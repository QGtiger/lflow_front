// Map的巧妙使用 map放入数据是按顺序的，最新放入的数据在迭代器最后 而且map的entries方法，还有keys方法，
// 会返回一个迭代器，迭代器调用next也是顺序返回，所以返回第一个的值就是最老的，找到并删除即可

export class LRUCache<T> {
  private capacity: number;
  private cache: Map<string, T>;
  constructor(capacity: number = 10) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: string): T | null {
    if (!this.cache.has(key)) {
      return null;
    }
    const value: T = this.cache.get(key)!;
    this.cache.delete(key);
    // 重新放入，保证最新的在最后
    this.cache.set(key, value);
    return value;
  }

  put(key: string, value: T) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // 如果超出容量，删除最老的
    if (this.cache.size >= this.capacity) {
      this.cache.delete(this.cache.keys().next().value!);
    }
    this.cache.set(key, value);
  }

  remove(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  getKeys() {
    return this.cache.keys();
  }

  getValues() {
    return this.cache.values();
  }

  getEntries() {
    return this.cache.entries();
  }

  has(key: string) {
    return this.cache.has(key);
  }

  forEach(callbackfn: (value: T, key: string, map: Map<string, T>) => void) {
    this.cache.forEach(callbackfn);
  }

  [Symbol.iterator]() {
    return this.cache[Symbol.iterator]();
  }
}
