import { createCustomModel } from "@/common/createModel";
import useRouter from "@/hooks/useRouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCreation } from "ahooks";
import { useState } from "react";
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
  parentUid?: string;
  isDir: boolean;
  createTime: number;
  updateTime: number;
  children?: FolderItemType[];
};

export const ROOT_FOLDER_UID = "root";

export const FunctionsModel = createCustomModel(function () {
  const { searchParams } = useRouter<{
    f?: string;
  }>();
  const { f = ROOT_FOLDER_UID } = searchParams;
  const [folderMap, setfolderMap] = useState<Record<string, FolderItemType>>(
    {}
  );

  const { refetch: queryFolders, isFetching } = useQuery({
    queryKey: ["folderList"],
    queryFn: async () => {
      const data = await queryCloudFunctions<FolderItemType[]>();
      const _folderMap = data.reduce((acc, cur) => {
        acc[cur.uid] = cur;
        return acc;
      }, {} as Record<string, FolderItemType>);

      // 构建根目录
      _folderMap[ROOT_FOLDER_UID] = {
        uid: ROOT_FOLDER_UID,
        name: "根目录",
        description: "根目录",
        createTime: Date.now(),
        updateTime: Date.now(),
        isDir: true,
        children: [],
      };

      // 递归构建树形结构
      data.forEach((item) => {
        const parent = _folderMap[item.parentUid || ROOT_FOLDER_UID];
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(item);
        }
      });

      setfolderMap(_folderMap);
      return data;
    },
  });

  const memoFolderList = useCreation(() => {
    const list = folderMap[f]?.children || [];
    // 创建时间排序，还有是否是文件夹排序
    list.sort((a, b) => b.createTime - a.createTime);
    return list.sort((a, b) => (a.isDir === b.isDir ? 0 : a.isDir ? -1 : 1));
  }, [f, folderMap]);

  const { mutateAsync: addFolderItem } = useMutation({
    mutationKey: ["addFolderItem"],
    mutationFn: async (
      params: Omit<
        Parameters<typeof addCloudFunctionEntityItem>[0],
        "parentUid"
      >
    ) => {
      await addCloudFunctionEntityItem({
        ...params,
        parentUid: f,
        isDir: params.isDir ?? true,
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
    return folderMap[folderMap[uid]?.parentUid || ROOT_FOLDER_UID];
  };

  return {
    folderList: memoFolderList,
    queryFolders,
    isRoot: f === ROOT_FOLDER_UID || !f,
    addFolderItem,
    updateFolderItem,
    deleteFolderItem,
    getParentFolder,
    folderMap,
    refreshing: isFetching,
  };
});
