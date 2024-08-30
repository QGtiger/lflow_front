import { PropsWithChildren } from "react";

export default function StopPropagationDiv(props: PropsWithChildren) {
  return <div onClick={(e) => e.stopPropagation()}>{props.children}</div>;
}
