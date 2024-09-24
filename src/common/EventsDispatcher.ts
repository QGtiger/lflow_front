type BaseEventMap = Record<string, any>;

interface BaseEvent {
  type: string;
}

interface Event extends BaseEvent {
  // target?: any;
  [attachment: string]: any;
}

export type EventListener<E, T, U, D = any> = (
  event: E & { type: T } & { target: U } & { data: D }
) => void;

export class EventsDispatcher<
  E extends BaseEventMap = BaseEventMap,
  Type extends string = keyof E & string
> {
  private _events: Record<Type, any>;
  constructor() {
    // @ts-expect-error 赋值前声明
    this._events = this._events || {};
  }

  getListenersFromType<T extends Type>(type: T) {
    if (!type) return [];
    const events = this._events;
    const listeners: any[] = events[type] || (events[type] = []);
    return listeners;
  }

  addEventListener<T extends Type>(
    type: T,
    listener: EventListener<Event, T, this, E[T & string]>
  ) {
    if (!listener) return this;
    const listeners = this.getListenersFromType(type);
    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener);
    }
    return this;
  }

  removeEventListener<T extends Type>(
    type: T,
    listener: EventListener<Event, T, this, E[T & string]>
  ) {
    if (!listener) return this;
    const listeners = this.getListenersFromType(type);

    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    return this;
  }

  removeAllEventListener<T extends Type>(type?: T) {
    // @ts-expect-error 赋值前声明
    if (!type) this._events = {};
    // @ts-expect-error 赋值前声明
    this._events[type] = [];
    return this;
  }

  hasEventListener<T extends Type>(
    type: T,
    listener: EventListener<Event, T, this, E[T & string]>
  ) {
    return this.getListenersFromType(type).indexOf(listener) !== -1;
  }

  dispathcEvent<T extends Type>(type: T, data?: E[T & string]) {
    const listeners = this.getListenersFromType(type);
    const event: Event = {
      type,
      data,
    };
    event.target = this;
    const arr = listeners.slice(0);
    arr.forEach((fn) => {
      fn.call(this, event);
    });
    event.target = null;
  }
}
