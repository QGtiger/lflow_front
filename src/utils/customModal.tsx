import { FormInstance, ModalFuncProps } from "antd";
import { HookAPI } from "antd/es/modal/useModal";
import { createRef } from "react";

import { throttle } from ".";

import { SchemaForm } from "@/components/SchemaForm";
import { FormSchema } from "@/components/SchemaForm/typings";

export const ModalRef = {
  current: undefined as unknown as HookAPI,
  modalInsList: [] as { destroy: () => void }[],
};

export function createModal(config: ModalFuncProps) {
  // 路由拦截，不让跳转
  const ins = ModalRef.current.confirm({
    okText: "确定",
    cancelText: "取消",
    ...config,
  });
  ModalRef.modalInsList.push(ins);
  return ins;
}

export const createSchemaFormModal = throttle(function (config: {
  title: string;
  schema: FormSchema[];
  onFinished: (values: any) => Promise<any>;
  schemaFormProps?: Partial<Parameters<typeof SchemaForm>[0]>;
  initialValues?: any;
}) {
  const formRef = createRef<FormInstance>();
  const ins = ModalRef.current.confirm({
    title: config.title,
    closable: true,
    icon: null,
    width: 704,
    content: (
      <div className="mt-3">
        <SchemaForm
          layout="vertical"
          ref={formRef}
          schema={config.schema}
          initialValues={config.initialValues}
        ></SchemaForm>
      </div>
    ),
    onOk: () => {
      return new Promise((resolve, reject) => {
        formRef.current?.validateFields().then(async (v) => {
          resolve(await config.onFinished(v).catch(reject));
        }, reject);
      });
    },
    okText: "确定",
    cancelText: "取消",
  });
  ModalRef.modalInsList.push(ins);
  return ins;
},
500);
