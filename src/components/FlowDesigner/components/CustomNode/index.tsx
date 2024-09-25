import { useResizeObserver } from "@/hooks/useResizeObserver";
import { Handle, NodeProps, Position, useNodeId } from "@xyflow/react";
import { useRef } from "react";
import useLFStoreState from "../../hooks/useLFStoreState";

export default function CustomNode(props: NodeProps) {
  const id = useNodeId();
  const nodeRef = useRef<HTMLDivElement>(null);
  const { setNodeDisplayConfig } = useLFStoreState();
  const tt = useRef(Math.random());

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
        className=" transition ring-1 rounded-sm w-full ring-slate-400 hover:ring-2 hover:ring-indigo-600 p-2"
        ref={nodeRef}
      >
        {tt.current}
      </div>
    </div>
  );
}
