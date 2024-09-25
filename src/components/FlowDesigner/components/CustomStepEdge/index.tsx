import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";
import useLFStoreState from "../../hooks/useLFStoreState";

export function CustomStepEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd } = props;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    borderRadius: 0,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const { edgeLabelNode } = useLFStoreState();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 1,
        }}
      />
      {edgeLabelNode && (
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
            {edgeLabelNode}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
