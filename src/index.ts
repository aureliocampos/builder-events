import "./proxy/index.js";
import { formatText } from "./utils/utils.js";

window.dataLayer = window.dataLayer || [];

const gtmDataLayer = {
  pushEvent: function (callback: any) {
    callback;
  },
};

interface IOptions {
  creativeSlot: string;
  container: HTMLElement;
  classFilter?: string;
  promotionNameSelector: string;
}
interface IPromotion {
  promotion_id: string;
  promotion_name: string;
  creative_name: string;
  creative_slot: string;
  localtion_id: string;
}
interface IPromotionConfig {
  index: number;
  element: Element;
  selectorName: string;
  creativeSlot: string;
}

class PromotionListFactory {
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
class PromotionFactory {
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

    this.element.setAttribute("ga-element-link", formatText(textContent));
    this.element.setAttribute("ga-element-id", itemId);

    return {
      promotion_id: formatText(textContent),
      promotion_name: formatText(textContent),
      creative_name: formatText(textContent),
      creative_slot: this.creativeSlot,
      localtion_id: itemId,
    };
  }
}
class ViewPromotionBuilder {
  items: IPromotion[];

  constructor(items: IPromotion[]) {
    this.items = items;
  }

  public pushDataLayer(): void {
    window.dataLayer.push({ ecommerce: null });
    window.dataLayer.push({
      event: "view_promotion",
      ecommerce: {
        items: [this.items],
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

class SelectPromotionBuilder {
  private items: IPromotion[];

  constructor() {
    this.items = [];
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

  public handleLinkClicked(link: Element, allPromotions: IPromotion[]) {
    if (link.classList.contains("ga-element-clicked")) {
      return;
    }

    link.classList.add("ga-element-clicked");

    const item_select = allPromotions.filter(
      (item) => item.localtion_id === link.getAttribute("ga-element-id")
    );

    return (this.items = item_select);
  }
}

setTimeout(() => {
  // view_promotion
  const configPromotions = [
    {
      creativeSlot: "full_banner",
      container: document.querySelector(
        "#home_full_banners .slick-track"
      ) as HTMLElement,
      classFilter: "slick-cloned",
      promotionNameSelector: "img",
    },
    {
      creativeSlot: "banner_tarja_topo",
      container: document.querySelector(
        ".highlights-copy .highlights-section-container"
      ) as HTMLElement,
      promotionNameSelector: "a",
    },
    {
      creativeSlot: "banner_central",
      container: document.querySelector(
        ".mini-banners-home-middle .column"
      ) as HTMLElement,
      promotionNameSelector: "img",
    },
    {
      creativeSlot: "banner_tarja_rodape",
      container: document.querySelector(
        ".main-section + .highlights-section .highlights-section-container"
      ) as HTMLElement,
      promotionNameSelector: "a",
    },
  ];

  const createPromotions = configPromotions.map((config) => {
    return new PromotionListFactory(config).getAllPromotions();
  });
  const allPromotions = createPromotions.flatMap((promotions) => promotions);
  const viewPromotion = new ViewPromotionBuilder(allPromotions);
  gtmDataLayer.pushEvent(viewPromotion.pushDataLayer());

  // select_item
  const gaLinks = document.querySelectorAll("[ga-element-link]");
  gaLinks.forEach((link) => {
    const selectEvent = new SelectPromotionBuilder();

    link.addEventListener("click", () => {
      if (selectEvent.handleLinkClicked(link, allPromotions)?.length) {
        gtmDataLayer.pushEvent(selectEvent.pushDataLayer());
      }
    });
  });
}, 3000);
