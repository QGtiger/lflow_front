import { GlobalEventDispatcher } from "../constant";

export type RectInfer = {
  w: number;
  h: number;
};

export class DisplayObject {
  // 坐标矩阵，有add， sub等坐标计算方法
  w: number = Math.random() * 150 + 100;
  h: number = 40;
  mb: number = 40;

  constructor(data?: RectInfer) {
    if (data) {
      this.w = data.w;
      this.h = data.h;
    }
  }

  setRect(rect: RectInfer) {
    this.w = rect.w;
    this.h = rect.h;

    GlobalEventDispatcher.dispathcEvent("rePaint");
  }
}
