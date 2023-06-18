import { Promotion } from "../components/Promotion";
import { IPromotion } from "../interfaces/Promotion";

export default function ViewPromotion(items: IPromotion[][]) {
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "view_promotion",
    ecommerce: {
      items,
    },
  });
}
