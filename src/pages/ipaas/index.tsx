import { request } from "@/api/request";
import { useMount } from "ahooks";
import { registerMicroApps, start } from "qiankun";

export default function IPaaS() {
  useMount(() => {
    registerMicroApps([
      {
        name: "micro-ipaas",
        entry: process.env.MICRO_IPASS_URL!,
        container: "#ipaas-container",
        activeRule: "/ipaas",
        props: {
          requestClient: request,
        },
      },
    ]);
    start();
  });

  return <div id="ipaas-container"></div>;
}
