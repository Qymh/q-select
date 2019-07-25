<script lang="ts">
import Vue from 'vue';
import QSelect from '@qymh/q-select';
import { value, onCreated, watch } from 'vue-function-api';
import { assert } from '@qymh/q-select/src/uitls';
export default {
  setup(props, context) {
    let pending = value(true);
    const uid = value(0);
    let ins: QSelect;

    onCreated(() => {
      Vue.nextTick(() => {
        ins = new QSelect({
          data: props.data,
          index: props.index,
          target: props.inline ? `.q-select-inline--${uid.value}` : '',
          count: props.count,
          title: props.title,
          chunkHeight: props.chunkHeight,
          loading: props.loading,
          ready(value, key, data) {
            pending = false;
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
        return ins.show();
      }
    };

    const close = () => {
      if (warnIns()) {
        return ins.close();
      }
    };

    const destroy = () => {
      if (warnIns()) {
        return ins.destroy();
      }
    };

    const setData = (data, index) => {
      if (warnIns()) {
        return ins.setData(data, index);
      }
    };

    const setColumnData = (column, data) => {
      if (warnIns()) {
        return ins.setColumnData(column, data);
      }
    };

    const scrollTo = (column: number, index: number) => {
      if (warnIns()) {
        return ins.scrollTo(column, index);
      }
    };

    const setIndex = index => {
      if (warnIns()) {
        return ins.setIndex(index);
      }
    };

    const setValue = value => {
      if (warnIns()) {
        return ins.setValue(value);
      }
    };

    const setKey = key => {
      if (warnIns()) {
        return ins.setKey(key);
      }
    };

    const getData = () => {
      if (warnIns()) {
        return ins.getChangeCallData();
      }
    };

    const getIndex = () => {
      if (warnIns()) {
        return ins.getIndex();
      }
    };

    const getValue = () => {
      if (warnIns()) {
        return ins.getValue();
      }
    };

    const getKey = () => {
      if (warnIns()) {
        return ins.getKey();
      }
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
      () => props.visible,
      val => {
        if (val) {
          if (pending) {
            Vue.nextTick(() => {
              show();
            });
          } else {
            show();
          }
        } else {
          if (!pending) {
            close();
          }
        }
      }
    );

    watch(
      () => props.loading,
      val => {
        if (val) {
          if (pending) {
          } else {
            setLoading();
          }
        } else {
          if (!pending) {
            cancelLoading();
          }
        }
      }
    );

    return {
      pending,
      ins,
      show,
      close,
      destroy,
      setData,
      setColumnData,
      scrollTo,
      setIndex,
      setValue,
      setKey,
      getData,
      getIndex,
      getValue,
      getKey,
      setLoading,
      cancelLoading,
      uid
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
    }
  },
  render(h) {
    this.uid = this._uid;
    if (this.inline) {
      return h('div', { class: `q-select-inline--${this._uid}` });
    } else {
      return h('');
    }
  }
};
</script>
