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

const handlePath = (path: string) => {
  return path.replace(/\[(.*?)\]/g, ":$1");
};

// 生成组件
function generateComp(
  moduleComp: {
    default: any;
    settings?: {
      login?: boolean;
    };
  } = {
    default: CommonLayout,
  }
) {
  const { settings = {} } = moduleComp;
  if (settings.login) {
    return () => {
      console.log("emmmmm");
      const M = moduleComp.default || CommonLayout;
      return (
        <RequireAuth>
          <M></M>
        </RequireAuth>
      );
    };
  }
  return moduleComp.default || CommonLayout;
}

function initRoutes() {
  const routeMap: Record<string, { default: any }> = import.meta.glob(
    "./pages/**/index.tsx",
    {
      eager: true,
    }
  );

  const layoutMap: Record<string, { default: any }> = import.meta.glob(
    "./pages/**/layout.tsx",
    {
      eager: true,
    }
  );

  const notFoundMap: Record<string, { default: any }> = import.meta.glob(
    "./pages/**/notFound.tsx",
    {
      eager: true,
    }
  );

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

    const LayoutComp = generateComp(layoutMap[layoutUrl]);
    const PageComp = generateComp(routeMap[pageUrl]);
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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ConfigProvider prefixCls="lflow">
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ConfigProvider>
);
