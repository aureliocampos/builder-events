import { Product } from "./Product";

export interface ViewItem {
  currency: string;
  value: number;
  items: Array<Product>;
}
