import { Promotion } from "../components/Promotion";
import { IPromotion } from "../interfaces/Promotion";

export class EventViewPromotion {
  items;

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
