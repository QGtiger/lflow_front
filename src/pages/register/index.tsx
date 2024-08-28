import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, FormInstance } from "antd";
import { useRef } from "react";

import { SchemaForm } from "@/components/SchemaForm";
import { EmailCaptchaProps } from "@/components/SchemaForm/components/EmailCaptcha";
import useRouter from "@/hooks/useRouter";
import { composeValidator, requiredValidator } from "@/utils";

export default function Register() {
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
              valadator: requiredValidator("用户名"),
            },
            {
              name: "password",
              type: "Input",
              config: {
                type: "password",
                placeholder: "请输入密码",
                prefix: <LockOutlined />,
              },
              valadator: composeValidator<string>(
                requiredValidator("密码"),
                (v) => {
                  if (v.length < 6) {
                    return "密码长度不能小于6位";
                  }
                }
              ),
            },
            {
              name: "email",
              type: "Input",
              config: {
                placeholder: "请输入邮箱",
                prefix: <MailOutlined />,
              },
              valadator: composeValidator<string>(
                requiredValidator("邮箱"),
                (v) => {
                  if (
                    !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(v)
                  ) {
                    return "请输入正确的邮箱";
                  }
                }
              ),
            },
            {
              name: "captcha",
              type: "EmailCaptcha",
              config: {
                placeholder: "请输入验证码",
                sendCaptcha: async () => {
                  await formRef.current?.validateFields(["email"]).then((v) => {
                    console.log("发送验证码", v);
                  });
                },
              } as EmailCaptchaProps,
            },
          ]}
        />
        <Button
          type="primary"
          size="large"
          block
          onClick={() => {
            formRef.current?.validateFields().then((values) => {
              console.log("注册", values);
            });
          }}
        >
          注册
        </Button>
        <div className="flex justify-end mt-2">
          <Button
            type="link"
            className="p-0"
            onClick={() => {
              nav("/login", {
                replace: true,
              });
            }}
          >
            已有账户？去登陆
          </Button>
        </div>
      </div>
    </div>
  );
}
