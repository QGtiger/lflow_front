import { CloudFunctionDetailModel } from "../models";

export default function Header() {
  const { cloudFunctionDetail } = CloudFunctionDetailModel.useModel();
  const { name } = cloudFunctionDetail!;
  return (
    <div className="flex justify-between bg-white px-3 absolute top-0 left-0 h-14 w-full border-b border-bg z-[10]">
      <div>
        <span>{name}</span>
      </div>
    </div>
  );
}
