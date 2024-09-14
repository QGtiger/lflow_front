import { useContext } from "react";
import { StoreContext } from "../context";
import { useStore } from "zustand";

export default function useLFStoreState() {
  const store = useContext(StoreContext);
  return useStore(store);
}
