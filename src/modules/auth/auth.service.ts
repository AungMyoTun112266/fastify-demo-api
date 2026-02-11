import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import { Repository } from "../../shared/types/repository";
import { InternalServerError } from "../../shared/errors";
import { hashPassword } from "../../shared/utils/password";
import { User } from "../user/user.types";
import { SignupBody, SigninBody } from "./auth.schema";

export interface CognitoConfig {
  userPoolId: string;
  clientId: string;
}

export interface AuthResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export class AuthService {
  constructor(
    private readonly userRepo: Repository<User>,
    private readonly cognitoClient: CognitoIdentityProviderClient,
    private readonly cognitoConfig: CognitoConfig
  ) {}

  async signup(input: SignupBody): Promise<{ message: string }> {
    const hashedPassword = await hashPassword(input.password);

    await this.cognitoClient.send(
      new SignUpCommand({
        ClientId: this.cognitoConfig.clientId,
        Username: input.email,
        Password: input.password,
        UserAttributes: [{ Name: "email", Value: input.email }],
      })
    );

    await this.cognitoClient.send(
      new AdminConfirmSignUpCommand({
        UserPoolId: this.cognitoConfig.userPoolId,
        Username: input.email,
      })
    );

    await this.userRepo.save({
      id: input.email,
      sk: "USER",
      name: input.name,
      age: input.age,
      active: true,
      password: hashedPassword,
    });

    return { message: "User registered successfully" };
  }

  async signin(input: SigninBody): Promise<AuthResponse> {
    const result = await this.cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: this.cognitoConfig.clientId,
        AuthParameters: {
          USERNAME: input.email,
          PASSWORD: input.password,
        },
      })
    );

    const authResult = result.AuthenticationResult;
    if (
      !authResult?.AccessToken ||
      !authResult?.IdToken ||
      !authResult?.RefreshToken
    ) {
      throw new InternalServerError("Authentication failed");
    }

    return {
      accessToken: authResult.AccessToken,
      idToken: authResult.IdToken,
      refreshToken: authResult.RefreshToken,
    };
  }
}
