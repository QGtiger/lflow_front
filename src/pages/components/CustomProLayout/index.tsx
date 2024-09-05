import { GlobalContext } from "@/context/GlobalContext";
import { ProLayout, ProSettings } from "@ant-design/pro-components";
import { useContext } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import UserDropDown from "../UserDropDown";
import classNames from "classnames";
import { Avatar } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import useUserModel from "@/hooks/user/useUserModel";
import RequireAuth from "@/components/RequireAuth";
import TabHeader from "./tabHeader";

import "./index.css";

const ProSetting: ProSettings = {
  fixSiderbar: true,
};

function MyProLayout() {
  const outlet = useOutlet();
  const { routesMenu } = useContext(GlobalContext);
  const nav = useNavigate();
  const { userInfo } = useUserModel();

  return (
    <>
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
        onPageChange={(location) => {
          console.log(location);
        }}
        // breadcrumbRender={(routers = []) => {
        //   return [];
        // }}
        menuFooterRender={(props) => {
          const { collapsed } = props || {};
          return (
            <div className="pt-2 border-t">
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
                    {userInfo.username.slice(0, 1)}
                  </Avatar>
                  {collapsed ? null : (
                    <>
                      <div className=" flex flex-col ml-2 min-w-0 flex-1">
                        <span className="text-regular-plus text-sm overflow-hidden overflow-ellipsis text-nowrap">
                          {userInfo.username}
                        </span>
                        <span className="text-regular text-[#47536b] text-xs min-w-0 overflow-hidden overflow-ellipsis">
                          {userInfo.email}
                        </span>
                      </div>
                      <UserDropDown>
                        <MoreOutlined className=" hover:bg-[#eaebeb] rounded p-2" />
                      </UserDropDown>
                    </>
                  )}
                </div>
              </UserDropDown>
            </div>
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
        <>
          <TabHeader />
          {outlet}
        </>
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
    </>
  );
}

export default function CustomProLayout() {
  return (
    <RequireAuth>
      <MyProLayout />
    </RequireAuth>
  );
}
