import { Product } from "./Product";

export interface ProductsList {
  item_list_id: string;
  item_list_name: string;
  items: Array<Product>;
}
