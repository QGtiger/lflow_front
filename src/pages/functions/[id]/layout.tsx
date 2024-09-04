import { useOutlet, useParams } from "react-router-dom";
import { CloudFunctionDetailModel } from "./models";
import { useMemo } from "react";

export default function CloudFunctionDetailLayout() {
  const outlet = useOutlet();
  const { id } = useParams();
  if (!id) {
    throw new Error("id is required");
  }

  const memoProviderValue = useMemo(() => {
    return {
      uid: id,
    };
  }, [id]);

  console.log("outlet", outlet);

  return (
    <CloudFunctionDetailModel.Provider value={memoProviderValue}>
      {outlet}
    </CloudFunctionDetailModel.Provider>
  );
}
