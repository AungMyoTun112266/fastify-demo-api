export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  active: boolean;
}

export interface CreateProductInput {
  name: string;
  price: number;
  description: string;
  category: string;
}
