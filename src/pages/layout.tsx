import { message, Modal, notification, Spin } from "antd";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useOutlet } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import CommonErrorBoundaryPanel from "@/components/CommonErrorBoundaryPanel";
import { MessageRef } from "@/utils/customMessage";
import { ModalRef } from "@/utils/customModal";
import { NotificationRef } from "@/utils/customNotification";

import "./layout.css";
import CustomProLayout from "./components/CustomProLayout";
import { UserModel } from "@/hooks/user/UserModel";

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

  // 登录注册页面不需要全局布局
  if (pathname === "/login" || pathname === "/register") {
    return <div>{outlet}</div>;
  }

  return <CustomProLayout />;
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
    <UserModel.Provider>
      <ErrorBoundary FallbackComponent={CommonErrorBoundaryPanel}>
        <Suspense fallback={<FullScreenSpin />}>
          <OutletWrapper />
        </Suspense>
      </ErrorBoundary>
      <ReactQueryDevtools />
      {contextHolder}
      {messageContextHolder}
      {notificationContextHolder}
    </UserModel.Provider>
  );
}
