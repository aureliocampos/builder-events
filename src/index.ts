import "./proxy/index.js";

import { formatId, formatPrice, getPrices } from "./utils/utils";
/**
 * Verifica se os itens do array1 existem no array2 e realiza a mesclagem das informações.
 * Substitui as propriedades "price" e "quantity" do objeto do array2 pelo objeto do array1, se o item existir.
 * @param config Array de objetos
 * @returns Array2 com as informações atualizadas
 */
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

const configProducts = [
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
        location_id: location,
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
            id: id.split("_")[0],
          };
        };

        const { discount, price } = getPrices(product, prices);
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
  // Verifica se os items já existe no local storage
  window.ga_products_item = localStorage.getItem("ga-products-item")
    ? JSON.parse(localStorage.getItem("ga-products-item") as string)
    : [];

  window.ga_select_item = localStorage.getItem("ga-select-item")
    ? JSON.parse(localStorage.getItem("ga-select-item") as string)
    : [];

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
                  (promotion: any) => promotion.location_id === buttonID
                );
                // Buscar pelo location_id trás o resultado correto
                return {
                  item: getClickedItem,
                };
              }
            };

            const { item }: any = getPromotionSelect();

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

        const items = allViewItemList?.flatMap((list) => list.items);

        if (items?.length) {
          window.ga_products_item = [...items];

          localStorage.setItem(
            "ga-products-item",
            JSON.stringify(window.ga_products_item)
          );
        }

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

        /**
         * Evento GA: select_item
         *
         */
        if (document.querySelectorAll("[ga-product-link]")) {
          const buttons = document.querySelectorAll("[ga-product-link]");

          buttons.forEach((button) => {
            button.addEventListener("click", (event) => {
              const buttonID = button.getAttribute("ga-product-link");

              const getProductSelect = () => {
                const getStorage = localStorage.getItem("ga-products-item");

                if (getStorage !== null) {
                  const allProducts = JSON.parse(getStorage);

                  const getClickedItem = allProducts.find(
                    (product: any) => formatId(product.item_name) === buttonID
                  );

                  // Buscar pelo location_id trás o resultado correto
                  return {
                    item: getClickedItem,
                  };
                }
              };

              const { item }: any = getProductSelect();

              window.ga_select_item.push(item);

              localStorage.setItem(
                "ga-select-item",
                JSON.stringify(window.ga_select_item)
              );

              if (item) {
                window.dataLayer.push({ ecommerce: null });
                window.dataLayer.push({
                  event: "select_item",
                  ecommerce: {
                    items: item,
                  },
                });
              }
            });
          });
        }
      }, 3500);

      // Eventos para a página de produto
      if (document.body.classList.contains("catalog-category-view")) {
        /**
         * Evento GA: view_item
         */
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: "view_item",
          ecommerce: {
            items: window.ga_select_item[window.ga_select_item.length - 1],
          },
        });

        //
        // Percorre apenas as configurações da lista padrão
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
          /**
           * Evento GA: select_item
           *
           */
          if (document.querySelectorAll("[ga-product-link]")) {
            const buttons = document.querySelectorAll("[ga-product-link]");

            buttons.forEach((button) => {
              button.addEventListener("click", (event) => {
                const buttonID = button.getAttribute("ga-product-link");

                const getProductSelect = () => {
                  const getStorage = localStorage.getItem("ga-products-item");

                  if (getStorage !== null) {
                    const allProducts = JSON.parse(getStorage);

                    const getClickedItem = allProducts.find(
                      (product: any) => formatId(product.item_name) === buttonID
                    );

                    // Buscar pelo location_id trás o resultado correto
                    return {
                      item: getClickedItem,
                    };
                  }
                };

                const { item }: any = getProductSelect();

                window.ga_select_item.push(item);

                localStorage.setItem(
                  "ga-select-item",
                  JSON.stringify(window.ga_select_item)
                );

                if (item) {
                  window.dataLayer.push({ ecommerce: null });
                  window.dataLayer.push({
                    event: "select_item",
                    ecommerce: {
                      items: item,
                    },
                  });
                }
              });
            });
          }
        }
        //
        //
      }

      if (document.body.classList.contains("catalog-product-view")) {
        // Eventos do produto

        const buttonCart = document.querySelector(".btn-cart");

        const configPageProductSelectors = {
          selectorContainer: ".product-essential",
          selectorName: ".product-name .h1",
          selectorQuantity: "input#qty",
          selectorPrices: {
            regularPrice: ".regular-price .price",
            specialPrice: ".special-price .price",
            oldPrice: ".old-price .price",
          },
        };
        buttonCart?.addEventListener("click", (event) => {
          event.preventDefault();

          const {
            selectorQuantity,
            selectorPrices,
            selectorContainer,
            selectorName,
          } = configPageProductSelectors;

          const product = document.querySelector(selectorContainer);

          if (product) {
            const name =
              document.querySelector(selectorName)?.textContent ?? "";
            const { discount, price } = getPrices(product, selectorPrices);
            const quantity =
              (document.querySelector(selectorQuantity) as HTMLInputElement)
                ?.value ?? "";

            const itemSelected = {
              name,
              discount,
              price,
              quantity: parseFloat(quantity),
            };

            const AllSelectedItems = JSON.parse(
              localStorage.getItem("ga-select-item") ?? "[]"
            );

            const itemInfo = AllSelectedItems.filter(
              (selected: any) => selected.item_name === itemSelected.name
            );

            if (itemInfo) {
              const item = itemInfo[0];

              window.dataLayer.push({ ecommerce: null });
              window.dataLayer.push({
                event: "add_to_cart",
                ecommerce: {
                  items: item,
                },
              });
            }
          }
        });
      }

      if (document.body.classList.contains("checkout-cart-index")) {
        const subtotal =
          document.querySelector("#shopping-cart-totals-table tbody .price")
            ?.textContent ?? "";
        const removeButtons = document.querySelectorAll(".btn-remove");

        const config = {
          container: "#shopping-cart-table",
          productItem: "tbody tr",
          productName: ".product-name",
          productSubtotal: ".product-cart-total .cart-price .price",
          productQuantity: "input.qty",
        };

        /**
         * Evento GA: View_cart
         */

        const getCartProducts = () => {
          const container = document.querySelector(config.container);
          const allProducts = container?.querySelectorAll(config.productItem);

          if (allProducts) {
            const cartProducts = Array.from(allProducts).map((product) => {
              const { productName, productQuantity, productSubtotal } = config;

              const getName =
                product.querySelector(productName)?.textContent ?? "";

              const getSubtotal = formatPrice(
                product.querySelector(productSubtotal) as Element
              );
              const getQuantity =
                (product.querySelector(productQuantity) as HTMLInputElement)
                  .value ?? "";

              return {
                name: getName.trim(),
                subtotal: getSubtotal,
                quantity: parseFloat(getQuantity),
              };
            });

            return cartProducts;
          }
        };
        const updateItems = () => {
          const AllSelectedItems = JSON.parse(
            localStorage.getItem("ga-select-item") ?? "[]"
          );

          const cartItems = getCartProducts();
          const names = cartItems?.flatMap((item) => item.name);
          let alreadyUpdated: string[] = [];

          const mergeItems: [] = AllSelectedItems.filter((item: IProduct) => {
            if (alreadyUpdated.includes(item.item_name)) {
              return;
            }

            if (!names?.includes(item.item_name)) {
              return;
            }

            const updateItem = cartItems?.find(
              (cartItem) => cartItem.name === item.item_name
            );

            alreadyUpdated.push(updateItem?.name ?? "");

            const updateItemPrice = () => (item.price = updateItem?.subtotal);
            const updateItemQuantity = () =>
              (item.quantity = updateItem?.quantity);

            return {
              ...item,
              price: updateItemPrice(),
              quantity: updateItemQuantity(),
            };
          });

          return mergeItems;
        };

        window.ga_pre_checkout = updateItems();

        if (window.ga_pre_checkout) {
          window.dataLayer.push({ ecommerce: null });
          window.dataLayer.push({
            event: "view_cart",
            current: "",
            value: "",
            ecommerce: {
              items: window.ga_pre_checkout,
            },
          });
        }

        /**
         * Evento GA: remove_from_cart
         */

        Array.from(removeButtons).forEach((button) => {
          button.addEventListener("click", (event) => {
            const product = button.closest(config.productItem);
            const getName =
              product?.querySelector(config.productName)?.textContent ?? "";
            const removeName = getName.trim();

            const itemRemoved = window.ga_pre_checkout.filter(
              (item: IProduct, index: number) => {
                if (item.item_name === removeName) {
                  window.ga_pre_checkout.splice(index, 1);

                  return item;
                }
              }
            );

            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
              event: "remove_from_cart",
              ecommerce: {
                items: itemRemoved,
              },
            });
          });
        });

        /**
         * Evento GA: add_to_cart and remove_from_Cart
         */
      }
    }, 2000);
  }
});

/**
 * Para select_item utilizar a mesma lógica de select_promotion
 *
 * Criar fallback para itens não encontrados no storage, principalmente na página de produto e carrinho
 */
