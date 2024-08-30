import { useOutlet } from "react-router-dom";
import { FunctionsModel } from "./models";

export default function ApiMetaLayout() {
  const outlet = useOutlet();

  return <FunctionsModel.Provider>{outlet}</FunctionsModel.Provider>;
}
