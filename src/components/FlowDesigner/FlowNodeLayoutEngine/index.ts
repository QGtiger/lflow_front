import { Edge, MarkerType, Node } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";
import { EventsDispatcher } from "@/common/EventsDispatcher";
import type { RectInfer } from "./DisplayObject";

export class FlowNodeLayoutEngine extends EventsDispatcher<{
  rePaint: { id: string; rect: RectInfer };
}> {
  private nodeMap: Record<string, FlowNode> = {};
  private flowBlockMap: Record<string, FlowBlock> = {};
  private rootId: string | undefined;

  constructor() {
    super();
    this.initEvents();
  }

  private initEvents() {}

  private removeEvents() {
    this.removeAllEventListener();
  }

  destroy() {
    this.removeEvents();
  }

  get rootBlock() {
    if (!this.rootId) {
      throw new Error("rootId not found");
    }
    return this.flowBlockMap[this.rootId];
  }

  private generateNodeMap(nodes: FlowNode[]) {
    this.nodeMap = {};
    nodes.forEach((node) => {
      this.nodeMap[node.id] = node;
    });
  }

  getFlowNode(id: string) {
    return this.nodeMap[id];
  }

  getFlowBlockById(id: string) {
    return this.flowBlockMap[id];
  }

  createFlowBlock(node: FlowNode) {
    const item = new FlowBlock({
      id: node.id,
    });
    // 绑定事件
    item.addEventListener("resize", (e) => {
      console.log("resize", e);
      this.dispathcEvent("rePaint", {
        id: node.id,
        rect: e.data,
      });
    });
    return item;
  }

  // 一些方法
  setGraphNode2Block(nodes: FlowNode[], rootId?: string) {
    //
    let nodeId = (this.rootId = rootId || nodes.at(0)?.id);
    this.generateNodeMap(nodes);
    let parentBlock: FlowBlock | undefined;

    while (nodeId) {
      const node: FlowNode = this.nodeMap[nodeId];
      if (!node) {
        throw new Error(`node ${nodeId} not found`);
      }
      const block = (this.flowBlockMap[nodeId] = this.createFlowBlock(node));
      if (parentBlock) {
        parentBlock.setNext(block);
      }
      parentBlock = block;
      nodeId = node.next;
    }
  }

  /**
   * 获取flow 节点信息
   * @param id 节点id
   * @returns flow 节点信息
   */
  private getNodeData(id: string): Node {
    const block = this.flowBlockMap[id];
    const parentBlock = block.parent;
    return {
      id,
      data: { label: id },
      parentId: parentBlock?.id,
      position: {
        x: parentBlock ? (parentBlock.w - block.w) / 2 : -block.w / 2,
        y: parentBlock ? parentBlock.mb + parentBlock.h : 0,
      },
      // style: {
      //   width: block.w,
      //   height: block.h,
      // },
      type: "customNode",
    };
  }

  /**
   * 导出flow 数据
   * @param block 节点
   * @returns 返回 flowNode 数据
   */
  private exportReactFlowData(block: FlowBlock) {
    const nextReactFlowData = block.next
      ? this.exportReactFlowData(block.next)
      : {
          nodes: [],
          edges: [],
        };

    const nodes: Node[] = Array.prototype.concat.call(
      [],
      this.getNodeData(block.id),
      nextReactFlowData.nodes
    );

    const edges: Edge[] = Array.prototype.concat.call(
      [],
      (() => {
        const nextNode = nextReactFlowData.nodes.at(0);
        if (!nextNode) return [];
        return {
          id: `${block.id}-${nextNode.id}`,
          source: block.id,
          target: nextNode.id,
          focusable: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          type: "customStepEdge",
        } as Edge;
      })(),
      nextReactFlowData.edges
    );

    return {
      nodes,
      edges,
    };
  }

  exportReactFlowDataByRoot() {
    return this.exportReactFlowData(this.rootBlock);
  }
}
