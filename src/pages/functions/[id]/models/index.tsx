import { createCustomModel } from "@/common/createModel";
import { useQuery } from "@tanstack/react-query";
import { getCloudFunctionDetail } from "./api";

export const CloudFunctionDetailModel = createCustomModel(function (props: {
  uid: string;
}) {
  const { data: cloudFunctionDetail, isFetching } = useQuery({
    queryKey: ["cloudFunctionDetail", props.uid],
    queryFn: async () => {
      return getCloudFunctionDetail(props.uid);
    },
  });

  return {
    cloudFunctionDetail,
    isPending: isFetching,
  };
});
