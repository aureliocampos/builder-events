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
import { ok } from "assert";
import { error } from "console";

window.dataLayer = window.dataLayer || [];

const isGaSelectItem = localStorage.getItem("ga-select-item");
const isGaPreCheckout = localStorage.getItem("ga-pre-checkout");

if (isGaPreCheckout?.length) {
  window.ga_pre_checkout = JSON.parse(isGaPreCheckout ?? "");
} else {
  window.ga_pre_checkout = [];
}

if (isGaSelectItem?.length) {
  window.ga_select_item = JSON.parse(isGaSelectItem ?? "");
} else {
  window.ga_select_item = [];
}

const allPreCheckotItems: IProduct[] = window.ga_pre_checkout;
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

          // Envia o evento add_to_cart
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

  /**
   *  Evento GA: view_cart
   */
  if (document.body.classList.contains("checkout-cart-index")) {
    const tableItems = Array.from(
      document.querySelectorAll("#shopping-cart-table tbody tr")
    );

    const getCartItems = tableItems.map((itemCart) => {
      const itemName =
        itemCart.querySelector(".product-name a")?.textContent ?? "";
      const itemPriceTotal = itemCart.querySelector(
        ".product-cart-total .price"
      )!;
      const itemQuantity =
        (itemCart.querySelector("input.qty") as HTMLInputElement).value ?? "";

      return {
        item_name: itemName,
        price: formatPrice(itemPriceTotal),
        quantity: Number(itemQuantity),
      };
    });

    interface Item {
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }

    interface MergedItem extends Item {
      affiliation: string;
      index: number;
      currency: string;
      discount: number;
      item_list_id: string;
      item_list_name: string;
      location_id: string;
      updated: boolean;
    }

    const mergeItems = (array1: Item[], array2: MergedItem[]): MergedItem[] => {
      for (const item1 of array1) {
        const item2 = array2.find((item) => item.item_name === item1.item_name);

        if (item2 && !item2.updated) {
          item2.price = item1.price;
          item2.quantity = item1.quantity;
          item2.updated = true;
        }
      }
      return array2;
    };

    const mergedAllItems = mergeItems(
      getCartItems as Item[],
      allPreCheckotItems as MergedItem[]
    );

    const updateItems = (array: MergedItem[]): IProduct[] => {
      const updatedItems: IProduct[] = array.filter((item) => {
        if (item.updated) {
          // @ts-expect-error Aqui vai ocorrer um erro, mas estou ignorando
          delete item.updated;

          return item;
        }
      });

      return updatedItems.filter((item) => item !== null);
    };

    // window.ga_pre_checkout = updateItems(mergedAllItems);

    // setStorageJson("ga-pre-checkout", window.ga_pre_checkout as []);

    // const view_cart = () => {
    //   const mergeItems = updateItems(mergedAllItems);
    //   const dataCart = window.dataLayer[1]["cart"];

    //   const isOk = dataCart.map((item) => {
    //     if (item.name) {
    //     }
    //   });
    // };

    // const cartTotal = view_cart_items.reduce((acc: number, item: IProduct) => {
    //   return acc + item.price;
    // }, 0);

    // console.log(cartTotal);

    // const event_view_cart = {
    //   pushDataLayer: () => {
    //     window.dataLayer.push({ ecommerce: null });
    //     window.dataLayer.push({
    //       event: "view_cart",
    //       ecommerce: {
    //         currency: "BRL",
    //         value: view_cart.total,
    //         items: [view_cart.items],
    //       },
    //     });
    //   },
    // };

    // gtmDataLayer.pushEvent(event_view_cart.pushDataLayer());
  }
}, 2000);
