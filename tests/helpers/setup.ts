import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const dynamoMock = mockClient(DynamoDBDocumentClient);

export function resetMocks() {
  dynamoMock.reset();
}
