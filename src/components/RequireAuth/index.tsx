import useUserModel from "@/hooks/user/useUserModel";
import useRouter from "@/hooks/useRouter";
import { PropsWithChildren, useEffect } from "react";

// 用于检查用户是否登录，如果未登录则跳转到登录页
export default function RequireAuth(props: PropsWithChildren) {
  const { isLogged } = useUserModel();
  const { nav, location } = useRouter();

  useEffect(() => {
    if (!isLogged) {
      nav("/login", {
        replace: true,
        state: {
          from: location,
        },
      });
    }
  }, [isLogged, nav, location]);

  if (!isLogged) {
    return null;
  }

  return props.children;
}
