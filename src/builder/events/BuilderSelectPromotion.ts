import { IPromotion } from "../../interfaces/Promotion";

export class BuilderSelectPromotion {
  allPromotions: HTMLElement[] = [];
  items: IPromotion[] = [];

  constructor() {
    this.allPromotions = Array.from(
      document.querySelectorAll("[ga-promotion-link]")
    ) as HTMLElement[];
  }

  /**
   * Escuta o clique na Promotion
   */
  public selectEventListener(eventPromotionItems: IPromotion[]) {
    if (this.allPromotions) {
      this.allPromotions.forEach((promotion) => {
        promotion.addEventListener("click", () => {
          if (!promotion.classList.contains("ga-promotion-clicked")) {
            promotion.classList.add("ga-promotion-clicked");

            this.items = eventPromotionItems.filter(
              (promotionItem) =>
                promotionItem.location_id ===
                promotion.getAttribute("ga-promotion-link")
            );

            this.pushEventDataLayer();
          }
        });
      });
    }
  }

  /**
   * pushEventDataLayer
   */
  public pushEventDataLayer() {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "select_promotion",
      ecommerce: {
        items: [...this.items],
      },
    });
  }
}
