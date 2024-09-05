import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./index.css";
import CommonLayout from "./components/CommonLayout";
import RequireAuth from "./components/RequireAuth";
import { layoutMap, notFoundMap, routeMap, settingsMap } from "./glob";
import { generateFolderMenu } from "./generateMenu";
import { GlobalContext } from "./context/GlobalContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AliveScope, autoFixContext } from "react-activation";
import reactJsxRuntime from "react/jsx-runtime";
import reactJsxDevRuntime from "react/jsx-dev-runtime";

// 修复内嵌自定义 Context 走 KeepAlive 不能 使用consumer的问题 https://github.com/StructureBuilder/react-keep-alive/issues/36
autoFixContext(
  [reactJsxRuntime, "jsx", "jsxs", "jsxDEV"],
  [reactJsxDevRuntime, "jsx", "jsxs", "jsxDEV"]
);

type ReactFunctionComponent = (props: any) => JSX.Element | null;

const handlePath = (path: string) => {
  return path.replace(/\[(.*?)\]/g, ":$1");
};

// 生成组件
function generateComp(
  ModuleComp: ReactFunctionComponent = CommonLayout,
  // @ts-expect-error settingsConfig
  settingsConfig: PageSettings = {}
) {
  if (settingsConfig.login) {
    return () => {
      return (
        <RequireAuth>
          <ModuleComp></ModuleComp>
        </RequireAuth>
      );
    };
  }
  return ModuleComp;
}

function initRoutes() {
  const resultRoutes: RouteObject[] = [];

  /**
   * 创建路由
   * @param pageUrl 页面路径
   * @param layoutUrl 布局页面路径
   * @param path 路径
   * @param routes 路由集合
   * @returns
   */
  function createRoute(
    relativePath: string,
    path: string,
    routes: RouteObject[] = []
  ) {
    const pageUrl = `${relativePath}/index.tsx`;
    const layoutUrl = `${relativePath}/layout.tsx`;
    const notFoundUrl = `${relativePath}/notFound.tsx`;
    const settingsUrl = `${relativePath}/settings.tsx`;

    const LayoutComp = generateComp(layoutMap[layoutUrl]?.default);
    // 页面 settings
    const PageComp = generateComp(
      routeMap[pageUrl]?.default,
      settingsMap[settingsUrl]?.default
    );
    const NotFoundComp = notFoundMap[notFoundUrl]?.default;

    let route = routes.find((item) => item.path === handlePath(path));
    if (!route) {
      route = {
        path: handlePath(path),
        element: <LayoutComp />,
        children: [
          {
            index: true,
            element: PageComp ? <PageComp /> : null,
          },
        ],
      };

      // 路由器404
      if (NotFoundComp) {
        route.children!.push({
          path: "*",
          element: <NotFoundComp />,
        });
      }
      routes.unshift(route);
    }

    return route;
  }

  const rootRoute = createRoute(`./pages`, "", resultRoutes);

  function dfs(prePath: string, paths: string[], result: RouteObject[] = []) {
    if (!paths.length) return result;
    const path = paths.shift() || "";

    dfs(
      `${prePath}/${path}`,
      paths,
      createRoute(`${prePath}/${path}`, path, result).children
    );
    return result;
  }

  Object.keys(routeMap)
    .filter((key) => !key.includes("components"))
    .forEach((key) => {
      dfs("./pages", key.split("/").slice(2, -1), rootRoute.children);
    });

  return resultRoutes;
}

const routes = initRoutes();

const router = createBrowserRouter(routes);
console.log(routes);
const menu = generateFolderMenu();
console.log("menu", menu);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AliveScope>
    <GlobalContext.Provider
      value={{
        routesMenu: menu,
      }}
    >
      <ConfigProvider prefixCls="lflow">
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
        <Analytics />
        <SpeedInsights />
      </ConfigProvider>
    </GlobalContext.Provider>
  </AliveScope>
);
