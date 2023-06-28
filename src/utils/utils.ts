import { PricesConfig } from "../interfaces/Configs";

export const formatId = (text: string) => {
  // const regex = /(?:\b\s\b|-)|(?:\p{M})|:/gu;

  if (typeof text !== "string") {
    console.error(`Não foi possível formatar o ${text}`);
  }

  return text
    .replace(/\b(\s)\b|[-]/g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(":", "")
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

export const getPrices = (product: Element, prices: PricesConfig) => {
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
