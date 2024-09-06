import { request } from "@/api/request";
import { createCustomModel } from "@/common/createModel";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/api";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import useRouter from "../useRouter";

function getUserInfoAPI() {
  return request<UserInfo>({
    url: "/user/info",
    method: "GET",
  });
}

export const UserModel = createCustomModel(() => {
  const { state } = useLocation();
  const { nav } = useRouter();
  const queryRef = useRef<{
    queryPromise: Promise<void>;
    queryStatus: "init" | "loading" | "success" | "error";
    result: any;
  }>({
    queryPromise: undefined as unknown as Promise<void>,
    queryStatus: "init", // init | loading | success | error
    result: null as any,
  });

  const userLogin = (loginInfo: UserLoginRes) => {
    const _queryRef = queryRef.current;

    _queryRef.queryStatus = "success";
    _queryRef.result = loginInfo.userInfo;

    localStorage.setItem(ACCESS_TOKEN_KEY, loginInfo.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, loginInfo.refreshToken);
    if (state?.from) {
      nav(state.from);
    } else {
      nav("/");
    }
  };

  const userLogout = () => {
    // 重置用户信息
    queryRef.current.queryStatus = "init";
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    nav("/login");
  };

  const isLoggedIn = () => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  };

  // 同步获取用户信息
  const getUserInfoSync = () => {
    const _queryRef = queryRef.current;
    if (_queryRef.queryStatus === "success") return _queryRef.result;
    if (_queryRef.queryStatus === "error") throw _queryRef.result;
    if (_queryRef.queryStatus === "init") {
      _queryRef.queryStatus = "loading";
      _queryRef.queryPromise = getUserInfoAPI()
        .then((res) => {
          _queryRef.queryStatus = "success";
          _queryRef.result = res;
        })
        .catch((error) => {
          _queryRef.queryStatus = "error";
          _queryRef.result = error;
          throw error;
        });
    }
    throw _queryRef.queryPromise;
  };

  const isLogged = isLoggedIn();

  return {
    userLogin,
    userLogout,
    isLoggedIn,
    isLogged,
    get userInfo(): UserInfo {
      return getUserInfoSync();
    },
  };
});
