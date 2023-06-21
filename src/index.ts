import "./proxy/index.js";
import { idFormatted, getPrice } from "./utils/utils";

import { PromotionListFactory } from "./constructor/PromotionListFactory";
import { ViewPromotionBuilder } from "./event/ViewPromotionBuilder";
import { SelectPromotionBuilder } from "./event/SelectPromotionBuilder";

window.dataLayer = window.dataLayer || [];

const gtmDataLayer = {
  pushEvent: function (callback: any) {
    callback;
  },
};

const getStorageJson = (key: string) => {
  const responseJson = localStorage.getItem(key);
  return responseJson !== null ? JSON.parse(responseJson) : [];
};

setTimeout(() => {
  /**
   *  Evento GA : view_promotion
   */
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
  if (createPromotions.length) {
    const allPromotions = createPromotions.flatMap((promotions) => promotions);

    localStorage.setItem("ga-promotions-items", JSON.stringify(allPromotions));

    const view_promotion = new ViewPromotionBuilder(allPromotions);
    gtmDataLayer.pushEvent(view_promotion.pushDataLayer());
  }

  /**
   *  Evento GA : select_item
   */
  if (localStorage.getItem("ga-promotions-items")?.length) {
    const gaLinks = document.querySelectorAll("[ga-promotion-link]");

    const allPromotions = getStorageJson("ga-promotions-items");

    gaLinks.forEach((link) => {
      const select_promotion = new SelectPromotionBuilder(allPromotions);

      link.addEventListener("click", () => {
        if (select_promotion.handleElementClicked(link)?.length) {
          gtmDataLayer.pushEvent(select_promotion.pushDataLayer());
        }
      });
    });
  }

  setTimeout(() => {
    const listProductSection = document.querySelectorAll(
      ".list-category-products-section"
    );
    const listPerformaGrid = document.querySelectorAll(".performa-vitrine");
    const listCategorySection = document.querySelectorAll(".category-products");

    if (
      listPerformaGrid.length > 0 ||
      listProductSection.length > 0 ||
      listCategorySection.length > 0
    ) {
      const allSections = [
        Array.from(listPerformaGrid),
        Array.from(listProductSection),
        Array.from(listCategorySection),
      ].flatMap((section) => section);

      interface Iconfig {
        id: string;
        section: Element;
        selectorTitle: string;
        selectorGrid: string;
      }

      const handleListFormatting = (config: Iconfig) => {
        const { id, section, selectorTitle, selectorGrid } = config;

        const sectionTitle = section.querySelector(selectorTitle)?.textContent;
        const productsItems = section.querySelector(selectorGrid)?.children;

        return {
          id,
          title: sectionTitle !== undefined ? sectionTitle : "",
          allProducts: productsItems !== undefined ? productsItems : [],
        };
      };

      const allList = allSections.map((section) => {
        /** Class ProductsListFactory(section) */
        if (section.classList.contains("default-section")) {
          const config = {
            id: "default",
            section: section,
            selectorTitle: ".title",
            selectorGrid: ".products-grid",
          };

          return handleListFormatting(config);
        }
        if (section.classList.contains("performa-vitrine")) {
          const config = {
            id: "performa",
            section: section,
            selectorTitle: ".performa-vitrine-title span",
            selectorGrid: ".performa-vitrine-ul",
          };

          return handleListFormatting(config);
        }
      });

      // Formatção dos preços com desconto ou sem

      // Formatção dos preços com desconto ou sem

      const viewItemList = allList.map((list) => {
        const listId = list?.id ?? "";
        const listName = list?.title ?? "";
        const listItems = Array.from(list?.allProducts as Element[]);
        return new ListItemsFactory(listName, listId, listItems).getList();
      });

      console.log(viewItemList);
    }
  }, 3000);
}, 2000);

interface IPrices {
  oldPrice: number;
  specialPrice: number;
  regularPrice: number;
}

class ListItemsFactory {
  public item_list_name: string;
  public item_list_id: string;
  public item_list_items: Element[];

  private list_id: string;

