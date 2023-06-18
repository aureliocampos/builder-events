import { IPromotion } from "../interfaces/index";

export class EventViewPromotion {
  public items: IPromotion[] = [];

  constructor(items: IPromotion[]) {
    this.items = items;
  }

  public pushEvent(): void {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "view_promotion",
      ecommerce: {
        items: [...this.items],
      },
    });
  }
}
