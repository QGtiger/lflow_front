import { Spin } from "antd";
import Header from "./components/header";
import { CloudFunctionDetailModel } from "./models";
import { useEffect, useState, useCallback } from "react";
import { useDocumentTitle } from "@/context/DocumentMap";
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  NodeToolbar,
  Position,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "node-with-toolbar",
    data: { label: "Select me to show the toolbar" },
  },
];

const nodeTypes = {
  "node-with-toolbar": NodeWithToolbar,
};

function NodeWithToolbar({ data }) {
  return (
    <>
      <NodeToolbar
        isVisible={data.forceToolbarVisible || undefined}
        position={data.toolbarPosition}
      >
        <button>cut</button>
        <button>copy</button>
        <button>paste</button>
      </NodeToolbar>
      <div className="react-flow__node-default">{data?.label}</div>
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("interval");
      setCount((count) => count + 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="pt-10">
      <p>count: {count}</p>
      <button onClick={() => setCount((count) => count + 1)}>Add</button>
    </div>
  );
}

export default function CloudFunctionDetail() {
  const { isPending, cloudFunctionDetail } =
    CloudFunctionDetailModel.useModel();

  const setDocumentTitle = useDocumentTitle();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const setPosition = useCallback(
    (pos) =>
      setNodes((nodes) =>
        nodes.map((node) => ({
          ...node,
          data: { ...node.data, toolbarPosition: pos },
        }))
      ),
    [setNodes]
  );
  const forceToolbarVisible = (enabled) =>
    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        data: { ...node.data, forceToolbarVisible: enabled },
      }))
    );

  useEffect(() => {
    cloudFunctionDetail?.name &&
      setDocumentTitle({
        title: cloudFunctionDetail?.name,
      });
  }, [cloudFunctionDetail?.name, setDocumentTitle]);

  if (isPending) {
    return (
      <Spin className="w-full h-full flex items-center justify-center"></Spin>
    );
  }
  return (
    <div className="detail relative h-full">
      <Header />
      {/* <Counter /> */}
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          fitView
          preventScrolling={false}
        >
          <Panel>
            <h3>Node Toolbar position:</h3>
            <button onClick={() => setPosition(Position.Top)}>top</button>
            <button onClick={() => setPosition(Position.Right)}>right</button>
            <button onClick={() => setPosition(Position.Bottom)}>bottom</button>
            <button onClick={() => setPosition(Position.Left)}>left</button>
            <h3>Override Node Toolbar visibility</h3>
            <label>
              <input
                type="checkbox"
                onChange={(e) => forceToolbarVisible(e.target.checked)}
              />
              <span>Always show toolbar</span>
            </label>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
