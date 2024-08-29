import { message, Modal, notification } from "antd";
import { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useOutlet } from "react-router-dom";

import CommonErrorBoundaryPanel from "@/components/CommonErrorBoundaryPanel";
import { MessageRef } from "@/utils/customMessage";
import { ModalRef } from "@/utils/customModal";
import { NotificationRef } from "@/utils/customNotification";

import { Spin } from "antd";

function FullScreenSpin() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spin></Spin>
    </div>
  );
}

export default function Layout() {
  const [modal, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const outlet = useOutlet();
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
          <div className="root-wrapper">{outlet}</div>
        </Suspense>
      </ErrorBoundary>
      {contextHolder}
      {messageContextHolder}
      {notificationContextHolder}
    </>
  );
}
