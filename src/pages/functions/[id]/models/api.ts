import { request } from "@/api/request";

/**
 * 获取云函数详细信息
 * @param uid
 * @returns
 */
export function getCloudFunctionDetail(uid: string) {
  return request<{
    name: string;
    description: string;
    uid: string;
    parentUid?: string;
    isDir: boolean;
    createTime: number;
    updateTime: number;
  }>({
    url: "/cloudfunctions/" + uid,
    method: "get",
  });
}
