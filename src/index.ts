import "./proxy/index.js";
import { formatText } from "./utils/utils.js";

window.dataLayer = window.dataLayer || [];

const gtmDataLayer = {
  pushEvent: function (event: any) {
    event();
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

setTimeout(() => {
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

      switch (this.selectorName) {
        case "img":
          textContent = element?.getAttribute("alt") || "";
          break;
        case "a":
          textContent = element?.getAttribute("title") || "";
          break;
      }

      return {
        promotion_id: formatText(textContent),
        promotion_name: formatText(textContent),
        creative_name: formatText(textContent),
        creative_slot: this.creativeSlot,
        localtion_id: `${this.creativeSlot}_${this.index++}`,
      };
    }
  }

  const createPromotions = configPromotions.map((config) => {
    return new PromotionListFactory(config).getAllPromotions();
    // return item;
  });

  const allPromotions = createPromotions.flatMap((promotions) => promotions);

  console.log(allPromotions);

  // class ViewPromotionBuilder {
  //   items: PromotionListFactory[];
  //   constructor(items: PromotionListFactory[]) {
  //     this.items = items;
  //   }

  //   public get eventDataLayer() {
  //     const promotions = this.items.map((item) => item);
  //     return promotions;
  //   }

  //   /**
  //    * getDataLayer
  //    */
  //   public getDataLayer() {}
  // }

  // const builderPromotion = new ViewPromotionBuilder(allPromotions);

  // gtmDataLayer.pushEvent(builderPromotion.eventDataLayer);
}, 3000);
