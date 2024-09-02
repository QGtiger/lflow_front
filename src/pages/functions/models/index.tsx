import { createCustomModel } from "@/common/createModel";
import useRouter from "@/hooks/useRouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUpdate } from "ahooks";
import { useMemo, useRef } from "react";
import {
  addCloudFunctionEntityItem,
  deleteCloudFunction,
  queryCloudFunctions,
  updateCloudFunction,
} from "./api";

export type FolderItemType = {
  name: string;
  description: string;
  uid: string;
  parent_uid?: string;
  isdir: boolean;
  created_at: number;
  updated_at: number;
  children?: FolderItemType[];
};

export const ROOT_FOLDER_UID = "root";

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
      const data = await queryCloudFunctions<FolderItemType[]>();
      folderMapRef.current = data.reduce((acc, cur) => {
        acc[cur.uid] = cur;
        return acc;
      }, {} as Record<string, FolderItemType>);

      // 构建根目录
      folderMapRef.current[ROOT_FOLDER_UID] = {
        uid: ROOT_FOLDER_UID,
        name: "根目录",
        description: "根目录",
        created_at: Date.now(),
        updated_at: Date.now(),
        isdir: true,
        children: [],
      };

      // 递归构建树形结构
      data.forEach((item) => {
        const parent = folderMapRef.current[item.parent_uid || ROOT_FOLDER_UID];
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

  const memoFolderList = useMemo(() => {
    const list = folderMapRef.current[f]?.children || [];
    // 创建时间排序，还有是否是文件夹排序
    list.sort((a, b) => b.created_at - a.created_at);
    return list.sort((a, b) => (a.isdir === b.isdir ? 0 : a.isdir ? -1 : 1));
  }, [folderMapRef.current, f]);

  const { mutateAsync: addFolderItem } = useMutation({
    mutationKey: ["addFolderItem"],
    mutationFn: async (
      params: Omit<
        Parameters<typeof addCloudFunctionEntityItem>[0],
        "parent_uid"
      >
    ) => {
      await addCloudFunctionEntityItem({
        ...params,
        parent_uid: f,
      });
    },
    onSuccess() {
      queryFolders();
    },
  });

  const { mutateAsync: updateFolderItem } = useMutation({
    mutationKey: ["updateCloudFunction"],
    mutationFn: (params: Parameters<typeof updateCloudFunction>[0]) => {
      return updateCloudFunction(params);
    },
    onSuccess: queryFolders,
  });

  const { mutateAsync: deleteFolderItem } = useMutation({
    mutationKey: ["deleteFolderItem"],
    mutationFn: deleteCloudFunction,
    onSuccess: queryFolders,
  });

  // 获取父级目录
  const getParentFolder = (uid: string) => {
    return folderMapRef.current[
      folderMapRef.current[uid]?.parent_uid || ROOT_FOLDER_UID
    ];
  };

  return {
    folderList: memoFolderList,
    queryFolders,
    isRoot: f === ROOT_FOLDER_UID || !f,
    addFolderItem,
    updateFolderItem,
    deleteFolderItem,
    getParentFolder,
    folderMap: folderMapRef.current,
  };
});
