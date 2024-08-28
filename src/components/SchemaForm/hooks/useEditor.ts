import { useFormStore } from "../store";

export default function useEditor(type: string) {
  const _map = useFormStore((state) => state.fieldComponentMap);

  //@ts-expect-error 没有配对上的话，就用Input
  return _map[type] || _map["Input"];
}
