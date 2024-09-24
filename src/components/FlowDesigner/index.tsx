import { PropsWithChildren, useEffect, useRef } from "react";
import {
  createLFStore,
  LFStoreApi,
  LFStoreConfig,
  StoreContext,
} from "./context";
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
import CustomNode from "./components/CustomNode";

const edgeTypes = {
  customStepEdge: CustomStepEdge,
};

const nodeTypes = {
  customNode: CustomNode,
};

function CustomReactFlow() {
  const { nodes, edges } = useLFStoreState();
  const FlowNodeLayoutEngineIns = useFlowNodeLayoutEngineIns();
  useEffect(() => {
    // @ts-expect-error 111
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
        nodeTypes={nodeTypes}
      >
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>
    </ReactFlowProvider>
  );
}

export function FlowDesignerProvider(props: PropsWithChildren<LFStoreConfig>) {
  const storeRef = useRef<LFStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createLFStore(props);
  }
  return (
    <StoreContext.Provider value={storeRef.current}>
      <CustomReactFlow />
    </StoreContext.Provider>
  );
}
