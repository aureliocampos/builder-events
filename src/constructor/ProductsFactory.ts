import { getPriceDefault, getPricePerforma, formatId } from "../utils/utils";
import { IPrices } from "../interface/Products";

export class PerformaItemFactory {
  private item: Element;
  private index: number;

  private item_name: string;
  private item_prices: IPrices;
  private item_list_name: string;

  constructor(item: Element, index: number, listName: string) {
    this.item = item;
    this.index = index;
    this.item_list_name = listName;
    this.item_name =
      this.item.querySelector(".performa-name-vitrine")?.textContent ?? "";

    const prices = getPricePerforma(this.item);
    this.item_prices = {
      oldPrice: prices?.oldPrice ?? 0,
      specialPrice: prices?.specialPrice ?? 0,
      regularPrice: prices?.regularPrice ?? 0,
    };
  }

  /**
   * item
   */
  public getItem() {
    const location = `${formatId(this.item_list_name)}_${formatId(
      this.item_name
    )}`;

    const priceType =
      this.item_prices.oldPrice === 0
        ? this.item_prices.regularPrice
        : this.item_prices.specialPrice;

    return {
      affiliation: "Casa Boa Vista",
      index: ++this.index,
      item_id: formatId(this.item_name),
      item_name: this.item_name?.trim(),
      currency: "BRL",
      discount: this.item_prices.oldPrice,
      price: priceType,
      item_list_id: formatId(this.item_list_name),
      item_list_name: this.item_list_name,
      quantity: 1,
      location_id: location,
    };
  }
}
export class DefaultItemFactory {
  private item: Element;
  private index: number;

  private item_name: string;
  private item_prices: IPrices;
  private item_list_name: string;

  constructor(item: Element, index: number, listName: string) {
    this.item = item;
    this.index = index;
    this.item_list_name = listName;
    this.item_name =
      this.item.querySelector(".product-name a")?.textContent ?? "";

    const prices = getPriceDefault(this.item);
    this.item_prices = {
      oldPrice: prices?.oldPrice ?? 0,
      specialPrice: prices?.specialPrice ?? 0,
      regularPrice: prices?.regularPrice ?? 0,
    };
  }

  /**
   * item
   */
  public getItem() {
    const location = `${formatId(this.item_list_name)}_${formatId(
      this.item_name
    )}`;

    const priceType =
      this.item_prices.oldPrice === 0
        ? this.item_prices.regularPrice
        : this.item_prices.specialPrice;

    return {
      affiliation: "Casa Boa Vista",
      index: ++this.index,
      item_id: formatId(this.item_name),
      item_name: this.item_name?.trim(),
      currency: "BRL",
      discount: this.item_prices.oldPrice,
      price: priceType,
      item_list_id: formatId(this.item_list_name),
      item_list_name: this.item_list_name,
      quantity: 1,
      location_id: location,
    };
  }
}
