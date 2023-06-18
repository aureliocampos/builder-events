import { IProduct } from "./Product";

export interface Products {
  currency: string;
  value: number;
  items: Array<IProduct>;
}
