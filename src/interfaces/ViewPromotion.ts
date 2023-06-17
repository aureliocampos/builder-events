import { Promotion } from "./Promotion";

export interface ViewPromotion {
  creative_name: string;
  creative_slot: string;
  promotion_id: string;
  promotion_name: string;
  items: Array<Promotion>;
}
