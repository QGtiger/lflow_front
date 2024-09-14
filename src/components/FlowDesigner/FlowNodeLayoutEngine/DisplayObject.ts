export class DisplayObject {
  // 坐标矩阵，有add， sub等坐标计算方法
  w: number = Math.random() * 150 + 100;
  h: number = 40;
  mb: number = 40;

  constructor(data?: { x: number; y: number; w: number; h: number }) {
    if (data) {
      this.w = data.w;
      this.h = data.h;
    }
  }

  setRect(rect: { x: number; y: number; w: number; h: number }) {
    this.w = rect.w;
    this.h = rect.h;
  }
}
