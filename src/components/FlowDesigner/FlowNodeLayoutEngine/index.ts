import { Edge, MarkerType, Node } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";
import { EventsDispatcher } from "@/common/EventsDispatcher";
import { GlobalEventDispatcher } from "../constant";

export class FlowNodeLayoutEngine extends EventsDispatcher {
  private nodeMap: Record<string, FlowNode> = {};
  private flowBlockMap: Record<string, FlowBlock> = {};
  private rootId: string | undefined;

  constructor() {
    super();
    this.initEvents();
  }

  initEvents() {
    GlobalEventDispatcher.addEventListener("rePaint", () => {
      console.log("rePaint");
    });
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

  getFlowBlockById(id: string) {
    return this.flowBlockMap[id];
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
        throw new Error("node not found");
      }
      const block = (this.flowBlockMap[nodeId] = new FlowBlock({
        id: nodeId,
      }));
      // block.addEventListener('rePaint')
      if (parentBlock) {
        parentBlock.setNext(block);
      }
      parentBlock = block;
      nodeId = node.next;
    }
  }

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
      style: {
        width: block.w,
        height: block.h,
      },
      type: "customNode",
    };
  }

  exportReactFlowData(block: FlowBlock) {
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
