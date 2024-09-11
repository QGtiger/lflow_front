import { FlowNodeLayoutEngine } from "@/libs/FlowNodeLayoutEngine";
import { Edge, Node } from "@xyflow/react";
import { createContext } from "react";
import { createStore } from "zustand";

// https://github.com/pmndrs/zustand

export interface LFStoreState {
  nodes: Node[];
  edges: Edge[];
  FlowNodeLayoutEngineIns: FlowNodeLayoutEngine;
  setNodes: (nodes: Node[]) => void;
}

export type LFStoreApi = ReturnType<typeof createLFStore>;

export const StoreContext = createContext<LFStoreApi>({} as any);

export function createLFStore({ flowNodes }: { flowNodes: FlowNode[] }) {
  // 创建 FlowNodeLayoutEngine 实例
  const FlowNodeLayoutEngineIns = new FlowNodeLayoutEngine();
  FlowNodeLayoutEngineIns.setGraphNode2Block(flowNodes);
  const { nodes } = FlowNodeLayoutEngineIns.exportReactFlowData();
  console.log(nodes);
  const store = createStore<LFStoreState>((set) => {
    return {
      nodes: nodes,
      edges: [],
      FlowNodeLayoutEngineIns,
      setNodes: (nodes: Node[]) => {
        set((state) => {
          state.nodes = nodes;
          return {
            ...state,
          };
        });
      },
    };
  });
  return store;
}
