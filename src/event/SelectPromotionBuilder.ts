import { IPromotion } from "../interface/Promotion";

export class SelectPromotionBuilder {
  private items: IPromotion[];
  allPromotions: IPromotion[];

  constructor(allPromotions: IPromotion[]) {
    this.items = [];
    this.allPromotions = allPromotions;
  }

  /**
   * pushDataLayer
   */
  public pushDataLayer() {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "select_promotion",
      ecommerce: {
        items: this.items,
      },
    });
  }

  public handleElementClicked(link: Element) {
    if (link.classList.contains("ga-element-clicked")) {
      return;
    }

    link.classList.add("ga-element-clicked");

    const item_select = this.allPromotions.filter(
      (item) => item.localtion_id === link.getAttribute("ga-element-id")
    );

    return (this.items = item_select);
  }
}
