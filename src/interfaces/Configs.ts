export interface TitleConfig {
  selector: string;
}

export interface PricesConfig {
  regularPrice: string;
  specialPrice: string;
  oldPrice: string;
}

export interface ItemConfig {
  sku: string;
  name: string;
  prices: PricesConfig;
}

export interface GridConfig {
  selector: string;
  items: {
    selector: string;
    item: ItemConfig;
  };
}

export interface ProductConfig {
  name: string;
  config: {
    allContainers: string;
    title: TitleConfig;
    grid: GridConfig;
  };
}
