"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VueSlash = exports.default = void 0;

var _compositionApi = _interopRequireWildcard(require("@vue/composition-api"));

var _qSelect = _interopRequireDefault(require("@qymh/q-select"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * @qymh/vue-q-select v0.4.9
 * (c) 2020 Qymh
 * @license MIT
 */
function assert(condition, msg) {
  if (process.env.NODE_ENV === 'development') {
    if (!condition) {
      return Boolean(console.error("[SelectQ]: " + msg));
    } else {
      return true;
    }
  }

  return true;
}

var Component = (0, _compositionApi.createComponent)({
  setup: function setup(props, context) {
    var pending = (0, _compositionApi.ref)(true);
    var uid = (0, _compositionApi.ref)(0);
    var ins;
    (0, _compositionApi.onMounted)(function () {
      ins = new _qSelect.default({
        data: props.data,
        index: props.index,
        target: props.inline ? ".q-select-inline--" + uid.value : '',
        count: props.count,
        title: props.title,
        chunkHeight: props.chunkHeight,
        cancelBtn: props.cancelBtn,
        confirmBtn: props.confirmBtn,
        loading: props.loading,
        disableDefaultCancel: props.disableDefaultCancel,
        bkIndex: props.bkIndex,
        selectIndex: props.selectIndex,
        ready: function ready(value, key, data) {
          pending.value = false;
          context.emit('ready', value, key, data);
        },
        cancel: function cancel() {
          context.emit('input', false);
          context.emit('cancel');
        },
        confirm: function confirm(value, key, data) {
          context.emit('input', false);
          context.emit('confirm', value, key, data);
        },
        change: function change(weight, value, key, data) {
          context.emit('change', weight, value, key, data);
        },
        show: function show() {
          context.emit('show');
        },
        hide: function hide() {}
      });
    });
    (0, _compositionApi.onBeforeUnmount)(function () {
      ins && ins.destroy();
    });

    var warnIns = function warnIns() {
      if (!ins) {
        return assert(false, 'You should new QSelect before you use it');
      } else {
        return true;
      }
    };

    var show = function show() {
      if (warnIns()) {
        context.emit('input', true);
        return ins.show();
      }
    };

    var close = function close() {
      if (warnIns()) {
        context.emit('input', false);
        return ins.close();
      }
    };

    var destroy = function destroy() {
      if (warnIns()) {
        return ins.destroy();
      }
    };

    var setData = function setData(data, index) {
      if (warnIns()) {
        return ins.setData(data, index);
      }

      return '';
    };

    var setColumnData = function setColumnData(column, data) {
      if (warnIns()) {
        return ins.setColumnData(column, data);
      }

      return '';
    };

    var scrollTo = function scrollTo(column, index) {
      if (warnIns()) {
        return ins.scrollTo(column, index);
      }

      return '';
    };

    var setIndex = function setIndex(index) {
      if (warnIns()) {
        return ins.setIndex(index);
      }

      return '';
    };

    var setTitle = function setTitle(title) {
      if (warnIns()) {
        return ins.setTitle(title);
      }
    };

    var setValue = function setValue(value) {
      if (warnIns()) {
        return ins.setValue(value);
      }

      return '';
    };

    var setKey = function setKey(key) {
      if (warnIns()) {
        return ins.setKey(key);
      }

      return '';
    };

    var getData = function getData() {
      if (warnIns()) {
        return ins.getData();
      }

      return [];
    };

    var getIndex = function getIndex() {
      if (warnIns()) {
        return ins.getIndex();
      }

      return [];
    };

    var getValue = function getValue() {
      if (warnIns()) {
        return ins.getValue();
      }

      return [];
    };

    var getKey = function getKey() {
      if (warnIns()) {
        return ins.getKey();
      }

      return [];
    };

    var setLoading = function setLoading() {
      if (warnIns()) {
        return ins.setLoading();
      }
    };

    var cancelLoading = function cancelLoading() {
      if (warnIns()) {
        return ins.cancelLoading();
      }
    };

    (0, _compositionApi.watch)(function () {
      return props.defaultKey;
    }, function (val) {
      if (val && val.length) {
        if (pending.value) {
          VueSlash.nextTick(function () {
            ins.setKey(props.defaultKey);
          });
        } else {
          ins.setKey(props.defaultKey);
        }
      }
    });
    (0, _compositionApi.watch)(function () {
      return props.defaultValue;
    }, function (val) {
      if (val && val.length) {
        if (pending.value) {
          VueSlash.nextTick(function () {
            ins.setValue(props.defaultValue);
          });
        } else {
          ins.setValue(props.defaultValue);
        }
      }
    });
    (0, _compositionApi.watch)(function () {
      return props.visible;
    }, function (val) {
      if (val) {
        if (pending.value) {
          VueSlash.nextTick(function () {
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
    });
    (0, _compositionApi.watch)(function () {
      return props.loading;
    }, function (val) {
      if (val) {
        if (pending.value) ;else {
          setLoading();
        }
      } else {
        if (!pending.value) {
          cancelLoading();
        }
      }
    });
    (0, _compositionApi.watch)(function () {
      return props.data;
    }, function (val) {
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
    }, {
      lazy: true,
      deep: props.deep
    });
    (0, _compositionApi.watch)(function () {
      return props.index;
    }, function (val) {
      setIndex(val);
    }, {
      lazy: true
    });
    (0, _compositionApi.watch)(function () {
      return props.title;
    }, function (val) {
      setTitle(val);
    }, {
      lazy: true
    });
    return {
      uid: uid,
      destroy: destroy,
      setIndex: setIndex,
      setData: setData,
      setColumnData: setColumnData,
      scrollTo: scrollTo,
      setValue: setValue,
      setKey: setKey,
      setTitle: setTitle,
      getData: getData,
      getIndex: getIndex,
      getValue: getValue,
      getKey: getKey
    };
  },
  name: 'QSelect',
  model: {
    prop: 'visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: function _default() {
        return [['']];
      }
    },
    index: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    title: {
      type: String,
      default: '请选择'
    },
    count: {
      type: Number,
      default: 7
    },
    chunkHeight: {
      type: Number,
      default: 40
    },
    confirmBtn: {
      type: String,
      default: '确定'
    },
    cancelBtn: {
      type: String,
      default: '取消'
    },
    inline: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    deep: {
      type: Boolean,
      default: false
    },
    disableDefaultCancel: {
      type: Boolean,
      default: false
    },
    defaultKey: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    defaultValue: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    bkIndex: {
      type: Number,
      default: 500
    },
    selectIndex: {
      type: Number,
      default: 600
    }
  },
  render: function render(h) {
    this.uid = this._uid;

    if (this.inline) {
      return h('div', {
        class: "q-select-inline--" + this._uid
      });
    } else {
      return h('');
    }
  }
});
var VueSlash;
exports.VueSlash = VueSlash;
var index = {
  install: function install(Vue, options) {
    if (options === void 0) {
      options = {};
    }

    exports.VueSlash = VueSlash = Vue;
    Vue.use(_compositionApi.default);
    Vue.component(options.name || 'QSelect', Component);
  }
};
var _default2 = index;
exports.default = _default2;