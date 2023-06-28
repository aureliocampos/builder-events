export interface IOptions {
  creativeSlot: string;
  container: HTMLElement;
  classFilter?: string;
  promotionNameSelector: string;
}
export interface IPromotion {
  promotion_id: string;
  promotion_name: string;
  creative_name: string;
  creative_slot: string;
  localtion_id: string;
}
export interface IPromotionConfig {
  index: number;
  element: Element;
  selectorName: string;
  creativeSlot: string;
}