  constructor(listName: string, listId: string, listItems: Element[]) {
    this.item_list_name = listName;
    this.item_list_id = idFormatted(this.item_list_name);
    this.list_id = listId;
    this.item_list_items = listItems;
  }

  /**
   * getList
   */
  public getList() {
    return this.listBuilder();
  }

  private listBuilder() {
    switch (this.list_id) {
      case "default":
        return this.defaultBuilder();
      case "performa":
        return this.performaBuilder();
      default:
        break;
    }
  }

  private defaultBuilder() {
    const productItems = this.item_list_items.map(
      (item: Element, index: number) => {
        const newItem = new DefaultItemFactory(
          item,
          index,
          this.item_list_name
        );

        return newItem.getItem();
      }
    );

    return {
      item_list_id: idFormatted(this.item_list_name),
      item_list_name: this.item_list_name.trim(),
      items: productItems,
    };
  }

  private performaBuilder() {
    const productItems = this.item_list_items.map(
      (item: Element, index: number) => {
        const newItem = new PerformaItemFactory(
          item,
          index,
          this.item_list_name
        );

        return newItem.getItem();
      }
    );

    return {
      item_list_id: idFormatted(this.item_list_name),
      item_list_name: this.item_list_name.trim(),
      items: productItems,
    };
  }
}

class PerformaItemFactory {
  private item: Element;
  private index: number;

  private item_name: string;
  private item_prices: IPrices;
  private item_list_name: string;

  constructor(item: Element, index: number, listName: string) {
    this.item = item;
    this.index = index;
    this.item_list_name = listName;
    this.item_name =
      this.item.querySelector(".performa-name-vitrine")?.textContent ?? "";

    const prices = getPrice(this.item);
    this.item_prices = {
      oldPrice: prices?.oldPrice ?? 0,
      specialPrice: prices?.specialPrice ?? 0,
      regularPrice: prices?.regularPrice ?? 0,
    };
  }

  /**
   * item
   */
  public getItem() {
    const location = `${idFormatted(this.item_list_name)}_${idFormatted(
      this.item_name
    )}_${this.index++}`;

    const priceType =
      this.item_prices.oldPrice === 0
        ? this.item_prices.regularPrice
        : this.item_prices.specialPrice;

    return {
      affiliation: "Casa Boa Vista",
      index: ++this.index,
      item_id: idFormatted(this.item_name),
      item_name: this.item_name?.trim(),
      currency: "BRL",
      discount: this.item_prices.oldPrice,
      price: priceType,
      item_list_id: idFormatted(this.item_list_name),
      item_list_name: this.item_list_name,
      quantity: 1,
      location_id: location,
    };
  }
}
class DefaultItemFactory {
  private item: Element;
  private index: number;

  private item_name: string;
  private item_prices: IPrices;
  private item_list_name: string;

  constructor(item: Element, index: number, listName: string) {
    this.item = item;
    this.index = index;
    this.item_list_name = listName;
    this.item_name =
      this.item.querySelector(".product-name a")?.textContent ?? "";

    const prices = getPrice(this.item);
    this.item_prices = {
      oldPrice: prices?.oldPrice ?? 0,
      specialPrice: prices?.specialPrice ?? 0,
      regularPrice: prices?.regularPrice ?? 0,
    };
  }

  /**
   * item
   */
  public getItem() {
    const location = `${idFormatted(this.item_list_name)}_${idFormatted(
      this.item_name
    )}_${this.index++}`;

    const priceType =
      this.item_prices.oldPrice === 0
        ? this.item_prices.regularPrice
        : this.item_prices.specialPrice;

    return {
      affiliation: "Casa Boa Vista",
      index: ++this.index,
      item_id: idFormatted(this.item_name),
      item_name: this.item_name?.trim(),
      currency: "BRL",
      discount: this.item_prices.oldPrice,
      price: priceType,
      item_list_id: idFormatted(this.item_list_name),
      item_list_name: this.item_list_name,
      quantity: 1,
      location_id: location,
    };
  }
}
