export interface User {
  id: string;
  name: string;
  age: number;
  active: boolean;
}

export interface CreateUserInput {
  id: string;
  name: string;
  age: number;
  active: boolean;
}
