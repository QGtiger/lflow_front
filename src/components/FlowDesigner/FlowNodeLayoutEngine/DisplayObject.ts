import { EventsDispatcher } from "@/common/EventsDispatcher";

export type RectInfer = {
  w: number;
  h: number;
};

export class DisplayObject extends EventsDispatcher<{
  resize: RectInfer;
}> {
  // 坐标矩阵，有add， sub等坐标计算方法
  w: number = 0;
  h: number = 0;
  mb: number = 40;

  constructor(data?: RectInfer) {
    super();
    if (data) {
      this.w = data.w;
      this.h = data.h;
    }
  }

  setRect(rect: RectInfer) {
    this.w = rect.w;
    this.h = rect.h;

    this.dispathcEvent("resize", rect);
  }
}
