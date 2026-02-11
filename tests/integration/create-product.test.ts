import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from "vitest";
import { FastifyInstance } from "fastify";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { createTestApp, AUTH_HEADER } from "../helpers/app";
import { dynamoMock, resetMocks } from "../helpers/setup";
import { validProduct, validCreateProductBody } from "../helpers/fixtures";

describe("POST /products", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await createTestApp();
  });

  beforeEach(() => {
    resetMocks();
    dynamoMock.on(PutCommand).resolves({});
  });

  afterAll(async () => {
    await app.close();
  });

  // --- Success ---

  it("should create a product and return 201", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
      payload: validCreateProductBody,
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body).toMatchObject({
      name: validCreateProductBody.name,
      price: validCreateProductBody.price,
      description: validCreateProductBody.description,
      category: validCreateProductBody.category,
      active: true,
    });
    expect(body.id).toBeDefined();
  });

  // --- Authentication ---

  it("should return 401 without auth header", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/products",
      payload: validCreateProductBody,
    });

    expect(response.statusCode).toBe(401);
  });

  // --- Body Validation ---

  it("should return 400 when body is missing", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/validation-error",
      title: "Validation Error",
      status: 400,
    });
  });

  it("should return 400 when name is missing from body", async () => {
    const { name, ...bodyWithoutName } = validCreateProductBody;
    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
      payload: bodyWithoutName,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when price is missing from body", async () => {
    const { price, ...bodyWithoutPrice } = validCreateProductBody;
    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
      payload: bodyWithoutPrice,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when description is missing from body", async () => {
    const { description, ...bodyWithoutDesc } = validCreateProductBody;
    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
      payload: bodyWithoutDesc,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when category is missing from body", async () => {
    const { category, ...bodyWithoutCategory } = validCreateProductBody;
    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
      payload: bodyWithoutCategory,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when price is not a positive number", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
      payload: { ...validCreateProductBody, price: -5 },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when name is an empty string", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
      payload: { ...validCreateProductBody, name: "" },
    });

    expect(response.statusCode).toBe(400);
  });

  // --- DynamoDB Errors ---

  it("should return 500 when DynamoDB save fails", async () => {
    dynamoMock.on(PutCommand).rejects(new Error("DynamoDB unavailable"));

    const response = await app.inject({
      method: "POST",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
      payload: validCreateProductBody,
    });

    expect(response.statusCode).toBe(500);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/internal-server-error",
      title: "Internal Server Error",
      status: 500,
    });
  });
});
