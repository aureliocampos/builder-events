import "./proxy/index.js";

import {
  formatId,
  formatList,
  getListType,
  formatPrice,
  getStorageJson,
  setStorageJson,
  getPriceDefault,
} from "./utils/utils";
// import { IProduct } from "./interface/Products";

import { PromotionListFactory } from "./constructor/PromotionListFactory";
import { ListItemsFactory } from "./constructor/ListItemsFactory";

import { ViewPromotionBuilder } from "./event/ViewPromotionBuilder";
import { SelectPromotionBuilder } from "./event/SelectPromotionBuilder";
import { ViewItemListBuilder } from "./event/ViewItemListBuilder";
import { SelectItemBuilder } from "./event/SelectItemBuilder";
import { IProduct } from "./interface/Products.js";
import { json } from "stream/consumers";

window.dataLayer = window.dataLayer || [];

const isGaSelectItem = localStorage.getItem("ga-select-item");
const isGaPreCheckout = localStorage.getItem("ga-pre-checkout");

if (isGaPreCheckout?.length) {
  window.ga_pre_checkout = JSON.parse(isGaPreCheckout ?? "");
} else {
  window.ga_pre_checkout = [];
}

// console.log(isGaSelectItem);
// console.log(isGaPreCheckout);

if (isGaSelectItem?.length) {
  window.ga_select_item = JSON.parse(isGaSelectItem ?? "");
} else {
  window.ga_select_item = [];
}

const gtmDataLayer = {
  pushEvent: function (callback: any) {
    callback;
  },
};

setTimeout(() => {
  /**
   *  Evento GA: view_promotion
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
   *  Evento GA: select_promotion
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
   *  Evento GA: view_item_list e select_item
   */
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

    const groupSelectors =
      listPerformaGrid.length ||
      listProductSection.length ||
      listCategorySection.length;

    if (groupSelectors) {
      const allSections = [
        Array.from(listPerformaGrid),
        Array.from(listProductSection),
        Array.from(listCategorySection),
      ].flatMap((section) => section);

      const allList = allSections.map((section) => getListType(section));
      const formattedLists = allList.map((list) => createViewItemList(list));

      const createStorageItems = () => {
        return formattedLists.flatMap((list) => list.items);
      };

      setStorageJson("ga-view-item-list", createStorageItems() as []);

      formattedLists.forEach((list) => {
        const view_item_list = new ViewItemListBuilder(list);
        gtmDataLayer.pushEvent(view_item_list.pushDataLayer());
      });
    }

    /**
     *  Evento GA : select_item
     */
    if (getStorageJson("ga-view-item-list")?.length) {
      const gaLinks = document.querySelectorAll("[ga-item-link]");
      const storageItems = getStorageJson("ga-view-item-list");

      gaLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
          const getItem = new SelectItemBuilder(storageItems);
          const select_item = getItem.handleElementClicked(link) as IProduct[];

          if (select_item?.length) {
            gtmDataLayer.pushEvent(getItem.pushDataLayer());
          }
        });
      });

      /**
       * Página de Produto
       * Evento GA: view_item e add_to_cart
       */

      // view_item
      if (document.body.classList.contains("catalog-product-view")) {
        const productName =
          document.querySelector(".product-name h1")?.textContent;

        let currentProduct: IProduct[];

        currentProduct = getStorageJson("ga-select-item").filter(
          (select: IProduct) => select.item_name === productName
        );

        console.log(currentProduct);

        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: "view_item",
          ecommerce: {
            items: [currentProduct[0]],
          },
        });

        // add_to_cart
        const buttonCart = document.querySelector(
          ".add-to-cart-buttons .btn-cart"
        );
        buttonCart?.addEventListener("click", (event) => {
          // event.preventDefault();
          const updateProduct = currentProduct.map(
            (product: IProduct): IProduct => {
              const container = document.querySelector(
                ".product-essential"
              ) as Element;

              const updateQty = document.querySelector(
                "input#qty"
              ) as HTMLInputElement;

              const updatePrice = getPriceDefault(container);

              const newPrice =
                updatePrice?.oldPrice !== 0
                  ? updatePrice?.specialPrice
                  : updatePrice?.regularPrice;

              return {
                ...product,
                discount: updatePrice?.oldPrice,
                price: newPrice ?? 0,
                quantity: Number(updateQty?.value),
              };
            }
          );

          // Cria um objeto para verificar futuramente ele está no carrinho e retornar os valores de item_list_name, item_list_id e index
          window.ga_pre_checkout.push(updateProduct[0]);
          setStorageJson("ga-pre-checkout", window.ga_pre_checkout as []);

          // Envia o evento
          window.dataLayer.push({ ecommerce: null });
          window.dataLayer.push({
            event: "add_to_cart",
            ecommerce: {
              items: [updateProduct[0]],
            },
          });
        });
      }
    }
  }, 3000);
}, 2000);

/**
 *
 * View_cart
 *  percorrer o ga-select-item e verificar se o item existe no carrinho se sim retornar o objeto, se não pula pro próximo
 *  Verificar se o item está duplciados no ga-select-item se sim concatenar em 1 só e atualizar para os valores e quantidades que estão no carrinho
 *  por fim criar um objeto begin_checkout com os items do carrinho certo
 *
 * remove_from_cart
 * add_to_cart
 *
 */
