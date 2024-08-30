import { Button } from "antd";
import { createSchemaFormModal } from "@/utils/customModal";
import { createNotification } from "@/utils/customNotification";
import { ADD_FOLDER_SCHEMA } from "@/constants/schema";
import { FunctionsModel } from "../models";

export default function AddFolderBtn() {
  const { addFolderItem } = FunctionsModel.useModel();
  return (
    <Button
      type="default"
      onClick={() => {
        createSchemaFormModal({
          title: "添加文件夹",
          schema: ADD_FOLDER_SCHEMA,
          onFinished(value) {
            return addFolderItem(value).then(() => {
              createNotification({
                type: "success",
                message: "添加成功",
                description: `文件夹 ${value.name} 添加成功`,
              });
            });
          },
        });
      }}
    >
      添加文件夹
    </Button>
  );
}
