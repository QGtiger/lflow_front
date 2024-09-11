import { useContext } from "react";
import { LFStoreState, StoreContext } from "../context";
import { useStore } from "zustand";

export default function useLFStore<T>(selector: (state: LFStoreState) => T): T {
  const store = useContext(StoreContext);
  return useStore(store, selector);
}
