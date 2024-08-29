import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function useUserModel() {
  const { state } = useLocation();
  const nav = useNavigate();

  const userLogin = (loginInfo: UserLoginRes) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, loginInfo.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, loginInfo.refreshToken);
    if (state?.from) {
      nav(state.from);
    } else {
      nav("/");
    }
  };

  const userLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    nav("/login");
  };

  const isLoggedIn = () => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  };

  const isLogged = isLoggedIn();

  return {
    userLogin,
    userLogout,
    isLoggedIn,
    isLogged,
  };
}
