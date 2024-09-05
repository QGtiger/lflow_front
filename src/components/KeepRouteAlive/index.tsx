import { PropsWithChildren, useEffect } from "react";
import KeepAlive, { useAliveController } from "react-activation";
import { useLocation } from "react-router-dom";

export default function KeepRouteAlive({
  children,
  lisenSearch,
}: PropsWithChildren<{
  lisenSearch?: boolean;
}>) {
  const { pathname } = useLocation();
  const { drop, getCachingNodes, refresh, refreshScope } = useAliveController();

  useEffect(() => {
    window.drop = drop;
    window.getCachingNodes = getCachingNodes;
    window.refresh = refresh;
    window.refreshScope = refreshScope;
    console.log(pathname);
  }, []);

  return (
    <KeepAlive cacheKey={pathname} name={pathname}>
      {children}
    </KeepAlive>
  );
}
