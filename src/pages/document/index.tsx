import { FlowDesignerProvider } from "@/components/FlowDesigner";
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => setCount((count) => count + 1)}>Add</button>
    </div>
  );
}

export default function Document() {
  return (
    <FlowDesignerProvider
      flowNodes={[
        {
          id: "1",
          next: "2",
          connectorCode: "connectorCode",
          actionCode: "actionCode",
        },
        {
          id: "2",
          next: "3",
          connectorCode: "connectorCode",
          actionCode: "actionCode",
        },
        {
          id: "3",
          next: "4",
          connectorCode: "connectorCode",
          actionCode: "actionCode",
        },
        {
          id: "4",
          connectorCode: "connectorCode",
          actionCode: "actionCode",
        },
      ]}
    ></FlowDesignerProvider>
  );
}
