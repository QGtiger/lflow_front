import { Node } from "@xyflow/react";
import { FlowBlock } from "./FlowBlock";

export class FlowNodeLayoutEngine {
  private nodeMap: Record<string, FlowNode> = {};
  private flowBlockMap: Record<string, FlowBlock> = {};
  private rootId: string | undefined;

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
      if (parentBlock) {
        parentBlock.setNext(block);
      }
      parentBlock = block;
      nodeId = node.next;
    }
  }

  getNodeData(id: string): Node {
    const block = this.flowBlockMap[id];
    const parentBlock = block.parent;
    return {
      id,
      type: "input",
      data: { label: id },
      parentId: parentBlock?.id,
      position: {
        x: 0,
        y: parentBlock ? parentBlock.mb + parentBlock.h : 0,
      },
    };
  }

  exportReactFlowData(block: FlowBlock = this.rootBlock) {
    const nodes: Node[] = Array.prototype.concat.call(
      [],
      this.getNodeData(block.id),
      block.next ? this.exportReactFlowData(block.next).nodes : []
    );
    return {
      nodes,
    };
  }
}
