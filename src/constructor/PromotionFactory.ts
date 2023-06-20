import { IPromotionConfig } from "../interface/Promotion";
import { formatText } from "../utils/utils";

export class PromotionFactory {
  private index: number;
  private element: Element;
  private selectorName: string;
  private creativeSlot: string;

  constructor(config: IPromotionConfig) {
    const { index, element, selectorName, creativeSlot } = config;

    this.index = index;
    this.element = element;
    this.selectorName = selectorName;
    this.creativeSlot = creativeSlot;
  }

  /**
   * getPromotion
   */
  public getItem() {
    let element = this.element.querySelector(this.selectorName);
    let textContent = "";
    let itemId = `${this.creativeSlot}_${++this.index}`;

    switch (this.selectorName) {
      case "img":
        textContent = element?.getAttribute("alt") || "";
        break;
      case "a":
        textContent = element?.getAttribute("title") || "";
        break;
    }

    this.element.setAttribute("ga-promotion-link", formatText(textContent));
    this.element.setAttribute("ga-promotion-id", itemId);

    return {
      promotion_id: formatText(textContent),
      promotion_name: formatText(textContent),
      creative_name: formatText(textContent),
      creative_slot: this.creativeSlot,
      localtion_id: itemId,
    };
  }
}
