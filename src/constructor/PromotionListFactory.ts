import { IOptions } from "../interface/Promotion";
import { PromotionFactory } from "./PromotionFactory";

export class PromotionListFactory {
  public creativeSlot: string;

  private container: HTMLElement;
  private classFilter?: string;
  private promotionNameSelector: string;

  constructor(options: IOptions) {
    this.container = options.container;
    this.creativeSlot = options.creativeSlot;
    this.classFilter = options.classFilter;
    this.promotionNameSelector = options.promotionNameSelector;
  }

  /**
   * getAllPromotions
   */
  public getAllPromotions() {
    if (!this.container) {
      return [];
    }

    const childrens = Array.from(this.container.children);

    const allItems = this.classFilter
      ? this.handleFilterClass(childrens)
      : childrens;

    return allItems.map((element, index) => {
      const config = {
        index,
        element,
        selectorName: this.promotionNameSelector,
        creativeSlot: this.creativeSlot,
      };

      const newPromotion = new PromotionFactory(config).getItem();

      return newPromotion;
    });
  }

  /**
   * setElementsID
   */
  public setElementID() {}

  private handleFilterClass(items: Element[]) {
    const selectorClass = this.classFilter;
    let filterItems: Element[] = [];

    if (selectorClass) {
      filterItems = items.filter(
        (item) => !item.classList.contains(selectorClass)
      );
    }

    return filterItems;
  }
}
