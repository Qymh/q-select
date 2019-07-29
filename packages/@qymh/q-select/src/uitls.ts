export function easeOutCubic(pos: number): number {
  return Math.pow(pos - 1, 3) + 1;
}

export function firstUpper(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function isPlainObj(obj: any): boolean {
  return Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
}

export function isPlainNumber(obj: any): boolean {
  return isFinite(obj);
}

export function assert(condition: boolean, msg: string): boolean {
  if (process.env.NODE_ENV === 'development') {
    if (!condition) {
      // eslint-disable-next-line
      return Boolean(console.error(`[SelectQ]: ${msg}`));
    } else {
      return true;
    }
  }
  return true;
}

export function sameIndex(a: number[], b: number[]) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function tips(condition: boolean, msg: string): boolean {
  if (process.env.NODE_ENV === 'development') {
    if (!condition) {
      // eslint-disable-next-line
      return Boolean(console.warn(`[SelectQ]: ${msg}`));
    } else {
      return true;
    }
  }
  return true;
}

export function nextTick(fn: Function): void {
  try {
    Promise.resolve().then(() => {
      fn();
    });
  } catch (error) {
    setTimeout(() => {
      fn();
    });
  }
}

export function deepClone(val: any[] | obj): any {
  if (Array.isArray(val)) {
    return val.map(v => deepClone(v));
  } else {
    const res: obj = {};
    for (const key in val) {
      const item = val[key];
      res[key] = isPlainObj(item) ? deepClone(item) : item;
    }
    return res;
  }
}

export function isDefined(val: any) {
  return val === 0 || !!val;
}
