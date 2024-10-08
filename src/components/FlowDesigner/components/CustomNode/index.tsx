import { useResizeObserver } from "@/hooks/useResizeObserver";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { useRef } from "react";
import useLFStoreState from "../../hooks/useLFStoreState";
import useFlowNode from "../../hooks/useFlowNode";

export default function CustomNode({ id }: NodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { setNodeDisplayConfig } = useLFStoreState();
  const flowNode = useFlowNode();

  useResizeObserver(nodeRef, (entry) => {
    if (!id) return;
    const { offsetWidth, offsetHeight } = entry.target as HTMLDivElement;
    if (!offsetWidth || !offsetHeight) return;
    setNodeDisplayConfig(id, {
      w: offsetWidth,
      h: offsetHeight,
    });
  });

  return (
    <div className="custom-node">
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
        className=" invisible "
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="sourceBottom"
        style={{ background: "#555" }}
        className=" invisible "
      />
      <div
        className=" min-w-[350px] transition ring-1 ring-slate-400 rounded-sm hover:ring-2 hover:ring-indigo-600 p-2"
        ref={nodeRef}
      >
        {flowNode.connectorCode}
      </div>
    </div>
  );
}
