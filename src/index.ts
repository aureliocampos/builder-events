import { IPromotion } from "./interface/Promotion.js";
import "./proxy/index.js";
import { formatId, formatPrice } from "./utils/utils.js";

/**
 * Verifica se os itens do array1 existem no array2 e realiza a mesclagem das informações.
 * Substitui as propriedades "price" e "quantity" do objeto do array2 pelo objeto do array1, se o item existir.
 * @param config Array de objetos
 * @returns Array2 com as informações atualizadas
 */

// Interfaces
interface TitleConfig {
  selector: string;
}

interface PricesConfig {
  regularPrice: string;
  specialPrice: string;
  oldPrice: string;
}

interface ItemConfig {
  sku: string;
  name: string;
  prices: PricesConfig;
}

interface GridConfig {
  selector: string;
  items: {
    selector: string;
    item: ItemConfig;
  };
}

interface ProductConfig {
  name: string;
  config: {
    allContainers: string;
    title: TitleConfig;
    grid: GridConfig;
  };
}

const configPromotions = [
  {
    config: {
      name: "banner_full",
      container: "#home_full_banners",
      items: {
        selector: ".slick-slide",
        content: {
          selector: "img",
          tag: "img",
        },
      },
    },
  },
  {
    config: {
      name: "banner_tarja_topo",
      container: ".highlights-copy",
      items: {
        selector: ".highlight-block",
        content: {
          selector: "a",
          tag: "a",
        },
      },
    },
  },
  {
    config: {
      name: "banner_central",
      container: ".mini-banners-home-middle",
      items: {
        selector: ".link",
        content: {
          selector: ".label",
          tag: "h3",
        },
      },
    },
  },
  {
    config: {
      name: "banner_tarja_rodape",
      container: ".main-section + .highlights-section",
      items: {
        selector: ".highlight-block",
        content: {
          selector: "a",
          tag: "a",
        },
      },
    },
  },
];

const configProducts: ProductConfig[] = [
  {
    name: "beon_default",
    config: {
      allContainers: ".beon-container .beon-showcase",
      title: {
        selector: ".beon-showcase__title",
      },
      grid: {
        selector: ".beon-showcase__items-wrapper",
        items: {
          selector: ".beon-slider__slide",
          item: {
            sku: ".beon-product__sku",
            name: ".beon-showcase__item-title span",
            prices: {
              regularPrice: ".beon-showcase__item-price .value",
              specialPrice:
                ".beon-showcase__item-price.beon-showcase__item-price--to .value",
              oldPrice:
                ".beon-showcase__item-price.beon-showcase__item-price--from .value",
            },
          },
        },
      },
    },
  },
  {
    name: "vitrine_default",
    config: {
      allContainers: ".main-section.default-section",
      title: {
        selector: ".catalog-category-banner-section-container > h1",
      },
      grid: {
        selector: ".category-products .products-grid",
        items: {
          selector: ".item",
          item: {
            sku: "attr",
            name: ".product-name",
            prices: {
              regularPrice: ".regular-price .price",
              specialPrice: ".special-price .price",
              oldPrice: ".old-price .price",
            },
          },
        },
      },
    },
  },
];

interface IConfigProduct {
  allContainers: string;
  title: {
    selector: string;
  };
  grid: {
    selector: string;
    items: {
      selector: string;
      item: {
        sku?: string;
        name: string;
        prices: {
          regularPrice: string;
          specialPrice: string;
          oldPrice: string;
        };
      };
    };
  };
}
interface IProduct {
  item_id: string;
  item_name: string;
  affiliation?: string;
  coupon?: string;
  discount?: number;
  index: number;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_category3?: string;
  item_category4?: string;
  item_category5?: string;
  item_list_id: string;
  item_list_name: string;
  item_variant?: string;
  location_id: string;
  price: number;
  quantity: number;
}

const createPromotions = (config: any) => {
  const container = document.querySelector(config.container);

  if (container !== null) {
    const allPromotions = Array.from(
      container.querySelectorAll(config.items.selector)
    );

    const getInfoItems = allPromotions.map((promotion: any, index: number) => {
      const { selector } = config.items.content;

      const getContentItem = promotion.querySelector(selector);

      const getName = () => {
        const checkTag = getContentItem.tagName;

        const handleNameForAttr = (attr: string) => {
          return getContentItem.getAttribute(attr)
            ? getContentItem.getAttribute(attr)
            : `Atributo ${attr} vazio`;
        };

        switch (checkTag) {
          case "IMG":
            return {
              name: handleNameForAttr("alt"),
            };
          case "A":
            return {
              name: handleNameForAttr("title"),
            };
          default:
            return {
              name: getContentItem.textContent,
            };
        }
      };

      const { name } = getName();
      const location = `${config.name}_${++index}`;

      promotion.setAttribute("ga-promotion-link", location);

      return {
        promotion_name: name,
        promotion_id: formatId(name),
        creative_name: formatId(name),
        creative_slot: config.name,
        localtion_id: location,
      };
    });

    return {
      items: getInfoItems,
    };
  } else {
    return `O Container: ${container}, não está disonível na DOM`;
  }
};

