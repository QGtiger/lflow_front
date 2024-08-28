import { Button, ConfigProvider, Input, Space } from "antd";

import { CommonFormFieldProps } from "../../typings";

export default function InputWithCopy(props: CommonFormFieldProps<string>) {
  return (
    <Space.Compact className="w-full">
      <Input disabled value={props.value} readOnly />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#000000",
          },
        }}
      >
        <Button
          type="primary"
          className="shadow-none"
          onClick={() => navigator.clipboard.writeText(props.value)}
        >
          复制
        </Button>
      </ConfigProvider>
    </Space.Compact>
  );
}
