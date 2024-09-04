import { CloudFunctionDetailModel } from "../models";

export default function Header() {
  const { cloudFunctionDetail } = CloudFunctionDetailModel.useModel();
  const { name } = cloudFunctionDetail!;
  return (
    <div
      className="flex justify-between px-3 absolute top-0 left-0 h-14 w-full"
      style={{
        backgroundImage:
          "linear-gradient(rgb(249, 250, 251) 0%, rgba(249, 250, 251, 0) 100%)",
      }}
    >
      <div>
        <span>{name}</span>
      </div>
    </div>
  );
}
