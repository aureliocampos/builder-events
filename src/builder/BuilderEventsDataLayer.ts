import { BuilderViewPromotion } from "./events/BuilderViewPromotion";
import { BuilderSelectPromotion } from "./events/BuilderSelectPromotion";

import { IPromotion } from "../interfaces/index";

export class BuilderEventsDataLayer {
  constructor() {}
  /**
   * viewPromotion
   */
  public viewPromotion(items: IPromotion[]) {
    return new BuilderViewPromotion(items);
  }

  /**
   * selectPromotion
   */
  public selectPromotion() {
    return new BuilderSelectPromotion();
  }
}
