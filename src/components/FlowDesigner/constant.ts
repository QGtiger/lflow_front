import { EventsDispatcher } from "@/common/EventsDispatcher";

export const GlobalEventDispatcher = new EventsDispatcher<{
  rePaint: any;
}>();
