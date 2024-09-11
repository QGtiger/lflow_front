import { PropsWithChildren, useEffect, useRef } from "react";
import { createLFStore, LFStoreApi, StoreContext } from "./context";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import useLFStore from "./hooks/useLFStote";
import useFlowNodeLayoutEngineIns from "./hooks/useFlowNodeLayoutEngineIns";

function CustomReactFlow() {
  const nodes = useLFStore((state) => state.nodes);
  const FlowNodeLayoutEngineIns = useFlowNodeLayoutEngineIns();
  useEffect(() => {
    window.FlowNodeLayoutEngineIns = FlowNodeLayoutEngineIns;
  }, []);
  return (
    <ReactFlowProvider>
      <ReactFlow nodes={nodes}>
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
