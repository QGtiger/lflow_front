interface PageSettings {
  login?: boolean; // 是否需要登录
  menuConfig: {
    // 菜单配置 如果没有配置就不会显示在菜单中
    name: string; // 菜单名称
    icon: JSX.Element; // 菜单图标
  };
  // 先不考虑这个
  separate?: boolean; // 是否独立页面

  microApp?: boolean; // 是否是微应用
}

type ProLayoutRouteObject = {
  path: string;
  name: string;
  icon: JSX.Element;
  routes?: ProLayoutRouteObject[];
};

interface Window {
  drop: any;
  getCachingNodes: any;
  refresh: any;
  refreshScope: any;
}
