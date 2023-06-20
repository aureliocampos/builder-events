import "./proxy/index.js";
import { formatText } from "./utils/utils";

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

  /**
   *  Evento GA : view_item_list
   */

  const allSection = document.querySelectorAll(
    ".beon-region, .list-category-products-section"
  );

  console.log(allSection);
}, 2000);
