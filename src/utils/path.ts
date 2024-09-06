/**
 * 获取路由的路径 例如：/home?name=123 => /home
 * @param path 路由
 * @returns
 */
export function getPathName(path: string): string {
  return path.split("?").shift() || "";
}
