import { request } from "@/api/request";
import { useMount } from "ahooks";
import { registerMicroApps, start } from "qiankun";
import { useRef, useState } from "react";
import { Skeleton } from "antd";

import "./index.css";

export default function MicroIPaaS() {
  const skeletonRef = useRef<HTMLDivElement>(null);

  useMount(() => {
    registerMicroApps(
      [
        {
          name: "micro-ipaas",
          entry: process.env.MICRO_IPASS_URL!,
          container: "#ipaas-container",
          activeRule: "/ipaas",
          props: {
            requestClient: request,
          },
        },
      ],
      {
        async afterMount() {
          const skeletonContainer: any = document.querySelector(
            ".skeleton-container"
          );
          console.log("afterMount", skeletonContainer);
          if (skeletonContainer) {
            skeletonContainer.style.display = "none";
          }
        },
      }
    );
    start();
  });

  return (
    <>
      <div className="p-4 skeleton-container" ref={skeletonRef}>
        <Skeleton active />
      </div>
      <div
        id="ipaas-container"
        style={{
          height: "calc(100% - 38px)",
        }}
      ></div>
    </>
  );
}
