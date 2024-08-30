import { createCustomModel } from "@/common/createModel";
import useRouter from "@/hooks/useRouter";
import { useQuery } from "@tanstack/react-query";
import { useUpdate } from "ahooks";
import { useRef } from "react";

export type FolderItemType = {
  name: string;
  description: string;
  uid: string;
  parentUid?: string;
  isDir: boolean;
  createdAt: number;
  updatedAt: number;
  children?: FolderItemType[];
};

const _folder: FolderItemType[] = [
  {
    name: "文件夹1",
    description: "文件夹1描述",
    uid: "1",
    isDir: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    name: "文件夹2",
    description: "文件夹2描述",
    uid: "2",
    isDir: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    parentUid: "1",
  },
];

const ROOT_FOLDER_UID = "root";

export const FunctionsModel = createCustomModel(function () {
  const { searchParams } = useRouter<{
    f?: string;
  }>();
  const { f = ROOT_FOLDER_UID } = searchParams;
  const folderMapRef = useRef<Record<string, FolderItemType>>({});
  const update = useUpdate();

  const { refetch: queryFolders } = useQuery({
    queryKey: ["folderList"],
    queryFn: async () => {
      const data = _folder;
      folderMapRef.current = data.reduce((acc, cur) => {
        acc[cur.uid] = cur;
        return acc;
      }, {} as Record<string, FolderItemType>);

      // 构建根目录
      folderMapRef.current[ROOT_FOLDER_UID] = {
        uid: ROOT_FOLDER_UID,
        name: "根目录",
        description: "根目录",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isDir: true,
        children: [],
      };

      // 递归构建树形结构
      data.forEach((item) => {
        const parent = folderMapRef.current[item.parentUid || ROOT_FOLDER_UID];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(item);
        }
      });

      console.log(folderMapRef.current, f, folderMapRef.current);
      update();
      return data;
    },
  });

  const addFolderItem = async (v: any) => {
    // TODO
    console.log(v);
  };

  const updateFolderItem = async (v: any) => {
    // TODO
    console.log(v);
  };

  const deleteFolderItem = async (v: any) => {
    console.log(v);
  };

  // 获取父级目录
  const getParentFolder = (uid: string) => {
    return folderMapRef.current[
      folderMapRef.current[uid]?.parentUid || ROOT_FOLDER_UID
    ];
  };

  return {
    folderList: folderMapRef.current[f]?.children || [],
    queryFolders,
    isRoot: f === ROOT_FOLDER_UID || !f,
    addFolderItem,
    updateFolderItem,
    deleteFolderItem,
    getParentFolder,
  };
});
