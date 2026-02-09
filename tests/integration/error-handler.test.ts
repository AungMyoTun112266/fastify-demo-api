import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { createTestApp, AUTH_HEADER } from "../helpers/app";
import { dynamoMock, resetMocks } from "../helpers/setup";

describe("Error Handler", () => {
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

  it("should return RFC 7807 problem details for validation errors", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/users/user-1",
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { name: "", age: -1 },
    });

    expect(response.statusCode).toBe(400);

    const body = response.json();
    expect(body).toMatchObject({
      type: "https://example.com/problems/validation-error",
      title: "Validation Error",
      status: 400,
    });
    expect(body.instance).toContain("/users/user-1");
    expect(body).toHaveProperty("errors");
  });

  it("should return RFC 7807 problem details for not found errors", async () => {
    dynamoMock.on(QueryCommand).resolves({ Items: [] });

    const response = await app.inject({
      method: "GET",
      url: "/users/missing-id",
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(404);

    const body = response.json();
    expect(body).toMatchObject({
      type: "https://example.com/problems/not-found",
      title: "Not Found",
      status: 404,
      instance: "/users/missing-id",
    });
  });

  it("should return RFC 7807 problem details for unauthorized errors", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/users/user-1",
    });

    expect(response.statusCode).toBe(401);

    const body = response.json();
    expect(body).toMatchObject({
      type: "https://example.com/problems/unauthorized",
      title: "Unauthorized",
      status: 401,
      instance: "/users/user-1",
    });
  });

  it("should return RFC 7807 problem details for internal server errors", async () => {
    dynamoMock.on(QueryCommand).rejects(new Error("Unexpected failure"));

    const response = await app.inject({
      method: "GET",
      url: "/users/user-1",
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(500);

    const body = response.json();
    expect(body).toMatchObject({
      type: "https://example.com/problems/internal-server-error",
      title: "Internal Server Error",
      status: 500,
      instance: "/users/user-1",
    });
  });

  it("should include instance field with request url in all error responses", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/users/test-instance-field",
    });

    const body = response.json();
    expect(body.instance).toBe("/users/test-instance-field");
  });
});
