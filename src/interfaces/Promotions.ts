import { IPromotion } from "./Promotion";

export interface Promotions {
  creative_name: string;
  creative_slot: string;
  promotion_id: string;
  promotion_name: string;
  items: Array<IPromotion>;
}
