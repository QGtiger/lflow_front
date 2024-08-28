import { Form, FormInstance, FormProps } from "antd";
import { useForm } from "antd/es/form/Form";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import RecursionFormItem from "./RecursionFormItem";
import { useFormStore } from "./store";
import { FormSchema } from "./typings";
import "./index.css";
import { findCusrorItem } from "./utils/findCursorItem";

type SchemaProps = {
  schema: FormSchema[];
  onFileUpload?: (file: File) => Promise<string>;
} & FormProps;

export const SchemaForm = forwardRef<FormInstance, SchemaProps>(
  (props, ref) => {
    const { schema, onFileUpload, ...formProps } = props;
    const [form] = useForm();
    const formRef = useRef<FormInstance>(null);
    const { formValue, setFormValue } = useFormStore((state) => state);
    const setFileUpload = useFormStore((state) => state.setFileUpload);

    useEffect(() => {
      onFileUpload && setFileUpload(onFileUpload);
    }, [onFileUpload, setFileUpload]);

    useEffect(() => {
      setFormValue(() => {
        return props.initialValues || {};
      });
    }, []);

    useImperativeHandle(ref, () => formRef.current as FormInstance);

    const cursorFormItem = findCusrorItem(
      schema,
      formRef.current?.getFieldsValue() || formValue,
      0
    );

    return (
      <Form
        ref={(el) => {
          // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
          formRef.current = el;
        }}
        form={form}
        layout="vertical"
        {...formProps}
        autoComplete={"off"}
        id="custom_dynamic_form"
        onValuesChange={(c, v) => {
          formProps.onValuesChange?.(c, v);
          setFormValue(() => v);
        }}
      >
        {cursorFormItem && <RecursionFormItem formItemState={cursorFormItem} />}
      </Form>
    );
  }
);
