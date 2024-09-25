import { DisplayObject } from "./DisplayObject";

export class FlowBlock extends DisplayObject {
  next?: FlowBlock;
  parent?: FlowBlock;
  id: string;

  constructor(options: {
    id: string;
    rect?: { x: number; y: number; w: number; h: number };
  }) {
    super(options.rect);
    this.id = options.id;
  }

  setNext(block?: FlowBlock) {
    if (!block) {
      this.next = undefined;
      return this;
    }

    if (this.next) {
      block.setNext(this.next);
    }
    this.next = block;
    block.parent = this;

    return block;
  }

  break() {
    if (this.parent) {
      this.parent.setNext(this.next);
    }

    this.removeLink();

    this.removeAllEventListener();
  }

  /**
   * 移除所有的链接,清除引用
   */
  removeLink() {
    this.next = undefined;
    this.parent = undefined;
  }
}
