"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _qSelect = _interopRequireDefault(require("@qymh/q-select"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}

var vueCompositionApi = createCommonjsModule(function (module, exports) {
  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopDefault(ex) {
    return ex && _typeof(ex) === 'object' && 'default' in ex ? ex['default'] : ex;
  }

  var Vue$1 = _interopDefault(_vue.default);

  var toString = function toString(x) {
    return Object.prototype.toString.call(x);
  };

  var hasSymbol = typeof Symbol === 'function' && Symbol.for;

  var noopFn = function noopFn(_) {
    return _;
  };

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noopFn,
    set: noopFn
  };

  function proxy(target, key, _a) {
    var get = _a.get,
        set = _a.set;
    sharedPropertyDefinition.get = get || noopFn;
    sharedPropertyDefinition.set = set || noopFn;
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  function assert(condition, msg) {
    if (!condition) throw new Error("[vue-composition-api] " + msg);
  }

  function isArray(x) {
    return Array.isArray(x);
  }

  function isPlainObject(x) {
    return toString(x) === '[object Object]';
  }

  function isFunction(x) {
    return typeof x === 'function';
  }

  function warn(msg, vm) {
    Vue$1.util.warn(msg, vm);
  }

  function logError(err, vm, info) {
    {
      warn("Error in " + info + ": \"" + err.toString() + "\"", vm);
    }

    if (typeof window !== 'undefined' && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err;
    }
  }

  var currentVue = null;
  var currentVM = null;

  function getCurrentVue() {
    {
      assert(currentVue, "must call Vue.use(plugin) before using any function.");
    }
    return currentVue;
  }

  function setCurrentVue(vue) {
    currentVue = vue;
  }

  function getCurrentVM() {
    return currentVM;
  }

  function setCurrentVM(vm) {
    currentVM = vm;
  }

  function ensureCurrentVMInFn(hook) {
    var vm = getCurrentVM();
    {
      assert(vm, "\"" + hook + "\" get called outside of \"setup()\"");
    }
    return vm;
  }

  function createComponentInstance(Ctor, options) {
    if (options === void 0) {
      options = {};
    }

    var silent = Ctor.config.silent;
    Ctor.config.silent = true;
    var vm = new Ctor(options);
    Ctor.config.silent = silent;
    return vm;
  }

  function isComponentInstance(obj) {
    return currentVue && obj instanceof currentVue;
  }

  function createSymbol(name) {
    return hasSymbol ? Symbol.for(name) : name;
  }

  var WatcherPreFlushQueueKey = createSymbol('vfa.key.preFlushQueue');
  var WatcherPostFlushQueueKey = createSymbol('vfa.key.postFlushQueue');
  var AccessControlIdentifierKey = createSymbol('vfa.key.accessControlIdentifier');
  var ReactiveIdentifierKey = createSymbol('vfa.key.reactiveIdentifier');
  var NonReactiveIdentifierKey = createSymbol('vfa.key.nonReactiveIdentifier'); // must be a string, symbol key is ignored in reactive

  var RefKey = 'vfa.key.refKey';

  var RefImpl =
  /** @class */
  function () {
    function RefImpl(_a) {
      var get = _a.get,
          set = _a.set;
      proxy(this, 'value', {
        get: get,
        set: set
      });
    }

    return RefImpl;
  }();

  function createRef(options) {
    // seal the ref, this could prevent ref from being observed
    // It's safe to seal the ref, since we really shoulnd't extend it.
    // related issues: #79
    return Object.seal(new RefImpl(options));
  } // implementation


  function ref(raw) {
    // if (isRef(raw)) {
    //   return {} as any;
    // }
    var _a;

    var value = reactive((_a = {}, _a[RefKey] = raw, _a));
    return createRef({
      get: function get() {
        return value[RefKey];
      },
      set: function set(v) {
        return value[RefKey] = v;
      }
    });
  }

  function isRef(value) {
    return value instanceof RefImpl;
  }

  function toRefs(obj) {
    if (!isPlainObject(obj)) return obj;
    var res = {};
    Object.keys(obj).forEach(function (key) {
      var val = obj[key]; // use ref to proxy the property

      if (!isRef(val)) {
        val = createRef({
          get: function get() {
            return obj[key];
          },
          set: function set(v) {
            return obj[key] = v;
          }
        });
      } // todo


      res[key] = val;
    });
    return res;
  }

  var AccessControlIdentifier = {};
  var ReactiveIdentifier = {};
  var NonReactiveIdentifier = {};

  function isNonReactive(obj) {
    return hasOwn(obj, NonReactiveIdentifierKey) && obj[NonReactiveIdentifierKey] === NonReactiveIdentifier;
  }

  function isReactive(obj) {
    return hasOwn(obj, ReactiveIdentifierKey) && obj[ReactiveIdentifierKey] === ReactiveIdentifier;
  }
  /**
   * Proxing property access of target.
   * We can do unwrapping and other things here.
   */


  function setupAccessControl(target) {
    if (!isPlainObject(target) || isNonReactive(target) || Array.isArray(target) || isRef(target) || isComponentInstance(target)) {
      return;
    }

    if (hasOwn(target, AccessControlIdentifierKey) && target[AccessControlIdentifierKey] === AccessControlIdentifier) {
      return;
    }

    if (Object.isExtensible(target)) {
      def(target, AccessControlIdentifierKey, AccessControlIdentifier);
    }

    var keys = Object.keys(target);

    for (var i = 0; i < keys.length; i++) {
      defineAccessControl(target, keys[i]);
    }
  }
  /**
   * Auto unwrapping when access property
   */


  function defineAccessControl(target, key, val) {
    if (key === '__ob__') return;
    var getter;
    var setter;
    var property = Object.getOwnPropertyDescriptor(target, key);

    if (property) {
      if (property.configurable === false) {
        return;
      }

      getter = property.get;
      setter = property.set;

      if ((!getter || setter) &&
      /* not only have getter */
      arguments.length === 2) {
        val = target[key];
      }
    }

    setupAccessControl(val);
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: function getterHandler() {
        var value = getter ? getter.call(target) : val; // if the key is equal to RefKey, skip the unwrap logic

        if (key !== RefKey && isRef(value)) {
          return value.value;
        } else {
          return value;
        }
      },
      set: function setterHandler(newVal) {
        if (getter && !setter) return;
        var value = getter ? getter.call(target) : val; // If the key is equal to RefKey, skip the unwrap logic
        // If and only if "value" is ref and "newVal" is not a ref,
        // the assignment should be proxied to "value" ref.

        if (key !== RefKey && isRef(value) && !isRef(newVal)) {
          value.value = newVal;
        } else if (setter) {
          setter.call(target, newVal);
        } else if (isRef(newVal)) {
          val = newVal;
        }

        setupAccessControl(newVal);
      }
    });
  }

  function observe(obj) {
    var Vue = getCurrentVue();
    var observed;

    if (Vue.observable) {
      observed = Vue.observable(obj);
    } else {
      var vm = createComponentInstance(Vue, {
        data: {
          $$state: obj
        }
      });
      observed = vm._data.$$state;
    }

    return observed;
  }
  /**
   * Make obj reactivity
   */


  function reactive(obj) {
    if (!obj) {
      warn('"reactive()" is called without provide an "object".'); // @ts-ignore

      return;
    }

    if (!isPlainObject(obj) || isReactive(obj) || isNonReactive(obj) || !Object.isExtensible(obj)) {
      return obj;
    }

    var observed = observe(obj);
    def(observed, ReactiveIdentifierKey, ReactiveIdentifier);
    setupAccessControl(observed);
    return observed;
  }
  /**
   * Make sure obj can't be a reactive
   */


  function nonReactive(obj) {
    if (!isPlainObject(obj)) {
      return obj;
    } // set the vue observable flag at obj


    obj.__ob__ = observe({}).__ob__; // mark as nonReactive

    def(obj, NonReactiveIdentifierKey, NonReactiveIdentifier);
    return obj;
  }

  function isUndef(v) {
    return v === undefined || v === null;
  }

  function isPrimitive(value) {
    return typeof value === 'string' || typeof value === 'number' || // $flow-disable-line
    _typeof(value) === 'symbol' || typeof value === 'boolean';
  }

  function isValidArrayIndex(val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val);
  }
  /**
   * Set a property on an object. Adds the new property, triggers change
   * notification and intercept it's subsequent access if the property doesn't
   * already exist.
   */


  function set(target, key, val) {
    var Vue = getCurrentVue();
    var _a = Vue.util,
        warn = _a.warn,
        defineReactive = _a.defineReactive;

    if (isUndef(target) || isPrimitive(target)) {
      warn("Cannot set reactive property on undefined, null, or primitive value: " + target);
    }

    if (isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }

    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val;
    }

    var ob = target.__ob__;

    if (target._isVue || ob && ob.vmCount) {
      warn('Avoid adding reactive properties to a Vue instance or its root $data ' + 'at runtime - declare it upfront in the data option.');
      return val;
    }

    if (!ob) {
      target[key] = val;
      return val;
    }

    defineReactive(ob.value, key, val); // IMPORTANT: define access control before trigger watcher

    defineAccessControl(target, key, val);
    ob.dep.notify();
    return val;
  }
  /**
   * Helper that recursively merges two data objects together.
   */


  function mergeData(to, from) {
    if (!from) return to;
    var key;
    var toVal;
    var fromVal;
    var keys = hasSymbol ? Reflect.ownKeys(from) : Object.keys(from);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i]; // in case the object is already observed...

      if (key === '__ob__') continue;
      toVal = to[key];
      fromVal = from[key];

      if (!hasOwn(to, key)) {
        to[key] = fromVal;
      } else if (toVal !== fromVal && isPlainObject(toVal) && !isRef(toVal) && isPlainObject(fromVal) && !isRef(toVal)) {
        mergeData(toVal, fromVal);
      }
    }

    return to;
  }

  function install(Vue, _install) {
    if (currentVue && currentVue === Vue) {
      {
        assert(false, 'already installed. Vue.use(plugin) should be called only once');
      }
      return;
    }

    Vue.config.optionMergeStrategies.setup = function (parent, child) {
      return function mergedSetupFn(props, context) {
        return mergeData(typeof child === 'function' ? child(props, context) || {} : {}, typeof parent === 'function' ? parent(props, context) || {} : {});
      };
    };

    setCurrentVue(Vue);

    _install(Vue);
  }
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0
  
  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.
  
  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */


  var _assign = function __assign() {
    _assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }

      return t;
    };

    return _assign.apply(this, arguments);
  };

  function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
        r,
        ar = [],
        e;

    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
        ar.push(r.value);
      }
    } catch (error) {
      e = {
        error: error
      };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }

    return ar;
  }

  function set$1(vm, key, value) {
    var state = vm.__secret_vfa_state__ = vm.__secret_vfa_state__ || {};
    state[key] = value;
  }

  function get(vm, key) {
    return (vm.__secret_vfa_state__ || {})[key];
  }

  var vmStateManager = {
    set: set$1,
    get: get
  };

  function asVmProperty(vm, propName, propValue) {
    var props = vm.$options.props;

    if (!(propName in vm) && !(props && hasOwn(props, propName))) {
      proxy(vm, propName, {
        get: function get() {
          return propValue.value;
        },
        set: function set(val) {
          propValue.value = val;
        }
      });
      {
        // expose binding to Vue Devtool as a data property
        // delay this until state has been resolved to prevent repeated works
        vm.$nextTick(function () {
          proxy(vm._data, propName, {
            get: function get() {
              return propValue.value;
            },
            set: function set(val) {
              propValue.value = val;
            }
          });
        });
      }
    } else {
      if (props && hasOwn(props, propName)) {
        warn("The setup binding property \"" + propName + "\" is already declared as a prop.", vm);
      } else {
        warn("The setup binding property \"" + propName + "\" is already declared.", vm);
      }
    }
  }

  function updateTemplateRef(vm) {
    var rawBindings = vmStateManager.get(vm, 'rawBindings') || {};
    if (!rawBindings || !Object.keys(rawBindings).length) return;
    var refs = vm.$refs;
    var oldRefKeys = vmStateManager.get(vm, 'refs') || [];

    for (var index = 0; index < oldRefKeys.length; index++) {
      var key = oldRefKeys[index];

      if (!refs[key]) {
        rawBindings[key].value = null;
      }
    }

    var newKeys = Object.keys(refs);
    var validNewKeys = [];

    for (var index = 0; index < newKeys.length; index++) {
      var key = newKeys[index];
      var setupValue = rawBindings[key];

      if (refs[key] && setupValue && isRef(setupValue)) {
        setupValue.value = refs[key];
        validNewKeys.push(key);
      }
    }

    vmStateManager.set(vm, 'refs', validNewKeys);
  }

  function activateCurrentInstance(vm, fn, onError) {
    var preVm = getCurrentVM();
    setCurrentVM(vm);

    try {
      return fn(vm);
    } catch (err) {
      if (onError) {
        onError(err);
      } else {
        throw err;
      }
    } finally {
      setCurrentVM(preVm);
    }
  }

  function mixin(Vue) {
    Vue.mixin({
      beforeCreate: functionApiInit,
      mounted: function mounted() {
        updateTemplateRef(this);
      },
      updated: function updated() {
        updateTemplateRef(this);
      }
    });
    /**
     * Vuex init hook, injected into each instances init hooks list.
     */

    function functionApiInit() {
      var vm = this;
      var $options = vm.$options;
      var setup = $options.setup,
          render = $options.render;

      if (render) {
        // keep currentInstance accessible for createElement
        $options.render = function () {
          var _this = this;

          var args = [];

          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }

          return activateCurrentInstance(vm, function () {
            return render.apply(_this, args);
          });
        };
      }

      if (!setup) {
        return;
      }

      if (typeof setup !== 'function') {
        {
          warn('The "setup" option should be a function that returns a object in component definitions.', vm);
        }
        return;
      }

      var data = $options.data; // wrapper the data option, so we can invoke setup before data get resolved

      $options.data = function wrappedData() {
        initSetup(vm, vm.$props);
        return typeof data === 'function' ? data.call(vm, vm) : data || {};
      };
    }

    function initSetup(vm, props) {
      if (props === void 0) {
        props = {};
      }

      var setup = vm.$options.setup;
      var ctx = createSetupContext(vm);
      var binding;
      activateCurrentInstance(vm, function () {
        binding = setup(props, ctx);
      });
      if (!binding) return;

      if (isFunction(binding)) {
        // keep typescript happy with the binding type.
        var bindingFunc_1 = binding; // keep currentInstance accessible for createElement

        vm.$options.render = function () {
          return activateCurrentInstance(vm, function (vm_) {
            return bindingFunc_1(vm_.$props, ctx);
          });
        };

        return;
      }

      if (isPlainObject(binding)) {
        var bindingObj_1 = binding;
        vmStateManager.set(vm, 'rawBindings', binding);
        Object.keys(binding).forEach(function (name) {
          var bindingValue = bindingObj_1[name]; // only make primitive value reactive

          if (!isRef(bindingValue)) {
            if (isReactive(bindingValue)) {
              bindingValue = ref(bindingValue);
            } else {
              // a non-reactive should not don't get reactivity
              bindingValue = ref(nonReactive(bindingValue));
            }
          }

          asVmProperty(vm, name, bindingValue);
        });
        return;
      }

      {
        assert(false, "\"setup\" must return a \"Object\" or a \"Function\", got \"" + Object.prototype.toString.call(binding).slice(8, -1) + "\"");
      }
    }

    function createSetupContext(vm) {
      var ctx = {};
      var props = ['root', 'parent', 'refs', ['slots', 'scopedSlots'], 'attrs'];
      var methodReturnVoid = ['emit'];
      props.forEach(function (key) {
        var _a;

        var targetKey;
        var srcKey;

        if (Array.isArray(key)) {
          _a = __read(key, 2), targetKey = _a[0], srcKey = _a[1];
        } else {
          targetKey = srcKey = key;
        }

        srcKey = "$" + srcKey;
        proxy(ctx, targetKey, {
          get: function get() {
            return vm[srcKey];
          },
          set: function set() {
            warn("Cannot assign to '" + targetKey + "' because it is a read-only property", vm);
          }
        });
      });
      methodReturnVoid.forEach(function (key) {
        var srcKey = "$" + key;
        proxy(ctx, key, {
          get: function get() {
            return function () {
              var args = [];

              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }

              var fn = vm[srcKey];
              fn.apply(vm, args);
            };
          }
        });
      });
      return ctx;
    }
  }

  var fallbackCreateElement;

  var createElement = function createElement() {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    if (!currentVM) {
      warn('`createElement()` has been called outside of render function.');

      if (!fallbackCreateElement) {
        fallbackCreateElement = createComponentInstance(getCurrentVue()).$createElement;
      }

      return fallbackCreateElement.apply(fallbackCreateElement, args);
    }

    return currentVM.$createElement.apply(currentVM, args);
  }; // implementation, close to no-op


  function createComponent(options) {
    return options;
  }

  var genName = function genName(name) {
    return "on" + (name[0].toUpperCase() + name.slice(1));
  };

  function createLifeCycle(lifeCyclehook) {
    return function (callback) {
      var vm = ensureCurrentVMInFn(genName(lifeCyclehook));
      injectHookOption(getCurrentVue(), vm, lifeCyclehook, callback);
    };
  }

  function createLifeCycles(lifeCyclehooks, name) {
    return function (callback) {
      var currentVue = getCurrentVue();
      var vm = ensureCurrentVMInFn(name);
      lifeCyclehooks.forEach(function (lifeCyclehook) {
        return injectHookOption(currentVue, vm, lifeCyclehook, callback);
      });
    };
  }

  function injectHookOption(Vue, vm, hook, val) {
    var options = vm.$options;
    var mergeFn = Vue.config.optionMergeStrategies[hook];
    options[hook] = mergeFn(options[hook], val);
  } // export const onCreated = createLifeCycle('created');


  var onBeforeMount = createLifeCycle('beforeMount');
  var onMounted = createLifeCycle('mounted');
  var onBeforeUpdate = createLifeCycle('beforeUpdate');
  var onUpdated = createLifeCycle('updated');
  var onBeforeUnmount = createLifeCycle('beforeDestroy'); // only one event will be fired between destroyed and deactivated when an unmount occurs

  var onUnmounted = createLifeCycles(['destroyed', 'deactivated'], genName('unmounted'));
  var onErrorCaptured = createLifeCycle('errorCaptured');
  var onActivated = createLifeCycle('activated');
  var onDeactivated = createLifeCycle('deactivated');
  var fallbackVM;

  function flushPreQueue() {
    flushQueue(this, WatcherPreFlushQueueKey);
  }

  function flushPostQueue() {
    flushQueue(this, WatcherPostFlushQueueKey);
  }

  function hasWatchEnv(vm) {
    return vm[WatcherPreFlushQueueKey] !== undefined;
  }

  function installWatchEnv(vm) {
    vm[WatcherPreFlushQueueKey] = [];
    vm[WatcherPostFlushQueueKey] = [];
    vm.$on('hook:beforeUpdate', flushPreQueue);
    vm.$on('hook:updated', flushPostQueue);
  }

  function flushQueue(vm, key) {
    var queue = vm[key];

    for (var index = 0; index < queue.length; index++) {
      queue[index]();
    }

    queue.length = 0;
  }

  function queueFlushJob(vm, fn, mode) {
    // flush all when beforeUpdate and updated are not fired
    var fallbackFlush = function fallbackFlush() {
      vm.$nextTick(function () {
        if (vm[WatcherPreFlushQueueKey].length) {
          flushQueue(vm, WatcherPreFlushQueueKey);
        }

        if (vm[WatcherPostFlushQueueKey].length) {
          flushQueue(vm, WatcherPostFlushQueueKey);
        }
      });
    };

    switch (mode) {
      case 'pre':
        fallbackFlush();
        vm[WatcherPreFlushQueueKey].push(fn);
        break;

      case 'post':
        fallbackFlush();
        vm[WatcherPostFlushQueueKey].push(fn);
        break;

      default:
        assert(false, "flush must be one of [\"post\", \"pre\", \"sync\"], but got " + mode);
        break;
    }
  }

  function createWatcher(vm, source, cb, options) {
    var flushMode = options.flush;
    var cleanup;

    var registerCleanup = function registerCleanup(fn) {
      cleanup = function cleanup() {
        try {
          fn();
        } catch (error) {
          logError(error, vm, 'onCleanup()');
        }
      };
    }; // effect watch


    if (cb === null) {
      var getter_1 = function getter_1() {
        return source(registerCleanup);
      }; // cleanup before running getter again


      var runBefore_1 = function runBefore_1() {
        if (cleanup) {
          cleanup();
        }
      };

      if (flushMode === 'sync') {
        return vm.$watch(getter_1, noopFn, {
          immediate: true,
          deep: options.deep,
          // @ts-ignore
          sync: true,
          before: runBefore_1
        });
      }

      var stopRef_1;
      var hasEnded_1 = false;

      var doWatch = function doWatch() {
        if (hasEnded_1) return;
        stopRef_1 = vm.$watch(getter_1, noopFn, {
          immediate: false,
          deep: options.deep,
          // @ts-ignore
          before: runBefore_1
        });
      };
      /* without a current active instance, ignore pre|post mode */


      if (vm === fallbackVM) {
        vm.$nextTick(doWatch);
      } else {
        queueFlushJob(vm, doWatch, flushMode);
      }

      return function () {
        hasEnded_1 = true;
        stopRef_1 && stopRef_1();
      };
    }

    var getter;

    if (Array.isArray(source)) {
      getter = function getter() {
        return source.map(function (s) {
          return isRef(s) ? s.value : s();
        });
      };
    } else if (isRef(source)) {
      getter = function getter() {
        return source.value;
      };
    } else {
      getter = source;
    }

    var applyCb = function applyCb(n, o) {
      // cleanup before running cb again
      if (cleanup) {
        cleanup();
      }

      cb(n, o, registerCleanup);
    };

    var callback = flushMode === 'sync' ||
    /* without a current active instance, ignore pre|post mode */
    vm === fallbackVM ? applyCb : function (n, o) {
      return queueFlushJob(vm, function () {
        applyCb(n, o);
      }, flushMode);
    }; // `shiftCallback` is used to handle dirty sync effect.
    // The subsequent callbacks will redirect to `callback`.

    var _shiftCallback = function shiftCallback(n, o) {
      _shiftCallback = callback;
      applyCb(n, o);
    };

    return vm.$watch(getter, options.lazy ? callback : _shiftCallback, {
      immediate: !options.lazy,
      deep: options.deep,
      // @ts-ignore
      sync: flushMode === 'sync'
    });
  }

  function watch(source, cb, options) {
    var callback = null;

    if (typeof cb === 'function') {
      // source watch
      callback = cb;
    } else {
      // effect watch
      options = cb;
      callback = null;
    }

    var opts = _assign({
      lazy: false,
      deep: false,
      flush: 'post'
    }, options);

    var vm = getCurrentVM();

    if (!vm) {
      if (!fallbackVM) {
        fallbackVM = createComponentInstance(getCurrentVue());
      }

      vm = fallbackVM;
    } else if (!hasWatchEnv(vm)) {
      installWatchEnv(vm);
    }

    return createWatcher(vm, source, callback, opts);
  } // implement


  function computed(options) {
    var vm = getCurrentVM();

    var get, _set;

    if (typeof options === 'function') {
      get = options;
    } else {
      get = options.get;
      _set = options.set;
    }

    var computedHost = createComponentInstance(getCurrentVue(), {
      computed: {
        $$state: {
          get: get,
          set: _set
        }
      }
    });
    return createRef({
      get: function get() {
        return computedHost.$$state;
      },
      set: function set(v) {
        if (!_set) {
          warn('Computed property was assigned to but it has no setter.', vm);
          return;
        }

        computedHost.$$state = v;
      }
    });
  }

  var NOT_FOUND = {};

  function resolveInject(provideKey, vm) {
    var source = vm;

    while (source) {
      // @ts-ignore
      if (source._provided && hasOwn(source._provided, provideKey)) {
        //@ts-ignore
        return source._provided[provideKey];
      }

      source = source.$parent;
    }

    return NOT_FOUND;
  }

  function provide(key, value) {
    var vm = ensureCurrentVMInFn('provide');

    if (!vm._provided) {
      var provideCache_1 = {};
      Object.defineProperty(vm, '_provided', {
        get: function get() {
          return provideCache_1;
        },
        set: function set(v) {
          return Object.assign(provideCache_1, v);
        }
      });
    }

    vm._provided[key] = value;
  }

  function inject(key, defaultValue) {
    if (!key) {
      return defaultValue;
    }

    var vm = ensureCurrentVMInFn('inject');
    var val = resolveInject(key, vm);

    if (val !== NOT_FOUND) {
      return val;
    } else if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      warn("Injection \"" + String(key) + "\" not found", vm);
    }
  }

  var _install = function _install(Vue) {
    return install(Vue, mixin);
  };

  var plugin = {
    install: _install
  }; // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,

  if (currentVue && typeof window !== 'undefined' && window.Vue) {
    _install(window.Vue);
  }

  exports.computed = computed;
  exports.createComponent = createComponent;
  exports.createElement = createElement;
  exports.default = plugin;
  exports.inject = inject;
  exports.isRef = isRef;
  exports.onActivated = onActivated;
  exports.onBeforeMount = onBeforeMount;
  exports.onBeforeUnmount = onBeforeUnmount;
  exports.onBeforeUpdate = onBeforeUpdate;
  exports.onDeactivated = onDeactivated;
  exports.onErrorCaptured = onErrorCaptured;
  exports.onMounted = onMounted;
  exports.onUnmounted = onUnmounted;
  exports.onUpdated = onUpdated;
  exports.provide = provide;
  exports.reactive = reactive;
  exports.ref = ref;
  exports.set = set;
  exports.toRefs = toRefs;
  exports.watch = watch;
});
var VueCompositionApi = unwrapExports(vueCompositionApi);
var vueCompositionApi_1 = vueCompositionApi.computed;
var vueCompositionApi_2 = vueCompositionApi.createComponent;
var vueCompositionApi_3 = vueCompositionApi.createElement;
var vueCompositionApi_4 = vueCompositionApi.inject;
var vueCompositionApi_5 = vueCompositionApi.isRef;
var vueCompositionApi_6 = vueCompositionApi.onActivated;
var vueCompositionApi_7 = vueCompositionApi.onBeforeMount;
var vueCompositionApi_8 = vueCompositionApi.onBeforeUnmount;
var vueCompositionApi_9 = vueCompositionApi.onBeforeUpdate;
var vueCompositionApi_10 = vueCompositionApi.onDeactivated;
var vueCompositionApi_11 = vueCompositionApi.onErrorCaptured;
var vueCompositionApi_12 = vueCompositionApi.onMounted;
var vueCompositionApi_13 = vueCompositionApi.onUnmounted;
var vueCompositionApi_14 = vueCompositionApi.onUpdated;
var vueCompositionApi_15 = vueCompositionApi.provide;
var vueCompositionApi_16 = vueCompositionApi.reactive;
var vueCompositionApi_17 = vueCompositionApi.ref;
var vueCompositionApi_18 = vueCompositionApi.set;
var vueCompositionApi_19 = vueCompositionApi.toRefs;
var vueCompositionApi_20 = vueCompositionApi.watch;

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

