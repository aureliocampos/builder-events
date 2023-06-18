import "./proxy/index.js";

import { Promotion } from "./components/Promotion";
import { EventViewPromotion } from "./events/ViewPromotion";

/**
 *  Init App
 *
 */
window.dataLayer = window.dataLayer || [];

setTimeout(() => {
  const optionsFullBanner = {
    promotionName: "full_banner",
    container: "#home_full_banners .slick-track",
    excludeClassItem: "slick-cloned",
    itemTextSelector: "img",
  };
  const optionsBannerTop = {
    promotionName: "banner_tarja_topo",
    container: ".highlights-copy .highlights-section-container",
    itemTextSelector: "a",
  };
  const optionsBannerBottom = {
    promotionName: "banner_tarja_topo",
    container:
      ".main-section + .highlights-section .highlights-section-container",
    itemTextSelector: "a",
  };
  const optionsBannerCenter = {
    promotionName: "banner_central",
    container: ".mini-banners-home-middle .column",
    itemTextSelector: "img",
  };

  const fullBanner = new Promotion(optionsFullBanner);
  const bannerTop = new Promotion(optionsBannerTop);
  const bannerCenter = new Promotion(optionsBannerCenter);
  const bannerBottom = new Promotion(optionsBannerBottom);

  const viewPromotionItems = [
    ...fullBanner.promotion,
    ...bannerTop.promotion,
    ...bannerCenter.promotion,
    ...bannerBottom.promotion,
  ];

  const view_promotion = new EventViewPromotion(viewPromotionItems);
  view_promotion.pushEvent();
}, 3000);

/**
 *  // Criando evento View_Promotion
 *  const fullBannerPromotions = new BuilderPromotion(options)
 *
 *  const builder = new BuilderEvent()
 *
 *  const viewPromotion = builder.viewPromotion(fullBannerPromotions.items)
 *
 *  viewPromotion.pushDatalayer()
 *  viewPromotion.resetDatalayer()
 *
 *  viewPromotion.setDatalayer(fullBannerPromotions.items)
 *  viewPromotion.getDatalayer()
 *
 *  viewPromotion.setDatalayerItems()
 *  viewPromotion.getDatalayerItems()
 *
 *  viewPromotion.getAllPromotions()
 *
 *  // Criando Evento Select_Promotion
 *  const selectPromotion = builder.selectPromotion(viewPromotion.getAllPromotions())
 *
 *
 * selectPromotion.forEach( promotion => {
 *  promotion.addEventListener(item => {
 *    item.pushDataLayer(item)
 *  })
 * })
 */
