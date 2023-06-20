import { IPromotion } from "../interface/Promotion";

export class ViewPromotionBuilder {
  items: IPromotion[];

  constructor(items: IPromotion[]) {
    this.items = items;
  }

  public pushDataLayer(): void {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "view_promotion",
      ecommerce: {
        items: [...this.items],
      },
    });
  }

  /**
   * getEventName
   */
  public getEventName() {
    return "view_promotion";
  }
}
