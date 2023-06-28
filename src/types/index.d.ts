import { IProduct } from "../interfaces/Products";

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtmDataLayer: Record<string, any>;
    ga_pre_checkout: Array<string, any>;
    ga_select_item: Array<string, any>;
    ga_promotions_item: Array<string, any>;
    ga_products_item: Array<string, any>;
  }
}

export {};
