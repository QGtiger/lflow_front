import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/api";
import { useCallback } from "react";

export default function useUserModel() {
  const userLogin = useCallback((loginInfo: UserLoginRes) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, loginInfo.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, loginInfo.refreshToken);
  }, []);

  return {
    userLogin,
  };
}
