import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { createTestApp, AUTH_HEADER, USER_AUTH_HEADER } from "../helpers/app";
import { dynamoMock, resetMocks } from "../helpers/setup";
import { validUser, validCreateBody } from "../helpers/fixtures";

describe("POST /users/:id", () => {
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

  // --- Success ---

  it("should create a user and return 201", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: validCreateBody,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      id: validUser.id,
      name: validCreateBody.name,
      age: validCreateBody.age,
    });
  });

  // --- Authentication ---

  it("should return 401 without auth header", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      query: { active: "true" },
      payload: validCreateBody,
    });

    expect(response.statusCode).toBe(401);
  });

  // --- Authorization ---

  it("should return 403 when authenticated as user role on admin route", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: USER_AUTH_HEADER },
      query: { active: "true" },
      payload: validCreateBody,
    });

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/forbidden",
      title: "Access denied",
      status: 403,
    });
  });

  // --- Conflict ---

  it("should return 409 when user already exists", async () => {
    dynamoMock.on(QueryCommand).resolves({ Items: [validUser] });

    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: validCreateBody,
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/conflict",
      title: "Conflict",
      status: 409,
      detail: `User with id ${validUser.id} already exists`,
    });
  });

  // --- Body Validation ---

  it("should return 400 when body is missing", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/validation-error",
      title: "Validation Error",
      status: 400,
    });
  });

  it("should return 400 when name is missing from body", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { age: 25 },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when age is missing from body", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { name: "John" },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when age is not a positive integer", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { name: "John", age: -1 },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when age is a decimal number", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { name: "John", age: 25.5 },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when name is an empty string", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { name: "", age: 25 },
    });

    expect(response.statusCode).toBe(400);
  });

  // --- Query Validation ---

  it("should return 400 when active query param is missing", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      payload: validCreateBody,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when active query param is not a strict boolean", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "yes" },
      payload: validCreateBody,
    });

    expect(response.statusCode).toBe(400);
  });

  // --- Security: Input Length Limits ---

  it("should return 400 when name exceeds max length", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { ...validCreateBody, name: "a".repeat(101) },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when password exceeds max length", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { ...validCreateBody, password: "a".repeat(129) },
    });

    expect(response.statusCode).toBe(400);
  });

  // --- Security: Whitespace Trimming ---

  it("should return 400 when name is only whitespace", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { ...validCreateBody, name: "   " },
    });

    expect(response.statusCode).toBe(400);
  });

  // --- Security: Type Coercion ---

  it("should return 400 when age is a string", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { ...validCreateBody, age: "twenty-five" },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when name is a number", async () => {
    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: { ...validCreateBody, name: 12345 },
    });

    expect(response.statusCode).toBe(400);
  });

  // --- DynamoDB Errors ---

  it("should return 500 when DynamoDB save fails", async () => {
    dynamoMock.on(PutCommand).rejects(new Error("DynamoDB unavailable"));

    const response = await app.inject({
      method: "POST",
      url: `/users/${validUser.id}`,
      headers: { authorization: AUTH_HEADER },
      query: { active: "true" },
      payload: validCreateBody,
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/internal-server-error",
      title: "Internal Server Error",
      status: 500,
    });
  });
});
