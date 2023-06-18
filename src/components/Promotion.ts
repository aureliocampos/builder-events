import { IPromotion } from "../interfaces/Promotion";
import { formatText } from "../utils/utils";

interface Options {
  promotionName: string;
  container: string;
  excludeClassItem?: string;
  itemTextSelector: string;
}

export class Promotion {
  promotionName: string;
  container: string;
  excludeClassItem?: string;
  itemTextSelector: string;

  constructor(options: Options) {
    this.promotionName = options.promotionName;
    this.container = options.container;
    this.excludeClassItem = options.excludeClassItem;
    this.itemTextSelector = options.itemTextSelector;
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

  get promotion(): IPromotion[] {
    const containerElement = document.querySelector(this.container);

    if (!containerElement) {
      console.error("Container element not found");
      return [];
    }

    const baseItems = Array.from(containerElement.children) as HTMLElement[];

    const items = this.excludeClassItem
      ? this.filterExcludedItems(baseItems)
      : baseItems;

    const formattedItems: IPromotion[] = items.map((item, index) => {
      const text = this.getItemText(item);

      return {
        promotion_id: formatText(text),
        promotion_name: formatText(text),
        creative_name: formatText(text),
        creative_slot: this.promotionName,
        location_id: `${this.promotionName}_${++index}`,
      };
    });

    return formattedItems;
  }
}
