import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, FormInstance } from "antd";
import { useRef } from "react";

import { SchemaForm } from "@/components/SchemaForm";
import useRouter from "@/hooks/useRouter";

export default function Login() {
  const formRef = useRef<FormInstance>(null);
  const { nav } = useRouter();

  return (
    <div className="flex h-[100vh] items-center justify-center">
      <div className="w-[500px] mt-[-200px]">
        <SchemaForm
          ref={formRef}
          size="large"
          schema={[
            {
              name: "username",
              type: "Input",
              config: {
                placeholder: "请输入用户名",
                prefix: <UserOutlined />,
              },
            },
            {
              name: "password",
              type: "Input",
              config: {
                type: "password",
                placeholder: "请输入密码",
                prefix: <LockOutlined />,
              },
            },
          ]}
        />
        <Button
          type="primary"
          block
          size="large"
          onClick={() => {
            return formRef.current?.validateFields().then(async (values) => {
              console.log("登录", values);
            });
          }}
        >
          登陆
        </Button>
        <div className="flex justify-end mt-2">
          <Button
            type="link"
            className="p-0"
            onClick={() => {
              nav("/register", { replace: true });
            }}
          >
            还没有账户？去注册
          </Button>
        </div>
      </div>
    </div>
  );
}
