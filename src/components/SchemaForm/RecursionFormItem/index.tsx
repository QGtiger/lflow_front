import { Form } from "antd";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";

import useEditor from "../hooks/useEditor";
import { DynamicFormItem } from "../typings";

const customLinkRenderer = ({ href, children }: any) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

const DefaultConfig = {
  placeholder: "请输入",
};

function WrapperFieldComponent(props: {
  formItemState: DynamicFormItem;
  [x: string]: any;
}) {
  const { formItemState, ...otherProps } = props;
  const { type, payload } = formItemState;
  const FieldComponent = useEditor(type);
  const _config = Object.assign({}, DefaultConfig, payload.config);
  return (
    <div className="relative">
      {payload.description && (
        <div className="desc text-[#888f9d] mb-2 mt-1">
          <ReactMarkdown
            components={{
              a: customLinkRenderer,
            }}
          >
            {payload.description}
          </ReactMarkdown>
        </div>
      )}

      <div className=" relative">
        {payload.extra}
        <FieldComponent {...otherProps} {..._config} />
      </div>
    </div>
  );
}

export default function RecursionFormItem({
  formItemState,
}: {
  formItemState: DynamicFormItem;
}) {
  const { payload, next } = formItemState;

  const nextFieldItem = useMemo(() => {
    let current: DynamicFormItem | null = formItemState;
    if (!next || !current) return null;

    // 获取所有祖先节点
    const acients: DynamicFormItem[] = [];
    acients.unshift(current);
    while ((current = current.parent)) {
      acients.unshift(current);
    }

    // 递归渲染
    const item = next(formItemState, acients);
    if (!item) return null;
    return <RecursionFormItem formItemState={item} />;
  }, [formItemState, next]);

  return (
    <>
      <Form.Item
        label={payload.label}
        name={payload.name}
        required={payload.required}
        rules={[
          {
            validator(_, value) {
              return new Promise<void>((r, j) => {
                const error = payload.valadator?.(value);
                if (error) j(error);
                r();
              });
            },
          },
        ]}
      >
        <WrapperFieldComponent formItemState={formItemState} />
      </Form.Item>
      {nextFieldItem}
    </>
  );
}
