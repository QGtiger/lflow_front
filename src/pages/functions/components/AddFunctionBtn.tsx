import { Button } from "antd";

import { createSchemaFormModal } from "@/utils/customModal";
import { createNotification } from "@/utils/customNotification";
import { ADD_FUNCTION_SCHEMA } from "@/constants/schema";
import { FunctionsModel } from "../models";

export default function AddFunctionBtn() {
  const { addFolderItem } = FunctionsModel.useModel();
  return (
    <Button
      type="primary"
      onClick={() => {
        createSchemaFormModal({
          title: "添加云函数",
          schema: ADD_FUNCTION_SCHEMA,
          onFinished(value: { name: string; description: string }) {
            return addFolderItem({
              ...value,
              isDir: false,
            }).then(() => {
              createNotification({
                type: "success",
                message: "添加成功",
                description: `云函数 ${value.name} 添加成功`,
              });
            });
          },
        });
      }}
    >
      添加云函数
    </Button>
  );
}
