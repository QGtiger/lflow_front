import RecursionFormItem from "../../RecursionFormItem";
import { useFormStore } from "../../store";
import { FormSchema } from "../../typings";
import { findCusrorItem } from "../../utils/findCursorItem";

export type DynamicFormProps = {
  schema: FormSchema[];
};

export default function DynamicForm(props: DynamicFormProps) {
  const formValue = useFormStore((state) => state.formValue);

  const cursorFormItem = findCusrorItem(props.schema, formValue, 0);

  return (
    <div className="p-3 bg-white">
      {cursorFormItem && <RecursionFormItem formItemState={cursorFormItem} />}
    </div>
  );
}
