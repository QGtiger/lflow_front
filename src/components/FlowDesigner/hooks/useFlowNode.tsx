import { useNodeId } from "@xyflow/react";
import useFlowNodeLayoutEngineIns from "./useFlowNodeLayoutEngineIns";

export default function useFlowNode() {
  const id = useNodeId();
  const ins = useFlowNodeLayoutEngineIns();
  if (!id) {
    throw new Error("useFlowNode must be used in a FlowNode component");
  }
  return ins.getFlowNode(id);
}
