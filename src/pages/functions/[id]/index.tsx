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
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  // {
  //   id: "2342341",
  //   position: { x: 0, y: 0 },
  //   type: "node-with-toolbar",
  //   data: { label: "Select me to show the toolbar" },
  // },

  {
    id: "aa",
    type: "input",
    data: { label: "Node 0" },
    position: { x: 0, y: 0 },
    className: "light",
  },
  {
    id: "bb",
    type: "input",
    data: { label: "Node 0" },
    position: { x: 0, y: 100 },
    className: "light",
    parentId: "aa",
  },
  {
    id: "cc",
    type: "group",
    data: { label: "Node 0" },
    position: {
      x: -75,
      y: 100,
    },
    style: {
      width: 300,
      height: 300,
      backgroundColor: "rgba(255, 0, 0, 0.2)",
    },
    className: "light",
    parentId: "bb",
  },

  {
    id: "dd",
    type: "input",
    data: { label: "Node 0" },
    position: { x: 75, y: 100 },
    className: "light",
    parentId: "cc",
  },

  // {
  //   id: "1",
  //   type: "input",
  //   data: { label: "Node 0" },
  //   position: { x: 250, y: 5 },
  //   className: "light",
  // },
  // {
  //   id: "2",
  //   data: { label: "Group A" },
  //   position: { x: 100, y: 100 },
  //   className: "light",
  //   style: { backgroundColor: "rgba(255, 0, 0, 0.2)", width: 200, height: 200 },
  // },
  // {
  //   id: "2a",
  //   data: { label: "Node A.1" },
  //   position: { x: 10, y: 50 },
  //   parentId: "2",
  // },
  // {
  //   id: "3",
  //   data: { label: "Node 1" },
  //   position: { x: 250, y: 100 },
  //   className: "light",
  //   parentId: "1",
  // },
  // {
  //   id: "4",
  //   data: { label: "Group B" },
  //   position: { x: 320, y: 200 },
  //   className: "light",
  //   style: { backgroundColor: "rgba(255, 0, 0, 0.2)", width: 300, height: 300 },
  //   type: "group",
  // },
  // {
  //   id: "4a",
  //   data: { label: "Node B.1" },
  //   position: { x: 15, y: 65 },
  //   className: "light",
  //   parentId: "4",
  //   extent: "parent",
  // },
  // {
  //   id: "4b",
  //   data: { label: "Group B.A" },
  //   position: { x: 15, y: 120 },
  //   className: "light",
  //   style: {
  //     backgroundColor: "rgba(255, 0, 255, 0.2)",
  //     height: 150,
  //     width: 270,
  //   },
  //   parentId: "4",
  //   extent: "parent",
  // },
  // {
  //   id: "4b1",
  //   data: { label: "Node B.A.1" },
  //   position: { x: 20, y: 40 },
  //   className: "light",
  //   parentId: "4b",
  // },
  // {
  //   id: "4b2",
  //   data: { label: "Node B.A.2" },
  //   position: { x: 100, y: 100 },
  //   className: "light",
  //   parentId: "4b",
  // },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3" },
  { id: "e2a-4a", source: "2a", target: "4a" },
  { id: "e3-4b", source: "3", target: "4b" },
  { id: "e4a-4b1", source: "4a", target: "4b1" },
  { id: "e4a-4b2", source: "4a", target: "4b2" },
  { id: "e4b1-4b2", source: "4b1", target: "4b2" },
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
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
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
    <div className="detail relative h-full bg-[#f1f3f7]">
      {/* <Header /> */}
      {/* <Counter /> */}
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          nodeTypes={nodeTypes}
          fitView
          // preventScrolling={false}
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
          <MiniMap />
          {/* <Controls /> */}
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
