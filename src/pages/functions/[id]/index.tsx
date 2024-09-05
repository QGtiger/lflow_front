import { Spin } from "antd";
import Header from "./components/header";
import { CloudFunctionDetailModel } from "./models";
import { useEffect, useState } from "react";

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
  const { isPending } = CloudFunctionDetailModel.useModel();

  if (isPending) {
    return (
      <Spin className="w-full h-full flex items-center justify-center"></Spin>
    );
  }
  return (
    <div className="detail relative">
      <Header />
      <Counter />
    </div>
  );
}
