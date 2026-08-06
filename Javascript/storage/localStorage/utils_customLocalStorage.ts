// Object-based implementation
export const objectLocalStorage = {
  storage: {} as Record<string, string>,
  length: 0,
  setItem(key: string, value: string) {
    if (key) {
      this.storage[key] = value;
      this.length = Object.keys(this.storage).length;
    } else throw new TypeError("Key is required");
  },
  getItem(key: string) {
    if (key in this.storage) return this.storage[key];
    else if (!key) throw new TypeError("Key is required");
    return null;
  },
  removeItem(key: string) {
    if (key in this.storage) {
      delete this.storage[key];
      this.length = Object.keys(this.storage).length;
    }
  },
  clear() {
    this.storage = {};
    this.length = 0;
  }
};

// Class-based implementation
class LocalStorage {
  private store: Map<string, string>;

  constructor() {
    this.store = new Map();
  }
  
  get length() {
    return this.store.size;
  }
  
  setItem(key: string, value: string) {
    if (arguments.length < 2) {
      throw new TypeError(`Expected 2 parameters but got ${arguments.length}`);
    }
    this.store.set(String(key), value);
  }
  
  getItem(key: string) {
    if (arguments.length < 1) {
      throw new TypeError(`Expected 1 parameter but got ${arguments.length}`);
    }
    return this.store.get(String(key)) ?? null;
  }
  
  removeItem(key: string) {
    this.store.delete(String(key));
  }
  
  clear() {
    this.store.clear();
  }
}

export const classLocalStorage = new LocalStorage();

