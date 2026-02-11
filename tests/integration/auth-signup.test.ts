import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import {
  SignUpCommand,
  AdminConfirmSignUpCommand,
  UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import { createTestApp } from "../helpers/app";
import { dynamoMock, cognitoMock, resetMocks } from "../helpers/setup";

const validSignupBody = {
  email: "test@example.com",
  name: "John Doe",
  age: 25,
  password: "password123",
};

describe("POST /auth/signup", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(() => {
    resetMocks();
    cognitoMock.on(SignUpCommand).resolves({});
    cognitoMock.on(AdminConfirmSignUpCommand).resolves({});
    dynamoMock.on(PutCommand).resolves({});
  });

  afterAll(async () => {
    await app.close();
  });

  // --- Success ---

  it("should register a user and return 201", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: validSignupBody,
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      message: "User registered successfully",
    });
  });

  it("should not require auth header for signup", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: validSignupBody,
    });

    expect(response.statusCode).toBe(201);
  });

  // --- Cognito Errors ---

  it("should return 500 when Cognito signup fails", async () => {
    cognitoMock.on(SignUpCommand).rejects(new Error("Cognito unavailable"));

    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: validSignupBody,
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/internal-server-error",
      title: "Internal Server Error",
      status: 500,
    });
  });

  it("should return 500 when Cognito confirm fails", async () => {
    cognitoMock
      .on(AdminConfirmSignUpCommand)
      .rejects(new Error("Confirm failed"));

    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: validSignupBody,
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/internal-server-error",
      title: "Internal Server Error",
      status: 500,
    });
  });

  // --- DynamoDB Errors ---

  it("should return 500 when DynamoDB save fails", async () => {
    dynamoMock.on(PutCommand).rejects(new Error("DynamoDB unavailable"));

    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: validSignupBody,
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/internal-server-error",
      title: "Internal Server Error",
      status: 500,
    });
  });

  // --- Body Validation ---

  it("should return 400 when email is missing", async () => {
    const { email, ...bodyWithoutEmail } = validSignupBody;
    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: bodyWithoutEmail,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when email is invalid", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: { ...validSignupBody, email: "not-an-email" },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when name is missing", async () => {
    const { name, ...bodyWithoutName } = validSignupBody;
    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: bodyWithoutName,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when password is missing", async () => {
    const { password, ...bodyWithoutPassword } = validSignupBody;
    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: bodyWithoutPassword,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when password is too short", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: { ...validSignupBody, password: "short" },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when age is missing", async () => {
    const { age, ...bodyWithoutAge } = validSignupBody;
    const response = await app.inject({
      method: "POST",
      url: "/auth/signup",
      payload: bodyWithoutAge,
    });

    expect(response.statusCode).toBe(400);
  });
});
