import { IConfigSection } from "../interface/Products";

export const formatId = (text: string) => {
  if (typeof text !== "string") {
    console.error(`Não foi possível formatar o ${text}`);
  }

  return text
    .replace(/\b(\s)\b|[-]/g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase();
};

export const formatPrice = (item: Element) => {
  const getValue = item?.textContent !== null ? item?.textContent : "";
  const clearValue = getValue.trim().replace("R$", "");

  if (clearValue.length >= 8) {
    return Number(clearValue.replace(".", "").replace(",", "."));
  }

  return Number(clearValue.replace(",", "."));
};

export const formatList = (config: IConfigSection) => {
  const { id, section, selectorTitle, selectorGrid } = config;

  const sectionTitle = section.querySelector(selectorTitle)?.textContent;
  const productsItems = section.querySelector(selectorGrid)?.children;

  return {
    id,
    title: sectionTitle !== undefined ? sectionTitle : "",
    allProducts: productsItems !== undefined ? productsItems : [],
  };
};

export const getListType = (section: Element) => {
  /** Class ProductsListFactory(section) */
  if (section.classList.contains("default-section")) {
    const config = {
      id: "default",
      section: section,
      selectorTitle: ".title",
      selectorGrid: ".products-grid",
    };

    return formatList(config);
  }
  if (section.classList.contains("performa-vitrine")) {
    const config = {
      id: "performa",
      section: section,
      selectorTitle: ".performa-vitrine-title span",
      selectorGrid: ".performa-vitrine-ul",
    };

    return formatList(config);
  }

  if (section.querySelector(".category-products")) {
    const config = {
      id: "category",
      section: section,
      selectorTitle: ".catalog-category-banner-section-container > h1",
      selectorGrid: ".products-grid",
    };

    return formatList(config);
  }
};

export const getPriceDefault = (item: Element) => {
  const prices = item.querySelector(".price-box")?.children;

  let oldPrice = 0;
  let specialPrice = 0;
  let regularPrice = 0;

  if (prices?.item(0)?.classList.contains("old-price")) {
    const selectorOldPrice = prices.item(0)?.querySelector(".price");
    const selectorSpecialPrice = prices.item(1)?.querySelector(".price");

    if (selectorSpecialPrice && selectorOldPrice) {
      oldPrice = formatPrice(selectorOldPrice);
      specialPrice = formatPrice(selectorSpecialPrice);
    }

    return {
      oldPrice: Number((oldPrice - specialPrice).toFixed(2)),
      specialPrice: Number(specialPrice.toFixed(2)),
      regularPrice,
    };
  }

  if (prices?.item(0)?.classList.contains("regular-price")) {
    const selectorRegularPrice = prices.item(0)?.querySelector(".price");

    if (selectorRegularPrice) {
      regularPrice = formatPrice(selectorRegularPrice);
    }

    return {
      oldPrice,
      specialPrice,
      regularPrice: Number(regularPrice.toFixed(2)),
    };
  }
};

export const getPricePerforma = (item: Element) => {
  const prices = item.querySelector(".performa-details-vitrine")?.children;

  let oldPrice = 0;
  let specialPrice = 0;
  let regularPrice = 0;

  if (prices?.item(1)?.classList.contains("performa-price-vitrine")) {
    const selectorOldPrice = prices.item(1);

    const selectorSpecialPrice = prices
      .item(2)
      ?.querySelector(".performa-list-price-vitrine strong");

    if (selectorSpecialPrice && selectorOldPrice) {
      oldPrice = formatPrice(selectorOldPrice);
      specialPrice = formatPrice(selectorSpecialPrice);
    }

    return {
      oldPrice: Number((oldPrice - specialPrice).toFixed(2)),
      specialPrice: Number(specialPrice.toFixed(2)),
      regularPrice,
    };
  }

  if (prices?.item(1)?.classList.contains("performa-list-price-vitrine")) {
    const selectorRegularPrice = prices.item(1)?.querySelector("strong");

    if (selectorRegularPrice) {
      regularPrice = formatPrice(selectorRegularPrice);
    }

    return {
      oldPrice,
      specialPrice,
      regularPrice: Number(regularPrice.toFixed(2)),
    };
  }
};

export const getStorageJson = (key: string): [] => {
  const responseJson = localStorage.getItem(key);
  return responseJson !== null ? JSON.parse(responseJson) : [];
};

export const setStorageJson = (key: string, value: string | []) => {
  if (typeof value !== "string") {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  return localStorage.setItem(key, value);
};
