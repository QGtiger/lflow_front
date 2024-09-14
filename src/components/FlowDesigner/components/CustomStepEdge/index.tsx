import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
} from "@xyflow/react";

export function CustomStepEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY, markerEnd } = props;
  const [edgePath] = getSmoothStepPath({
    borderRadius: 0,
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 2,
        }}
      />
      (<EdgeLabelRenderer>11</EdgeLabelRenderer>)
    </>
  );
}
