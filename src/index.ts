import "./proxy/index.js";

import { formatList, getListType } from "./utils/utils";

import { PromotionListFactory } from "./constructor/PromotionListFactory";
import { ListItemsFactory } from "./constructor/ListItemsFactory";
import { ViewPromotionBuilder } from "./event/ViewPromotionBuilder";
import { SelectPromotionBuilder } from "./event/SelectPromotionBuilder";
import { ViewItemListBuilder } from "./event/ViewItemListBuilder";

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
    const createViewItemList = (list: any) => {
      const listId = list?.id ?? "";
      const listName = (list?.title ?? "").trim();
      const listItems = Array.from(list?.allProducts as Element[]);

      return new ListItemsFactory(listName, listId, listItems).getList();
    };

    const listProductSection = document.querySelectorAll(
      ".list-category-products-section"
    );
    const listPerformaGrid = document.querySelectorAll(".performa-vitrine");
    const listCategorySection = document.querySelectorAll(
      ".catalog-category-view"
    );

    const containsItems =
      listPerformaGrid.length ||
      listProductSection.length ||
      listCategorySection.length;

    if (containsItems) {
      const allSections = [
        Array.from(listPerformaGrid),
        Array.from(listProductSection),
        Array.from(listCategorySection),
      ].flatMap((section) => section);

      const allList = allSections.map((section) => getListType(section));
      const allItems = allList.map((list) => createViewItemList(list));

      console.log(allItems);

      allItems.forEach((list) => {
        const view_item_list = new ViewItemListBuilder(list);
        gtmDataLayer.pushEvent(view_item_list.pushDataLayer());
      });

      // const pushViewItemsList = () => {

      // };
    }
  }, 3000);
}, 2000);
