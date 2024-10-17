import { PageContainer } from "@ant-design/pro-components";
import { FunctionsModel, ROOT_FOLDER_UID } from "./models";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FolderItem, { LastItem } from "./components/FolderItem";
import useRouter from "@/hooks/useRouter";
import AddFolderBtn from "./components/AddFolderBtn";
import AddFunctionBtn from "./components/AddFunctionBtn";
import EmptyFolder from "@/components/EmptyFolder";
import { useMemo } from "react";
import { Breadcrumb, Spin } from "antd";
import KeepRouteAlive from "@/components/KeepRouteAlive";

function Functions() {
  const { folderList, isRoot, getParentFolder, folderMap, refreshing } =
    FunctionsModel.useModel();
  const {
    searchParams: { f },
    navBySearchParam,
  } = useRouter<{ f: string }>();

  const breadCrumbList = useMemo(() => {
    let fword: string = f;
    let last;
    const origin = [] as any[];
    while ((last = folderMap[fword]) && f !== ROOT_FOLDER_UID) {
      origin.unshift({
        title: last.name,
        key: last.uid,
      });
      if (!last.parentUid) {
        break;
      }
      fword = last.parentUid;
    }
    origin.unshift({
      title: "根目录",
      key: "root",
    });
    return origin.map((it) => {
      return {
        title: (
          <span
            className=" cursor-pointer"
            onClick={() => {
              navBySearchParam("f", it.key);
            }}
          >
            {it.title}
          </span>
        ),
      };
    });
  }, [f, folderMap, navBySearchParam]);

  return (
    <PageContainer
      content="欢迎使用 云函数， 云函数可以让你在云端运行代码，无需搭建服务器。"
      extra={[<AddFolderBtn key="4" />, <AddFunctionBtn key="addfunction" />]}
      breadcrumbRender={() => {
        return <Breadcrumb items={breadCrumbList} />;
      }}
    >
      <Spin spinning={refreshing}>
        <div className="folder-system">
          {isRoot && !folderList?.length ? (
            <EmptyFolder className="mt-20"></EmptyFolder>
          ) : (
            <div className="mt-4 select-none">
              <div className="flex flex-row flex-nowrap justify-between items-center">
                <div className="text-micro text-labelFaint w-60 ml-2">名称</div>
                <div className="text-micro text-labelFaint w-60">描述</div>
                <div className="text-micro text-labelFaint w-60">创建时间</div>
                <div className="text-micro text-labelFaint w-60">更新时间</div>
                <div className="text-micro text-labelFaint w-10 mr-3"> </div>
              </div>
              <DndProvider backend={HTML5Backend}>
                <div className="mt-1.5">
                  {!isRoot && <LastItem parent={getParentFolder(f)} />}
                  {folderList?.map((item) => {
                    return <FolderItem key={item.uid} item={item} />;
                  })}
                </div>
                {/* <DragLayer /> */}
              </DndProvider>
              <div className="border-t border-bg"></div>
            </div>
          )}
        </div>
      </Spin>
    </PageContainer>
  );
}

export default function FunctionDetail() {
  return (
    <KeepRouteAlive>
      <FunctionsModel.Provider>
        <Functions />
      </FunctionsModel.Provider>
    </KeepRouteAlive>
  );
}