var Component = vueCompositionApi_2({
  setup: function setup(props, context) {
    var pending = vueCompositionApi_17(true);
    var uid = vueCompositionApi_17(0);
    var ins;
    vueCompositionApi_12(function () {
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
        hide: function hide() {
          context.emit('hide');
        }
      });
    });
    vueCompositionApi_8(function () {
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

    vueCompositionApi_20(function () {
      return props.defaultKey;
    }, function (val) {
      if (val && val.length) {
        if (pending.value) {
          _vue.default.nextTick(function () {
            ins.setKey(props.defaultKey);
          });
        } else {
          ins.setKey(props.defaultKey);
        }
      }
    });
    vueCompositionApi_20(function () {
      return props.defaultValue;
    }, function (val) {
      if (val && val.length) {
        if (pending.value) {
          _vue.default.nextTick(function () {
            ins.setValue(props.defaultValue);
          });
        } else {
          ins.setValue(props.defaultValue);
        }
      }
    });
    vueCompositionApi_20(function () {
      return props.visible;
    }, function (val) {
      if (val) {
        if (pending.value) {
          _vue.default.nextTick(function () {
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
    vueCompositionApi_20(function () {
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
    vueCompositionApi_20(function () {
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
    vueCompositionApi_20(function () {
      return props.index;
    }, function (val) {
      setIndex(val);
    }, {
      lazy: true
    });
    vueCompositionApi_20(function () {
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
var index = {
  install: function install(Vue, options) {
    if (options === void 0) {
      options = {};
    }

    Vue.use(VueCompositionApi);
    Vue.component(options.name || 'QSelect', Component);
  }
};
var _default2 = index;
exports.default = _default2;