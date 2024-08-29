import { Avatar, Dropdown, message, Modal, notification, Spin } from "antd";
import { PropsWithChildren, Suspense, useContext, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLocation, useNavigate, useOutlet } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import CommonErrorBoundaryPanel from "@/components/CommonErrorBoundaryPanel";
import { MessageRef } from "@/utils/customMessage";
import { ModalRef } from "@/utils/customModal";
import { NotificationRef } from "@/utils/customNotification";
import { ProLayout, ProSettings } from "@ant-design/pro-components";
import { GlobalContext } from "@/context/GlobalContext";

import "./layout.css";
import classNames from "classnames";
import { MoreOutlined, LogoutOutlined } from "@ant-design/icons";
import useUserModel from "@/hooks/user/useUserModel";

function FullScreenSpin() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spin></Spin>
    </div>
  );
}

function UserDropDown(
  props: PropsWithChildren<{
    disabled?: boolean;
  }>
) {
  const { userLogout } = useUserModel();
  return (
    <Dropdown
      overlayStyle={{
        width: "160px",
      }}
      disabled={props.disabled}
      menu={{
        items: [
          {
            key: "center",
            label: "个人中心",
          },
          {
            type: "divider",
          },
          {
            key: "logout",
            label: (
              <div className="flex justify-between items-center">
                退出登录
                <LogoutOutlined />
              </div>
            ),
            onClick: userLogout,
          },
        ],
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      {props.children}
    </Dropdown>
  );
}

const ProSetting: ProSettings = {
  fixSiderbar: true,
};

function OutletWrapper() {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const { routesMenu } = useContext(GlobalContext);
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
        title="lflow"
        className="custom-pro-layout"
        appList={[
          {
            icon: "https://qgtiger.github.io/code-playground/assets/react-CHdo91hT.svg",
            title: "React Playground",
            desc: "杭州市西湖区良吉鸿府知名React Playground",
            url: "https://qgtiger.github.io/code-playground",
            target: "_blank",
          },
          {
            icon: "https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png",
            title: "AntV",
            desc: "淳安县千岛湖某地方知名 node playground",
            url: "https://node-playground.vercel.app/",
            target: "_blank",
          },
        ]}
        menuFooterRender={(props) => {
          const { collapsed } = props || {};
          return (
            <UserDropDown disabled={!collapsed}>
              <div
                className={classNames(
                  "flex items-center max-w-full pr-3 pl-1.5 py-1 rounded text-[#0b0e14] transition-all cursor-pointer",
                  {
                    "hover:bg-[#eaebeb]": collapsed,
                  }
                )}
              >
                <Avatar
                  style={{
                    background: "#f56a00",
                    verticalAlign: "middle",
                    width: "36px",
                    height: "36px",
                  }}
                  className=" flex-grow-0 flex-shrink-0"
                  gap={7}
                >
                  L
                </Avatar>
                <div className=" flex flex-col ml-2 min-w-0 flex-1">
                  <span className="text-regular-plus text-sm overflow-hidden overflow-ellipsis">
                    Lightfish
                  </span>
                  <span className="text-regular text-[#47536b] text-xs min-w-0 overflow-hidden overflow-ellipsis">
                    201030049@qq.com
                  </span>
                </div>
                {collapsed ? null : (
                  <UserDropDown>
                    <MoreOutlined className=" hover:bg-[#eaebeb] rounded p-2" />
                  </UserDropDown>
                )}
              </div>
            </UserDropDown>
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
        {...ProSetting}
      >
        {outlet}
      </ProLayout>
      {/* <SettingDrawer
        pathname={pathname}
        getContainer={() => document.getElementById("test-pro-layout")}
        settings={settings}
        onSettingChange={(changeSetting) => {
          setSetting(changeSetting);
        }}
        disableUrlParams
      /> */}
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
