import { IListProduct } from "../interface/Products";

export class ViewItemListBuilder {
  view_item_list: IListProduct;

  constructor(view_item_list: IListProduct) {
    this.view_item_list = view_item_list;
  }

  public pushDataLayer(): void {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "view_item_list",
      ecommerce: {
        items: [this.view_item_list],
      },
    });
  }

  /**
   * getEventName
   */
  public getEventName() {
    return "view_item_list";
  }
}
