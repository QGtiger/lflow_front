import { PageContainer } from "@ant-design/pro-components";
import { FunctionsModel } from "./models";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import FolderItem, { LastItem } from "./components/FolderItem";
import useRouter from "@/hooks/useRouter";
import AddFolderBtn from "./components/AddFolderBtn";
import AddFunctionBtn from "./components/AddFunctionBtn";

export default function Functions() {
  const { folderList, isRoot, getParentFolder } = FunctionsModel.useModel();
  const {
    searchParams: { f },
  } = useRouter<{ f: string }>();

  console.log(folderList, f);
  return (
    <PageContainer
      content="欢迎使用 云函数， 云函数可以让你在云端运行代码，无需搭建服务器。"
      extra={[<AddFolderBtn key="4" />, <AddFunctionBtn key="addfunction" />]}
      breadcrumbRender={(props) => {
        console.log(props);
        return <div className="pt-4">123</div>;
      }}
    >
      <div className="folder-system">
        {isRoot && !folderList?.length ? (
          "no"
        ) : (
          <div className="mt-4 select-none">
            <div className="flex flex-row flex-nowrap justify-between items-center">
              <div className="text-micro text-labelFaint ml-5 w-96">Name</div>
              <div className="text-micro text-labelFaint w-60">Description</div>
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
    </PageContainer>
  );
}
