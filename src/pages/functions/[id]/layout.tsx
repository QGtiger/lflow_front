import { useOutlet, useParams } from "react-router-dom";
import { CloudFunctionDetailModel } from "./models";
import { useMemo } from "react";
import KeepRouteAlive from "@/components/KeepRouteAlive";

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

  return (
    <KeepRouteAlive>
      <CloudFunctionDetailModel.Provider value={memoProviderValue}>
        {outlet}
      </CloudFunctionDetailModel.Provider>
    </KeepRouteAlive>
  );
}
