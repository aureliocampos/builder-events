export const idFormatted = (text: string) => {
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

export const priceFormatted = (item: Element) => {
  const value = item?.textContent !== null ? item?.textContent : "";

  return Number(value.trim().replace("R$", "").replace(",", "."));
};

export const getPrice = (item: Element) => {
  const prices = item.querySelector(".price-box")?.children;

  let oldPrice = 0;
  let specialPrice = 0;
  let regularPrice = 0;

  if (prices?.item(0)?.classList.contains("old-price")) {
    const selectorOldPrice = prices.item(0)?.querySelector(".price");
    const selectorSpecialPrice = prices.item(1)?.querySelector(".price");

    if (selectorSpecialPrice && selectorOldPrice) {
      oldPrice = priceFormatted(selectorOldPrice);
      specialPrice = priceFormatted(selectorSpecialPrice);
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
      regularPrice = priceFormatted(selectorRegularPrice);
    }

    return {
      oldPrice,
      specialPrice,
      regularPrice: Number(regularPrice.toFixed(2)),
    };
  }
};
