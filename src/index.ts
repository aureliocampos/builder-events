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
        const item_list_name = list?.title as string;
        const item_list_items = Array.from(list?.allProducts as HTMLCollection);

        if (list?.id === "default") {
          const productItems = item_list_items.map(
            // @class ListProducsDefaultFactory
            (item: Element, index: number) => {
              const itemName = item?.querySelector(".product-name a")
                ?.textContent as string;

              const itemPrices = getPrice(item);

              return {
                affiliation: "Casa Boa Vista",
                index: ++index,
                item_id: idFormatted(itemName),
                item_name: itemName?.trim(),
                currency: "BRL",
                discount: itemPrices?.oldPrice !== 0 ? itemPrices?.oldPrice : 0,
                price:
                  itemPrices?.oldPrice !== 0
                    ? itemPrices?.specialPrice
                    : itemPrices?.regularPrice,
                item_list_id: idFormatted(item_list_name),
                item_list_name: item_list_name,
                quantity: 1,
                location_id: `${idFormatted(item_list_name)}_${idFormatted(
                  itemName
                )}_${index++}`,
              };
            }
            // @class ListProducsDefaultFactory
          );

          return {
            item_list_id: idFormatted(item_list_name),
            item_list_name: item_list_name.trim(),
            items: productItems,
          };
        }
      });

      console.log(viewItemList);
    }
  }, 3000);
}, 2000);

class ItemProducsDefaultFactory {
  private item: Element;
  private index: number;

  private item_name: string;
  private item_price: number;

  constructor(item: Element, index: number) {
    this.item = item;
    this.index = index;
    this.item_name = this.item.querySelector(".product-name a")
      ?.textContent as string;
    this.item_price = getPrice(item);
  }
}
/**
 *  Evento GA : view_item_list Beon
 */
// setTimeout(() => {
//   const allSection = document.querySelectorAll(".beon-container");
//   if (document.querySelectorAll(".beon-container").length > 0) {
//     const allItems = Array.from(allSection).map((section) => section.children);

//     const newList = allItems.map((section) => {
//       console.log(section);

//       // Inicio da class ListProductsFactory
//       // const getTitleContent = section
//       //   .item(0)
//       //   .querySelector(".beon-showcase__title span")?.textContent;

//       // const getSectionGrid = section
//       //   .item(0)
//       //   .querySelector(".beon-slider__slides")?.children;

//       // const sectionTitle = getTitleContent !== "string" ? "" : getTitleContent;

//       // const productsGrid = getSectionGrid ? Array.from(getSectionGrid) : [];

//       // const listConfig = {
//       //   item_list_name: sectionTitle,
//       //   item_list_id: idFormatted(sectionTitle),
//       //   list_item: productsGrid,
//       // };

//       // // Fim da class ListProductsFactory
//       // //
//       // // Inicio da class ProductFactory
//       // return new BeonListProductsFactory(listConfig).getProduct();
//     });

//     console.log(newList);
//   }
// }, 6000);
interface IListsProductConfig {
  item_list_id: string;
  item_list_name: string;
  list_item: Element[];
}
class BeonListProductsFactory {
  item_list_id: string;
  item_list_name: string;
  list_item: Element[];

  constructor(config: IListsProductConfig) {
    this.item_list_id = config.item_list_id;
    this.item_list_name = config.item_list_name;
    this.list_item = config.list_item;
  }

  /**
   * getProduct
   */
  public getProduct() {
    if (this.list_item.length === 0) {
      console.error("Não existe produtos na lista");
    }

    const listFormatted = this.list_item.map((item: Element, index) => {
      const selectorProp = (selector: string) => {
        return item.querySelector(selector);
      };

      const itemName = () => {
        const getName = selectorProp(".product-name a")!.textContent?.trim();

        return getName !== undefined ? getName : "";
      };

      const itemPrice = () => {
        const getPrice = selectorProp(".special-price .price")
          ?.textContent?.trim()
          .replace("R$", "")
          .replace(",", ".");

        return getPrice !== undefined ? Number(getPrice) : 0;
      };

      return {
        item_id: idFormatted(itemName()),
        item_name: itemName(),
        item_list_id: this.item_list_id,
        item_list_name: this.item_list_name,
        location_id: `${idFormatted(itemName())}_${index++}`,
        price: itemPrice(),
        quantity: 1,
      };
    });

    return listFormatted;
  }
}

// const observer = new MutationObserver((allMutations) => {
//   const items = allMutations.forEach((mutation) => {
//     if (mutation.addedNodes.length || mutation.removedNodes.length) {
//       let grids: any[] = [];

//       const productsGrid = document.querySelectorAll(
//         ".list-category-products-section"
//       );

//       const performaGrid = document.querySelectorAll(".performa-vitrine");

//       if (performaGrid.length > 0 && productsGrid.length > 0) {
//         const gridsGroup = [Array.from(performaGrid), Array.from(productsGrid)];
//         const allGrids = gridsGroup.flatMap((grid) => grid);

//         grids = allGrids;
//       }
//       return grids;
//     }
//   });
//   console.log(items);
// });

// const options = {
//   childList: true,
//   subtree: true,
// };

// observer.observe(document.documentElement, options);
