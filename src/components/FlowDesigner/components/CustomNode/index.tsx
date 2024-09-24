import { useResizeObserver } from "@/hooks/useResizeObserver";
import { Handle, NodeProps, Position, useNodeId } from "@xyflow/react";
import { useRef } from "react";
import useLFStoreState from "../../hooks/useLFStoreState";

export default function CustomNode(props: NodeProps) {
  const id = useNodeId();
  const nodeRef = useRef<HTMLDivElement>(null);
  const { setNodeDisplayConfig } = useLFStoreState();

  useResizeObserver(nodeRef, (entry) => {
    if (!id) return;
    console.log(props);
    const { clientWidth, clientHeight } = entry.target as HTMLDivElement;
    if (!clientHeight || !clientWidth) return;
    setNodeDisplayConfig(id, {
      w: clientWidth,
      h: clientHeight,
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
      <div className=" border rounded-sm" ref={nodeRef}>
        123
      </div>
    </div>
  );
}
