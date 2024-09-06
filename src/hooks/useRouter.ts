import { useDocumentTitleSelector } from "@/context/DocumentMap";
import {
  NavigateOptions,
  Path,
  useLocation,
  useNavigate,
} from "react-router-dom";

function getPath(path: string | Partial<Path>) {
  return typeof path === "string"
    ? path
    : `${path.pathname}${path.search || ""}`;
}

type NewNavigateOptions = NavigateOptions & {
  title?: string;
};

const getPathTitle = (() => {
  const PathTitleMap: Record<string, string> = {
    "/": "欢迎",
    "/login": "登录",
    "/register": "注册",
    "/functions": "云函数",
  };
  const kyes = Object.keys(PathTitleMap).slice(1);
  return (path: string | Partial<Path>) => {
    const _path = getPath(path);
    if (_path === "/") {
      return PathTitleMap[_path];
    }
    const k = kyes.find((k) => _path.startsWith(k));
    return (k && PathTitleMap[k]) || "Workflow";
  };
})();

export default function useRouter<S extends { [k: string]: string }>() {
  const location = useLocation();
  const nav = useNavigate();
  const setDocumentTitle = useDocumentTitleSelector((state) => state.setTitle);

  const searchParams: S = Object.fromEntries(
    new URLSearchParams(window.location.search)
  ) as S;

  const newNav = (to: string | Partial<Path>, options?: NewNavigateOptions) => {
    nav(to, options);
    const _title = options?.title || getPathTitle(to);
    setDocumentTitle(getPath(to), _title);
  };

  return {
    ...location,
    location,
    fullpath: location.pathname + location.search,
    nav: newNav,
    searchParams,
    // 通过搜索参数导航
    navBySearchParam(
      key: string,
      value: string,
      navOptions?: NewNavigateOptions & { delOther?: boolean }
    ) {
      let _serach = location.search;
      if (navOptions?.delOther) {
        _serach = "";
      }
      const search = new URLSearchParams(_serach);
      search.set(key, value);
      newNav(`${location.pathname}?${search.toString()}`, navOptions);
    },
    navByDelSearchParam(key: string, navOptions?: NewNavigateOptions) {
      const search = new URLSearchParams(location.search);
      search.delete(key);
      newNav(`${location.pathname}?${search.toString()}`, navOptions);
    },
    delSearchParam(key: string) {
      const search = new URLSearchParams(location.search);
      search.delete(key);
      return `${location.pathname}?${search.toString()}`;
    },
  };
}
