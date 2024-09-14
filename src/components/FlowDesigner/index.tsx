import { PropsWithChildren, useEffect, useRef } from "react";
import { createLFStore, LFStoreApi, StoreContext } from "./context";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import useFlowNodeLayoutEngineIns from "./hooks/useFlowNodeLayoutEngineIns";
import useLFStoreState from "./hooks/useLFStoreState";

import "./index.css";
import { CustomStepEdge } from "./components/CustomStepEdge";

const edgeTypes = {
  customStepEdge: CustomStepEdge,
};

function CustomReactFlow() {
  const { nodes, edges } = useLFStoreState();
  const FlowNodeLayoutEngineIns = useFlowNodeLayoutEngineIns();
  useEffect(() => {
    window.FlowNodeLayoutEngineIns = FlowNodeLayoutEngineIns;
  }, []);
  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodesDraggable={false}
        fitView
        edgeTypes={edgeTypes}
      >
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </ReactFlowProvider>
  );
}

export function FlowDesignerProvider({
  flowNodes,
}: PropsWithChildren<{
  flowNodes: FlowNode[];
}>) {
  const storeRef = useRef<LFStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createLFStore({ flowNodes });
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      <CustomReactFlow />
    </StoreContext.Provider>
  );
}
