declare type AnimateDir = 'bottom' | 'top';

declare type NotGangedData = NotGangedDataObj[] | Array<string | number>;

declare type NotGangedDataObj = {
  key?: any;
  value: any;
};

declare type DataTrans = {
  key: any;
  value: any;
};

declare interface DataCallback extends DataTrans {
  index: number;
}

declare type GangedData = {
  key?: any;
  value: any;
  children: GangedData[];
};

declare type Data = GangedData[] | NotGangedData[];

declare type FunctionKeys = 'ready' | 'cancel' | 'confirm' | 'hide' | 'show';

declare type QOptions = {
  id: number;
  target: string;
  loading: boolean;
  data: Data;
  index: number[];
  count: number;
  chunkHeight: number;
  change: Function;
  confirm: Function;
  cancel: Function;
  ready: Function;
  show: Function;
  hide: Function;
  title: string;
  confirmBtn: string;
  cancelBtn: string;
  bkIndex: number;
  selectIndex: number;
  disableDefaultCancel: boolean;
};
