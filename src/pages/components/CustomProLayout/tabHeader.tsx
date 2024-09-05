import { GlobalContext } from "@/context/GlobalContext";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { immer } from "zustand/middleware/immer";
import StopPropagationDiv from "@/components/StopPropagationDiv";
import { useAliveController } from "react-activation";
import { useUnmount } from "ahooks";

type TabConfig = {
  uid: string;
  path: string;
};

const useTabStore = create(
  immer(
    persist<{
      activeUid: string;
      tabs: Array<TabConfig>;
      setActiveTab: (tab: TabConfig) => void;
      changeTabPath: (path: string) => void;
      addDefaultTab: (cb?: (tab: TabConfig) => void) => void;
      closeTab: (uid: string, cb?: (tab: TabConfig) => void) => void;
    }>(
      (set) => {
        return {
          activeUid: "dashboard",
          tabs: [
            {
              uid: "dashboard",
              path: "/",
            },
          ],
          setActiveTab(tab) {
            set((state) => {
              state.activeUid = tab.uid;
              return state;
            });
          },
          changeTabPath(path) {
            set((state) => {
              state.tabs = state.tabs.map((tab) => {
                if (tab.uid === state.activeUid) {
                  tab.path = path;
                }
                return tab;
              });
              return state;
            });
          },
          addDefaultTab(cb) {
            set((state) => {
              const tab = {
                uid: uuidv4(),
                path: "/",
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
                nextActiveTab = {
                  uid: uuidv4(),
                  path: "/",
                };
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
  const { routesMenu } = useContext(GlobalContext);
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const { dropScope, clear, getCachingNodes } = useAliveController();

  useEffect(() => {
    changeTabPath(pathname + search);
  }, [changeTabPath, pathname, search]);

  useEffect(() => {
    // 每次修改 tabs 都会触发。 清除缓存
    getCachingNodes().forEach((node) => {
      if (!tabs.find((it) => it.path === node.name) && node.name) {
        dropScope(node.name);
      }
    });
  }, [tabs, getCachingNodes, dropScope]);

  useUnmount(clear);

  return (
    <div className="w-full h-[38px] overflow-hidden bg-white">
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
                  nav(tab.path, {
                    replace: true,
                  });
                }}
              >
                <div className="flex justify-between items-center">
                  <span>
                    {routesMenu.find((item) => item.path === tab.path)?.name}
                  </span>
                  <StopPropagationDiv>
                    <CloseOutlined
                      onClick={() => {
                        closeTab(tab.uid, (tab) => {
                          nav(tab.path);
                          console.log(tabs);
                        });
                      }}
                      className=" cursor-pointer hidden group-hover:flex hover:bg-[#c2c5cf] rounded-full w-[16px] h-[16px] p-[3px] items-center justify-center"
                    />
                  </StopPropagationDiv>
                </div>
              </div>
            );
          })}
          <div className="add-tab  flex-0">
            <PlusOutlined
              onClick={() => {
                addDefaultTab((tab) => {
                  nav(tab.path);
                });
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
