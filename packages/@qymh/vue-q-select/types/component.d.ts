import Vue from 'vue';

export type NotGangedData<K, V> =
  | NotGangedDataObj<K, V>[]
  | Array<string | number>;

export type NotGangedDataObj<K, V> = {
  key?: K;
  value: V;
};

export type GangedData<K, V> = {
  key?: K;
  value: V;
  children: GangedData<K, V>[] | Array<string | number>;
};

export type DataCallBack<K, V> = {
  key: K;
  value: V;
  index: number;
};

export type Data<V = any, K = any> = GangedData<K, V>[] | NotGangedData<K, V>[];

export class QSelect extends Vue {
  visible: boolean;

  data: Data;

  index?: number[];

  title?: string;

  count?: number;

  chunkHeight?: number;

  confirmBtn?: string;

  cancelBtn?: string;

  inline?: boolean;

  loading?: boolean;

  deep?: boolean;

  disableDefaultCancel?: boolean;
}
