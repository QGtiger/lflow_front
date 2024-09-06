import { CloseOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { immer } from "zustand/middleware/immer";
import StopPropagationDiv from "@/components/StopPropagationDiv";
import { useAliveController } from "react-activation";
import { useUnmount } from "ahooks";
import classNames from "classnames";
import useRouter from "@/hooks/useRouter";
import { useDocumentTitleMap } from "@/context/DocumentMap";
import { getPathName } from "@/utils/path";

type TabConfig = {
  uid: string;
  path: string;
  title: string;
};

const DashboardTab: TabConfig = {
  uid: "dashboard",
  path: "/",
  title: "欢迎",
};

const useTabStore = create(
  immer(
    persist<{
      activeUid: string;
      tabs: Array<TabConfig>;
      setActiveTab: (tab: TabConfig) => void;
      // 修改当前 tab 的 path 和 title, 并且修改 当前path 的 title
      changeTabPath: (path: string, cb: (tab: TabConfig) => void) => void;
      addDefaultTab: (cb?: (tab: TabConfig) => void) => void;
      closeTab: (uid: string, cb?: (tab: TabConfig) => void) => void;
    }>(
      (set) => {
        return {
          activeUid: "dashboard",
          tabs: [DashboardTab],
          setActiveTab(tab) {
            set((state) => {
              state.activeUid = tab.uid;
              return state;
            });
          },
          changeTabPath(path, cb) {
            set((state) => {
              state.tabs = state.tabs.map((tab) => {
                if (tab.uid === state.activeUid) {
                  cb(tab);
                }
                if (tab.path === path) {
                  cb(tab);
                }
                return tab;
              });
              return state;
            });
          },
          addDefaultTab(cb) {
            set((state) => {
              const tab = {
                ...DashboardTab,
                uid: uuidv4(),
              };
              state.tabs.push(tab);
              state.activeUid = tab.uid;
              cb?.(tab);
              return state;
            });
          },
          closeTab: (uid: string, cb) =>
            set((state) => {
              const { tabs, activeUid } = state;
              const index = tabs.findIndex((tab) => tab.uid === uid);
              if (index === -1) return state;
              tabs.splice(index, 1);
              let nextActiveTab: TabConfig | undefined;
              if (tabs.length === 0) {
                nextActiveTab = DashboardTab;
                tabs.push(nextActiveTab);
                state.activeUid = nextActiveTab.uid;
              } else if (activeUid === uid) {
                nextActiveTab =
                  tabs[index >= tabs.length ? tabs.length - 1 : index];
                state.activeUid = nextActiveTab.uid;
              }
              nextActiveTab && cb?.(nextActiveTab);
              return state;
            }),
        };
      },
      {
        name: "tabStore",
      }
    )
  )
);

export default function TabHeader() {
  const {
    activeUid,
    tabs,
    setActiveTab,
    addDefaultTab,
    closeTab,
    changeTabPath,
  } = useTabStore();
  const { nav, fullpath } = useRouter();
  const { dropScope, clear, getCachingNodes, refresh } = useAliveController();
  const titleMap = useDocumentTitleMap();

  useEffect(() => {
    changeTabPath(fullpath, (tab) => {
      tab.path = fullpath;
      const _t = titleMap[fullpath];
      if (_t) {
        tab.title = titleMap[fullpath];
      }
    });
  }, [changeTabPath, fullpath, titleMap]);

  useEffect(() => {
    // 每次修改 tabs 都会触发。 清除缓存
    getCachingNodes().forEach((node) => {
      // 清除缓存只校验 pathname
      if (node.name && !tabs.find((it) => it.path.startsWith(node.name!))) {
        dropScope(node.name);
      }
    });
  }, [tabs, getCachingNodes, dropScope]);

  useUnmount(clear);

  const changetabByNav = (tab: TabConfig) => {
    nav(tab.path, {
      replace: true,
      title: tab.title,
    });
  };

  return (
    <div className="w-full h-[38px] overflow-hidden bg-white flex-shrink-0">
      <div
        className="flex h-full left-0 top-0 items-center relative z-[60]"
        style={{
          width: "calc(100% - 200px)",
        }}
      >
        <div className="flex flex-nowrap h-full w-1 flex-1">
          {tabs.map((tab) => {
            return (
              <div
                key={tab.uid}
                className={`px-2 py-2 bg-white group hover:opacity-100 transition-opacity max-w-[230px] flex-1 border-l-transparent ${
                  activeUid === tab.uid
                    ? "opacity-100 text-[#000000] tabShadow border-x z-[60] cursor-default"
                    : "opacity-50 border cursor-pointer hover:bg-[#f0f1f5]"
                }`}
                onClick={() => {
                  if (activeUid === tab.uid) return;
                  setActiveTab(tab);
                  changetabByNav(tab);
                }}
              >
                <div className="flex justify-between items-center">
                  <span>{tab.title}</span>
                  <StopPropagationDiv>
                    <div className="gap-1 hidden group-hover:flex">
                      <ReloadOutlined
                        onClick={() => {
                          refresh(getPathName(tab.path));
                        }}
                        className="cursor-pointer flex hover:bg-[#e2e4eb] rounded-full w-[16px] h-[16px] p-[3px] items-center justify-center"
                      ></ReloadOutlined>
                      <CloseOutlined
                        onClick={() => {
                          closeTab(tab.uid, changetabByNav);
                        }}
                        className={classNames(
                          " cursor-pointer flex hover:bg-[#e2e4eb] rounded-full w-[16px] h-[16px] p-[3px] items-center justify-center"
                        )}
                      />
                    </div>
                  </StopPropagationDiv>
                </div>
              </div>
            );
          })}
          <div className="add-tab  flex-0">
            <PlusOutlined
              onClick={() => {
                addDefaultTab(changetabByNav);
              }}
              className=" m-2 p-1 rounded-sm hover:bg-[#f0f1f5] cursor-pointer transition-all"
            />
          </div>
        </div>
      </div>
      <div className="absolute top-[37px] border-b border-bg w-full z-10"></div>
    </div>
  );
}
