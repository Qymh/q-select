/**
 * @qymh/vue-q-select v0.2.2
 * (c) 2019 Qymh
 * @license MIT
 */
'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _interopDefault(ex) {
  return ex && _typeof(ex) === 'object' && 'default' in ex ? ex['default'] : ex;
}

var Vue = _interopDefault(require('vue'));

var QSelect$1 = _interopDefault(require('@qymh/q-select'));

var vueFunctionApi = require('vue-function-api');

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

var script = {
  setup: function setup(props, context) {
    var pending = vueFunctionApi.value(true);
    var uid = vueFunctionApi.value(0);
    var ins;
    vueFunctionApi.onMounted(function () {
      ins = new QSelect$1({
        data: props.data,
        index: props.index,
        target: props.inline ? ".q-select-inline--" + uid.value : '',
        count: props.count,
        title: props.title,
        chunkHeight: props.chunkHeight,
        loading: props.loading,
        disableDefaultCancel: props.disableDefaultCancel,
        ready: function ready(value, key, data) {
          pending = false;
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
        hide: function hide() {
          context.emit('hide');
        }
      });
    });
    vueFunctionApi.onUnmounted(function () {
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
    };

    var setColumnData = function setColumnData(column, data) {
      if (warnIns()) {
        return ins.setColumnData(column, data);
      }
    };

    var scrollTo = function scrollTo(column, index) {
      if (warnIns()) {
        return ins.scrollTo(column, index);
      }
    };

    var setIndex = function setIndex(index) {
      if (warnIns()) {
        return ins.setIndex(index);
      }
    };

    var setValue = function setValue(value) {
      if (warnIns()) {
        return ins.setValue(value);
      }
    };

    var setKey = function setKey(key) {
      if (warnIns()) {
        return ins.setKey(key);
      }
    };

    var getData = function getData() {
      if (warnIns()) {
        return ins.getChangeCallData();
      }
    };

    var getIndex = function getIndex() {
      if (warnIns()) {
        return ins.getIndex();
      }
    };

    var getValue = function getValue() {
      if (warnIns()) {
        return ins.getValue();
      }
    };

    var getKey = function getKey() {
      if (warnIns()) {
        return ins.getKey();
      }
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

    vueFunctionApi.watch(function () {
      return props.visible;
    }, function (val) {
      if (val) {
        if (pending) {
          Vue.nextTick(function () {
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
    });
    vueFunctionApi.watch(function () {
      return props.loading;
    }, function (val) {
      if (val) {
        if (pending) ;else {
          setLoading();
        }
      } else {
        if (!pending) {
          cancelLoading();
        }
      }
    });
    vueFunctionApi.watch(function () {
      return props.data;
    }, function (val) {
      setData(val);
    }, {
      lazy: true,
      deep: props.deep
    });
    vueFunctionApi.watch(function () {
      return props.index;
    }, function (val) {
      setIndex(val);
    }, {
      lazy: true
    });
    return {
      pending: pending,
      ins: ins,
      destroy: destroy,
      setData: setData,
      setColumnData: setColumnData,
      scrollTo: scrollTo,
      setValue: setValue,
      setKey: setKey,
      getData: getData,
      getIndex: getIndex,
      getValue: getValue,
      getKey: getKey,
      uid: uid
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
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;
/* script */

var __vue_script__ = script;
/* template */

/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = undefined;
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = undefined;
/* style inject */

/* style inject SSR */

var QSelect = normalizeComponent_1({}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, undefined, undefined);
var index = {
  install: function install(Vue, options) {
    if (options === void 0) {
      options = {};
    }

    Vue.use(vueFunctionApi.plugin);
    Vue.component(options.name || 'QSelect', QSelect);
  }
};
module.exports = index;