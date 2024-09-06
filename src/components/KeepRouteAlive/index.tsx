import { PropsWithChildren, useEffect } from "react";
import KeepAlive, { useAliveController } from "react-activation";
import { useLocation } from "react-router-dom";

export default function KeepRouteAlive({ children }: PropsWithChildren) {
  const { pathname } = useLocation();
  const { drop, getCachingNodes, refresh, refreshScope } = useAliveController();

  useEffect(() => {
    window.drop = drop;
    window.getCachingNodes = getCachingNodes;
    window.refresh = refresh;
    window.refreshScope = refreshScope;
  }, []);

  console.log("缓存节点地址", pathname);
  return (
    <KeepAlive cacheKey={pathname} name={pathname}>
      {children}
    </KeepAlive>
  );
}
