import useUserModel from "@/hooks/user/useUserModel";
import { LogoutOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { PropsWithChildren } from "react";

export default function UserDropDown(
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
