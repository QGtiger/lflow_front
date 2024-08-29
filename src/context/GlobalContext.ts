import { createContext } from "react";

export const GlobalContext = createContext<{
  routesMenu: ProLayoutRouteObject[];
}>({
  routesMenu: [],
});
