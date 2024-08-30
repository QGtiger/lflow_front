import { FormSchema } from "@/components/SchemaForm/typings";
import { requiredValidator } from "@/utils";

export const ADD_FOLDER_SCHEMA: FormSchema[] = [
  {
    name: "name",
    label: "文件夹名称",
    description: "请输文件夹名称",
    type: "Input",
    valadator: requiredValidator("文件夹名称"),
  },
  {
    name: "description",
    label: "文件夹描述",
    description: "请输文件夹描述",
    type: "Textarea",
    valadator: requiredValidator("文件夹描述"),
  },
];

export const ADD_FUNCTION_SCHEMA: FormSchema[] = [
  {
    name: "name",
    label: "云函数名称",
    description: "请输入云函数名称",
    type: "Input",
    valadator: requiredValidator("云函数名称"),
  },
  {
    name: "description",
    label: "云函数描述",
    description: "请输入云函数描述",
    type: "Textarea",
    valadator: requiredValidator("云函数描述"),
  },
];
