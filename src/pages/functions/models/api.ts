import { request } from "@/api/request";

export function addCloudFunctionEntityItem(data: {
  name: string;
  description: string;
  parent_uid?: string;
  isdir?: boolean;
}) {
  return request({
    url: "/cloudfunctions",
    method: "post",
    data,
  });
}

export function queryCloudFunctions<T>() {
  return request<T>({
    url: "/cloudfunctions",
    method: "get",
  });
}

export function updateCloudFunction(data: {
  name?: string;
  description?: string;
  parent_uid?: string;
  uid: string;
}) {
  return request({
    url: "/cloudfunctions/" + data.uid,
    method: "patch",
    data,
  });
}

export function deleteCloudFunction(uid: string) {
  return request({
    url: "/cloudfunctions/" + uid,
    method: "delete",
  });
}
