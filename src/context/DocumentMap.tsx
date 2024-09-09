/* eslint-disable react-refresh/only-export-components */
import useRouter from "@/hooks/useRouter";
import { useMount } from "ahooks";
import { createContext, PropsWithChildren, useContext } from "react";
import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

// 定义 store 的类型
type DocumentTitleState = {
  titleMap: Record<string, string>;
  setTitle: (path: string, title: string) => void;
  getTitle: (path: string) => string;
};

// 创建 store
const store = createStore(
  immer<DocumentTitleState>((set, get) => {
    return {
      titleMap: {},
      setTitle: (path: string, title: string) => {
        document.title = title;
        set((state) => {
          state.titleMap[path] = title;
          return state;
        });
      },
      getTitle: (path: string) => {
        return get().titleMap[path] || "Workflow";
      },
    };
  })
);

// 创建上下文
const StoreContext = createContext(store);

// 提供者组件
export function DocumentTitleProvider(props: PropsWithChildren) {
  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
}

// 定义 selector 的类型
export function useDocumentTitleSelector<T>(
  selector: (state: DocumentTitleState) => T
): T {
  const store = useContext(StoreContext);
  return useStore(store, selector);
}

export function useDocumentTitleMap() {
  return useDocumentTitleSelector((state) => state.titleMap);
}

export function useSetDocumentTitle() {
  return useDocumentTitleSelector((state) => state.setTitle);
}

export function useDocumentTitle(options?: { title?: string }) {
  const setTitle = useSetDocumentTitle();
  const { fullpath } = useRouter();
  useMount(() => {
    options?.title && setTitle(fullpath, options.title);
  });
  return (options: { title: string }) => {
    setTitle(fullpath, options?.title);
  };
}
