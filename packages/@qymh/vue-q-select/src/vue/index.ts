import {
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
  createComponent
} from '@vue/composition-api';
import Vue from 'vue';
import QSelect from '@qymh/q-select';

import { assert } from '@qymh/q-select/src/uitls';

interface IProps {
  visible: boolean;
  data: Data;
  index: number[];
  title: string;
  count: number;
  chunkHeight: number;
  confirmBtn: string;
  cancelBtn: string;
  inline: boolean;
  loading: boolean;
  deep: boolean;
  disableDefaultCancel: boolean;
  defaultKey: any[];
  defaultValue: any[];
  bkIndex: number;
  selectIndex: number;
}

const Component = createComponent({
  setup(props: IProps, context) {
    const pending = ref(true);
    const uid = ref(0);
    let ins: QSelect;

    onMounted(() => {
      ins = new QSelect({
        data: props.data,
        index: props.index,
        target: props.inline ? `.q-select-inline--${uid.value}` : '',
        count: props.count,
        title: props.title,
        chunkHeight: props.chunkHeight,
        cancelBtn: props.cancelBtn,
        confirmBtn: props.confirmBtn,
        loading: props.loading,
        disableDefaultCancel: props.disableDefaultCancel,
        bkIndex: props.bkIndex,
        selectIndex: props.selectIndex,
        ready(value, key, data) {
          pending.value = false;
          context.emit('ready', value, key, data);
        },
        cancel() {
          context.emit('input', false);
          context.emit('cancel');
        },
        confirm(value, key, data) {
          context.emit('input', false);
          context.emit('confirm', value, key, data);
        },
        change(weight, value, key, data) {
          context.emit('change', weight, value, key, data);
        },
        show() {
          context.emit('show');
        },
        hide() {
          context.emit('hide');
        }
      });
    });

    onBeforeUnmount(() => {
      ins && ins.destroy();
    });

    const warnIns = () => {
      if (!ins) {
        return assert(false, 'You should new QSelect before you use it');
      } else {
        return true;
      }
    };

    const show = () => {
      if (warnIns()) {
        context.emit('input', true);
        return ins.show();
      }
    };

    const close = () => {
      if (warnIns()) {
        context.emit('input', false);
        return ins.close();
      }
    };

    const destroy = () => {
      if (warnIns()) {
        return ins.destroy();
      }
    };

    const setData = (data: Data, index?: number[]) => {
      if (warnIns()) {
        return ins.setData(data, index);
      }
      return '';
    };

    const setColumnData = (
      column: number | number[],
      data: NotGangedData | NotGangedData[]
    ) => {
      if (warnIns()) {
        return ins.setColumnData(column, data);
      }
      return '';
    };

    const scrollTo = (column: number, index: number) => {
      if (warnIns()) {
        return ins.scrollTo(column, index);
      }
      return '';
    };

    const setIndex = (index: number[]) => {
      if (warnIns()) {
        return ins.setIndex(index);
      }
      return '';
    };

    const setTitle = (title: string) => {
      if (warnIns()) {
        return ins.setTitle(title);
      }
    };

    const setValue = (value: any[]) => {
      if (warnIns()) {
        return ins.setValue(value);
      }
      return '';
    };

    const setKey = (key: any[]) => {
      if (warnIns()) {
        return ins.setKey(key);
      }
      return '';
    };

    const getData = () => {
      if (warnIns()) {
        return ins.getData();
      }
      return [];
    };

    const getIndex = () => {
      if (warnIns()) {
        return ins.getIndex();
      }
      return [];
    };

    const getValue = () => {
      if (warnIns()) {
        return ins.getValue();
      }
      return [];
    };

    const getKey = () => {
      if (warnIns()) {
        return ins.getKey();
      }
      return [];
    };

    const setLoading = () => {
      if (warnIns()) {
        return ins.setLoading();
      }
    };

    const cancelLoading = () => {
      if (warnIns()) {
        return ins.cancelLoading();
      }
    };

    watch(
      () => props.defaultKey,
      val => {
        if (val && val.length) {
          if (pending.value) {
            Vue.nextTick(() => {
              ins.setKey(props.defaultKey);
            });
          } else {
            ins.setKey(props.defaultKey);
          }
        }
      }
    );

    watch(
      () => props.defaultValue,
      val => {
        if (val && val.length) {
          if (pending.value) {
            Vue.nextTick(() => {
              ins.setValue(props.defaultValue);
            });
          } else {
            ins.setValue(props.defaultValue);
          }
        }
      }
    );

    watch(
      () => props.visible,
      val => {
        if (val) {
          if (pending.value) {
            Vue.nextTick(() => {
              show();
            });
          } else {
            show();
          }
        } else {
          if (!pending.value) {
            context.emit('hide');
            close();
          }
        }
      }
    );

    watch(
      () => props.loading,
      val => {
        if (val) {
          if (pending.value) {
          } else {
            setLoading();
          }
        } else {
          if (!pending.value) {
            cancelLoading();
          }
        }
      }
    );

    watch(
      () => props.data,
      (val: Data) => {
        setData(val);
        if (props.defaultValue && props.defaultValue.length) {
          setValue(props.defaultValue);
        }
        if (props.defaultKey && props.defaultKey.length) {
          setKey(props.defaultKey);
        }
        if (props.index && props.index.length) {
          setIndex(props.index);
        }
      },
      {
        lazy: true,
        deep: props.deep
      }
    );

    watch(
      () => props.index,
      val => {
        setIndex(val);
      },
      {
        lazy: true
      }
    );

    watch(
      () => props.title,
      val => {
        setTitle(val);
      },
      {
        lazy: true
      }
    );

    return {
      uid,
      destroy,
      setIndex,
      setData,
      setColumnData,
      scrollTo,
      setValue,
      setKey,
      setTitle,
      getData,
      getIndex,
      getValue,
      getKey
    };
  },
  name: 'QSelect',
  model: {
    prop: 'visible'
  },
  props: {
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    },
    // data值
    data: {
      type: Array,
      default: () => [['']]
    },
    // 索引
    index: {
      type: Array,
      default: () => []
    },
    // 标题
    title: {
      type: String,
      default: '请选择'
    },
    // 展示多少个
    count: {
      type: Number,
      default: 7
    },
    // 一个块的高度
    chunkHeight: {
      type: Number,
      default: 40
    },
    // 确定按钮
    confirmBtn: {
      type: String,
      default: '确定'
    },
    // 取消按钮
    cancelBtn: {
      type: String,
      default: '取消'
    },
    // 是否内联展示
    inline: {
      type: Boolean,
      default: false
    },
    // 是否异步加载
    loading: {
      type: Boolean,
      default: false
    },
    // 深度观察data
    deep: {
      type: Boolean,
      default: false
    },
    // 是否禁止默认关闭事件
    disableDefaultCancel: {
      type: Boolean,
      default: false
    },
    // 默认key
    defaultKey: {
      type: Array,
      default: () => []
    },
    // 默认value
    defaultValue: {
      type: Array,
      default: () => []
    },
    // 背景index
    bkIndex: {
      type: Number,
      default: 500
    },
    // select index
    selectIndex: {
      type: Number,
      default: 600
    }
  },
  render(this: any, h) {
    this.uid = this._uid;
    if (this.inline) {
      return h('div', { class: `q-select-inline--${this._uid}` });
    } else {
      return h('');
    }
  }
});

export default Component;
