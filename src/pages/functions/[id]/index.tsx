import { Spin } from "antd";
import Header from "./components/header";
import { CloudFunctionDetailModel } from "./models";

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
      123123
    </div>
  );
}
