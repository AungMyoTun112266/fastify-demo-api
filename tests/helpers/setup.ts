import { mockClient } from "aws-sdk-client-mock";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export const dynamoMock = mockClient(DynamoDBDocumentClient);
export const cognitoMock = mockClient(CognitoIdentityProviderClient);

export function resetMocks() {
  dynamoMock.reset();
  cognitoMock.reset();
}
