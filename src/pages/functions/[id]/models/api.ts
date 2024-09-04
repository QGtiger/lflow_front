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
    parent_uid?: string;
    isdir: boolean;
    created_at: number;
    updated_at: number;
  }>({
    url: "/cloudfunctions/" + uid,
    method: "get",
  });
}
