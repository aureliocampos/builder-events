import { Product } from "./Product";

export interface Products {
  currency: string;
  value: number;
  items: Array<Product>;
}
