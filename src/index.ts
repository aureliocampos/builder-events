import "./proxy/index.js";

import { Promotion } from "./builder/elements/Promotion";
import { BuilderEventsDataLayer } from "./builder/BuilderEventsDataLayer";

/**
 *  Init App
 *
 */
window.dataLayer = window.dataLayer || [];

setTimeout(() => {
  const sitePromotionConfig = [];
  const fullBanner = new Promotion({
    promotionName: "full_banner",
    container: "#home_full_banners .slick-track",
    excludeClassItem: "slick-cloned",
    itemTextSelector: "img",
  });
  const bannerTop = new Promotion({
    promotionName: "banner_tarja_topo",
    container: ".highlights-copy .highlights-section-container",
    itemTextSelector: "a",
  });
  const bannerCenter = new Promotion({
    promotionName: "banner_central",
    container: ".mini-banners-home-middle .column",
    itemTextSelector: "img",
  });
  const bannerBottom = new Promotion({
    promotionName: "banner_tarja_rodape",
    container:
      ".main-section + .highlights-section .highlights-section-container",
    itemTextSelector: "a",
  });

  const viewPromotionItems = [
    ...fullBanner.getAllPromotions(),
    ...bannerTop.getAllPromotions(),
    ...bannerCenter.getAllPromotions(),
    ...bannerBottom.getAllPromotions(),
  ];

  const builder = new BuilderEventsDataLayer();

  const eventViewPromotion = builder.viewPromotion(viewPromotionItems);
  const eventSelectPromotion = builder.selectPromotion();

  eventViewPromotion.pushEventDataLayer();
  eventSelectPromotion.selectEventListener(viewPromotionItems);
}, 3000);

/**
 * Class mais Abtrasta com metodos em comum com todas as classes de item
 * Lista de métodos comuns entre todos os items
 *
 *  method.pushDatalayer()
 *  method.resetDatalayer()
 *
 *  method.setDatalayer(items)
 *  method.getDatalayer()
 *
 *  method.setDatalayerItems(items)
 *  method.getDatalayerItems()
 *
 *  method.getAllItems()
 *  method.getAllItemsWithID()
 *
 *
 * Class especifica de Item
 * * Percorra a DOM para obter os elementos relevantes
 * * formate esses elementos para o formato válido de items do evento
 * * Adcione marcadores únicos para obter no futuro e um função que lide com o estado deles se já foi clicado ou não
 * * retorne esses items
 *
 *
 *
 */
