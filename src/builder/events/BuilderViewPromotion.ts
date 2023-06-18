import { IPromotion } from "../../interfaces/index";

export class BuilderViewPromotion {
  public items: IPromotion[] = [];

  constructor(items: IPromotion[]) {
    this.items = items;
  }

  /**
   * getEventDataLayer
   */
  public pushEventDataLayer(): void {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "view_promotion",
      ecommerce: {
        items: [...this.items],
      },
    });
  }

  /**
   * getEventDataLayer
   */
  public getEventDataLayer() {
    let event = window.dataLayer.filter((item) => {
      if (!item.event) {
        return;
      }

      return item.event === "view_promotion";
    });

    return event;
  }

  /**
   * getAllPromotions
   */
  public getAllItems() {
    return this.items;
  }

  /**
   * getAllItemsWithID
   */
  public getAllItemsWithID() {
    console.log("Obtém todos os items marcados com ID, para o evento select");
  }
}

// localStorage.setItem("ga_view_promotions", "");

// localStorage.setItem(
//   "ga_view_promotions",
//   JSON.stringify(viewPromotionItems)
// );

// let ga_promotions: string = localStorage.getItem("ga_view_promotions")?.length
//   ? String(localStorage.getItem("ga_view_promotions"))
//   : "";

// const clickedItem = JSON.parse(ga_promotions).filter(
//   (item: IPromotion) => item.location_id === "banner_tarja_topo_3"
// );

// console.log(clickedItem);

// const view_promotion = new EventViewPromotion(viewPromotionItems);
// view_promotion.pushEvent();
