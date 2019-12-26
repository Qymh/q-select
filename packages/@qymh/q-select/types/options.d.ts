export type NotGangedData<K, V> =
  | NotGangedDataObj<K, V>[]
  | Array<string | number>;

export type NotGangedDataObj<K, V> = {
  key?: K;
  value: V;
  disabled?: boolean;
};

export type GangedData<K, V> = {
  key?: K;
  value: V;
  disabled?: boolean;
  children: GangedData<K, V>[] | Array<string | number>;
};

export type DataCallBack<K, V> = {
  key: K;
  value: V;
  disabled?: boolean;
  index: number;
};

export type Data<V = any, K = any> = GangedData<K, V>[] | NotGangedData<K, V>[];

export type DefaultFunction<K = any, V = any> = (
  value?: V[],
  key?: K[],
  data?: DataCallBack<K, V>[]
) => void;

export type ChangeFunction<K = any, V = any> = (
  weight?: number,
  value?: V[],
  key?: K[],
  data?: DataCallBack<K, V>[]
) => void;

export interface QSelectOptions {
  data: Data;
  target?: string;
  index?: number[];
  loading?: boolean;
  count?: number;
  chunkHeight?: number;
  change?: ChangeFunction;
  confirm?: DefaultFunction;
  cancel?: DefaultFunction;
  ready?: DefaultFunction;
  show?: DefaultFunction;
  hide?: DefaultFunction;
  title?: string;
  confirmBtn?: string;
  cancelBtn?: string;
  bkIndex?: number;
  selectIndex?: number;
  disableDefaultCancel?: boolean;
}

export interface QSelectConstructor {
  new (options: QSelectOptions): QSelect;
}

export type PromiseCall<K, V> = Promise<[K[], V[], DataCallBack<K, V>[]]>;

export interface QSelect {
  setColumnData<K, V>(
    column: number | number[],
    data: NotGangedData<K, V> | NotGangedData<K, V>[]
  ): PromiseCall<K, V>;
  scrollTo<K, V>(column: number, index: number): PromiseCall<K, V>;

  setIndex<K, V>(index: number[]): PromiseCall<K, V>;
  setKey<K, V>(key: any[]): PromiseCall<K, V>;
  setValue<K, V>(value: any[]): PromiseCall<K, V>;
  setData<K, V>(data: Data<K, V>, index?: number[]): PromiseCall<K, V>;
  setTitle<K>(title: K): void;

  getIndex: () => number[];
  getKey: <T>() => T[];
  getValue: <T>() => T[];
  getData: <K, V>() => Data<K, V>;

  close: () => void;
  show: () => void;
  destroy: () => void;
  setLoading: () => void;
  cancelLoading: () => void;
}

export const QSelect: QSelectConstructor;