const createViewItemList = (config: IConfigProduct) => {
  const allContainers = Array.from(
    document.querySelectorAll(config.allContainers)
  );

  if (allContainers.length) {
    const allItems = allContainers.map((container) => {
      const title =
        container.querySelector(config.title.selector)?.textContent ?? "";
      const grid = container.querySelector(config.grid.selector) as HTMLElement;
      const allProductItems =
        Array.from(grid.querySelectorAll(config.grid.items.selector)) ?? [];

      const getItems = allProductItems.map((product, index) => {
        const { name, sku, prices } = config.grid.items.item;
        const getIndex = ++index;
        const getName = product.querySelector(name)?.textContent ?? "";

        const getID = () => {
          let id: string;

          if (sku && sku !== "attr") {
            id = product.querySelector(sku)?.textContent ?? "";
            return {
              id: formatId(id),
            };
          }

          id = product.getAttribute("data-product-id") ?? "";
          return {
            id: formatId(id).split("_")[0],
          };
        };
        const getPrices = () => {
          const getOldPrice = product.querySelector(prices.oldPrice);
          const getSpecialPrice = product.querySelector(prices.specialPrice);
          const getRegularPrice = product.querySelector(prices.regularPrice);

          if (getOldPrice !== null && getSpecialPrice !== null) {
            const getDiscount = () => {
              const oldPrice = formatPrice(getOldPrice);
              const newPrice = formatPrice(getSpecialPrice);

              return Number(oldPrice - newPrice);
            };
            return {
              price: formatPrice(getSpecialPrice),
              discount: Number(getDiscount().toFixed(2)),
            };
          }

          return {
            price: formatPrice(getRegularPrice as Element),
            discount: 0,
          };
        };

        const { discount, price } = getPrices();
        const { id } = getID();

        // Criar aqui o marcador de clique do produto, sempre que percorrer um produto
        //
        product.setAttribute("ga-product-link", formatId(getName));
        product.setAttribute("ga-product-id", id);

        return {
          item_id: id,
          item_name: getName,
          index: getIndex,
          affiliation: "Casa Boa Vista",
          currency: "BRL",
          item_list_id: formatId(title),
          item_list_name: title.trim(),
          location_id: `${formatId(title)}_${getIndex}`,
          discount: discount > 0 ? discount : 0,
          price: price,
          quantity: 1,
        };
      });

      return {
        item_list_id: formatId(title),
        item_list_name: title.trim(),
        items: [...getItems],
      };
    });

    return allItems;
  }
};

// Inicio dos eventos DataLayer
window.addEventListener("DOMContentLoaded", (event) => {
  if (event.isTrusted === true) {
    setTimeout(() => {
      /**=========================
       * Evento: view_promotion
       */
      // Percorre todos as configurações de promoção e envia os eventos

      window.ga_promotions_item = [];

      configPromotions.forEach(({ config }) => {
        const promotion = createPromotions(config);

        if (typeof promotion !== "string") {
          const { items } = promotion;

          window.ga_promotions_item.push(...items);

          localStorage.setItem(
            "ga-promotions-item",
            JSON.stringify(window.ga_promotions_item)
          );

          window.dataLayer.push({ ecommerce: null });
          window.dataLayer.push({
            event: "view_promotion",
            ecommerce: {
              items,
            },
          });
        }
      });

      /**==========================
       * Evento: select_promotion
       */
      if (document.querySelectorAll("[ga-promotion-link]")) {
        const buttons = document.querySelectorAll("[ga-promotion-link]");

        buttons.forEach((button) => {
          button.addEventListener("click", (event) => {
            event.preventDefault();

            const buttonID = button.getAttribute("ga-promotion-link");

            const getPromotionSelect = () => {
              const getStorage = localStorage.getItem("ga-promotions-item");

              if (getStorage !== null) {
                const allPromotions = JSON.parse(getStorage);

                const getClickedItem = allPromotions.find(
                  (promotion: any) => promotion.localtion_id === buttonID
                );
                // Buscar pelo location_id trás o resultado correto
                return {
                  item: getClickedItem,
                };
              }
            };

            const { item } = getPromotionSelect();

            if (item) {
              window.dataLayer.push({ ecommerce: null });
              window.dataLayer.push({
                event: "select_promotion",
                ecommerce: {
                  items: item,
                },
              });
            }
          });
        });
      }

      /**==========================
       * Evento: view_item_list
       */
      // Outro SetTimeout necessário para aguardar o carregamento da "Beon"
      setTimeout(() => {
        // Percorre apenas as configurações das listas "Beon"
        const allViewItemList = createViewItemList(configProducts[0].config);

        if (allViewItemList?.length) {
          allViewItemList.forEach(({ item_list_id, item_list_name, items }) => {
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
              event: "view_item_list",
              ecommerce: {
                item_list_id,
                item_list_name,
                items,
              },
            });
          });
        }
      }, 3500);

      // Percorre apenas as configurações da lista padrão
      if (document.body.classList.contains("catalog-category-view")) {
        const allViewItemList = createViewItemList(configProducts[1].config);

        if (allViewItemList?.length) {
          allViewItemList.forEach(({ item_list_id, item_list_name, items }) => {
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
              event: "view_item_list",
              ecommerce: {
                item_list_id,
                item_list_name,
                items,
              },
            });
          });
        }
      }
    }, 2000);
  }
});

/**
 * Para select_item utilizar a mesma lógica de select_promotion
 *
 * Criar fallback para itens não encontrados no storage, principalmente na página de produto e carrinho
 */
