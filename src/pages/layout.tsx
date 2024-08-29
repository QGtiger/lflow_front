import { message, Modal, notification } from "antd";
import { Suspense, useContext, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import CommonErrorBoundaryPanel from "@/components/CommonErrorBoundaryPanel";
import { MessageRef } from "@/utils/customMessage";
import { ModalRef } from "@/utils/customModal";
import { NotificationRef } from "@/utils/customNotification";

import { Spin } from "antd";
import {
  ProLayout,
  ProSettings,
  SettingDrawer,
} from "@ant-design/pro-components";
import { GlobalContext } from "@/context/GlobalContext";

function FullScreenSpin() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spin></Spin>
    </div>
  );
}

function OutletWrapper() {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const { routesMenu } = useContext(GlobalContext);
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
  });
  const nav = useNavigate();

  // 登录注册页面不需要全局布局
  if (pathname === "/login" || pathname === "/register") {
    return <div>{outlet}</div>;
  }

  return (
    <div>
      <ProLayout
        route={{
          routes: routesMenu,
        }}
        menuFooterRender={(props) => {
          return (
            <a
              style={{
                lineHeight: "48rpx",
                display: "flex",
                height: 48,
                color: "rgba(255, 255, 255, 0.65)",
                alignItems: "center",
              }}
              href="https://preview.pro.ant.design/dashboard/analysis"
              target="_blank"
              rel="noreferrer"
            >
              <img
                alt="pro-logo"
                src="https://procomponents.ant.design/favicon.ico"
                style={{
                  width: 16,
                  height: 16,
                  margin: "0 16px",
                  marginInlineEnd: 10,
                }}
              />
              {!props?.collapsed && "Preview Pro"}
            </a>
          );
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => (
          <a
            onClick={() => {
              nav(item.path || "/");
            }}
          >
            {dom}
          </a>
        )}
        {...settings}
      >
        {outlet}
      </ProLayout>
      <SettingDrawer
        pathname={pathname}
        getContainer={() => document.getElementById("test-pro-layout")}
        settings={settings}
        onSettingChange={(changeSetting) => {
          setSetting(changeSetting);
        }}
        disableUrlParams
      />
    </div>
  );

  return <div className="root-wrapper">11{outlet}</div>;
}

export default function Layout() {
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const location = useLocation();

  useEffect(() => {
    while (ModalRef.modalInsList.length) {
      ModalRef.modalInsList.pop()?.destroy();
    }
  }, [location]);

  useEffect(() => {
    // 为了解决动态弹窗 全局样式问题
    ModalRef.current = modal;

    MessageRef.current = messageApi;
    NotificationRef.current = notificationApi;
  }, [modal, messageApi, notificationApi]);

  return (
    <>
      <ErrorBoundary FallbackComponent={CommonErrorBoundaryPanel}>
        <Suspense fallback={<FullScreenSpin />}>
          <OutletWrapper />
        </Suspense>
      </ErrorBoundary>
      <ReactQueryDevtools />
      {contextHolder}
      {messageContextHolder}
      {notificationContextHolder}
    </>
  );
}
