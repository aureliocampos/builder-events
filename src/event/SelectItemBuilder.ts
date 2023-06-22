import { IProduct } from "../interface/Products";
import { formatId, getStorageJson, setStorageJson } from "../utils/utils";

export class SelectItemBuilder {
  public items: IProduct[];

  constructor(items: IProduct[]) {
    this.items = items;
  }

  public handleElementClicked(link: Element) {
    if (link.classList.contains("ga-item-clicked")) {
      return;
    }

    link.classList.add("ga-item-clicked");

    const item_select = this.items.filter(
      (item) => formatId(item.item_id) === link.getAttribute("ga-item-link-id")
    );

    window.ga_select_item.push(item_select[0]);
    setStorageJson("ga-select-item", window.ga_select_item as []);
    //
    //
    return (this.items = item_select);
  }
  /**
   * pushDataLayer
   */
  public pushDataLayer() {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "select_item",
      ecommerce: {
        items: [this.items],
      },
    });
  }
}
