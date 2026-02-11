export interface User {
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
