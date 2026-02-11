import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import { FastifyInstance } from "fastify";
import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { createTestApp, AUTH_HEADER } from "../helpers/app";
import { dynamoMock, resetMocks } from "../helpers/setup";
import { validProduct } from "../helpers/fixtures";

describe("GET /products/:id", () => {
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

  it("should return 200 with product data when product exists", async () => {
    dynamoMock.on(QueryCommand).resolves({ Items: [validProduct] });

    const response = await app.inject({
      method: "GET",
      url: `/products/${validProduct.id}`,
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      id: validProduct.id,
      name: validProduct.name,
      price: validProduct.price,
      description: validProduct.description,
      category: validProduct.category,
      active: validProduct.active,
    });
  });

  // --- Not Found ---

  it("should return 404 when product does not exist", async () => {
    dynamoMock.on(QueryCommand).resolves({ Items: [] });

    const response = await app.inject({
      method: "GET",
      url: "/products/nonexistent",
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      type: "https://example.com/problems/not-found",
      title: "Not Found",
      status: 404,
      detail: "Product with id nonexistent not found",
    });
  });

  // --- Authentication ---

  it("should return 401 without auth header", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/products/${validProduct.id}`,
    });

    expect(response.statusCode).toBe(401);
  });

  // --- DynamoDB Errors ---

  it("should return 500 when DynamoDB query fails", async () => {
    dynamoMock.on(QueryCommand).rejects(new Error("DynamoDB unavailable"));

    const response = await app.inject({
      method: "GET",
      url: `/products/${validProduct.id}`,
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

describe("GET /products", () => {
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

  it("should return 200 with list of products", async () => {
    dynamoMock.on(ScanCommand).resolves({ Items: [validProduct] });

    const response = await app.inject({
      method: "GET",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({
      id: validProduct.id,
      name: validProduct.name,
    });
  });

  it("should return 200 with empty array when no products exist", async () => {
    dynamoMock.on(ScanCommand).resolves({ Items: [] });

    const response = await app.inject({
      method: "GET",
      url: "/products",
      headers: { authorization: AUTH_HEADER },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  // --- Authentication ---

  it("should return 401 without auth header", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/products",
    });

    expect(response.statusCode).toBe(401);
  });

  // --- DynamoDB Errors ---

  it("should return 500 when DynamoDB scan fails", async () => {
    dynamoMock.on(ScanCommand).rejects(new Error("DynamoDB unavailable"));

    const response = await app.inject({
      method: "GET",
      url: "/products",
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
