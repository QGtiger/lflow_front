import { createSucNotification } from "./customNotification";

export function showLoginMessage(info: UserInfo) {
  return createSucNotification({
    message: "登录成功",
    description: `欢迎回来，${info.username}`,
  });
}

export function showRegisterMessage(info: UserInfo) {
  return createSucNotification({
    message: "注册成功",
    description: `欢迎加入，${info.username}`,
  });
}
