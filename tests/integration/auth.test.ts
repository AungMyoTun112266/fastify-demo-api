import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { createTestApp, AUTH_HEADER } from "../helpers/app";
import { dynamoMock, resetMocks } from "../helpers/setup";

describe("Authentication Plugin", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(() => {
    resetMocks();
    dynamoMock.on(QueryCommand).resolves({ Items: [] });
    dynamoMock.on(PutCommand).resolves({});
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 401 when no authorization header is provided", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/users/user-1",
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/unauthorized",
      title: "Unauthorized",
      status: 401,
    });
  });

  it("should return 401 when token is invalid", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/users/user-1",
      headers: { authorization: "Bearer wrong-token" },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/unauthorized",
      title: "Unauthorized",
      status: 401,
      detail: "Invalid token",
    });
  });

  it("should return 401 when authorization type is not Bearer", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/users/user-1",
      headers: { authorization: "Basic valid-token" },
    });

    expect(response.statusCode).toBe(401);
  });

  it("should pass authentication with a valid Bearer token", async () => {
    dynamoMock.on(QueryCommand).resolves({
      Items: [{ id: "user-1", name: "John", age: 25, active: true }],
    });

    const response = await app.inject({
      method: "GET",
      url: "/users/user-1",
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(200);
  });
});
