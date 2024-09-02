import { Empty } from "antd";
import classNames from "classnames";
import { PropsWithChildren } from "react";

export default function EmptyFolder(
  props: PropsWithChildren<{
    className?: string;
  }>
) {
  return (
    <Empty
      className={classNames("flex flex-col items-center", props.className)}
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 60 }}
      description={<span>暂无文件</span>}
    >
      {props.children}
    </Empty>
  );
}
