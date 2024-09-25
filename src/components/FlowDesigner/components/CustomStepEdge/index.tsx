import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import useLFStoreState from "../../hooks/useLFStoreState";
import { PlusOutlined } from "@ant-design/icons";

export function CustomStepEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd } = props;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    borderRadius: 0,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { edgeLabelNodeRender } = useLFStoreState();

  const edgeLabelNode = edgeLabelNodeRender?.(
    <EdgeLabelRenderer>
      <div
        style={{
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          pointerEvents: "all",
          fontSize: 12,
        }}
        className=" cursor-pointer"
      >
        <div className=" transition hover:ring-indigo-400 hover:text-indigo-400 text-slate-400 text-xs p-[2px] rounded-sm bg-white ring-1 ring-slate-400 flex justify-center items-center">
          <PlusOutlined />
        </div>
      </div>
    </EdgeLabelRenderer>
  );

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 1,
        }}
      />
      {edgeLabelNode}
    </>
  );
}
