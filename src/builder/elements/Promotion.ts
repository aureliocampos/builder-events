import { IPromotion } from "../../interfaces/index";
import { formatText } from "../utils/utils";

interface Options {
  promotionName: string;
  container: string;
  excludeClassItem?: string;
  itemTextSelector: string;
}

export class Promotion {
  promotionName: string;
  container: HTMLElement | null;
  excludeClassItem?: string;
  itemTextSelector: string;

  constructor(options: Options) {
    this.promotionName = options.promotionName;
    this.container = document.querySelector(options.container);
    this.excludeClassItem = options.excludeClassItem;
    this.itemTextSelector = options.itemTextSelector;
  }

  /**
   * getAllItems
   */
  public getAllItems() {
    return this.handleFilteringItems();
  }

  public getAllPromotions(): IPromotion[] {
    const allItems = this.handleFilteringItems();

    return this.handleFormattedItem(allItems);
  }

  private handleFormattedItem(items: HTMLElement[]) {
    return items.map((item, index) => {
      const text = this.getItemText(item);

      if (item.tagName === "A") {
        item.setAttribute(
          "ga-promotion-link",
          `${this.promotionName}_${++index}`
        );
      } else {
        item
          .querySelector("a")
          ?.setAttribute(
            "ga-promotion-link",
            `${this.promotionName}_${++index}`
          );
      }

      return {
        promotion_id: formatText(text),
        promotion_name: formatText(text),
        creative_name: formatText(text),
        creative_slot: this.promotionName,
        location_id: `${this.promotionName}_${index++}`,
      };
    });
  }

  private handleFilteringItems() {
    let alItems: HTMLElement[] = [];

    if (!this.container) {
      return [];
    }

    if (this.container) {
      let baseItems: HTMLElement[] = [];
      baseItems = Array.from(this.container.children) as HTMLElement[];

      alItems = this.excludeClassItem
        ? this.filterExcludedItems(baseItems)
        : baseItems;
    }
    return alItems;
  }

  private filterExcludedItems(items: HTMLElement[]): HTMLElement[] {
    const selectorClass = this.excludeClassItem;
    let filterItems: HTMLElement[] = [];

    if (selectorClass) {
      filterItems = items.filter(
        (item) => !item.classList.contains(selectorClass)
      );
    }

    return filterItems;
  }

  private getItemText(item: HTMLElement): string {
    const textElement = item.querySelector(this.itemTextSelector);

    switch (this.itemTextSelector) {
      case "img":
        return textElement?.getAttribute("alt") || "";
      case "a":
        return textElement?.getAttribute("title") || "";
      default:
        return "";
    }
  }
  private createIdentifierElement(items: HTMLElement[]) {}
}
