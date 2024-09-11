export class DisplayObject {
  // 坐标矩阵，有add， sub等坐标计算方法
  x: number = 0;
  y: number = 0;
  w: number = 0;
  h: number = 0;
  mb: number = 100;

  constructor(data?: { x: number; y: number; w: number; h: number }) {
    if (data) {
      this.x = data.x;
      this.y = data.y;
      this.w = data.w;
      this.h = data.h;
    }
  }

  setRect(rect: { x: number; y: number; w: number; h: number }) {
    this.x = rect.x;
    this.y = rect.y;
    this.w = rect.w;
    this.h = rect.h;
  }
}
