export type HashFn = (password: string) => Promise<string>;

export interface UserPersistence {
  id: string;
  sk: string;
  name: string;
  age: number;
  active: boolean;
  password: string;
}

export interface CreateUserInput {
  id: string;
  name: string;
  age: number;
  active: boolean;
  password: string;
}

export type UserPublic = Pick<UserPersistence, "id" | "name" | "age">;

export class User {
  private static readonly SK = "USER";

  private constructor(
    private readonly _id: string,
    private readonly _sk: string,
    private readonly _name: string,
    private readonly _age: number,
    private _active: boolean,
    private readonly _password: string
  ) {}

  get id(): string {
    return this._id;
  }

  get sk(): string {
    return this._sk;
  }

  get name(): string {
    return this._name;
  }

  get age(): number {
    return this._age;
  }

  get active(): boolean {
    return this._active;
  }

  get password(): string {
    return this._password;
  }

  static async create(input: CreateUserInput, hashFn: HashFn): Promise<User> {
    const hashedPassword = await hashFn(input.password);
    return new User(
      input.id,
      User.SK,
      input.name,
      input.age,
      input.active,
      hashedPassword
    );
  }

  static fromPersistence(data: UserPersistence): User {
    return new User(
      data.id,
      data.sk,
      data.name,
      data.age,
      data.active,
      data.password
    );
  }

  toPersistence(): UserPersistence {
    return {
      id: this._id,
      sk: this._sk,
      name: this._name,
      age: this._age,
      active: this._active,
      password: this._password,
    };
  }

  toPublic(): UserPublic {
    return {
      id: this._id,
      name: this._name,
      age: this._age,
    };
  }

  deactivate(): void {
    this._active = false;
  }
}
