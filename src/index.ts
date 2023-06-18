import "./proxy/index.js";

import { Promotion } from "./components/Promotion";
import ViewPromotion from "./events/ViewPromotion";

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
    fullBanner.promotion,
    bannerTop.promotion,
    bannerCenter.promotion,
    bannerBottom.promotion,
  ];

  ViewPromotion(viewPromotionItems);
}, 3000);
