import { settingsMap } from "./glob";

export function generateFolderMenu(): ProLayoutRouteObject[] {
  const resultMenu: ProLayoutRouteObject[] = [];

  // 生成菜单路由
  function createMenu(settingsUrl: string) {
    const settingsConfig = settingsMap[settingsUrl]?.default || {};
    const menuConfig = settingsConfig.menuConfig;

    if (!menuConfig) return;

    const routePaths = settingsUrl.split("/").slice(2, -1);
    if (routePaths.length === 0) {
      resultMenu.unshift({
        path: "/",
        ...menuConfig,
      });
    } else {
      routePaths.reduce(
        (acc, path) => {
          const { routes, prePath } = acc;
          const _path = `${prePath}/${path}`;
          const route = routes.find((route) => route.path === _path);
          if (route) {
            const _routes = route.routes || (route.routes = []);
            return { routes: _routes, prePath: _path };
          } else {
            // 获取页面配置
            const settingsConfig = settingsMap[`./pages${_path}/settings.tsx`]
              ?.default || {
              menuConfig: {
                name: "请设置settings.tsx",
              },
            };
            // if (!settingsConfig.menuConfig) return acc;
            const newRoute = {
              path: _path,
              ...settingsConfig.menuConfig,
              routes: [],
            };
            routes.push(newRoute);
            return {
              routes: newRoute.routes,
              prePath: _path,
            };
          }
        },
        {
          routes: resultMenu,
          prePath: "",
        }
      );
    }
    return resultMenu;
  }

  Object.keys(settingsMap)
    .filter((key) => !key.includes("components"))
    .forEach((key) => {
      createMenu(key);
    });

  return resultMenu;
}
