import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { createTestApp, AUTH_HEADER, USER_AUTH_HEADER } from "../helpers/app";
import { dynamoMock, resetMocks } from "../helpers/setup";
import { validUser } from "../helpers/fixtures";

describe("GET /users/:id", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(() => {
    resetMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  // --- Success ---

  it("should return 200 with user data when user exists", async () => {
    dynamoMock.on(QueryCommand).resolves({ Items: [validUser] });

    const response = await app.inject({
      method: "GET",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      id: validUser.id,
      name: validUser.name,
      age: validUser.age,
    });
  });

  it("should not expose password in response", async () => {
    dynamoMock.on(QueryCommand).resolves({ Items: [validUser] });

    const response = await app.inject({
      method: "GET",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).not.toHaveProperty("password");
  });

  // --- Not Found ---

  it("should return 404 when user does not exist", async () => {
    dynamoMock.on(QueryCommand).resolves({ Items: [] });

    const response = await app.inject({
      method: "GET",
      url: "/users/nonexistent",
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/not-found",
      title: "Not Found",
      status: 404,
      detail: "User with id nonexistent not found",
    });
  });

  // --- Authentication ---

  it("should return 401 without auth header", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/users/${validUser.id}`,
    });

    expect(response.statusCode).toBe(401);
  });

  it("should return 401 with invalid token", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/users/${validUser.id}`,
      headers: { authorization: "Bearer invalid" },
    });

    expect(response.statusCode).toBe(401);
  });

  // --- Authorization ---

  it("should return 403 when authenticated as user role on admin route", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/users/${validUser.id}`,
      headers: { authorization: USER_AUTH_HEADER },
    });

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/forbidden",
      title: "Access denied",
      status: 403,
    });
  });

  // --- DynamoDB Errors ---

  it("should return 500 when DynamoDB query fails", async () => {
    dynamoMock.on(QueryCommand).rejects(new Error("DynamoDB unavailable"));

    const response = await app.inject({
      method: "GET",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/internal-server-error",
      title: "Internal Server Error",
      status: 500,
    });
  });
});
