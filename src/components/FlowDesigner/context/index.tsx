import { FlowNodeLayoutEngine } from "@/components/FlowDesigner/FlowNodeLayoutEngine";
import { Edge, Node } from "@xyflow/react";
import { createContext } from "react";
import { createStore } from "zustand";

import type { RectInfer } from "../FlowNodeLayoutEngine/DisplayObject";

// https://github.com/pmndrs/zustand

export interface LFStoreConfig {
  flowNodes: FlowNode[];
  edgeLabelNode?: React.ReactNode;
}

export interface LFStoreState extends LFStoreConfig {
  nodes: Node[];
  edges: Edge[];
  FlowNodeLayoutEngineIns: FlowNodeLayoutEngine;
  setNodes: (nodes: Node[]) => void;
  setEges: (edges: Edge[]) => void;
  setNodeDisplayConfig: (nodeId: string, displayConfig: RectInfer) => void;
  dispose: () => void;
}

export type LFStoreApi = ReturnType<typeof createLFStore>;

export const StoreContext = createContext<LFStoreApi>({} as any);

// eslint-disable-next-line react-refresh/only-export-components
export function createLFStore(config: LFStoreConfig) {
  // 创建 FlowNodeLayoutEngine 实例
  const FlowNodeLayoutEngineIns = new FlowNodeLayoutEngine();
  FlowNodeLayoutEngineIns.setGraphNode2Block(config.flowNodes);
  const { nodes, edges } = FlowNodeLayoutEngineIns.exportReactFlowDataByRoot();
  console.log(nodes, edges);
  const store = createStore<LFStoreState>((set) => {
    return {
      ...config,
      nodes: nodes,
      edges: edges,
      FlowNodeLayoutEngineIns,
      dispose() {
        FlowNodeLayoutEngineIns.destroy();
      },
      setNodes: (nodes: Node[]) => {
        set((state) => {
          state.nodes = nodes;
          return {
            ...state,
          };
        });
      },
      setEges: (edges: Edge[]) => {
        set((state) => {
          state.edges = edges;
          return {
            ...state,
          };
        });
      },
      setNodeDisplayConfig: (nodeId: string, displayConfig: RectInfer) => {
        const block = FlowNodeLayoutEngineIns.getFlowBlockById(nodeId);
        if (block) {
          block.setRect(displayConfig);
        }
      },
    };
  });
  FlowNodeLayoutEngineIns.addEventListener("rePaint", () => {
    const { nodes, edges } =
      FlowNodeLayoutEngineIns.exportReactFlowDataByRoot();
    store.getState().setNodes(nodes);
    store.getState().setEges(edges);
  });
  return store;
}
