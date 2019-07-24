(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}(function () { 'use strict';

  /*!
   * Vue.js v2.6.10
   * (c) 2014-2019 Evan You
   * Released under the MIT License.
   */
  /*  */

  var emptyObject = Object.freeze({});

  // These helpers produce better VM code in JS engines due to their
  // explicitness and function inlining.
  function isUndef (v) {
    return v === undefined || v === null
  }

  function isDef (v) {
    return v !== undefined && v !== null
  }

  function isTrue (v) {
    return v === true
  }

  function isFalse (v) {
    return v === false
  }

  /**
   * Check if value is primitive.
   */
  function isPrimitive (value) {
    return (
      typeof value === 'string' ||
      typeof value === 'number' ||
      // $flow-disable-line
      typeof value === 'symbol' ||
      typeof value === 'boolean'
    )
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Get the raw type string of a value, e.g., [object Object].
   */
  var _toString = Object.prototype.toString;

  function toRawType (value) {
    return _toString.call(value).slice(8, -1)
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  function isPlainObject (obj) {
    return _toString.call(obj) === '[object Object]'
  }

  function isRegExp (v) {
    return _toString.call(v) === '[object RegExp]'
  }

  /**
   * Check if val is a valid array index.
   */
  function isValidArrayIndex (val) {
    var n = parseFloat(String(val));
    return n >= 0 && Math.floor(n) === n && isFinite(val)
  }

  function isPromise (val) {
    return (
      isDef(val) &&
      typeof val.then === 'function' &&
      typeof val.catch === 'function'
    )
  }

  /**
   * Convert a value to a string that is actually rendered.
   */
  function toString (val) {
    return val == null
      ? ''
      : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert an input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Check if an attribute is a reserved attribute.
   */
  var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

  /**
   * Remove an item from an array.
   */
  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether an object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    var cache = Object.create(null);
    return (function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    })
  }

  /**
   * Camelize a hyphen-delimited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /\B([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str.replace(hyphenateRE, '-$1').toLowerCase()
  });

  /**
   * Simple bind polyfill for environments that do not support it,
   * e.g., PhantomJS 1.x. Technically, we don't need this anymore
   * since native bind is now performant enough in most browsers.
   * But removing it would mean breaking code that was able to run in
   * PhantomJS 1.x, so this must be kept for backward compatibility.
   */

  /* istanbul ignore next */
  function polyfillBind (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }

    boundFn._length = fn.length;
    return boundFn
  }

  function nativeBind (fn, ctx) {
    return fn.bind(ctx)
  }

  var bind = Function.prototype.bind
    ? nativeBind
    : polyfillBind;

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /* eslint-disable no-unused-vars */

  /**
   * Perform no operation.
   * Stubbing args to make Flow happy without leaving useless transpiled code
   * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
   */
  function noop (a, b, c) {}

  /**
   * Always return false.
   */
  var no = function (a, b, c) { return false; };

  /* eslint-enable no-unused-vars */

  /**
   * Return the same value.
   */
  var identity = function (_) { return _; };

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (a instanceof Date && b instanceof Date) {
          return a.getTime() === b.getTime()
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  /**
   * Return the first index at which a loosely equal value can be
   * found in the array (if value is a plain object, the array must
   * contain an object of the same shape), or -1 if it is not present.
   */
  function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /**
   * Ensure a function is called only once.
   */
  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn.apply(this, arguments);
      }
    }
  }

  var SSR_ATTR = 'data-server-rendered';

  var ASSET_TYPES = [
    'component',
    'directive',
    'filter'
  ];

  var LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
  ];

  /*  */



  var config = ({
    /**
     * Option merge strategies (used in core/util/options)
     */
    // $flow-disable-line
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Show production mode tip message on boot?
     */
    productionTip: "production" !== 'production',

    /**
     * Whether to enable devtools
     */
    devtools: "production" !== 'production',

    /**
     * Whether to record perf
     */
    performance: false,

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Warn handler for watcher warns
     */
    warnHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: [],

    /**
     * Custom user key aliases for v-on
     */
    // $flow-disable-line
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if an attribute is reserved so that it cannot be used as a component
     * prop. This is platform-dependent and may be overwritten.
     */
    isReservedAttr: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Parse the real tag name for the specific platform.
     */
    parsePlatformTagName: identity,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * Perform updates asynchronously. Intended to be used by Vue Test Utils
     * This will significantly reduce performance if set to false.
     */
    async: true,

    /**
     * Exposed for legacy reasons
     */
    _lifecycleHooks: LIFECYCLE_HOOKS
  });

  /*  */

  /**
   * unicode letters used for parsing html tags, component names and property paths.
   * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
   * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
   */
  var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    }
    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) { return }
        obj = obj[segments[i]];
      }
      return obj
    }
  }

  /*  */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser = typeof window !== 'undefined';
  var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
  var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
  var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
  var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
  var isPhantomJS = UA && /phantomjs/.test(UA);
  var isFF = UA && UA.match(/firefox\/(\d+)/);

  // Firefox has a "watch" function on Object.prototype...
  var nativeWatch = ({}).watch;

  var supportsPassive = false;
  if (inBrowser) {
    try {
      var opts = {};
      Object.defineProperty(opts, 'passive', ({
        get: function get () {
          /* istanbul ignore next */
          supportsPassive = true;
        }
      })); // https://github.com/facebook/flow/issues/285
      window.addEventListener('test-passive', null, opts);
    } catch (e) {}
  }

  // this needs to be lazy-evaled because vue may be required before
  // vue-server-renderer can set VUE_ENV
  var _isServer;
  var isServerRendering = function () {
    if (_isServer === undefined) {
      /* istanbul ignore if */
      if (!inBrowser && !inWeex && typeof global !== 'undefined') {
        // detect presence of vue-server-renderer and avoid
        // Webpack shimming the process
        _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
      } else {
        _isServer = false;
      }
    }
    return _isServer
  };

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
  }

  var hasSymbol =
    typeof Symbol !== 'undefined' && isNative(Symbol) &&
    typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

  var _Set;
  /* istanbul ignore if */ // $flow-disable-line
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = /*@__PURE__*/(function () {
      function Set () {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has (key) {
        return this.set[key] === true
      };
      Set.prototype.add = function add (key) {
        this.set[key] = true;
      };
      Set.prototype.clear = function clear () {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */

  var warn = noop;

  /*  */

  var uid = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stabilize the subscriber list first
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // The current target watcher being evaluated.
  // This is globally unique because only one watcher
  // can be evaluated at a time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (target) {
    targetStack.push(target);
    Dep.target = target;
  }

  function popTarget () {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
  }

  /*  */

  var VNode = function VNode (
    tag,
    data,
    children,
    text,
    elm,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  };

  var prototypeAccessors = { child: { configurable: true } };

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  prototypeAccessors.child.get = function () {
    return this.componentInstance
  };

  Object.defineProperties( VNode.prototype, prototypeAccessors );

  var createEmptyVNode = function (text) {
    if ( text === void 0 ) text = '';

    var node = new VNode();
    node.text = text;
    node.isComment = true;
    return node
  };

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      // #7975
      // clone children array to avoid mutating original in case of cloning
      // a child.
      vnode.children && vnode.children.slice(),
      vnode.text,
      vnode.elm,
      vnode.context,
      vnode.componentOptions,
      vnode.asyncFactory
    );
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isComment = vnode.isComment;
    cloned.fnContext = vnode.fnContext;
    cloned.fnOptions = vnode.fnOptions;
    cloned.fnScopeId = vnode.fnScopeId;
    cloned.asyncMeta = vnode.asyncMeta;
    cloned.isCloned = true;
    return cloned
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);

  var methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ];

  /**
   * Intercept mutating methods and emit events
   */
  methodsToPatch.forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * In some cases we may want to disable observation inside a component's
   * update computation.
   */
  var shouldObserve = true;

  function toggleObserving (value) {
    shouldObserve = value;
  }

  /**
   * Observer class that is attached to each observed
   * object. Once attached, the observer converts the target
   * object's property keys into getter/setters that
   * collect dependencies and dispatch updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment a target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment a target Object or Array by defining
   * hidden properties.
   */
  /* istanbul ignore next */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value, asRootData) {
    if (!isObject(value) || value instanceof VNode) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      shouldObserve &&
      !isServerRendering() &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    if (asRootData && ob) {
      ob.vmCount++;
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;
    if ((!getter || setter) && arguments.length === 2) {
      val = obj[key];
    }

    var childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        /* eslint-disable no-self-compare */
        if (newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        // #7981: for accessor properties without setter
        if (getter && !setter) { return }
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = !shallow && observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (target, key, val) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val
    }
    if (key in target && !(key in Object.prototype)) {
      target[key] = val;
      return val
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      return val
    }
    if (!ob) {
      target[key] = val;
      return val
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (target, key) {
    if (Array.isArray(target) && isValidArrayIndex(key)) {
      target.splice(key, 1);
      return
    }
    var ob = (target).__ob__;
    if (target._isVue || (ob && ob.vmCount)) {
      return
    }
    if (!hasOwn(target, key)) {
      return
    }
    delete target[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    if (!from) { return to }
    var key, toVal, fromVal;

    var keys = hasSymbol
      ? Reflect.ownKeys(from)
      : Object.keys(from);

    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      // in case the object is already observed...
      if (key === '__ob__') { continue }
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (
        toVal !== fromVal &&
        isPlainObject(toVal) &&
        isPlainObject(fromVal)
      ) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  function mergeDataOrFn (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          typeof childVal === 'function' ? childVal.call(this, this) : childVal,
          typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
        )
      }
    } else {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm, vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm, vm)
          : parentVal;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  }

  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      if (childVal && typeof childVal !== 'function') {

        return parentVal
      }
      return mergeDataOrFn(parentVal, childVal)
    }

    return mergeDataOrFn(parentVal, childVal, vm)
  };

  /**
   * Hooks and props are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    var res = childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal;
    return res
      ? dedupeHooks(res)
      : res
  }

  function dedupeHooks (hooks) {
    var res = [];
    for (var i = 0; i < hooks.length; i++) {
      if (res.indexOf(hooks[i]) === -1) {
        res.push(hooks[i]);
      }
    }
    return res
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (
    parentVal,
    childVal,
    vm,
    key
  ) {
    var res = Object.create(parentVal || null);
    if (childVal) {
      return extend(res, childVal)
    } else {
      return res
    }
  }

  ASSET_TYPES.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
    /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.inject =
  strats.computed = function (
    parentVal,
    childVal,
    vm,
    key
  ) {
    if (childVal && "production" !== 'production') {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = Object.create(null);
    extend(ret, parentVal);
    if (childVal) { extend(ret, childVal); }
    return ret
  };
  strats.provide = mergeDataOrFn;

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options, vm) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        }
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    }
    options.props = res;
  }

  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject (options, vm) {
    var inject = options.inject;
    if (!inject) { return }
    var normalized = options.inject = {};
    if (Array.isArray(inject)) {
      for (var i = 0; i < inject.length; i++) {
        normalized[inject[i]] = { from: inject[i] };
      }
    } else if (isPlainObject(inject)) {
      for (var key in inject) {
        var val = inject[key];
        normalized[key] = isPlainObject(val)
          ? extend({ from: key }, val)
          : { from: val };
      }
    }
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def$$1 = dirs[key];
        if (typeof def$$1 === 'function') {
          dirs[key] = { bind: def$$1, update: def$$1 };
        }
      }
    }
  }

  function assertObjectType (name, value, vm) {
    if (!isPlainObject(value)) {
      warn(
        "Invalid value for option \"" + name + "\": expected an Object, " +
        "but got " + (toRawType(value)) + ".",
        vm
      );
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {

    if (typeof child === 'function') {
      child = child.options;
    }

    normalizeProps(child, vm);
    normalizeInject(child, vm);
    normalizeDirectives(child);

    // Apply extends and mixins on the child options,
    // but only if it is a raw options object that isn't
    // the result of another mergeOptions call.
    // Only merged options has the _base property.
    if (!child._base) {
      if (child.extends) {
        parent = mergeOptions(parent, child.extends, vm);
      }
      if (child.mixins) {
        for (var i = 0, l = child.mixins.length; i < l; i++) {
          parent = mergeOptions(parent, child.mixins[i], vm);
        }
      }
    }

    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    var assets = options[type];
    // check local registration variations first
    if (hasOwn(assets, id)) { return assets[id] }
    var camelizedId = camelize(id);
    if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
    var PascalCaseId = capitalize(camelizedId);
    if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
    // fallback to prototype chain
    var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
    return res
  }

  /*  */



  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // boolean casting
    var booleanIndex = getTypeIndex(Boolean, prop.type);
    if (booleanIndex > -1) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        // only cast empty string / same name to boolean if
        // boolean has higher priority
        var stringIndex = getTypeIndex(String, prop.type);
        if (stringIndex < 0 || booleanIndex < stringIndex) {
          value = true;
        }
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldObserve = shouldObserve;
      toggleObserving(true);
      observe(value);
      toggleObserving(prevShouldObserve);
    }
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm._props[key] !== undefined
    ) {
      return vm._props[key]
    }
    // call factory function for non-Function types
    // a value is Function if its prototype is function even across different execution context
    return typeof def === 'function' && getType(prop.type) !== 'Function'
      ? def.call(vm)
      : def
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match ? match[1] : ''
  }

  function isSameType (a, b) {
    return getType(a) === getType(b)
  }

  function getTypeIndex (type, expectedTypes) {
    if (!Array.isArray(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1
    }
    for (var i = 0, len = expectedTypes.length; i < len; i++) {
      if (isSameType(expectedTypes[i], type)) {
        return i
      }
    }
    return -1
  }

  /*  */

  function handleError (err, vm, info) {
    // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
    // See: https://github.com/vuejs/vuex/issues/1505
    pushTarget();
    try {
      if (vm) {
        var cur = vm;
        while ((cur = cur.$parent)) {
          var hooks = cur.$options.errorCaptured;
          if (hooks) {
            for (var i = 0; i < hooks.length; i++) {
              try {
                var capture = hooks[i].call(cur, err, vm, info) === false;
                if (capture) { return }
              } catch (e) {
                globalHandleError(e, cur, 'errorCaptured hook');
              }
            }
          }
        }
      }
      globalHandleError(err, vm, info);
    } finally {
      popTarget();
    }
  }

  function invokeWithErrorHandling (
    handler,
    context,
    args,
    vm,
    info
  ) {
    var res;
    try {
      res = args ? handler.apply(context, args) : handler.call(context);
      if (res && !res._isVue && isPromise(res) && !res._handled) {
        res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
        // issue #9511
        // avoid catch triggering multiple times when nested calls
        res._handled = true;
      }
    } catch (e) {
      handleError(e, vm, info);
    }
    return res
  }

  function globalHandleError (err, vm, info) {
    if (config.errorHandler) {
      try {
        return config.errorHandler.call(null, err, vm, info)
      } catch (e) {
        // if the user intentionally throws the original error in the handler,
        // do not log it twice
        if (e !== err) {
          logError(e, null, 'config.errorHandler');
        }
      }
    }
    logError(err, vm, info);
  }

  function logError (err, vm, info) {
    /* istanbul ignore else */
    if ((inBrowser || inWeex) && typeof console !== 'undefined') {
      console.error(err);
    } else {
      throw err
    }
  }

  /*  */

  var isUsingMicroTask = false;

  var callbacks = [];
  var pending = false;

  function flushCallbacks () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }

  // Here we have async deferring wrappers using microtasks.
  // In 2.5 we used (macro) tasks (in combination with microtasks).
  // However, it has subtle problems when state is changed right before repaint
  // (e.g. #6813, out-in transitions).
  // Also, using (macro) tasks in event handler would cause some weird behaviors
  // that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
  // So we now use microtasks everywhere, again.
  // A major drawback of this tradeoff is that there are some scenarios
  // where microtasks have too high a priority and fire in between supposedly
  // sequential events (e.g. #4521, #6690, which have workarounds)
  // or even between bubbling of the same event (#6566).
  var timerFunc;

  // The nextTick behavior leverages the microtask queue, which can be accessed
  // via either native Promise.then or MutationObserver.
  // MutationObserver has wider support, however it is seriously bugged in
  // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
  // completely stops working after triggering a few times... so, if native
  // Promise is available, we will use it:
  /* istanbul ignore next, $flow-disable-line */
  if (typeof Promise !== 'undefined' && isNative(Promise)) {
    var p = Promise.resolve();
    timerFunc = function () {
      p.then(flushCallbacks);
      // In problematic UIWebViews, Promise.then doesn't completely break, but
      // it can get stuck in a weird state where callbacks are pushed into the
      // microtask queue but the queue isn't being flushed, until the browser
      // needs to do some other work, e.g. handle a timer. Therefore we can
      // "force" the microtask queue to be flushed by adding an empty timer.
      if (isIOS) { setTimeout(noop); }
    };
    isUsingMicroTask = true;
  } else if (!isIE && typeof MutationObserver !== 'undefined' && (
    isNative(MutationObserver) ||
    // PhantomJS and iOS 7.x
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  )) {
    // Use MutationObserver where native Promise is not available,
    // e.g. PhantomJS, iOS7, Android 4.4
    // (#6466 MutationObserver is unreliable in IE11)
    var counter = 1;
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(String(counter));
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function () {
      counter = (counter + 1) % 2;
      textNode.data = String(counter);
    };
    isUsingMicroTask = true;
  } else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    // Fallback to setImmediate.
    // Techinically it leverages the (macro) task queue,
    // but it is still a better choice than setTimeout.
    timerFunc = function () {
      setImmediate(flushCallbacks);
    };
  } else {
    // Fallback to setTimeout.
    timerFunc = function () {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick (cb, ctx) {
    var _resolve;
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve) {
        _resolve = resolve;
      })
    }
  }

  /*  */

  var seenObjects = new _Set();

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  function traverse (val) {
    _traverse(val, seenObjects);
    seenObjects.clear();
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }

  /*  */

  var normalizeEvent = cached(function (name) {
    var passive = name.charAt(0) === '&';
    name = passive ? name.slice(1) : name;
    var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
    name = once$$1 ? name.slice(1) : name;
    var capture = name.charAt(0) === '!';
    name = capture ? name.slice(1) : name;
    return {
      name: name,
      once: once$$1,
      capture: capture,
      passive: passive
    }
  });

  function createFnInvoker (fns, vm) {
    function invoker () {
      var arguments$1 = arguments;

      var fns = invoker.fns;
      if (Array.isArray(fns)) {
        var cloned = fns.slice();
        for (var i = 0; i < cloned.length; i++) {
          invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
        }
      } else {
        // return handler return value for single handlers
        return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
      }
    }
    invoker.fns = fns;
    return invoker
  }

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    createOnceHandler,
    vm
  ) {
    var name, def$$1, cur, old, event;
    for (name in on) {
      def$$1 = cur = on[name];
      old = oldOn[name];
      event = normalizeEvent(name);
      if (isUndef(cur)) ; else if (isUndef(old)) {
        if (isUndef(cur.fns)) {
          cur = on[name] = createFnInvoker(cur, vm);
        }
        if (isTrue(event.once)) {
          cur = on[name] = createOnceHandler(event.name, cur, event.capture);
        }
        add(event.name, cur, event.capture, event.passive, event.params);
      } else if (cur !== old) {
        old.fns = cur;
        on[name] = old;
      }
    }
    for (name in oldOn) {
      if (isUndef(on[name])) {
        event = normalizeEvent(name);
        remove$$1(event.name, oldOn[name], event.capture);
      }
    }
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook) {
    if (def instanceof VNode) {
      def = def.data.hook || (def.data.hook = {});
    }
    var invoker;
    var oldHook = def[hookKey];

    function wrappedHook () {
      hook.apply(this, arguments);
      // important: remove merged hook to ensure it's called only once
      // and prevent memory leak
      remove(invoker.fns, wrappedHook);
    }

    if (isUndef(oldHook)) {
      // no existing hook
      invoker = createFnInvoker([wrappedHook]);
    } else {
      /* istanbul ignore if */
      if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
        // already a merged invoker
        invoker = oldHook;
        invoker.fns.push(wrappedHook);
      } else {
        // existing plain hook
        invoker = createFnInvoker([oldHook, wrappedHook]);
      }
    }

    invoker.merged = true;
    def[hookKey] = invoker;
  }

  /*  */

  function extractPropsFromVNodeData (
    data,
    Ctor,
    tag
  ) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (isUndef(propOptions)) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    if (isDef(attrs) || isDef(props)) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey, false);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (isDef(hash)) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  /*  */

  // The template compiler attempts to minimize the need for normalization by
  // statically analyzing the template at compile time.
  //
  // For plain HTML markup, normalization can be completely skipped because the
  // generated render function is guaranteed to return Array<VNode>. There are
  // two cases where extra normalization is needed:

  // 1. When the children contains components - because a functional component
  // may return an Array instead of a single root. In this case, just a simple
  // normalization is needed - if any child is an Array, we flatten the whole
  // thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
  // because functional components already normalize their own children.
  function simpleNormalizeChildren (children) {
    for (var i = 0; i < children.length; i++) {
      if (Array.isArray(children[i])) {
        return Array.prototype.concat.apply([], children)
      }
    }
    return children
  }

  // 2. When the children contains constructs that always generated nested Arrays,
  // e.g. <template>, <slot>, v-for, or when the children is provided by user
  // with hand-written render functions / JSX. In such cases a full normalization
  // is needed to cater to all possible types of children values.
  function normalizeChildren (children) {
    return isPrimitive(children)
      ? [createTextVNode(children)]
      : Array.isArray(children)
        ? normalizeArrayChildren(children)
        : undefined
  }

  function isTextNode (node) {
    return isDef(node) && isDef(node.text) && isFalse(node.isComment)
  }

  function normalizeArrayChildren (children, nestedIndex) {
    var res = [];
    var i, c, lastIndex, last;
    for (i = 0; i < children.length; i++) {
      c = children[i];
      if (isUndef(c) || typeof c === 'boolean') { continue }
      lastIndex = res.length - 1;
      last = res[lastIndex];
      //  nested
      if (Array.isArray(c)) {
        if (c.length > 0) {
          c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
          // merge adjacent text nodes
          if (isTextNode(c[0]) && isTextNode(last)) {
            res[lastIndex] = createTextVNode(last.text + (c[0]).text);
            c.shift();
          }
          res.push.apply(res, c);
        }
      } else if (isPrimitive(c)) {
        if (isTextNode(last)) {
          // merge adjacent text nodes
          // this is necessary for SSR hydration because text nodes are
          // essentially merged when rendered to HTML strings
          res[lastIndex] = createTextVNode(last.text + c);
        } else if (c !== '') {
          // convert primitive to vnode
          res.push(createTextVNode(c));
        }
      } else {
        if (isTextNode(c) && isTextNode(last)) {
          // merge adjacent text nodes
          res[lastIndex] = createTextVNode(last.text + c.text);
        } else {
          // default key for nested array children (likely generated by v-for)
          if (isTrue(children._isVList) &&
            isDef(c.tag) &&
            isUndef(c.key) &&
            isDef(nestedIndex)) {
            c.key = "__vlist" + nestedIndex + "_" + i + "__";
          }
          res.push(c);
        }
      }
    }
    return res
  }

  /*  */

  function initProvide (vm) {
    var provide = vm.$options.provide;
    if (provide) {
      vm._provided = typeof provide === 'function'
        ? provide.call(vm)
        : provide;
    }
  }

  function initInjections (vm) {
    var result = resolveInject(vm.$options.inject, vm);
    if (result) {
      toggleObserving(false);
      Object.keys(result).forEach(function (key) {
        /* istanbul ignore else */
        {
          defineReactive$$1(vm, key, result[key]);
        }
      });
      toggleObserving(true);
    }
  }

  function resolveInject (inject, vm) {
    if (inject) {
      // inject is :any because flow is not smart enough to figure out cached
      var result = Object.create(null);
      var keys = hasSymbol
        ? Reflect.ownKeys(inject)
        : Object.keys(inject);

      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        // #6574 in case the inject object is observed...
        if (key === '__ob__') { continue }
        var provideKey = inject[key].from;
        var source = vm;
        while (source) {
          if (source._provided && hasOwn(source._provided, provideKey)) {
            result[key] = source._provided[provideKey];
            break
          }
          source = source.$parent;
        }
        if (!source) {
          if ('default' in inject[key]) {
            var provideDefault = inject[key].default;
            result[key] = typeof provideDefault === 'function'
              ? provideDefault.call(vm)
              : provideDefault;
          }
        }
      }
      return result
    }
  }

  /*  */



  /**
   * Runtime helper for resolving raw children VNodes into a slot object.
   */
  function resolveSlots (
    children,
    context
  ) {
    if (!children || !children.length) {
      return {}
    }
    var slots = {};
    for (var i = 0, l = children.length; i < l; i++) {
      var child = children[i];
      var data = child.data;
      // remove slot attribute if the node is resolved as a Vue slot node
      if (data && data.attrs && data.attrs.slot) {
        delete data.attrs.slot;
      }
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.fnContext === context) &&
        data && data.slot != null
      ) {
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        (slots.default || (slots.default = [])).push(child);
      }
    }
    // ignore slots that contains only whitespace
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  function isWhitespace (node) {
    return (node.isComment && !node.asyncFactory) || node.text === ' '
  }

  /*  */

  function normalizeScopedSlots (
    slots,
    normalSlots,
    prevSlots
  ) {
    var res;
    var hasNormalSlots = Object.keys(normalSlots).length > 0;
    var isStable = slots ? !!slots.$stable : !hasNormalSlots;
    var key = slots && slots.$key;
    if (!slots) {
      res = {};
    } else if (slots._normalized) {
      // fast path 1: child component re-render only, parent did not change
      return slots._normalized
    } else if (
      isStable &&
      prevSlots &&
      prevSlots !== emptyObject &&
      key === prevSlots.$key &&
      !hasNormalSlots &&
      !prevSlots.$hasNormal
    ) {
      // fast path 2: stable scoped slots w/ no normal slots to proxy,
      // only need to normalize once
      return prevSlots
    } else {
      res = {};
      for (var key$1 in slots) {
        if (slots[key$1] && key$1[0] !== '$') {
          res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
        }
      }
    }
    // expose normal slots on scopedSlots
    for (var key$2 in normalSlots) {
      if (!(key$2 in res)) {
        res[key$2] = proxyNormalSlot(normalSlots, key$2);
      }
    }
    // avoriaz seems to mock a non-extensible $scopedSlots object
    // and when that is passed down this would cause an error
    if (slots && Object.isExtensible(slots)) {
      (slots)._normalized = res;
    }
    def(res, '$stable', isStable);
    def(res, '$key', key);
    def(res, '$hasNormal', hasNormalSlots);
    return res
  }

  function normalizeScopedSlot(normalSlots, key, fn) {
    var normalized = function () {
      var res = arguments.length ? fn.apply(null, arguments) : fn({});
      res = res && typeof res === 'object' && !Array.isArray(res)
        ? [res] // single vnode
        : normalizeChildren(res);
      return res && (
        res.length === 0 ||
        (res.length === 1 && res[0].isComment) // #9658
      ) ? undefined
        : res
    };
    // this is a slot using the new v-slot syntax without scope. although it is
    // compiled as a scoped slot, render fn users would expect it to be present
    // on this.$slots because the usage is semantically a normal slot.
    if (fn.proxy) {
      Object.defineProperty(normalSlots, key, {
        get: normalized,
        enumerable: true,
        configurable: true
      });
    }
    return normalized
  }

  function proxyNormalSlot(slots, key) {
    return function () { return slots[key]; }
  }

  /*  */

  /**
   * Runtime helper for rendering v-for lists.
   */
  function renderList (
    val,
    render
  ) {
    var ret, i, l, keys, key;
    if (Array.isArray(val) || typeof val === 'string') {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = render(val[i], i);
      }
    } else if (typeof val === 'number') {
      ret = new Array(val);
      for (i = 0; i < val; i++) {
        ret[i] = render(i + 1, i);
      }
    } else if (isObject(val)) {
      if (hasSymbol && val[Symbol.iterator]) {
        ret = [];
        var iterator = val[Symbol.iterator]();
        var result = iterator.next();
        while (!result.done) {
          ret.push(render(result.value, ret.length));
          result = iterator.next();
        }
      } else {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
    }
    if (!isDef(ret)) {
      ret = [];
    }
    (ret)._isVList = true;
    return ret
  }

  /*  */

  /**
   * Runtime helper for rendering <slot>
   */
  function renderSlot (
    name,
    fallback,
    props,
    bindObject
  ) {
    var scopedSlotFn = this.$scopedSlots[name];
    var nodes;
    if (scopedSlotFn) { // scoped slot
      props = props || {};
      if (bindObject) {
        props = extend(extend({}, bindObject), props);
      }
      nodes = scopedSlotFn(props) || fallback;
    } else {
      nodes = this.$slots[name] || fallback;
    }

    var target = props && props.slot;
    if (target) {
      return this.$createElement('template', { slot: target }, nodes)
    } else {
      return nodes
    }
  }

  /*  */

  /**
   * Runtime helper for resolving filters
   */
  function resolveFilter (id) {
    return resolveAsset(this.$options, 'filters', id, true) || identity
  }

  /*  */

  function isKeyNotMatch (expect, actual) {
    if (Array.isArray(expect)) {
      return expect.indexOf(actual) === -1
    } else {
      return expect !== actual
    }
  }

  /**
   * Runtime helper for checking keyCodes from config.
   * exposed as Vue.prototype._k
   * passing in eventKeyName as last argument separately for backwards compat
   */
  function checkKeyCodes (
    eventKeyCode,
    key,
    builtInKeyCode,
    eventKeyName,
    builtInKeyName
  ) {
    var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
    if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
      return isKeyNotMatch(builtInKeyName, eventKeyName)
    } else if (mappedKeyCode) {
      return isKeyNotMatch(mappedKeyCode, eventKeyCode)
    } else if (eventKeyName) {
      return hyphenate(eventKeyName) !== key
    }
  }

  /*  */

  /**
   * Runtime helper for merging v-bind="object" into a VNode's data.
   */
  function bindObjectProps (
    data,
    tag,
    value,
    asProp,
    isSync
  ) {
    if (value) {
      if (!isObject(value)) ; else {
        if (Array.isArray(value)) {
          value = toObject(value);
        }
        var hash;
        var loop = function ( key ) {
          if (
            key === 'class' ||
            key === 'style' ||
            isReservedAttribute(key)
          ) {
            hash = data;
          } else {
            var type = data.attrs && data.attrs.type;
            hash = asProp || config.mustUseProp(tag, type, key)
              ? data.domProps || (data.domProps = {})
              : data.attrs || (data.attrs = {});
          }
          var camelizedKey = camelize(key);
          var hyphenatedKey = hyphenate(key);
          if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
            hash[key] = value[key];

            if (isSync) {
              var on = data.on || (data.on = {});
              on[("update:" + key)] = function ($event) {
                value[key] = $event;
              };
            }
          }
        };

        for (var key in value) loop( key );
      }
    }
    return data
  }

  /*  */

  /**
   * Runtime helper for rendering static trees.
   */
  function renderStatic (
    index,
    isInFor
  ) {
    var cached = this._staticTrees || (this._staticTrees = []);
    var tree = cached[index];
    // if has already-rendered static tree and not inside v-for,
    // we can reuse the same tree.
    if (tree && !isInFor) {
      return tree
    }
    // otherwise, render a fresh tree.
    tree = cached[index] = this.$options.staticRenderFns[index].call(
      this._renderProxy,
      null,
      this // for render fns generated for functional component templates
    );
    markStatic(tree, ("__static__" + index), false);
    return tree
  }

  /**
   * Runtime helper for v-once.
   * Effectively it means marking the node as static with a unique key.
   */
  function markOnce (
    tree,
    index,
    key
  ) {
    markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
    return tree
  }

  function markStatic (
    tree,
    key,
    isOnce
  ) {
    if (Array.isArray(tree)) {
      for (var i = 0; i < tree.length; i++) {
        if (tree[i] && typeof tree[i] !== 'string') {
          markStaticNode(tree[i], (key + "_" + i), isOnce);
        }
      }
    } else {
      markStaticNode(tree, key, isOnce);
    }
  }

  function markStaticNode (node, key, isOnce) {
    node.isStatic = true;
    node.key = key;
    node.isOnce = isOnce;
  }

  /*  */

  function bindObjectListeners (data, value) {
    if (value) {
      if (!isPlainObject(value)) ; else {
        var on = data.on = data.on ? extend({}, data.on) : {};
        for (var key in value) {
          var existing = on[key];
          var ours = value[key];
          on[key] = existing ? [].concat(existing, ours) : ours;
        }
      }
    }
    return data
  }

  /*  */

  function resolveScopedSlots (
    fns, // see flow/vnode
    res,
    // the following are added in 2.6
    hasDynamicKeys,
    contentHashKey
  ) {
    res = res || { $stable: !hasDynamicKeys };
    for (var i = 0; i < fns.length; i++) {
      var slot = fns[i];
      if (Array.isArray(slot)) {
        resolveScopedSlots(slot, res, hasDynamicKeys);
      } else if (slot) {
        // marker for reverse proxying v-slot without scope on this.$slots
        if (slot.proxy) {
          slot.fn.proxy = true;
        }
        res[slot.key] = slot.fn;
      }
    }
    if (contentHashKey) {
      (res).$key = contentHashKey;
    }
    return res
  }

  /*  */

  function bindDynamicKeys (baseObj, values) {
    for (var i = 0; i < values.length; i += 2) {
      var key = values[i];
      if (typeof key === 'string' && key) {
        baseObj[values[i]] = values[i + 1];
      }
    }
    return baseObj
  }

  // helper to dynamically append modifier runtime markers to event names.
  // ensure only append when value is already string, otherwise it will be cast
  // to string and cause the type check to miss.
  function prependModifier (value, symbol) {
    return typeof value === 'string' ? symbol + value : value
  }

  /*  */

  function installRenderHelpers (target) {
    target._o = markOnce;
    target._n = toNumber;
    target._s = toString;
    target._l = renderList;
    target._t = renderSlot;
    target._q = looseEqual;
    target._i = looseIndexOf;
    target._m = renderStatic;
    target._f = resolveFilter;
    target._k = checkKeyCodes;
    target._b = bindObjectProps;
    target._v = createTextVNode;
    target._e = createEmptyVNode;
    target._u = resolveScopedSlots;
    target._g = bindObjectListeners;
    target._d = bindDynamicKeys;
    target._p = prependModifier;
  }

  /*  */

  function FunctionalRenderContext (
    data,
    props,
    children,
    parent,
    Ctor
  ) {
    var this$1 = this;

    var options = Ctor.options;
    // ensure the createElement function in functional components
    // gets a unique context - this is necessary for correct named slot check
    var contextVm;
    if (hasOwn(parent, '_uid')) {
      contextVm = Object.create(parent);
      // $flow-disable-line
      contextVm._original = parent;
    } else {
      // the context vm passed in is a functional context as well.
      // in this case we want to make sure we are able to get a hold to the
      // real context instance.
      contextVm = parent;
      // $flow-disable-line
      parent = parent._original;
    }
    var isCompiled = isTrue(options._compiled);
    var needNormalization = !isCompiled;

    this.data = data;
    this.props = props;
    this.children = children;
    this.parent = parent;
    this.listeners = data.on || emptyObject;
    this.injections = resolveInject(options.inject, parent);
    this.slots = function () {
      if (!this$1.$slots) {
        normalizeScopedSlots(
          data.scopedSlots,
          this$1.$slots = resolveSlots(children, parent)
        );
      }
      return this$1.$slots
    };

    Object.defineProperty(this, 'scopedSlots', ({
      enumerable: true,
      get: function get () {
        return normalizeScopedSlots(data.scopedSlots, this.slots())
      }
    }));

    // support for compiled functional template
    if (isCompiled) {
      // exposing $options for renderStatic()
      this.$options = options;
      // pre-resolve slots for renderSlot()
      this.$slots = this.slots();
      this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
    }

    if (options._scopeId) {
      this._c = function (a, b, c, d) {
        var vnode = createElement(contextVm, a, b, c, d, needNormalization);
        if (vnode && !Array.isArray(vnode)) {
          vnode.fnScopeId = options._scopeId;
          vnode.fnContext = parent;
        }
        return vnode
      };
    } else {
      this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
    }
  }

  installRenderHelpers(FunctionalRenderContext.prototype);

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    contextVm,
    children
  ) {
    var options = Ctor.options;
    var props = {};
    var propOptions = options.props;
    if (isDef(propOptions)) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData || emptyObject);
      }
    } else {
      if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
      if (isDef(data.props)) { mergeProps(props, data.props); }
    }

    var renderContext = new FunctionalRenderContext(
      data,
      props,
      children,
      contextVm,
      Ctor
    );

    var vnode = options.render.call(null, renderContext._c, renderContext);

    if (vnode instanceof VNode) {
      return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
    } else if (Array.isArray(vnode)) {
      var vnodes = normalizeChildren(vnode) || [];
      var res = new Array(vnodes.length);
      for (var i = 0; i < vnodes.length; i++) {
        res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
      }
      return res
    }
  }

  function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
    // #7817 clone node before setting fnContext, otherwise if the node is reused
    // (e.g. it was from a cached normal slot) the fnContext causes named slots
    // that should not be matched to match.
    var clone = cloneVNode(vnode);
    clone.fnContext = contextVm;
    clone.fnOptions = options;
    if (data.slot) {
      (clone.data || (clone.data = {})).slot = data.slot;
    }
    return clone
  }

  function mergeProps (to, from) {
    for (var key in from) {
      to[camelize(key)] = from[key];
    }
  }

  /*  */

  /*  */

  /*  */

  /*  */

  // inline hooks to be invoked on component VNodes during patch
  var componentVNodeHooks = {
    init: function init (vnode, hydrating) {
      if (
        vnode.componentInstance &&
        !vnode.componentInstance._isDestroyed &&
        vnode.data.keepAlive
      ) {
        // kept-alive components, treat as a patch
        var mountedNode = vnode; // work around flow
        componentVNodeHooks.prepatch(mountedNode, mountedNode);
      } else {
        var child = vnode.componentInstance = createComponentInstanceForVnode(
          vnode,
          activeInstance
        );
        child.$mount(hydrating ? vnode.elm : undefined, hydrating);
      }
    },

    prepatch: function prepatch (oldVnode, vnode) {
      var options = vnode.componentOptions;
      var child = vnode.componentInstance = oldVnode.componentInstance;
      updateChildComponent(
        child,
        options.propsData, // updated props
        options.listeners, // updated listeners
        vnode, // new parent vnode
        options.children // new children
      );
    },

    insert: function insert (vnode) {
      var context = vnode.context;
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isMounted) {
        componentInstance._isMounted = true;
        callHook(componentInstance, 'mounted');
      }
      if (vnode.data.keepAlive) {
        if (context._isMounted) {
          // vue-router#1212
          // During updates, a kept-alive component's child components may
          // change, so directly walking the tree here may call activated hooks
          // on incorrect children. Instead we push them into a queue which will
          // be processed after the whole patch process ended.
          queueActivatedComponent(componentInstance);
        } else {
          activateChildComponent(componentInstance, true /* direct */);
        }
      }
    },

    destroy: function destroy (vnode) {
      var componentInstance = vnode.componentInstance;
      if (!componentInstance._isDestroyed) {
        if (!vnode.data.keepAlive) {
          componentInstance.$destroy();
        } else {
          deactivateChildComponent(componentInstance, true /* direct */);
        }
      }
    }
  };

  var hooksToMerge = Object.keys(componentVNodeHooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (isUndef(Ctor)) {
      return
    }

    var baseCtor = context.$options._base;

    // plain options object: turn it into a constructor
    if (isObject(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    // if at this stage it's not a constructor or an async component factory,
    // reject.
    if (typeof Ctor !== 'function') {
      return
    }

    // async component
    var asyncFactory;
    if (isUndef(Ctor.cid)) {
      asyncFactory = Ctor;
      Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
      if (Ctor === undefined) {
        // return a placeholder node for async component, which is rendered
        // as a comment node but preserves all the raw information for the node.
        // the information will be used for async server-rendering and hydration.
        return createAsyncPlaceholder(
          asyncFactory,
          data,
          context,
          children,
          tag
        )
      }
    }

    data = data || {};

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // transform component v-model data into props & events
    if (isDef(data.model)) {
      transformModel(Ctor.options, data);
    }

    // extract props
    var propsData = extractPropsFromVNodeData(data, Ctor, tag);

    // functional component
    if (isTrue(Ctor.options.functional)) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    // so it gets processed during parent component patch.
    data.on = data.nativeOn;

    if (isTrue(Ctor.options.abstract)) {
      // abstract components do not keep anything
      // other than props & listeners & slot

      // work around flow
      var slot = data.slot;
      data = {};
      if (slot) {
        data.slot = slot;
      }
    }

    // install component management hooks onto the placeholder node
    installComponentHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
      asyncFactory
    );

    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent // activeInstance in lifecycle state
  ) {
    var options = {
      _isComponent: true,
      _parentVnode: vnode,
      parent: parent
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (isDef(inlineTemplate)) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnode.componentOptions.Ctor(options)
  }

  function installComponentHooks (data) {
    var hooks = data.hook || (data.hook = {});
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var existing = hooks[key];
      var toMerge = componentVNodeHooks[key];
      if (existing !== toMerge && !(existing && existing._merged)) {
        hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
      }
    }
  }

  function mergeHook$1 (f1, f2) {
    var merged = function (a, b) {
      // flow complains about extra args which is why we use any
      f1(a, b);
      f2(a, b);
    };
    merged._merged = true;
    return merged
  }

  // transform component v-model info (value and callback) into
  // prop and event handler respectively.
  function transformModel (options, data) {
    var prop = (options.model && options.model.prop) || 'value';
    var event = (options.model && options.model.event) || 'input'
    ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
    var on = data.on || (data.on = {});
    var existing = on[event];
    var callback = data.model.callback;
    if (isDef(existing)) {
      if (
        Array.isArray(existing)
          ? existing.indexOf(callback) === -1
          : existing !== callback
      ) {
        on[event] = [callback].concat(existing);
      }
    } else {
      on[event] = callback;
    }
  }

  /*  */

  var SIMPLE_NORMALIZE = 1;
  var ALWAYS_NORMALIZE = 2;

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    context,
    tag,
    data,
    children,
    normalizationType,
    alwaysNormalize
  ) {
    if (Array.isArray(data) || isPrimitive(data)) {
      normalizationType = children;
      children = data;
      data = undefined;
    }
    if (isTrue(alwaysNormalize)) {
      normalizationType = ALWAYS_NORMALIZE;
    }
    return _createElement(context, tag, data, children, normalizationType)
  }

  function _createElement (
    context,
    tag,
    data,
    children,
    normalizationType
  ) {
    if (isDef(data) && isDef((data).__ob__)) {
      return createEmptyVNode()
    }
    // object syntax in v-bind
    if (isDef(data) && isDef(data.is)) {
      tag = data.is;
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return createEmptyVNode()
    }
    // support single function children as default scoped slot
    if (Array.isArray(children) &&
      typeof children[0] === 'function'
    ) {
      data = data || {};
      data.scopedSlots = { default: children[0] };
      children.length = 0;
    }
    if (normalizationType === ALWAYS_NORMALIZE) {
      children = normalizeChildren(children);
    } else if (normalizationType === SIMPLE_NORMALIZE) {
      children = simpleNormalizeChildren(children);
    }
    var vnode, ns;
    if (typeof tag === 'string') {
      var Ctor;
      ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        vnode = new VNode(
          config.parsePlatformTagName(tag), data, children,
          undefined, undefined, context
        );
      } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        vnode = createComponent(Ctor, data, context, children, tag);
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        vnode = new VNode(
          tag, data, children,
          undefined, undefined, context
        );
      }
    } else {
      // direct component options / constructor
      vnode = createComponent(tag, data, context, children);
    }
    if (Array.isArray(vnode)) {
      return vnode
    } else if (isDef(vnode)) {
      if (isDef(ns)) { applyNS(vnode, ns); }
      if (isDef(data)) { registerDeepBindings(data); }
      return vnode
    } else {
      return createEmptyVNode()
    }
  }

  function applyNS (vnode, ns, force) {
    vnode.ns = ns;
    if (vnode.tag === 'foreignObject') {
      // use default namespace inside foreignObject
      ns = undefined;
      force = true;
    }
    if (isDef(vnode.children)) {
      for (var i = 0, l = vnode.children.length; i < l; i++) {
        var child = vnode.children[i];
        if (isDef(child.tag) && (
          isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
          applyNS(child, ns, force);
        }
      }
    }
  }

  // ref #5318
  // necessary to ensure parent re-render when deep bindings like :style and
  // :class are used on slot nodes
  function registerDeepBindings (data) {
    if (isObject(data.style)) {
      traverse(data.style);
    }
    if (isObject(data.class)) {
      traverse(data.class);
    }
  }

  /*  */

  function initRender (vm) {
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null; // v-once cached trees
    var options = vm.$options;
    var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
    var renderContext = parentVnode && parentVnode.context;
    vm.$slots = resolveSlots(options._renderChildren, renderContext);
    vm.$scopedSlots = emptyObject;
    // bind the createElement fn to this instance
    // so that we get proper render context inside it.
    // args order: tag, data, children, normalizationType, alwaysNormalize
    // internal version is used by render functions compiled from templates
    vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
    // normalization is always applied for the public version, used in
    // user-written render functions.
    vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

    // $attrs & $listeners are exposed for easier HOC creation.
    // they need to be reactive so that HOCs using them are always updated
    var parentData = parentVnode && parentVnode.data;

    /* istanbul ignore else */
    {
      defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
      defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
    }
  }

  var currentRenderingInstance = null;

  function renderMixin (Vue) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype);

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn, this)
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var _parentVnode = ref._parentVnode;

      if (_parentVnode) {
        vm.$scopedSlots = normalizeScopedSlots(
          _parentVnode.data.scopedSlots,
          vm.$slots,
          vm.$scopedSlots
        );
      }

      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        // There's no need to maintain a stack becaues all render fns are called
        // separately from one another. Nested component's render fns are called
        // when parent component is patched.
        currentRenderingInstance = vm;
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        handleError(e, vm, "render");
        // return error render result,
        // or previous vnode to prevent render error causing blank component
        /* istanbul ignore else */
        {
          vnode = vm._vnode;
        }
      } finally {
        currentRenderingInstance = null;
      }
      // if the returned array contains only a single node, allow it
      if (Array.isArray(vnode) && vnode.length === 1) {
        vnode = vnode[0];
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        vnode = createEmptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };
  }

  /*  */

  function ensureCtor (comp, base) {
    if (
      comp.__esModule ||
      (hasSymbol && comp[Symbol.toStringTag] === 'Module')
    ) {
      comp = comp.default;
    }
    return isObject(comp)
      ? base.extend(comp)
      : comp
  }

  function createAsyncPlaceholder (
    factory,
    data,
    context,
    children,
    tag
  ) {
    var node = createEmptyVNode();
    node.asyncFactory = factory;
    node.asyncMeta = { data: data, context: context, children: children, tag: tag };
    return node
  }

  function resolveAsyncComponent (
    factory,
    baseCtor
  ) {
    if (isTrue(factory.error) && isDef(factory.errorComp)) {
      return factory.errorComp
    }

    if (isDef(factory.resolved)) {
      return factory.resolved
    }

    var owner = currentRenderingInstance;
    if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
      // already pending
      factory.owners.push(owner);
    }

    if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
      return factory.loadingComp
    }

    if (owner && !isDef(factory.owners)) {
      var owners = factory.owners = [owner];
      var sync = true;
      var timerLoading = null;
      var timerTimeout = null

      ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

      var forceRender = function (renderCompleted) {
        for (var i = 0, l = owners.length; i < l; i++) {
          (owners[i]).$forceUpdate();
        }

        if (renderCompleted) {
          owners.length = 0;
          if (timerLoading !== null) {
            clearTimeout(timerLoading);
            timerLoading = null;
          }
          if (timerTimeout !== null) {
            clearTimeout(timerTimeout);
            timerTimeout = null;
          }
        }
      };

      var resolve = once(function (res) {
        // cache resolved
        factory.resolved = ensureCtor(res, baseCtor);
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          forceRender(true);
        } else {
          owners.length = 0;
        }
      });

      var reject = once(function (reason) {
        if (isDef(factory.errorComp)) {
          factory.error = true;
          forceRender(true);
        }
      });

      var res = factory(resolve, reject);

      if (isObject(res)) {
        if (isPromise(res)) {
          // () => Promise
          if (isUndef(factory.resolved)) {
            res.then(resolve, reject);
          }
        } else if (isPromise(res.component)) {
          res.component.then(resolve, reject);

          if (isDef(res.error)) {
            factory.errorComp = ensureCtor(res.error, baseCtor);
          }

          if (isDef(res.loading)) {
            factory.loadingComp = ensureCtor(res.loading, baseCtor);
            if (res.delay === 0) {
              factory.loading = true;
            } else {
              timerLoading = setTimeout(function () {
                timerLoading = null;
                if (isUndef(factory.resolved) && isUndef(factory.error)) {
                  factory.loading = true;
                  forceRender(false);
                }
              }, res.delay || 200);
            }
          }

          if (isDef(res.timeout)) {
            timerTimeout = setTimeout(function () {
              timerTimeout = null;
              if (isUndef(factory.resolved)) {
                reject(
                  null
                );
              }
            }, res.timeout);
          }
        }
      }

      sync = false;
      // return in case resolved synchronously
      return factory.loading
        ? factory.loadingComp
        : factory.resolved
    }
  }

  /*  */

  function isAsyncPlaceholder (node) {
    return node.isComment && node.asyncFactory
  }

  /*  */

  function getFirstComponentChild (children) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
          return c
        }
      }
    }
  }

  /*  */

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    vm._hasHookEvent = false;
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    if (listeners) {
      updateComponentListeners(vm, listeners);
    }
  }

  var target;

  function add (event, fn) {
    target.$on(event, fn);
  }

  function remove$1 (event, fn) {
    target.$off(event, fn);
  }

  function createOnceHandler (event, fn) {
    var _target = target;
    return function onceHandler () {
      var res = fn.apply(null, arguments);
      if (res !== null) {
        _target.$off(event, onceHandler);
      }
    }
  }

  function updateComponentListeners (
    vm,
    listeners,
    oldListeners
  ) {
    target = vm;
    updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
    target = undefined;
  }

  function eventsMixin (Vue) {
    var hookRE = /^hook:/;
    Vue.prototype.$on = function (event, fn) {
      var vm = this;
      if (Array.isArray(event)) {
        for (var i = 0, l = event.length; i < l; i++) {
          vm.$on(event[i], fn);
        }
      } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
          vm._hasHookEvent = true;
        }
      }
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // array of events
      if (Array.isArray(event)) {
        for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
          vm.$off(event[i$1], fn);
        }
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (!fn) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        var info = "event handler for \"" + event + "\"";
        for (var i = 0, l = cbs.length; i < l; i++) {
          invokeWithErrorHandling(cbs[i], vm, args, vm, info);
        }
      }
      return vm
    };
  }

  /*  */

  var activeInstance = null;

  function setActiveInstance(vm) {
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    return function () {
      activeInstance = prevActiveInstance;
    }
  }

  function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = null;
    vm._directInactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      var prevEl = vm.$el;
      var prevVnode = vm._vnode;
      var restoreActiveInstance = setActiveInstance(vm);
      vm._vnode = vnode;
      // Vue.prototype.__patch__ is injected in entry points
      // based on the rendering backend used.
      if (!prevVnode) {
        // initial render
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
      } else {
        // updates
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      restoreActiveInstance();
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      // updated hook is called by the scheduler to ensure that children are
      // updated in a parent's updated hook.
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
      // fire destroyed hook
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // release circular reference (#6759)
      if (vm.$vnode) {
        vm.$vnode.parent = null;
      }
    };
  }

  function mountComponent (
    vm,
    el,
    hydrating
  ) {
    vm.$el = el;
    if (!vm.$options.render) {
      vm.$options.render = createEmptyVNode;
    }
    callHook(vm, 'beforeMount');

    var updateComponent;
    /* istanbul ignore if */
    {
      updateComponent = function () {
        vm._update(vm._render(), hydrating);
      };
    }

    // we set this to vm._watcher inside the watcher's constructor
    // since the watcher's initial patch may call $forceUpdate (e.g. inside child
    // component's mounted hook), which relies on vm._watcher being already defined
    new Watcher(vm, updateComponent, noop, {
      before: function before () {
        if (vm._isMounted && !vm._isDestroyed) {
          callHook(vm, 'beforeUpdate');
        }
      }
    }, true /* isRenderWatcher */);
    hydrating = false;

    // manually mounted instance, call mounted on self
    // mounted is called for render-created child components in its inserted hook
    if (vm.$vnode == null) {
      vm._isMounted = true;
      callHook(vm, 'mounted');
    }
    return vm
  }

  function updateChildComponent (
    vm,
    propsData,
    listeners,
    parentVnode,
    renderChildren
  ) {

    // determine whether component has slot children
    // we need to do this before overwriting $options._renderChildren.

    // check if there are dynamic scopedSlots (hand-written or compiled but with
    // dynamic slot names). Static scoped slots compiled from template has the
    // "$stable" marker.
    var newScopedSlots = parentVnode.data.scopedSlots;
    var oldScopedSlots = vm.$scopedSlots;
    var hasDynamicScopedSlot = !!(
      (newScopedSlots && !newScopedSlots.$stable) ||
      (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
      (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
    );

    // Any static slot children from the parent may have changed during parent's
    // update. Dynamic scoped slots may also have changed. In such cases, a forced
    // update is necessary to ensure correctness.
    var needsForceUpdate = !!(
      renderChildren ||               // has new static slots
      vm.$options._renderChildren ||  // has old static slots
      hasDynamicScopedSlot
    );

    vm.$options._parentVnode = parentVnode;
    vm.$vnode = parentVnode; // update vm's placeholder node without re-render

    if (vm._vnode) { // update child tree's parent
      vm._vnode.parent = parentVnode;
    }
    vm.$options._renderChildren = renderChildren;

    // update $attrs and $listeners hash
    // these are also reactive so they may trigger child update if the child
    // used them during render
    vm.$attrs = parentVnode.data.attrs || emptyObject;
    vm.$listeners = listeners || emptyObject;

    // update props
    if (propsData && vm.$options.props) {
      toggleObserving(false);
      var props = vm._props;
      var propKeys = vm.$options._propKeys || [];
      for (var i = 0; i < propKeys.length; i++) {
        var key = propKeys[i];
        var propOptions = vm.$options.props; // wtf flow?
        props[key] = validateProp(key, propOptions, propsData, vm);
      }
      toggleObserving(true);
      // keep a copy of raw propsData
      vm.$options.propsData = propsData;
    }

    // update listeners
    listeners = listeners || emptyObject;
    var oldListeners = vm.$options._parentListeners;
    vm.$options._parentListeners = listeners;
    updateComponentListeners(vm, listeners, oldListeners);

    // resolve slots + force update if has children
    if (needsForceUpdate) {
      vm.$slots = resolveSlots(renderChildren, parentVnode.context);
      vm.$forceUpdate();
    }
  }

  function isInInactiveTree (vm) {
    while (vm && (vm = vm.$parent)) {
      if (vm._inactive) { return true }
    }
    return false
  }

  function activateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = false;
      if (isInInactiveTree(vm)) {
        return
      }
    } else if (vm._directInactive) {
      return
    }
    if (vm._inactive || vm._inactive === null) {
      vm._inactive = false;
      for (var i = 0; i < vm.$children.length; i++) {
        activateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'activated');
    }
  }

  function deactivateChildComponent (vm, direct) {
    if (direct) {
      vm._directInactive = true;
      if (isInInactiveTree(vm)) {
        return
      }
    }
    if (!vm._inactive) {
      vm._inactive = true;
      for (var i = 0; i < vm.$children.length; i++) {
        deactivateChildComponent(vm.$children[i]);
      }
      callHook(vm, 'deactivated');
    }
  }

  function callHook (vm, hook) {
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        invokeWithErrorHandling(handlers[i], vm, null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook);
    }
    popTarget();
  }

  var queue = [];
  var activatedChildren = [];
  var has = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    index = queue.length = activatedChildren.length = 0;
    has = {};
    waiting = flushing = false;
  }

  // Async edge case #6566 requires saving the timestamp when event listeners are
  // attached. However, calling performance.now() has a perf overhead especially
  // if the page has thousands of event listeners. Instead, we take a timestamp
  // every time the scheduler flushes and use that for all event listeners
  // attached during that flush.
  var currentFlushTimestamp = 0;

  // Async edge case fix requires storing an event listener's attach timestamp.
  var getNow = Date.now;

  // Determine what event timestamp the browser is using. Annoyingly, the
  // timestamp can either be hi-res (relative to page load) or low-res
  // (relative to UNIX epoch), so in order to compare time we have to use the
  // same timestamp type when saving the flush timestamp.
  // All IE versions use low-res event timestamps, and have problematic clock
  // implementations (#9632)
  if (inBrowser && !isIE) {
    var performance = window.performance;
    if (
      performance &&
      typeof performance.now === 'function' &&
      getNow() > document.createEvent('Event').timeStamp
    ) {
      // if the event timestamp, although evaluated AFTER the Date.now(), is
      // smaller than it, it means the event is using a hi-res timestamp,
      // and we need to use the hi-res version for event listener timestamps as
      // well.
      getNow = function () { return performance.now(); };
    }
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    currentFlushTimestamp = getNow();
    flushing = true;
    var watcher, id;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      watcher = queue[index];
      if (watcher.before) {
        watcher.before();
      }
      id = watcher.id;
      has[id] = null;
      watcher.run();
    }

    // keep copies of post queues before resetting state
    var activatedQueue = activatedChildren.slice();
    var updatedQueue = queue.slice();

    resetSchedulerState();

    // call component updated and activated hooks
    callActivatedHooks(activatedQueue);
    callUpdatedHooks(updatedQueue);

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }
  }

  function callUpdatedHooks (queue) {
    var i = queue.length;
    while (i--) {
      var watcher = queue[i];
      var vm = watcher.vm;
      if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'updated');
      }
    }
  }

  /**
   * Queue a kept-alive component that was activated during patch.
   * The queue will be processed after the entire tree has been patched.
   */
  function queueActivatedComponent (vm) {
    // setting _inactive to false here so that a render function can
    // rely on checking whether it's in an inactive tree (e.g. router-view)
    vm._inactive = false;
    activatedChildren.push(vm);
  }

  function callActivatedHooks (queue) {
    for (var i = 0; i < queue.length; i++) {
      queue[i]._inactive = true;
      activateChildComponent(queue[i], true /* true */);
    }
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has[id] == null) {
      has[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i > index && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(i + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */



  var uid$2 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options,
    isRenderWatcher
  ) {
    this.vm = vm;
    if (isRenderWatcher) {
      vm._watcher = this;
    }
    vm._watchers.push(this);
    // options
    if (options) {
      this.deep = !!options.deep;
      this.user = !!options.user;
      this.lazy = !!options.lazy;
      this.sync = !!options.sync;
      this.before = options.before;
    } else {
      this.deep = this.user = this.lazy = this.sync = false;
    }
    this.cb = cb;
    this.id = ++uid$2; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    this.expression = '';
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = noop;
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value;
    var vm = this.vm;
    try {
      value = this.getter.call(vm, vm);
    } catch (e) {
      if (this.user) {
        handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value);
      }
      popTarget();
      this.cleanupDeps();
    }
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var i = this.deps.length;
    while (i--) {
      var dep = this.deps[i];
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
    var i = this.deps.length;
    while (i--) {
      this.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed.
      if (!this.vm._isBeingDestroyed) {
        remove(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this.deps[i].removeSub(this);
      }
      this.active = false;
    }
  };

  /*  */

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    if (opts.methods) { initMethods(vm, opts.methods); }
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
  }

  function initProps (vm, propsOptions) {
    var propsData = vm.$options.propsData || {};
    var props = vm._props = {};
    // cache prop keys so that future props updates can iterate using Array
    // instead of dynamic object key enumeration.
    var keys = vm.$options._propKeys = [];
    var isRoot = !vm.$parent;
    // root instance props should be converted
    if (!isRoot) {
      toggleObserving(false);
    }
    var loop = function ( key ) {
      keys.push(key);
      var value = validateProp(key, propsOptions, propsData, vm);
      /* istanbul ignore else */
      {
        defineReactive$$1(props, key, value);
      }
      // static props are already proxied on the component's prototype
      // during Vue.extend(). We only need to proxy props defined at
      // instantiation here.
      if (!(key in vm)) {
        proxy(vm, "_props", key);
      }
    };

    for (var key in propsOptions) loop( key );
    toggleObserving(true);
  }

  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      if (props && hasOwn(props, key)) ; else if (!isReserved(key)) {
        proxy(vm, "_data", key);
      }
    }
    // observe data
    observe(data, true /* asRootData */);
  }

  function getData (data, vm) {
    // #7573 disable dep collection when invoking data getters
    pushTarget();
    try {
      return data.call(vm, vm)
    } catch (e) {
      handleError(e, vm, "data()");
      return {}
    } finally {
      popTarget();
    }
  }

  var computedWatcherOptions = { lazy: true };

  function initComputed (vm, computed) {
    // $flow-disable-line
    var watchers = vm._computedWatchers = Object.create(null);
    // computed properties are just getters during SSR
    var isSSR = isServerRendering();

    for (var key in computed) {
      var userDef = computed[key];
      var getter = typeof userDef === 'function' ? userDef : userDef.get;

      if (!isSSR) {
        // create internal watcher for the computed property.
        watchers[key] = new Watcher(
          vm,
          getter || noop,
          noop,
          computedWatcherOptions
        );
      }

      // component-defined computed properties are already defined on the
      // component prototype. We only need to define computed properties defined
      // at instantiation here.
      if (!(key in vm)) {
        defineComputed(vm, key, userDef);
      }
    }
  }

  function defineComputed (
    target,
    key,
    userDef
  ) {
    var shouldCache = !isServerRendering();
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = shouldCache
        ? createComputedGetter(key)
        : createGetterInvoker(userDef);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? shouldCache && userDef.cache !== false
          ? createComputedGetter(key)
          : createGetterInvoker(userDef.get)
        : noop;
      sharedPropertyDefinition.set = userDef.set || noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter (key) {
    return function computedGetter () {
      var watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        if (watcher.dirty) {
          watcher.evaluate();
        }
        if (Dep.target) {
          watcher.depend();
        }
        return watcher.value
      }
    }
  }

  function createGetterInvoker(fn) {
    return function computedGetter () {
      return fn.call(this, this)
    }
  }

  function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
  }

  function initWatch (vm, watch) {
    for (var key in watch) {
      var handler = watch[key];
      if (Array.isArray(handler)) {
        for (var i = 0; i < handler.length; i++) {
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    }
  }

  function createWatcher (
    vm,
    expOrFn,
    handler,
    options
  ) {
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    return vm.$watch(expOrFn, handler, options)
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () { return this._data };
    var propsDef = {};
    propsDef.get = function () { return this._props };
    Object.defineProperty(Vue.prototype, '$data', dataDef);
    Object.defineProperty(Vue.prototype, '$props', propsDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      if (isPlainObject(cb)) {
        return createWatcher(vm, expOrFn, cb, options)
      }
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        try {
          cb.call(vm, watcher.value);
        } catch (error) {
          handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
        }
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  /*  */

  var uid$3 = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid$3++;

      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      {
        vm._renderProxy = vm;
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate');
      initInjections(vm); // resolve injections before data/props
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created');

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    var parentVnode = options._parentVnode;
    opts.parent = options.parent;
    opts._parentVnode = parentVnode;

    var vnodeComponentOptions = parentVnode.componentOptions;
    opts.propsData = vnodeComponentOptions.propsData;
    opts._parentListeners = vnodeComponentOptions.listeners;
    opts._renderChildren = vnodeComponentOptions.children;
    opts._componentTag = vnodeComponentOptions.tag;

    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = resolveConstructorOptions(Ctor.super);
      var cachedSuperOptions = Ctor.superOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed,
        // need to resolve new options.
        Ctor.superOptions = superOptions;
        // check if there are any late-modified/attached options (#4976)
        var modifiedOptions = resolveModifiedOptions(Ctor);
        // update base extend options
        if (modifiedOptions) {
          extend(Ctor.extendOptions, modifiedOptions);
        }
        options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function resolveModifiedOptions (Ctor) {
    var modified;
    var latest = Ctor.options;
    var sealed = Ctor.sealedOptions;
    for (var key in latest) {
      if (latest[key] !== sealed[key]) {
        if (!modified) { modified = {}; }
        modified[key] = latest[key];
      }
    }
    return modified
  }

  function Vue (options) {
    this._init(options);
  }

  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecycleMixin(Vue);
  renderMixin(Vue);

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
      if (installedPlugins.indexOf(plugin) > -1) {
        return this
      }

      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
      }
      installedPlugins.push(plugin);
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var SuperId = Super.cid;
      var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
      if (cachedCtors[SuperId]) {
        return cachedCtors[SuperId]
      }

      var name = extendOptions.name || Super.options.name;

      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;

      // For props and computed properties, we define the proxy getters on
      // the Vue instances at extension time, on the extended prototype. This
      // avoids Object.defineProperty calls for each instance created.
      if (Sub.options.props) {
        initProps$1(Sub);
      }
      if (Sub.options.computed) {
        initComputed$1(Sub);
      }

      // allow further extension/mixin/plugin usage
      Sub.extend = Super.extend;
      Sub.mixin = Super.mixin;
      Sub.use = Super.use;

      // create asset registers, so extended classes
      // can have their private assets too.
      ASSET_TYPES.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }

      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      Sub.sealedOptions = extend({}, Sub.options);

      // cache constructor
      cachedCtors[SuperId] = Sub;
      return Sub
    };
  }

  function initProps$1 (Comp) {
    var props = Comp.options.props;
    for (var key in props) {
      proxy(Comp.prototype, "_props", key);
    }
  }

  function initComputed$1 (Comp) {
    var computed = Comp.options.computed;
    for (var key in computed) {
      defineComputed(Comp.prototype, key, computed[key]);
    }
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    ASSET_TYPES.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = this.options._base.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  /*  */



  function getComponentName (opts) {
    return opts && (opts.Ctor.options.name || opts.tag)
  }

  function matches (pattern, name) {
    if (Array.isArray(pattern)) {
      return pattern.indexOf(name) > -1
    } else if (typeof pattern === 'string') {
      return pattern.split(',').indexOf(name) > -1
    } else if (isRegExp(pattern)) {
      return pattern.test(name)
    }
    /* istanbul ignore next */
    return false
  }

  function pruneCache (keepAliveInstance, filter) {
    var cache = keepAliveInstance.cache;
    var keys = keepAliveInstance.keys;
    var _vnode = keepAliveInstance._vnode;
    for (var key in cache) {
      var cachedNode = cache[key];
      if (cachedNode) {
        var name = getComponentName(cachedNode.componentOptions);
        if (name && !filter(name)) {
          pruneCacheEntry(cache, key, keys, _vnode);
        }
      }
    }
  }

  function pruneCacheEntry (
    cache,
    key,
    keys,
    current
  ) {
    var cached$$1 = cache[key];
    if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
      cached$$1.componentInstance.$destroy();
    }
    cache[key] = null;
    remove(keys, key);
  }

  var patternTypes = [String, RegExp, Array];

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,

    props: {
      include: patternTypes,
      exclude: patternTypes,
      max: [String, Number]
    },

    created: function created () {
      this.cache = Object.create(null);
      this.keys = [];
    },

    destroyed: function destroyed () {
      for (var key in this.cache) {
        pruneCacheEntry(this.cache, key, this.keys);
      }
    },

    mounted: function mounted () {
      var this$1 = this;

      this.$watch('include', function (val) {
        pruneCache(this$1, function (name) { return matches(val, name); });
      });
      this.$watch('exclude', function (val) {
        pruneCache(this$1, function (name) { return !matches(val, name); });
      });
    },

    render: function render () {
      var slot = this.$slots.default;
      var vnode = getFirstComponentChild(slot);
      var componentOptions = vnode && vnode.componentOptions;
      if (componentOptions) {
        // check pattern
        var name = getComponentName(componentOptions);
        var ref = this;
        var include = ref.include;
        var exclude = ref.exclude;
        if (
          // not included
          (include && (!name || !matches(include, name))) ||
          // excluded
          (exclude && name && matches(exclude, name))
        ) {
          return vnode
        }

        var ref$1 = this;
        var cache = ref$1.cache;
        var keys = ref$1.keys;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
          : vnode.key;
        if (cache[key]) {
          vnode.componentInstance = cache[key].componentInstance;
          // make current key freshest
          remove(keys, key);
          keys.push(key);
        } else {
          cache[key] = vnode;
          keys.push(key);
          // prune oldest entry
          if (this.max && keys.length > parseInt(this.max)) {
            pruneCacheEntry(cache, keys[0], keys, this._vnode);
          }
        }

        vnode.data.keepAlive = true;
      }
      return vnode || (slot && slot[0])
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    Object.defineProperty(Vue, 'config', configDef);

    // exposed util methods.
    // NOTE: these are not considered part of the public API - avoid relying on
    // them unless you are aware of the risk.
    Vue.util = {
      warn: warn,
      extend: extend,
      mergeOptions: mergeOptions,
      defineReactive: defineReactive$$1
    };

    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    // 2.6 explicit observable API
    Vue.observable = function (obj) {
      observe(obj);
      return obj
    };

    Vue.options = Object.create(null);
    ASSET_TYPES.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    // this is used to identify the "base" constructor to extend all plain-object
    // components with in Weex's multi-instance scenarios.
    Vue.options._base = Vue;

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue);

  Object.defineProperty(Vue.prototype, '$isServer', {
    get: isServerRendering
  });

  Object.defineProperty(Vue.prototype, '$ssrContext', {
    get: function get () {
      /* istanbul ignore next */
      return this.$vnode && this.$vnode.ssrContext
    }
  });

  // expose FunctionalRenderContext for ssr runtime helper installation
  Object.defineProperty(Vue, 'FunctionalRenderContext', {
    value: FunctionalRenderContext
  });

  Vue.version = '2.6.10';

  /*  */

  // these are reserved for web because they are directly compiled away
  // during template compilation
  var isReservedAttr = makeMap('style,class');

  // attributes that should be using props for binding
  var acceptValue = makeMap('input,textarea,option,select,progress');
  var mustUseProp = function (tag, type, attr) {
    return (
      (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
      (attr === 'selected' && tag === 'option') ||
      (attr === 'checked' && tag === 'input') ||
      (attr === 'muted' && tag === 'video')
    )
  };

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

  var convertEnumeratedValue = function (key, value) {
    return isFalsyAttrValue(value) || value === 'false'
      ? 'false'
      // allow arbitrary string value for contenteditable
      : key === 'contenteditable' && isValidContentEditableValue(value)
        ? value
        : 'true'
  };

  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (isDef(childNode.componentInstance)) {
      childNode = childNode.componentInstance._vnode;
      if (childNode && childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while (isDef(parentNode = parentNode.parent)) {
      if (parentNode && parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return renderClass(data.staticClass, data.class)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: isDef(child.class)
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function renderClass (
    staticClass,
    dynamicClass
  ) {
    if (isDef(staticClass) || isDef(dynamicClass)) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    if (Array.isArray(value)) {
      return stringifyArray(value)
    }
    if (isObject(value)) {
      return stringifyObject(value)
    }
    if (typeof value === 'string') {
      return value
    }
    /* istanbul ignore next */
    return ''
  }

  function stringifyArray (value) {
    var res = '';
    var stringified;
    for (var i = 0, l = value.length; i < l; i++) {
      if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
        if (res) { res += ' '; }
        res += stringified;
      }
    }
    return res
  }

  function stringifyObject (value) {
    var res = '';
    for (var key in value) {
      if (value[key]) {
        if (res) { res += ' '; }
        res += key;
      }
    }
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML'
  };

  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template,blockquote,iframe,tfoot'
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
    'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );

  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  var isTextInputType = makeMap('text,number,password,search,email,tel,url');

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selected = document.querySelector(el);
      if (!selected) {
        return document.createElement('div')
      }
      return selected
    } else {
      return el
    }
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    // false or null will remove the attribute but undefined will not
    if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function setStyleScope (node, scopeId) {
    node.setAttribute(scopeId, '');
  }

  var nodeOps = /*#__PURE__*/Object.freeze({
    createElement: createElement$1,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    setStyleScope: setStyleScope
  });

  /*  */

  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!isDef(key)) { return }

    var vm = vnode.context;
    var ref = vnode.componentInstance || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (!Array.isArray(refs[key])) {
          refs[key] = [ref];
        } else if (refs[key].indexOf(ref) < 0) {
          // $flow-disable-line
          refs[key].push(ref);
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

  function sameVnode (a, b) {
    return (
      a.key === b.key && (
        (
          a.tag === b.tag &&
          a.isComment === b.isComment &&
          isDef(a.data) === isDef(b.data) &&
          sameInputType(a, b)
        ) || (
          isTrue(a.isAsyncPlaceholder) &&
          a.asyncFactory === b.asyncFactory &&
          isUndef(b.asyncFactory.error)
        )
      )
    )
  }

  function sameInputType (a, b) {
    if (a.tag !== 'input') { return true }
    var i;
    var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction (backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (isDef(modules[j][hooks[i]])) {
          cbs[hooks[i]].push(modules[j][hooks[i]]);
        }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove$$1 () {
        if (--remove$$1.listeners === 0) {
          removeNode(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1
    }

    function removeNode (el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html / v-text
      if (isDef(parent)) {
        nodeOps.removeChild(parent, el);
      }
    }

    function createElm (
      vnode,
      insertedVnodeQueue,
      parentElm,
      refElm,
      nested,
      ownerArray,
      index
    ) {
      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // This vnode was used in a previous render!
        // now it's used as a new node, overwriting its elm would cause
        // potential patch errors down the road when it's used as an insertion
        // reference node. Instead, we clone the node on-demand before creating
        // associated DOM element for it.
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      vnode.isRootInsert = !nested; // for transition enter check
      if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
        return
      }

      var data = vnode.data;
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {

        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);

        /* istanbul ignore if */
        {
          createChildren(vnode, children, insertedVnodeQueue);
          if (isDef(data)) {
            invokeCreateHooks(vnode, insertedVnodeQueue);
          }
          insert(parentElm, vnode.elm, refElm);
        }
      } else if (isTrue(vnode.isComment)) {
        vnode.elm = nodeOps.createComment(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
        insert(parentElm, vnode.elm, refElm);
      }
    }

    function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i = vnode.data;
      if (isDef(i)) {
        var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
        if (isDef(i = i.hook) && isDef(i = i.init)) {
          i(vnode, false /* hydrating */);
        }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(vnode.componentInstance)) {
          initComponent(vnode, insertedVnodeQueue);
          insert(parentElm, vnode.elm, refElm);
          if (isTrue(isReactivated)) {
            reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
          }
          return true
        }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (isDef(vnode.data.pendingInsert)) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
        vnode.data.pendingInsert = null;
      }
      vnode.elm = vnode.componentInstance.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
      var i;
      // hack for #4339: a reactivated component with inner transition
      // does not trigger because the inner node's created hooks are not called
      // again. It's not ideal to involve module-specific logic in here but
      // there doesn't seem to be a better way to do it.
      var innerNode = vnode;
      while (innerNode.componentInstance) {
        innerNode = innerNode.componentInstance._vnode;
        if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
          for (i = 0; i < cbs.activate.length; ++i) {
            cbs.activate[i](emptyNode, innerNode);
          }
          insertedVnodeQueue.push(innerNode);
          break
        }
      }
      // unlike a newly created component,
      // a reactivated keep-alive component doesn't insert itself
      insert(parentElm, vnode.elm, refElm);
    }

    function insert (parent, elm, ref$$1) {
      if (isDef(parent)) {
        if (isDef(ref$$1)) {
          if (nodeOps.parentNode(ref$$1) === parent) {
            nodeOps.insertBefore(parent, elm, ref$$1);
          }
        } else {
          nodeOps.appendChild(parent, elm);
        }
      }
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
          createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
      }
    }

    function isPatchable (vnode) {
      while (vnode.componentInstance) {
        vnode = vnode.componentInstance._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (isDef(i.create)) { i.create(emptyNode, vnode); }
        if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      var i;
      if (isDef(i = vnode.fnScopeId)) {
        nodeOps.setStyleScope(vnode.elm, i);
      } else {
        var ancestor = vnode;
        while (ancestor) {
          if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
            nodeOps.setStyleScope(vnode.elm, i);
          }
          ancestor = ancestor.parent;
        }
      }
      // for slot content they should also get the scopeId from the host instance.
      if (isDef(i = activeInstance) &&
        i !== vnode.context &&
        i !== vnode.fnContext &&
        isDef(i = i.$options._scopeId)
      ) {
        nodeOps.setStyleScope(vnode.elm, i);
      }
    }

    function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
      }
    }

    function invokeDestroyHook (vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            removeNode(ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (isDef(rm) || isDef(vnode.data)) {
        var i;
        var listeners = cbs.remove.length + 1;
        if (isDef(rm)) {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        } else {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeNode(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key)
            ? oldKeyToIdx[newStartVnode.key]
            : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
          if (isUndef(idxInOld)) { // New element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          } else {
            vnodeToMove = oldCh[idxInOld];
            if (sameVnode(vnodeToMove, newStartVnode)) {
              patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
            } else {
              // same key but different element. treat as new element
              createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx > oldEndIdx) {
        refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function findIdxInOld (node, oldCh, start, end) {
      for (var i = start; i < end; i++) {
        var c = oldCh[i];
        if (isDef(c) && sameVnode(node, c)) { return i }
      }
    }

    function patchVnode (
      oldVnode,
      vnode,
      insertedVnodeQueue,
      ownerArray,
      index,
      removeOnly
    ) {
      if (oldVnode === vnode) {
        return
      }

      if (isDef(vnode.elm) && isDef(ownerArray)) {
        // clone reused vnode
        vnode = ownerArray[index] = cloneVNode(vnode);
      }

      var elm = vnode.elm = oldVnode.elm;

      if (isTrue(oldVnode.isAsyncPlaceholder)) {
        if (isDef(vnode.asyncFactory.resolved)) {
          hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
        } else {
          vnode.isAsyncPlaceholder = true;
        }
        return
      }

      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (isTrue(vnode.isStatic) &&
        isTrue(oldVnode.isStatic) &&
        vnode.key === oldVnode.key &&
        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
      ) {
        vnode.componentInstance = oldVnode.componentInstance;
        return
      }

      var i;
      var data = vnode.data;
      if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }

      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (isDef(data) && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (isTrue(initial) && isDef(vnode.parent)) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }
    // list of modules that can skip create hook during hydration because they
    // are already rendered on the client or has no need for initialization
    // Note: style is excluded because it relies on initial clone for future
    // deep updates (#7063).
    var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

    // Note: this is a browser-only function so we can assume elms are DOM nodes.
    function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
      var i;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      inVPre = inVPre || (data && data.pre);
      vnode.elm = elm;

      if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
        vnode.isAsyncPlaceholder = true;
        return true
      }
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.componentInstance)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          // empty element, allow client to pick up and populate children
          if (!elm.hasChildNodes()) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            // v-html and domProps: innerHTML
            if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
              if (i !== elm.innerHTML) {
                return false
              }
            } else {
              // iterate and compare children lists
              var childrenMatch = true;
              var childNode = elm.firstChild;
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                  childrenMatch = false;
                  break
                }
                childNode = childNode.nextSibling;
              }
              // if childNode is not null, it means the actual childNodes list is
              // longer than the virtual children list.
              if (!childrenMatch || childNode) {
                return false
              }
            }
          }
        }
        if (isDef(data)) {
          var fullInvoke = false;
          for (var key in data) {
            if (!isRenderedModule(key)) {
              fullInvoke = true;
              invokeCreateHooks(vnode, insertedVnodeQueue);
              break
            }
          }
          if (!fullInvoke && data['class']) {
            // ensure collecting deps for deep class bindings for future updates
            traverse(data['class']);
          }
        }
      } else if (elm.data !== vnode.text) {
        elm.data = vnode.text;
      }
      return true
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      if (isUndef(vnode)) {
        if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
        return
      }

      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (isUndef(oldVnode)) {
        // empty mount (likely as component), create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          // patch existing root node
          patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
              oldVnode.removeAttribute(SSR_ATTR);
              hydrating = true;
            }
            if (isTrue(hydrating)) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              }
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }

          // replacing existing element
          var oldElm = oldVnode.elm;
          var parentElm = nodeOps.parentNode(oldElm);

          // create new node
          createElm(
            vnode,
            insertedVnodeQueue,
            // extremely rare edge case: do not insert if old element is in a
            // leaving transition. Only happens when combining transition +
            // keep-alive + HOCs. (#4590)
            oldElm._leaveCb ? null : parentElm,
            nodeOps.nextSibling(oldElm)
          );

          // update parent placeholder node element, recursively
          if (isDef(vnode.parent)) {
            var ancestor = vnode.parent;
            var patchable = isPatchable(vnode);
            while (ancestor) {
              for (var i = 0; i < cbs.destroy.length; ++i) {
                cbs.destroy[i](ancestor);
              }
              ancestor.elm = vnode.elm;
              if (patchable) {
                for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                  cbs.create[i$1](emptyNode, ancestor);
                }
                // #6513
                // invoke insert hooks that may have been merged by create hooks.
                // e.g. for directives that uses the "inserted" hook.
                var insert = ancestor.data.hook.insert;
                if (insert.merged) {
                  // start at index 1 to avoid re-invoking component mounted hook
                  for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                    insert.fns[i$2]();
                  }
                }
              } else {
                registerRef(ancestor);
              }
              ancestor = ancestor.parent;
            }
          }

          // destroy old node
          if (isDef(parentElm)) {
            removeVnodes(parentElm, [oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (oldVnode, vnode) {
    if (oldVnode.data.directives || vnode.data.directives) {
      _update(oldVnode, vnode);
    }
  }

  function _update (oldVnode, vnode) {
    var isCreate = oldVnode === emptyNode;
    var isDestroy = vnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        dir.oldArg = oldDir.arg;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        for (var i = 0; i < dirsWithInsert.length; i++) {
          callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
        }
      };
      if (isCreate) {
        mergeVNodeHook(vnode, 'insert', callInsert);
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode, 'postpatch', function () {
        for (var i = 0; i < dirsWithPostpatch.length; i++) {
          callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
        }
      });
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      // $flow-disable-line
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        // $flow-disable-line
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    // $flow-disable-line
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      try {
        fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
      } catch (e) {
        handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
      }
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    var opts = vnode.componentOptions;
    if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
      return
    }
    if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(attrs.__ob__)) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    // #4391: in IE9, setting type can reset value for input[type=radio]
    // #6666: IE/Edge forces progress value down to 1 before setting a max
    /* istanbul ignore if */
    if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
      setAttr(elm, 'value', attrs.value);
    }
    for (key in oldAttrs) {
      if (isUndef(attrs[key])) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (el.tagName.indexOf('-') > -1) {
      baseSetAttr(el, key, value);
    } else if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        // technically allowfullscreen is a boolean attribute for <iframe>,
        // but Flash expects a value of "true" when used on <embed> tag
        value = key === 'allowfullscreen' && el.tagName === 'EMBED'
          ? 'true'
          : key;
        el.setAttribute(key, value);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, convertEnumeratedValue(key, value));
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      baseSetAttr(el, key, value);
    }
  }

  function baseSetAttr (el, key, value) {
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // #7138: IE10 & 11 fires input event when setting placeholder on
      // <textarea>... block the first input event and remove the blocker
      // immediately.
      /* istanbul ignore if */
      if (
        isIE && !isIE9 &&
        el.tagName === 'TEXTAREA' &&
        key === 'placeholder' && value !== '' && !el.__ieph
      ) {
        var blocker = function (e) {
          e.stopImmediatePropagation();
          el.removeEventListener('input', blocker);
        };
        el.addEventListener('input', blocker);
        // $flow-disable-line
        el.__ieph = true; /* IE placeholder patched */
      }
      el.setAttribute(key, value);
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (
      isUndef(data.staticClass) &&
      isUndef(data.class) && (
        isUndef(oldData) || (
          isUndef(oldData.staticClass) &&
          isUndef(oldData.class)
        )
      )
    ) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (isDef(transitionClass)) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  /*  */

  /*  */

  /*  */

  /*  */

  // in some cases, the event used has to be determined at runtime
  // so we used some reserved tokens during compile.
  var RANGE_TOKEN = '__r';
  var CHECKBOX_RADIO_TOKEN = '__c';

  /*  */

  // normalize v-model event tokens that can only be determined at runtime.
  // it's important to place the event as the first in the array because
  // the whole point is ensuring the v-model callback gets called before
  // user-attached handlers.
  function normalizeEvents (on) {
    /* istanbul ignore if */
    if (isDef(on[RANGE_TOKEN])) {
      // IE input[type=range] only supports `change` event
      var event = isIE ? 'change' : 'input';
      on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
      delete on[RANGE_TOKEN];
    }
    // This was originally intended to fix #4521 but no longer necessary
    // after 2.5. Keeping it for backwards compat with generated code from < 2.4
    /* istanbul ignore if */
    if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
      on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
      delete on[CHECKBOX_RADIO_TOKEN];
    }
  }

  var target$1;

  function createOnceHandler$1 (event, handler, capture) {
    var _target = target$1; // save current target element in closure
    return function onceHandler () {
      var res = handler.apply(null, arguments);
      if (res !== null) {
        remove$2(event, onceHandler, capture, _target);
      }
    }
  }

  // #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
  // implementation and does not fire microtasks in between event propagation, so
  // safe to exclude.
  var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

  function add$1 (
    name,
    handler,
    capture,
    passive
  ) {
    // async edge case #6566: inner click event triggers patch, event handler
    // attached to outer element during patch, and triggered again. This
    // happens because browsers fire microtask ticks between event propagation.
    // the solution is simple: we save the timestamp when a handler is attached,
    // and the handler would only fire if the event passed to it was fired
    // AFTER it was attached.
    if (useMicrotaskFix) {
      var attachedTimestamp = currentFlushTimestamp;
      var original = handler;
      handler = original._wrapper = function (e) {
        if (
          // no bubbling, should always fire.
          // this is just a safety net in case event.timeStamp is unreliable in
          // certain weird environments...
          e.target === e.currentTarget ||
          // event is fired after handler attachment
          e.timeStamp >= attachedTimestamp ||
          // bail for environments that have buggy event.timeStamp implementations
          // #9462 iOS 9 bug: event.timeStamp is 0 after history.pushState
          // #9681 QtWebEngine event.timeStamp is negative value
          e.timeStamp <= 0 ||
          // #9448 bail if event is fired in another document in a multi-page
          // electron/nw.js app, since event.timeStamp will be using a different
          // starting reference
          e.target.ownerDocument !== document
        ) {
          return original.apply(this, arguments)
        }
      };
    }
    target$1.addEventListener(
      name,
      handler,
      supportsPassive
        ? { capture: capture, passive: passive }
        : capture
    );
  }

  function remove$2 (
    name,
    handler,
    capture,
    _target
  ) {
    (_target || target$1).removeEventListener(
      name,
      handler._wrapper || handler,
      capture
    );
  }

  function updateDOMListeners (oldVnode, vnode) {
    if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    target$1 = vnode.elm;
    normalizeEvents(on);
    updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
    target$1 = undefined;
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  var svgContainer;

  function updateDOMProps (oldVnode, vnode) {
    if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (isDef(props.__ob__)) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (!(key in props)) {
        elm[key] = '';
      }
    }

    for (key in props) {
      cur = props[key];
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if (key === 'textContent' || key === 'innerHTML') {
        if (vnode.children) { vnode.children.length = 0; }
        if (cur === oldProps[key]) { continue }
        // #6601 work around Chrome version <= 55 bug where single textNode
        // replaced by innerHTML/textContent retains its parentNode property
        if (elm.childNodes.length === 1) {
          elm.removeChild(elm.childNodes[0]);
        }
      }

      if (key === 'value' && elm.tagName !== 'PROGRESS') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = isUndef(cur) ? '' : String(cur);
        if (shouldUpdateValue(elm, strCur)) {
          elm.value = strCur;
        }
      } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
        // IE doesn't support innerHTML for SVG elements
        svgContainer = svgContainer || document.createElement('div');
        svgContainer.innerHTML = "<svg>" + cur + "</svg>";
        var svg = svgContainer.firstChild;
        while (elm.firstChild) {
          elm.removeChild(elm.firstChild);
        }
        while (svg.firstChild) {
          elm.appendChild(svg.firstChild);
        }
      } else if (
        // skip the update if old and new VDOM state is the same.
        // `value` is handled separately because the DOM value may be temporarily
        // out of sync with VDOM state due to focus, composition and modifiers.
        // This  #4521 by skipping the unnecesarry `checked` update.
        cur !== oldProps[key]
      ) {
        // some property updates can throw
        // e.g. `value` on <progress> w/ non-finite value
        try {
          elm[key] = cur;
        } catch (e) {}
      }
    }
  }

  // check platforms/web/util/attrs.js acceptValue


  function shouldUpdateValue (elm, checkVal) {
    return (!elm.composing && (
      elm.tagName === 'OPTION' ||
      isNotInFocusAndDirty(elm, checkVal) ||
      isDirtyWithModifiers(elm, checkVal)
    ))
  }

  function isNotInFocusAndDirty (elm, checkVal) {
    // return true when textbox (.number and .trim) loses focus and its value is
    // not equal to the updated value
    var notInFocus = true;
    // #6157
    // work around IE bug when accessing document.activeElement in an iframe
    try { notInFocus = document.activeElement !== elm; } catch (e) {}
    return notInFocus && elm.value !== checkVal
  }

  function isDirtyWithModifiers (elm, newVal) {
    var value = elm.value;
    var modifiers = elm._vModifiers; // injected by v-model runtime
    if (isDef(modifiers)) {
      if (modifiers.number) {
        return toNumber(value) !== toNumber(newVal)
      }
      if (modifiers.trim) {
        return value.trim() !== newVal.trim()
      }
    }
    return value !== newVal
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var parseStyleText = cached(function (cssText) {
    var res = {};
    var listDelimiter = /;(?![^(]*\))/g;
    var propertyDelimiter = /:(.+)/;
    cssText.split(listDelimiter).forEach(function (item) {
      if (item) {
        var tmp = item.split(propertyDelimiter);
        tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return res
  });

  // merge static and dynamic style data on the same vnode
  function normalizeStyleData (data) {
    var style = normalizeStyleBinding(data.style);
    // static style is pre-processed into an object during compilation
    // and is always a fresh object, so it's safe to merge into it
    return data.staticStyle
      ? extend(data.staticStyle, style)
      : style
  }

  // normalize possible array / string values into Object
  function normalizeStyleBinding (bindingStyle) {
    if (Array.isArray(bindingStyle)) {
      return toObject(bindingStyle)
    }
    if (typeof bindingStyle === 'string') {
      return parseStyleText(bindingStyle)
    }
    return bindingStyle
  }

  /**
   * parent component style should be after child's
   * so that parent component's style could override it
   */
  function getStyle (vnode, checkChild) {
    var res = {};
    var styleData;

    if (checkChild) {
      var childNode = vnode;
      while (childNode.componentInstance) {
        childNode = childNode.componentInstance._vnode;
        if (
          childNode && childNode.data &&
          (styleData = normalizeStyleData(childNode.data))
        ) {
          extend(res, styleData);
        }
      }
    }

    if ((styleData = normalizeStyleData(vnode.data))) {
      extend(res, styleData);
    }

    var parentNode = vnode;
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
        extend(res, styleData);
      }
    }
    return res
  }

  /*  */

  var cssVarRE = /^--/;
  var importantRE = /\s*!important$/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else if (importantRE.test(val)) {
      el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
    } else {
      var normalizedName = normalize(name);
      if (Array.isArray(val)) {
        // Support values array created by autoprefixer, e.g.
        // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
        // Set them one by one, and the browser will only set those it can recognize
        for (var i = 0, len = val.length; i < len; i++) {
          el.style[normalizedName] = val[i];
        }
      } else {
        el.style[normalizedName] = val;
      }
    }
  };

  var vendorNames = ['Webkit', 'Moz', 'ms'];

  var emptyStyle;
  var normalize = cached(function (prop) {
    emptyStyle = emptyStyle || document.createElement('div').style;
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in emptyStyle)) {
      return prop
    }
    var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < vendorNames.length; i++) {
      var name = vendorNames[i] + capName;
      if (name in emptyStyle) {
        return name
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    var data = vnode.data;
    var oldData = oldVnode.data;

    if (isUndef(data.staticStyle) && isUndef(data.style) &&
      isUndef(oldData.staticStyle) && isUndef(oldData.style)
    ) {
      return
    }

    var cur, name;
    var el = vnode.elm;
    var oldStaticStyle = oldData.staticStyle;
    var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

    // if static style exists, stylebinding already merged into it when doing normalizeStyleData
    var oldStyle = oldStaticStyle || oldStyleBinding;

    var style = normalizeStyleBinding(vnode.data.style) || {};

    // store normalized style under a different key for next diff
    // make sure to clone it if it's reactive, since the user likely wants
    // to mutate it.
    vnode.data.normalizedStyle = isDef(style.__ob__)
      ? extend({}, style)
      : style;

    var newStyle = getStyle(vnode, true);

    for (name in oldStyle) {
      if (isUndef(newStyle[name])) {
        setProp(el, name, '');
      }
    }
    for (name in newStyle) {
      cur = newStyle[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  var whitespaceRE = /\s+/;

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !(cls = cls.trim())) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
      if (!el.classList.length) {
        el.removeAttribute('class');
      }
    } else {
      var cur = " " + (el.getAttribute('class') || '') + " ";
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      cur = cur.trim();
      if (cur) {
        el.setAttribute('class', cur);
      } else {
        el.removeAttribute('class');
      }
    }
  }

  /*  */

  function resolveTransition (def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      enterToClass: (name + "-enter-to"),
      enterActiveClass: (name + "-enter-active"),
      leaveClass: (name + "-leave"),
      leaveToClass: (name + "-leave-to"),
      leaveActiveClass: (name + "-leave-active")
    }
  });

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined
    ) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined
    ) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  // binding to window is necessary to make hot reload work in IE in strict mode
  var raf = inBrowser
    ? window.requestAnimationFrame
      ? window.requestAnimationFrame.bind(window)
      : setTimeout
    : /* istanbul ignore next */ function (fn) { return fn(); };

  function nextFrame (fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
    if (transitionClasses.indexOf(cls) < 0) {
      transitionClasses.push(cls);
      addClass(el, cls);
    }
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    var styles = window.getComputedStyle(el);
    // JSDOM may return undefined for transition properties
    var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
    var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
    var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
    var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
    var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  // Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
  // in a locale-dependent way, using a comma instead of a dot.
  // If comma is not replaced with a dot, the input will be rounded down (i.e. acting
  // as a floor function) causing unexpected behaviors
  function toMs (s) {
    return Number(s.slice(0, -1).replace(',', '.')) * 1000
  }

  /*  */

  function enter (vnode, toggleDisplay) {
    var el = vnode.elm;

    // call leave callback now
    if (isDef(el._leaveCb)) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data)) {
      return
    }

    /* istanbul ignore if */
    if (isDef(el._enterCb) || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterToClass = data.enterToClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearToClass = data.appearToClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;
    var duration = data.duration;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var context = activeInstance;
    var transitionNode = activeInstance.$vnode;
    while (transitionNode && transitionNode.parent) {
      context = transitionNode.context;
      transitionNode = transitionNode.parent;
    }

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear && appearClass
      ? appearClass
      : enterClass;
    var activeClass = isAppear && appearActiveClass
      ? appearActiveClass
      : enterActiveClass;
    var toClass = isAppear && appearToClass
      ? appearToClass
      : enterToClass;

    var beforeEnterHook = isAppear
      ? (beforeAppear || beforeEnter)
      : beforeEnter;
    var enterHook = isAppear
      ? (typeof appear === 'function' ? appear : enter)
      : enter;
    var afterEnterHook = isAppear
      ? (afterAppear || afterEnter)
      : afterEnter;
    var enterCancelledHook = isAppear
      ? (appearCancelled || enterCancelled)
      : enterCancelled;

    var explicitEnterDuration = toNumber(
      isObject(duration)
        ? duration.enter
        : duration
    );

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(enterHook);

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, toClass);
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode, 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode &&
          pendingNode.tag === vnode.tag &&
          pendingNode.elm._leaveCb
        ) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      });
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled) {
          addTransitionClass(el, toClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitEnterDuration)) {
              setTimeout(cb, explicitEnterDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }

    if (vnode.data.show) {
      toggleDisplay && toggleDisplay();
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (isDef(el._enterCb)) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (isUndef(data) || el.nodeType !== 1) {
      return rm()
    }

    /* istanbul ignore if */
    if (isDef(el._leaveCb)) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveToClass = data.leaveToClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;
    var duration = data.duration;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl = getHookArgumentsLength(leave);

    var explicitLeaveDuration = toNumber(
      isObject(duration)
        ? duration.leave
        : duration
    );

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveToClass);
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show && el.parentNode) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled) {
            addTransitionClass(el, leaveToClass);
            if (!userWantsControl) {
              if (isValidDuration(explicitLeaveDuration)) {
                setTimeout(cb, explicitLeaveDuration);
              } else {
                whenTransitionEnds(el, type, cb);
              }
            }
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  function isValidDuration (val) {
    return typeof val === 'number' && !isNaN(val)
  }

  /**
   * Normalize a transition hook's argument length. The hook may be:
   * - a merged hook (invoker) with the original in .fns
   * - a wrapped component method (check ._length)
   * - a plain function (.length)
   */
  function getHookArgumentsLength (fn) {
    if (isUndef(fn)) {
      return false
    }
    var invokerFns = fn.fns;
    if (isDef(invokerFns)) {
      // invoker
      return getHookArgumentsLength(
        Array.isArray(invokerFns)
          ? invokerFns[0]
          : invokerFns
      )
    } else {
      return (fn._length || fn.length) > 1
    }
  }

  function _enter (_, vnode) {
    if (vnode.data.show !== true) {
      enter(vnode);
    }
  }

  var transition = inBrowser ? {
    create: _enter,
    activate: _enter,
    remove: function remove$$1 (vnode, rm) {
      /* istanbul ignore else */
      if (vnode.data.show !== true) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /**
   * Not type checking this file because flow doesn't like attaching
   * properties to Elements.
   */

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var directive = {
    inserted: function inserted (el, binding, vnode, oldVnode) {
      if (vnode.tag === 'select') {
        // #6903
        if (oldVnode.elm && !oldVnode.elm._vOptions) {
          mergeVNodeHook(vnode, 'postpatch', function () {
            directive.componentUpdated(el, binding, vnode);
          });
        } else {
          setSelected(el, binding, vnode.context);
        }
        el._vOptions = [].map.call(el.options, getValue);
      } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
        el._vModifiers = binding.modifiers;
        if (!binding.modifiers.lazy) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
          // Safari < 10.2 & UIWebView doesn't fire compositionend when
          // switching focus before confirming composition choice
          // this also fixes the issue where some browsers e.g. iOS Chrome
          // fires "change" instead of "input" on autocomplete.
          el.addEventListener('change', onCompositionEnd);
          /* istanbul ignore if */
          if (isIE9) {
            el.vmodel = true;
          }
        }
      }
    },

    componentUpdated: function componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var prevOptions = el._vOptions;
        var curOptions = el._vOptions = [].map.call(el.options, getValue);
        if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
          // trigger change event if
          // no matching option found for at least one value
          var needReset = el.multiple
            ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
            : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
          if (needReset) {
            trigger(el, 'change');
          }
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    actuallySetSelected(el, binding, vm);
    /* istanbul ignore if */
    if (isIE || isEdge) {
      setTimeout(function () {
        actuallySetSelected(el, binding, vm);
      }, 0);
    }
  }

  function actuallySetSelected (el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    return options.every(function (o) { return !looseEqual(o, value); })
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    // prevent triggering an input event for no reason
    if (!e.target.composing) { return }
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.componentInstance._vnode)
      : vnode
  }

  var show = {
    bind: function bind (el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      var originalDisplay = el.__vOriginalDisplay =
        el.style.display === 'none' ? '' : el.style.display;
      if (value && transition$$1) {
        vnode.data.show = true;
        enter(vnode, function () {
          el.style.display = originalDisplay;
        });
      } else {
        el.style.display = value ? originalDisplay : 'none';
      }
    },

    update: function update (el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (!value === !oldValue) { return }
      vnode = locateNode(vnode);
      var transition$$1 = vnode.data && vnode.data.transition;
      if (transition$$1) {
        vnode.data.show = true;
        if (value) {
          enter(vnode, function () {
            el.style.display = el.__vOriginalDisplay;
          });
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    },

    unbind: function unbind (
      el,
      binding,
      vnode,
      oldVnode,
      isDestroy
    ) {
      if (!isDestroy) {
        el.style.display = el.__vOriginalDisplay;
      }
    }
  };

  var platformDirectives = {
    model: directive,
    show: show
  };

  /*  */

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterToClass: String,
    leaveToClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
    appearToClass: String,
    duration: [Number, String, Object]
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1];
    }
    return data
  }

  function placeholder (h, rawChild) {
    if (/\d-keep-alive$/.test(rawChild.tag)) {
      return h('keep-alive', {
        props: rawChild.componentOptions.propsData
      })
    }
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  function isSameChild (child, oldChild) {
    return oldChild.key === child.key && oldChild.tag === child.tag
  }

  var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

  var isVShowDirective = function (d) { return d.name === 'show'; };

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,

    render: function render (h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(isNotTextNode);
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      var mode = this.mode;

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      // ensure a key that is unique to the vnode type and to this transition
      // component instance. This key will be used to remove pending leaving nodes
      // during entering.
      var id = "__transition-" + (this._uid) + "-";
      child.key = child.key == null
        ? child.isComment
          ? id + 'comment'
          : id + child.tag
        : isPrimitive(child.key)
          ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
          : child.key;

      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(isVShowDirective)) {
        child.data.show = true;
      }

      if (
        oldChild &&
        oldChild.data &&
        !isSameChild(child, oldChild) &&
        !isAsyncPlaceholder(oldChild) &&
        // #6687 component root is a comment node
        !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
      ) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);
        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          });
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          if (isAsyncPlaceholder(child)) {
            return oldRawChild
          }
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave);
          mergeVNodeHook(data, 'enterCancelled', performLeave);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
        }
      }

      return rawChild
    }
  };

  /*  */

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    beforeMount: function beforeMount () {
      var this$1 = this;

      var update = this._update;
      this._update = function (vnode, hydrating) {
        var restoreActiveInstance = setActiveInstance(this$1);
        // force removing pass
        this$1.__patch__(
          this$1._vnode,
          this$1.kept,
          false, // hydrating
          true // removeOnly (!important, avoids unnecessary moves)
        );
        this$1._vnode = this$1.kept;
        restoreActiveInstance();
        update.call(this$1, vnode, hydrating);
      };
    },

    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          }
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    updated: function updated () {
      var children = this.prevChildren;
      var moveClass = this.moveClass || ((this.name || 'v') + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      // assign to this to avoid being removed in tree-shaking
      // $flow-disable-line
      this._reflow = document.body.offsetHeight;

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (e && e.target !== el) {
              return
            }
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        /* istanbul ignore if */
        if (this._hasMove) {
          return this._hasMove
        }
        // Detect whether an element with the move class applied has
        // CSS transitions. Since the element may be inside an entering
        // transition at this very moment, we make a clone of it and remove
        // all other transition classes applied to ensure only the move class
        // is applied.
        var clone = el.cloneNode();
        if (el._transitionClasses) {
          el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
        }
        addClass(clone, moveClass);
        clone.style.display = 'none';
        this.$el.appendChild(clone);
        var info = getTransitionInfo(clone);
        this.$el.removeChild(clone);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue.config.mustUseProp = mustUseProp;
  Vue.config.isReservedTag = isReservedTag;
  Vue.config.isReservedAttr = isReservedAttr;
  Vue.config.getTagNamespace = getTagNamespace;
  Vue.config.isUnknownElement = isUnknownElement;

  // install platform runtime directives & components
  extend(Vue.options.directives, platformDirectives);
  extend(Vue.options.components, platformComponents);

  // install platform patch function
  Vue.prototype.__patch__ = inBrowser ? patch : noop;

  // public mount method
  Vue.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && inBrowser ? query(el) : undefined;
    return mountComponent(this, el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  if (inBrowser) {
    setTimeout(function () {
      if (config.devtools) {
        if (devtools) {
          devtools.emit('init', Vue);
        }
      }
    }, 0);
  }

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  var script = {
    name: 'Cell',
    props: {
      title: {
        type: String,
        default: ''
      },
      hideDetails: {
        type: Boolean,
        default: false
      },
      force: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      doClick() {
        this.$emit('click');
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

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD;
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);

        if (HEAD === undefined) {
          HEAD = document.head || document.getElementsByTagName('head')[0];
        }

        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  var browser = createInjector;

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { class: ["cell", _vm.force ? "cell--force" : ""] }, [
      _c("div", { staticClass: "title" }, [
        _vm._v("\n    " + _vm._s(_vm.title) + "\n  ")
      ]),
      _vm._v(" "),
      !_vm.force && !_vm.hideDetails
        ? _c("div", { staticClass: "details", on: { click: _vm.doClick } }, [
            _vm._v("\n    点击显示\n  ")
          ])
        : _vm._e()
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-1ab3ce86_0", { source: "\n.cell[data-v-1ab3ce86] {\n  padding: 10px 10px;\n  display: flex;\n  border-bottom: 1px solid #e1e1e1;\n  width: 100%;\n  box-sizing: border-box;\n  overflow: hidden;\n  font-size: 14px;\n}\n.cell--force[data-v-1ab3ce86] {\n  background-color: deepskyblue;\n  color: #fff;\n}\n.title[data-v-1ab3ce86] {\n  flex-grow: 1;\n  flex-shrink: 1;\n  flex-wrap: wrap;\n}\n.details[data-v-1ab3ce86] {\n  flex-grow: 0;\n  flex-shrink: 0;\n  text-align: right;\n  margin-left: 10px;\n}\n", map: {"version":3,"sources":["/Users/qymh/Documents/SelectQ/demo/vue/components/cell.vue"],"names":[],"mappings":";AAqCA;EACA,kBAAA;EACA,aAAA;EACA,gCAAA;EACA,WAAA;EACA,sBAAA;EACA,gBAAA;EACA,eAAA;AACA;AACA;EACA,6BAAA;EACA,WAAA;AACA;AACA;EACA,YAAA;EACA,cAAA;EACA,eAAA;AACA;AACA;EACA,YAAA;EACA,cAAA;EACA,iBAAA;EACA,iBAAA;AACA","file":"cell.vue","sourcesContent":["<template>\n  <div :class=\"['cell', force ? 'cell--force' : '']\">\n    <div class=\"title\">\n      {{ title }}\n    </div>\n    <div v-if=\"!force && !hideDetails\" class=\"details\" @click=\"doClick\">\n      点击显示\n    </div>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'Cell',\n  props: {\n    title: {\n      type: String,\n      default: ''\n    },\n    hideDetails: {\n      type: Boolean,\n      default: false\n    },\n    force: {\n      type: Boolean,\n      default: false\n    }\n  },\n  methods: {\n    doClick() {\n      this.$emit('click');\n    }\n  }\n};\n</script>\n\n<style scoped>\n.cell {\n  padding: 10px 10px;\n  display: flex;\n  border-bottom: 1px solid #e1e1e1;\n  width: 100%;\n  box-sizing: border-box;\n  overflow: hidden;\n  font-size: 14px;\n}\n.cell--force {\n  background-color: deepskyblue;\n  color: #fff;\n}\n.title {\n  flex-grow: 1;\n  flex-shrink: 1;\n  flex-wrap: wrap;\n}\n.details {\n  flex-grow: 0;\n  flex-shrink: 0;\n  text-align: right;\n  margin-left: 10px;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-1ab3ce86";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var cell = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //

  var script$1 = {
    name: 'Btn',
    methods: {
      doClick() {
        this.$emit('click');
      }
    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "button" }, [
      _c(
        "div",
        { staticClass: "button-value", on: { click: _vm.doClick } },
        [_vm._t("default")],
        2
      )
    ])
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-3fcd32a4_0", { source: "\n.button[data-v-3fcd32a4] {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  padding: 0 10px;\n}\n.button-value[data-v-3fcd32a4] {\n  background-color: deepskyblue;\n  display: inline-block;\n  padding: 5px;\n  border-radius: 10px;\n  color: #fff;\n  font-size: 12px;\n}\n", map: {"version":3,"sources":["/Users/qymh/Documents/SelectQ/demo/vue/components/btn.vue"],"names":[],"mappings":";AAoBA;EACA,gBAAA;EACA,mBAAA;EACA,eAAA;AACA;AACA;EACA,6BAAA;EACA,qBAAA;EACA,YAAA;EACA,mBAAA;EACA,WAAA;EACA,eAAA;AACA","file":"btn.vue","sourcesContent":["<template>\n  <div class=\"button\">\n    <div class=\"button-value\" @click=\"doClick\">\n      <slot />\n    </div>\n  </div>\n</template>\n\n<script>\nexport default {\n  name: 'Btn',\n  methods: {\n    doClick() {\n      this.$emit('click');\n    }\n  }\n};\n</script>\n\n<style scoped>\n.button {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  padding: 0 10px;\n}\n.button-value {\n  background-color: deepskyblue;\n  display: inline-block;\n  padding: 5px;\n  border-radius: 10px;\n  color: #fff;\n  font-size: 12px;\n}\n</style>\n"]}, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-3fcd32a4";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    

    
    var btn = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      browser,
      undefined
    );

  const data = [
    {
      code: '11',
      name: '北京市',
      children: [
        {
          code: '1101',
          name: '市辖区',
          children: [
            { code: '110101', name: '东城区' },
            { code: '110102', name: '西城区' },
            { code: '110105', name: '朝阳区' },
            { code: '110106', name: '丰台区' },
            { code: '110107', name: '石景山区' },
            { code: '110108', name: '海淀区' },
            { code: '110109', name: '门头沟区' },
            { code: '110111', name: '房山区' },
            { code: '110112', name: '通州区' },
            { code: '110113', name: '顺义区' },
            { code: '110114', name: '昌平区' },
            { code: '110115', name: '大兴区' },
            { code: '110116', name: '怀柔区' },
            { code: '110117', name: '平谷区' },
            { code: '110118', name: '密云区' },
            { code: '110119', name: '延庆区' }
          ]
        }
      ]
    },
    {
      code: '12',
      name: '天津市',
      children: [
        {
          code: '1201',
          name: '市辖区',
          children: [
            { code: '120101', name: '和平区' },
            { code: '120102', name: '河东区' },
            { code: '120103', name: '河西区' },
            { code: '120104', name: '南开区' },
            { code: '120105', name: '河北区' },
            { code: '120106', name: '红桥区' },
            { code: '120110', name: '东丽区' },
            { code: '120111', name: '西青区' },
            { code: '120112', name: '津南区' },
            { code: '120113', name: '北辰区' },
            { code: '120114', name: '武清区' },
            { code: '120115', name: '宝坻区' },
            { code: '120116', name: '滨海新区' },
            { code: '120117', name: '宁河区' },
            { code: '120118', name: '静海区' },
            { code: '120119', name: '蓟州区' }
          ]
        }
      ]
    },
    {
      code: '13',
      name: '河北省',
      children: [
        {
          code: '1301',
          name: '石家庄市',
          children: [
            { code: '130102', name: '长安区' },
            { code: '130104', name: '桥西区' },
            { code: '130105', name: '新华区' },
            { code: '130107', name: '井陉矿区' },
            { code: '130108', name: '裕华区' },
            { code: '130109', name: '藁城区' },
            { code: '130110', name: '鹿泉区' },
            { code: '130111', name: '栾城区' },
            { code: '130121', name: '井陉县' },
            { code: '130123', name: '正定县' },
            { code: '130125', name: '行唐县' },
            { code: '130126', name: '灵寿县' },
            { code: '130127', name: '高邑县' },
            { code: '130128', name: '深泽县' },
            { code: '130129', name: '赞皇县' },
            { code: '130130', name: '无极县' },
            { code: '130131', name: '平山县' },
            { code: '130132', name: '元氏县' },
            { code: '130133', name: '赵县' },
            { code: '130171', name: '石家庄高新技术产业开发区' },
            { code: '130172', name: '石家庄循环化工园区' },
            { code: '130181', name: '辛集市' },
            { code: '130183', name: '晋州市' },
            { code: '130184', name: '新乐市' }
          ]
        },
        {
          code: '1302',
          name: '唐山市',
          children: [
            { code: '130202', name: '路南区' },
            { code: '130203', name: '路北区' },
            { code: '130204', name: '古冶区' },
            { code: '130205', name: '开平区' },
            { code: '130207', name: '丰南区' },
            { code: '130208', name: '丰润区' },
            { code: '130209', name: '曹妃甸区' },
            { code: '130224', name: '滦南县' },
            { code: '130225', name: '乐亭县' },
            { code: '130227', name: '迁西县' },
            { code: '130229', name: '玉田县' },
            { code: '130271', name: '唐山市芦台经济技术开发区' },
            { code: '130272', name: '唐山市汉沽管理区' },
            { code: '130273', name: '唐山高新技术产业开发区' },
            { code: '130274', name: '河北唐山海港经济开发区' },
            { code: '130281', name: '遵化市' },
            { code: '130283', name: '迁安市' },
            { code: '130284', name: '滦州市' }
          ]
        },
        {
          code: '1303',
          name: '秦皇岛市',
          children: [
            { code: '130302', name: '海港区' },
            { code: '130303', name: '山海关区' },
            { code: '130304', name: '北戴河区' },
            { code: '130306', name: '抚宁区' },
            { code: '130321', name: '青龙满族自治县' },
            { code: '130322', name: '昌黎县' },
            { code: '130324', name: '卢龙县' },
            { code: '130371', name: '秦皇岛市经济技术开发区' },
            { code: '130372', name: '北戴河新区' }
          ]
        },
        {
          code: '1304',
          name: '邯郸市',
          children: [
            { code: '130402', name: '邯山区' },
            { code: '130403', name: '丛台区' },
            { code: '130404', name: '复兴区' },
            { code: '130406', name: '峰峰矿区' },
            { code: '130407', name: '肥乡区' },
            { code: '130408', name: '永年区' },
            { code: '130423', name: '临漳县' },
            { code: '130424', name: '成安县' },
            { code: '130425', name: '大名县' },
            { code: '130426', name: '涉县' },
            { code: '130427', name: '磁县' },
            { code: '130430', name: '邱县' },
            { code: '130431', name: '鸡泽县' },
            { code: '130432', name: '广平县' },
            { code: '130433', name: '馆陶县' },
            { code: '130434', name: '魏县' },
            { code: '130435', name: '曲周县' },
            { code: '130471', name: '邯郸经济技术开发区' },
            { code: '130473', name: '邯郸冀南新区' },
            { code: '130481', name: '武安市' }
          ]
        },
        {
          code: '1305',
          name: '邢台市',
          children: [
            { code: '130502', name: '桥东区' },
            { code: '130503', name: '桥西区' },
            { code: '130521', name: '邢台县' },
            { code: '130522', name: '临城县' },
            { code: '130523', name: '内丘县' },
            { code: '130524', name: '柏乡县' },
            { code: '130525', name: '隆尧县' },
            { code: '130526', name: '任县' },
            { code: '130527', name: '南和县' },
            { code: '130528', name: '宁晋县' },
            { code: '130529', name: '巨鹿县' },
            { code: '130530', name: '新河县' },
            { code: '130531', name: '广宗县' },
            { code: '130532', name: '平乡县' },
            { code: '130533', name: '威县' },
            { code: '130534', name: '清河县' },
            { code: '130535', name: '临西县' },
            { code: '130571', name: '河北邢台经济开发区' },
            { code: '130581', name: '南宫市' },
            { code: '130582', name: '沙河市' }
          ]
        },
        {
          code: '1306',
          name: '保定市',
          children: [
            { code: '130602', name: '竞秀区' },
            { code: '130606', name: '莲池区' },
            { code: '130607', name: '满城区' },
            { code: '130608', name: '清苑区' },
            { code: '130609', name: '徐水区' },
            { code: '130623', name: '涞水县' },
            { code: '130624', name: '阜平县' },
            { code: '130626', name: '定兴县' },
            { code: '130627', name: '唐县' },
            { code: '130628', name: '高阳县' },
            { code: '130629', name: '容城县' },
            { code: '130630', name: '涞源县' },
            { code: '130631', name: '望都县' },
            { code: '130632', name: '安新县' },
            { code: '130633', name: '易县' },
            { code: '130634', name: '曲阳县' },
            { code: '130635', name: '蠡县' },
            { code: '130636', name: '顺平县' },
            { code: '130637', name: '博野县' },
            { code: '130638', name: '雄县' },
            { code: '130671', name: '保定高新技术产业开发区' },
            { code: '130672', name: '保定白沟新城' },
            { code: '130681', name: '涿州市' },
            { code: '130682', name: '定州市' },
            { code: '130683', name: '安国市' },
            { code: '130684', name: '高碑店市' }
          ]
        },
        {
          code: '1307',
          name: '张家口市',
          children: [
            { code: '130702', name: '桥东区' },
            { code: '130703', name: '桥西区' },
            { code: '130705', name: '宣化区' },
            { code: '130706', name: '下花园区' },
            { code: '130708', name: '万全区' },
            { code: '130709', name: '崇礼区' },
            { code: '130722', name: '张北县' },
            { code: '130723', name: '康保县' },
            { code: '130724', name: '沽源县' },
            { code: '130725', name: '尚义县' },
            { code: '130726', name: '蔚县' },
            { code: '130727', name: '阳原县' },
            { code: '130728', name: '怀安县' },
            { code: '130730', name: '怀来县' },
            { code: '130731', name: '涿鹿县' },
            { code: '130732', name: '赤城县' },
            { code: '130771', name: '张家口市高新技术产业开发区' },
            { code: '130772', name: '张家口市察北管理区' },
            { code: '130773', name: '张家口市塞北管理区' }
          ]
        },
        {
          code: '1308',
          name: '承德市',
          children: [
            { code: '130802', name: '双桥区' },
            { code: '130803', name: '双滦区' },
            { code: '130804', name: '鹰手营子矿区' },
            { code: '130821', name: '承德县' },
            { code: '130822', name: '兴隆县' },
            { code: '130824', name: '滦平县' },
            { code: '130825', name: '隆化县' },
            { code: '130826', name: '丰宁满族自治县' },
            { code: '130827', name: '宽城满族自治县' },
            { code: '130828', name: '围场满族蒙古族自治县' },
            { code: '130871', name: '承德高新技术产业开发区' },
            { code: '130881', name: '平泉市' }
          ]
        },
        {
          code: '1309',
          name: '沧州市',
          children: [
            { code: '130902', name: '新华区' },
            { code: '130903', name: '运河区' },
            { code: '130921', name: '沧县' },
            { code: '130922', name: '青县' },
            { code: '130923', name: '东光县' },
            { code: '130924', name: '海兴县' },
            { code: '130925', name: '盐山县' },
            { code: '130926', name: '肃宁县' },
            { code: '130927', name: '南皮县' },
            { code: '130928', name: '吴桥县' },
            { code: '130929', name: '献县' },
            { code: '130930', name: '孟村回族自治县' },
            { code: '130971', name: '河北沧州经济开发区' },
            { code: '130972', name: '沧州高新技术产业开发区' },
            { code: '130973', name: '沧州渤海新区' },
            { code: '130981', name: '泊头市' },
            { code: '130982', name: '任丘市' },
            { code: '130983', name: '黄骅市' },
            { code: '130984', name: '河间市' }
          ]
        },
        {
          code: '1310',
          name: '廊坊市',
          children: [
            { code: '131002', name: '安次区' },
            { code: '131003', name: '广阳区' },
            { code: '131022', name: '固安县' },
            { code: '131023', name: '永清县' },
            { code: '131024', name: '香河县' },
            { code: '131025', name: '大城县' },
            { code: '131026', name: '文安县' },
            { code: '131028', name: '大厂回族自治县' },
            { code: '131071', name: '廊坊经济技术开发区' },
            { code: '131081', name: '霸州市' },
            { code: '131082', name: '三河市' }
          ]
        },
        {
          code: '1311',
          name: '衡水市',
          children: [
            { code: '131102', name: '桃城区' },
            { code: '131103', name: '冀州区' },
            { code: '131121', name: '枣强县' },
            { code: '131122', name: '武邑县' },
            { code: '131123', name: '武强县' },
            { code: '131124', name: '饶阳县' },
            { code: '131125', name: '安平县' },
            { code: '131126', name: '故城县' },
            { code: '131127', name: '景县' },
            { code: '131128', name: '阜城县' },
            { code: '131171', name: '河北衡水高新技术产业开发区' },
            { code: '131172', name: '衡水滨湖新区' },
            { code: '131182', name: '深州市' }
          ]
        }
      ]
    },
    {
      code: '14',
      name: '山西省',
      children: [
        {
          code: '1401',
          name: '太原市',
          children: [
            { code: '140105', name: '小店区' },
            { code: '140106', name: '迎泽区' },
            { code: '140107', name: '杏花岭区' },
            { code: '140108', name: '尖草坪区' },
            { code: '140109', name: '万柏林区' },
            { code: '140110', name: '晋源区' },
            { code: '140121', name: '清徐县' },
            { code: '140122', name: '阳曲县' },
            { code: '140123', name: '娄烦县' },
            { code: '140171', name: '山西转型综合改革示范区' },
            { code: '140181', name: '古交市' }
          ]
        },
        {
          code: '1402',
          name: '大同市',
          children: [
            { code: '140212', name: '新荣区' },
            { code: '140213', name: '平城区' },
            { code: '140214', name: '云冈区' },
            { code: '140215', name: '云州区' },
            { code: '140221', name: '阳高县' },
            { code: '140222', name: '天镇县' },
            { code: '140223', name: '广灵县' },
            { code: '140224', name: '灵丘县' },
            { code: '140225', name: '浑源县' },
            { code: '140226', name: '左云县' },
            { code: '140271', name: '山西大同经济开发区' }
          ]
        },
        {
          code: '1403',
          name: '阳泉市',
          children: [
            { code: '140302', name: '城区' },
            { code: '140303', name: '矿区' },
            { code: '140311', name: '郊区' },
            { code: '140321', name: '平定县' },
            { code: '140322', name: '盂县' }
          ]
        },
        {
          code: '1404',
          name: '长治市',
          children: [
            { code: '140403', name: '潞州区' },
            { code: '140404', name: '上党区' },
            { code: '140405', name: '屯留区' },
            { code: '140406', name: '潞城区' },
            { code: '140423', name: '襄垣县' },
            { code: '140425', name: '平顺县' },
            { code: '140426', name: '黎城县' },
            { code: '140427', name: '壶关县' },
            { code: '140428', name: '长子县' },
            { code: '140429', name: '武乡县' },
            { code: '140430', name: '沁县' },
            { code: '140431', name: '沁源县' },
            { code: '140471', name: '山西长治高新技术产业园区' }
          ]
        },
        {
          code: '1405',
          name: '晋城市',
          children: [
            { code: '140502', name: '城区' },
            { code: '140521', name: '沁水县' },
            { code: '140522', name: '阳城县' },
            { code: '140524', name: '陵川县' },
            { code: '140525', name: '泽州县' },
            { code: '140581', name: '高平市' }
          ]
        },
        {
          code: '1406',
          name: '朔州市',
          children: [
            { code: '140602', name: '朔城区' },
            { code: '140603', name: '平鲁区' },
            { code: '140621', name: '山阴县' },
            { code: '140622', name: '应县' },
            { code: '140623', name: '右玉县' },
            { code: '140671', name: '山西朔州经济开发区' },
            { code: '140681', name: '怀仁市' }
          ]
        },
        {
          code: '1407',
          name: '晋中市',
          children: [
            { code: '140702', name: '榆次区' },
            { code: '140721', name: '榆社县' },
            { code: '140722', name: '左权县' },
            { code: '140723', name: '和顺县' },
            { code: '140724', name: '昔阳县' },
            { code: '140725', name: '寿阳县' },
            { code: '140726', name: '太谷县' },
            { code: '140727', name: '祁县' },
            { code: '140728', name: '平遥县' },
            { code: '140729', name: '灵石县' },
            { code: '140781', name: '介休市' }
          ]
        },
        {
          code: '1408',
          name: '运城市',
          children: [
            { code: '140802', name: '盐湖区' },
            { code: '140821', name: '临猗县' },
            { code: '140822', name: '万荣县' },
            { code: '140823', name: '闻喜县' },
            { code: '140824', name: '稷山县' },
            { code: '140825', name: '新绛县' },
            { code: '140826', name: '绛县' },
            { code: '140827', name: '垣曲县' },
            { code: '140828', name: '夏县' },
            { code: '140829', name: '平陆县' },
            { code: '140830', name: '芮城县' },
            { code: '140881', name: '永济市' },
            { code: '140882', name: '河津市' }
          ]
        },
        {
          code: '1409',
          name: '忻州市',
          children: [
            { code: '140902', name: '忻府区' },
            { code: '140921', name: '定襄县' },
            { code: '140922', name: '五台县' },
            { code: '140923', name: '代县' },
            { code: '140924', name: '繁峙县' },
            { code: '140925', name: '宁武县' },
            { code: '140926', name: '静乐县' },
            { code: '140927', name: '神池县' },
            { code: '140928', name: '五寨县' },
            { code: '140929', name: '岢岚县' },
            { code: '140930', name: '河曲县' },
            { code: '140931', name: '保德县' },
            { code: '140932', name: '偏关县' },
            { code: '140971', name: '五台山风景名胜区' },
            { code: '140981', name: '原平市' }
          ]
        },
        {
          code: '1410',
          name: '临汾市',
          children: [
            { code: '141002', name: '尧都区' },
            { code: '141021', name: '曲沃县' },
            { code: '141022', name: '翼城县' },
            { code: '141023', name: '襄汾县' },
            { code: '141024', name: '洪洞县' },
            { code: '141025', name: '古县' },
            { code: '141026', name: '安泽县' },
            { code: '141027', name: '浮山县' },
            { code: '141028', name: '吉县' },
            { code: '141029', name: '乡宁县' },
            { code: '141030', name: '大宁县' },
            { code: '141031', name: '隰县' },
            { code: '141032', name: '永和县' },
            { code: '141033', name: '蒲县' },
            { code: '141034', name: '汾西县' },
            { code: '141081', name: '侯马市' },
            { code: '141082', name: '霍州市' }
          ]
        },
        {
          code: '1411',
          name: '吕梁市',
          children: [
            { code: '141102', name: '离石区' },
            { code: '141121', name: '文水县' },
            { code: '141122', name: '交城县' },
            { code: '141123', name: '兴县' },
            { code: '141124', name: '临县' },
            { code: '141125', name: '柳林县' },
            { code: '141126', name: '石楼县' },
            { code: '141127', name: '岚县' },
            { code: '141128', name: '方山县' },
            { code: '141129', name: '中阳县' },
            { code: '141130', name: '交口县' },
            { code: '141181', name: '孝义市' },
            { code: '141182', name: '汾阳市' }
          ]
        }
      ]
    },
    {
      code: '15',
      name: '内蒙古自治区',
      children: [
        {
          code: '1501',
          name: '呼和浩特市',
          children: [
            { code: '150102', name: '新城区' },
            { code: '150103', name: '回民区' },
            { code: '150104', name: '玉泉区' },
            { code: '150105', name: '赛罕区' },
            { code: '150121', name: '土默特左旗' },
            { code: '150122', name: '托克托县' },
            { code: '150123', name: '和林格尔县' },
            { code: '150124', name: '清水河县' },
            { code: '150125', name: '武川县' },
            { code: '150171', name: '呼和浩特金海工业园区' },
            { code: '150172', name: '呼和浩特经济技术开发区' }
          ]
        },
        {
          code: '1502',
          name: '包头市',
          children: [
            { code: '150202', name: '东河区' },
            { code: '150203', name: '昆都仑区' },
            { code: '150204', name: '青山区' },
            { code: '150205', name: '石拐区' },
            { code: '150206', name: '白云鄂博矿区' },
            { code: '150207', name: '九原区' },
            { code: '150221', name: '土默特右旗' },
            { code: '150222', name: '固阳县' },
            { code: '150223', name: '达尔罕茂明安联合旗' },
            { code: '150271', name: '包头稀土高新技术产业开发区' }
          ]
        },
        {
          code: '1503',
          name: '乌海市',
          children: [
            { code: '150302', name: '海勃湾区' },
            { code: '150303', name: '海南区' },
            { code: '150304', name: '乌达区' }
          ]
        },
        {
          code: '1504',
          name: '赤峰市',
          children: [
            { code: '150402', name: '红山区' },
            { code: '150403', name: '元宝山区' },
            { code: '150404', name: '松山区' },
            { code: '150421', name: '阿鲁科尔沁旗' },
            { code: '150422', name: '巴林左旗' },
            { code: '150423', name: '巴林右旗' },
            { code: '150424', name: '林西县' },
            { code: '150425', name: '克什克腾旗' },
            { code: '150426', name: '翁牛特旗' },
            { code: '150428', name: '喀喇沁旗' },
            { code: '150429', name: '宁城县' },
            { code: '150430', name: '敖汉旗' }
          ]
        },
        {
          code: '1505',
          name: '通辽市',
          children: [
            { code: '150502', name: '科尔沁区' },
            { code: '150521', name: '科尔沁左翼中旗' },
            { code: '150522', name: '科尔沁左翼后旗' },
            { code: '150523', name: '开鲁县' },
            { code: '150524', name: '库伦旗' },
            { code: '150525', name: '奈曼旗' },
            { code: '150526', name: '扎鲁特旗' },
            { code: '150571', name: '通辽经济技术开发区' },
            { code: '150581', name: '霍林郭勒市' }
          ]
        },
        {
          code: '1506',
          name: '鄂尔多斯市',
          children: [
            { code: '150602', name: '东胜区' },
            { code: '150603', name: '康巴什区' },
            { code: '150621', name: '达拉特旗' },
            { code: '150622', name: '准格尔旗' },
            { code: '150623', name: '鄂托克前旗' },
            { code: '150624', name: '鄂托克旗' },
            { code: '150625', name: '杭锦旗' },
            { code: '150626', name: '乌审旗' },
            { code: '150627', name: '伊金霍洛旗' }
          ]
        },
        {
          code: '1507',
          name: '呼伦贝尔市',
          children: [
            { code: '150702', name: '海拉尔区' },
            { code: '150703', name: '扎赉诺尔区' },
            { code: '150721', name: '阿荣旗' },
            { code: '150722', name: '莫力达瓦达斡尔族自治旗' },
            { code: '150723', name: '鄂伦春自治旗' },
            { code: '150724', name: '鄂温克族自治旗' },
            { code: '150725', name: '陈巴尔虎旗' },
            { code: '150726', name: '新巴尔虎左旗' },
            { code: '150727', name: '新巴尔虎右旗' },
            { code: '150781', name: '满洲里市' },
            { code: '150782', name: '牙克石市' },
            { code: '150783', name: '扎兰屯市' },
            { code: '150784', name: '额尔古纳市' },
            { code: '150785', name: '根河市' }
          ]
        },
        {
          code: '1508',
          name: '巴彦淖尔市',
          children: [
            { code: '150802', name: '临河区' },
            { code: '150821', name: '五原县' },
            { code: '150822', name: '磴口县' },
            { code: '150823', name: '乌拉特前旗' },
            { code: '150824', name: '乌拉特中旗' },
            { code: '150825', name: '乌拉特后旗' },
            { code: '150826', name: '杭锦后旗' }
          ]
        },
        {
          code: '1509',
          name: '乌兰察布市',
          children: [
            { code: '150902', name: '集宁区' },
            { code: '150921', name: '卓资县' },
            { code: '150922', name: '化德县' },
            { code: '150923', name: '商都县' },
            { code: '150924', name: '兴和县' },
            { code: '150925', name: '凉城县' },
            { code: '150926', name: '察哈尔右翼前旗' },
            { code: '150927', name: '察哈尔右翼中旗' },
            { code: '150928', name: '察哈尔右翼后旗' },
            { code: '150929', name: '四子王旗' },
            { code: '150981', name: '丰镇市' }
          ]
        },
        {
          code: '1522',
          name: '兴安盟',
          children: [
            { code: '152201', name: '乌兰浩特市' },
            { code: '152202', name: '阿尔山市' },
            { code: '152221', name: '科尔沁右翼前旗' },
            { code: '152222', name: '科尔沁右翼中旗' },
            { code: '152223', name: '扎赉特旗' },
            { code: '152224', name: '突泉县' }
          ]
        },
        {
          code: '1525',
          name: '锡林郭勒盟',
          children: [
            { code: '152501', name: '二连浩特市' },
            { code: '152502', name: '锡林浩特市' },
            { code: '152522', name: '阿巴嘎旗' },
            { code: '152523', name: '苏尼特左旗' },
            { code: '152524', name: '苏尼特右旗' },
            { code: '152525', name: '东乌珠穆沁旗' },
            { code: '152526', name: '西乌珠穆沁旗' },
            { code: '152527', name: '太仆寺旗' },
            { code: '152528', name: '镶黄旗' },
            { code: '152529', name: '正镶白旗' },
            { code: '152530', name: '正蓝旗' },
            { code: '152531', name: '多伦县' },
            { code: '152571', name: '乌拉盖管委会' }
          ]
        },
        {
          code: '1529',
          name: '阿拉善盟',
          children: [
            { code: '152921', name: '阿拉善左旗' },
            { code: '152922', name: '阿拉善右旗' },
            { code: '152923', name: '额济纳旗' },
            { code: '152971', name: '内蒙古阿拉善经济开发区' }
          ]
        }
      ]
    },
    {
      code: '21',
      name: '辽宁省',
      children: [
        {
          code: '2101',
          name: '沈阳市',
          children: [
            { code: '210102', name: '和平区' },
            { code: '210103', name: '沈河区' },
            { code: '210104', name: '大东区' },
            { code: '210105', name: '皇姑区' },
            { code: '210106', name: '铁西区' },
            { code: '210111', name: '苏家屯区' },
            { code: '210112', name: '浑南区' },
            { code: '210113', name: '沈北新区' },
            { code: '210114', name: '于洪区' },
            { code: '210115', name: '辽中区' },
            { code: '210123', name: '康平县' },
            { code: '210124', name: '法库县' },
            { code: '210181', name: '新民市' }
          ]
        },
        {
          code: '2102',
          name: '大连市',
          children: [
            { code: '210202', name: '中山区' },
            { code: '210203', name: '西岗区' },
            { code: '210204', name: '沙河口区' },
            { code: '210211', name: '甘井子区' },
            { code: '210212', name: '旅顺口区' },
            { code: '210213', name: '金州区' },
            { code: '210214', name: '普兰店区' },
            { code: '210224', name: '长海县' },
            { code: '210281', name: '瓦房店市' },
            { code: '210283', name: '庄河市' }
          ]
        },
        {
          code: '2103',
          name: '鞍山市',
          children: [
            { code: '210302', name: '铁东区' },
            { code: '210303', name: '铁西区' },
            { code: '210304', name: '立山区' },
            { code: '210311', name: '千山区' },
            { code: '210321', name: '台安县' },
            { code: '210323', name: '岫岩满族自治县' },
            { code: '210381', name: '海城市' }
          ]
        },
        {
          code: '2104',
          name: '抚顺市',
          children: [
            { code: '210402', name: '新抚区' },
            { code: '210403', name: '东洲区' },
            { code: '210404', name: '望花区' },
            { code: '210411', name: '顺城区' },
            { code: '210421', name: '抚顺县' },
            { code: '210422', name: '新宾满族自治县' },
            { code: '210423', name: '清原满族自治县' }
          ]
        },
        {
          code: '2105',
          name: '本溪市',
          children: [
            { code: '210502', name: '平山区' },
            { code: '210503', name: '溪湖区' },
            { code: '210504', name: '明山区' },
            { code: '210505', name: '南芬区' },
            { code: '210521', name: '本溪满族自治县' },
            { code: '210522', name: '桓仁满族自治县' }
          ]
        },
        {
          code: '2106',
          name: '丹东市',
          children: [
            { code: '210602', name: '元宝区' },
            { code: '210603', name: '振兴区' },
            { code: '210604', name: '振安区' },
            { code: '210624', name: '宽甸满族自治县' },
            { code: '210681', name: '东港市' },
            { code: '210682', name: '凤城市' }
          ]
        },
        {
          code: '2107',
          name: '锦州市',
          children: [
            { code: '210702', name: '古塔区' },
            { code: '210703', name: '凌河区' },
            { code: '210711', name: '太和区' },
            { code: '210726', name: '黑山县' },
            { code: '210727', name: '义县' },
            { code: '210781', name: '凌海市' },
            { code: '210782', name: '北镇市' }
          ]
        },
        {
          code: '2108',
          name: '营口市',
          children: [
            { code: '210802', name: '站前区' },
            { code: '210803', name: '西市区' },
            { code: '210804', name: '鲅鱼圈区' },
            { code: '210811', name: '老边区' },
            { code: '210881', name: '盖州市' },
            { code: '210882', name: '大石桥市' }
          ]
        },
        {
          code: '2109',
          name: '阜新市',
          children: [
            { code: '210902', name: '海州区' },
            { code: '210903', name: '新邱区' },
            { code: '210904', name: '太平区' },
            { code: '210905', name: '清河门区' },
            { code: '210911', name: '细河区' },
            { code: '210921', name: '阜新蒙古族自治县' },
            { code: '210922', name: '彰武县' }
          ]
        },
        {
          code: '2110',
          name: '辽阳市',
          children: [
            { code: '211002', name: '白塔区' },
            { code: '211003', name: '文圣区' },
            { code: '211004', name: '宏伟区' },
            { code: '211005', name: '弓长岭区' },
            { code: '211011', name: '太子河区' },
            { code: '211021', name: '辽阳县' },
            { code: '211081', name: '灯塔市' }
          ]
        },
        {
          code: '2111',
          name: '盘锦市',
          children: [
            { code: '211102', name: '双台子区' },
            { code: '211103', name: '兴隆台区' },
            { code: '211104', name: '大洼区' },
            { code: '211122', name: '盘山县' }
          ]
        },
        {
          code: '2112',
          name: '铁岭市',
          children: [
            { code: '211202', name: '银州区' },
            { code: '211204', name: '清河区' },
            { code: '211221', name: '铁岭县' },
            { code: '211223', name: '西丰县' },
            { code: '211224', name: '昌图县' },
            { code: '211281', name: '调兵山市' },
            { code: '211282', name: '开原市' }
          ]
        },
        {
          code: '2113',
          name: '朝阳市',
          children: [
            { code: '211302', name: '双塔区' },
            { code: '211303', name: '龙城区' },
            { code: '211321', name: '朝阳县' },
            { code: '211322', name: '建平县' },
            { code: '211324', name: '喀喇沁左翼蒙古族自治县' },
            { code: '211381', name: '北票市' },
            { code: '211382', name: '凌源市' }
          ]
        },
        {
          code: '2114',
          name: '葫芦岛市',
          children: [
            { code: '211402', name: '连山区' },
            { code: '211403', name: '龙港区' },
            { code: '211404', name: '南票区' },
            { code: '211421', name: '绥中县' },
            { code: '211422', name: '建昌县' },
            { code: '211481', name: '兴城市' }
          ]
        }
      ]
    },
    {
      code: '22',
      name: '吉林省',
      children: [
        {
          code: '2201',
          name: '长春市',
          children: [
            { code: '220102', name: '南关区' },
            { code: '220103', name: '宽城区' },
            { code: '220104', name: '朝阳区' },
            { code: '220105', name: '二道区' },
            { code: '220106', name: '绿园区' },
            { code: '220112', name: '双阳区' },
            { code: '220113', name: '九台区' },
            { code: '220122', name: '农安县' },
            { code: '220171', name: '长春经济技术开发区' },
            { code: '220172', name: '长春净月高新技术产业开发区' },
            { code: '220173', name: '长春高新技术产业开发区' },
            { code: '220174', name: '长春汽车经济技术开发区' },
            { code: '220182', name: '榆树市' },
            { code: '220183', name: '德惠市' }
          ]
        },
        {
          code: '2202',
          name: '吉林市',
          children: [
            { code: '220202', name: '昌邑区' },
            { code: '220203', name: '龙潭区' },
            { code: '220204', name: '船营区' },
            { code: '220211', name: '丰满区' },
            { code: '220221', name: '永吉县' },
            { code: '220271', name: '吉林经济开发区' },
            { code: '220272', name: '吉林高新技术产业开发区' },
            { code: '220273', name: '吉林中国新加坡食品区' },
            { code: '220281', name: '蛟河市' },
            { code: '220282', name: '桦甸市' },
            { code: '220283', name: '舒兰市' },
            { code: '220284', name: '磐石市' }
          ]
        },
        {
          code: '2203',
          name: '四平市',
          children: [
            { code: '220302', name: '铁西区' },
            { code: '220303', name: '铁东区' },
            { code: '220322', name: '梨树县' },
            { code: '220323', name: '伊通满族自治县' },
            { code: '220381', name: '公主岭市' },
            { code: '220382', name: '双辽市' }
          ]
        },
        {
          code: '2204',
          name: '辽源市',
          children: [
            { code: '220402', name: '龙山区' },
            { code: '220403', name: '西安区' },
            { code: '220421', name: '东丰县' },
            { code: '220422', name: '东辽县' }
          ]
        },
        {
          code: '2205',
          name: '通化市',
          children: [
            { code: '220502', name: '东昌区' },
            { code: '220503', name: '二道江区' },
            { code: '220521', name: '通化县' },
            { code: '220523', name: '辉南县' },
            { code: '220524', name: '柳河县' },
            { code: '220581', name: '梅河口市' },
            { code: '220582', name: '集安市' }
          ]
        },
        {
          code: '2206',
          name: '白山市',
          children: [
            { code: '220602', name: '浑江区' },
            { code: '220605', name: '江源区' },
            { code: '220621', name: '抚松县' },
            { code: '220622', name: '靖宇县' },
            { code: '220623', name: '长白朝鲜族自治县' },
            { code: '220681', name: '临江市' }
          ]
        },
        {
          code: '2207',
          name: '松原市',
          children: [
            { code: '220702', name: '宁江区' },
            { code: '220721', name: '前郭尔罗斯蒙古族自治县' },
            { code: '220722', name: '长岭县' },
            { code: '220723', name: '乾安县' },
            { code: '220771', name: '吉林松原经济开发区' },
            { code: '220781', name: '扶余市' }
          ]
        },
        {
          code: '2208',
          name: '白城市',
          children: [
            { code: '220802', name: '洮北区' },
            { code: '220821', name: '镇赉县' },
            { code: '220822', name: '通榆县' },
            { code: '220871', name: '吉林白城经济开发区' },
            { code: '220881', name: '洮南市' },
            { code: '220882', name: '大安市' }
          ]
        },
        {
          code: '2224',
          name: '延边朝鲜族自治州',
          children: [
            { code: '222401', name: '延吉市' },
            { code: '222402', name: '图们市' },
            { code: '222403', name: '敦化市' },
            { code: '222404', name: '珲春市' },
            { code: '222405', name: '龙井市' },
            { code: '222406', name: '和龙市' },
            { code: '222424', name: '汪清县' },
            { code: '222426', name: '安图县' }
          ]
        }
      ]
    },
    {
      code: '23',
      name: '黑龙江省',
      children: [
        {
          code: '2301',
          name: '哈尔滨市',
          children: [
            { code: '230102', name: '道里区' },
            { code: '230103', name: '南岗区' },
            { code: '230104', name: '道外区' },
            { code: '230108', name: '平房区' },
            { code: '230109', name: '松北区' },
            { code: '230110', name: '香坊区' },
            { code: '230111', name: '呼兰区' },
            { code: '230112', name: '阿城区' },
            { code: '230113', name: '双城区' },
            { code: '230123', name: '依兰县' },
            { code: '230124', name: '方正县' },
            { code: '230125', name: '宾县' },
            { code: '230126', name: '巴彦县' },
            { code: '230127', name: '木兰县' },
            { code: '230128', name: '通河县' },
            { code: '230129', name: '延寿县' },
            { code: '230183', name: '尚志市' },
            { code: '230184', name: '五常市' }
          ]
        },
        {
          code: '2302',
          name: '齐齐哈尔市',
          children: [
            { code: '230202', name: '龙沙区' },
            { code: '230203', name: '建华区' },
            { code: '230204', name: '铁锋区' },
            { code: '230205', name: '昂昂溪区' },
            { code: '230206', name: '富拉尔基区' },
            { code: '230207', name: '碾子山区' },
            { code: '230208', name: '梅里斯达斡尔族区' },
            { code: '230221', name: '龙江县' },
            { code: '230223', name: '依安县' },
            { code: '230224', name: '泰来县' },
            { code: '230225', name: '甘南县' },
            { code: '230227', name: '富裕县' },
            { code: '230229', name: '克山县' },
            { code: '230230', name: '克东县' },
            { code: '230231', name: '拜泉县' },
            { code: '230281', name: '讷河市' }
          ]
        },
        {
          code: '2303',
          name: '鸡西市',
          children: [
            { code: '230302', name: '鸡冠区' },
            { code: '230303', name: '恒山区' },
            { code: '230304', name: '滴道区' },
            { code: '230305', name: '梨树区' },
            { code: '230306', name: '城子河区' },
            { code: '230307', name: '麻山区' },
            { code: '230321', name: '鸡东县' },
            { code: '230381', name: '虎林市' },
            { code: '230382', name: '密山市' }
          ]
        },
        {
          code: '2304',
          name: '鹤岗市',
          children: [
            { code: '230402', name: '向阳区' },
            { code: '230403', name: '工农区' },
            { code: '230404', name: '南山区' },
            { code: '230405', name: '兴安区' },
            { code: '230406', name: '东山区' },
            { code: '230407', name: '兴山区' },
            { code: '230421', name: '萝北县' },
            { code: '230422', name: '绥滨县' }
          ]
        },
        {
          code: '2305',
          name: '双鸭山市',
          children: [
            { code: '230502', name: '尖山区' },
            { code: '230503', name: '岭东区' },
            { code: '230505', name: '四方台区' },
            { code: '230506', name: '宝山区' },
            { code: '230521', name: '集贤县' },
            { code: '230522', name: '友谊县' },
            { code: '230523', name: '宝清县' },
            { code: '230524', name: '饶河县' }
          ]
        },
        {
          code: '2306',
          name: '大庆市',
          children: [
            { code: '230602', name: '萨尔图区' },
            { code: '230603', name: '龙凤区' },
            { code: '230604', name: '让胡路区' },
            { code: '230605', name: '红岗区' },
            { code: '230606', name: '大同区' },
            { code: '230621', name: '肇州县' },
            { code: '230622', name: '肇源县' },
            { code: '230623', name: '林甸县' },
            { code: '230624', name: '杜尔伯特蒙古族自治县' },
            { code: '230671', name: '大庆高新技术产业开发区' }
          ]
        },
        {
          code: '2307',
          name: '伊春市',
          children: [
            { code: '230702', name: '伊春区' },
            { code: '230703', name: '南岔区' },
            { code: '230704', name: '友好区' },
            { code: '230705', name: '西林区' },
            { code: '230706', name: '翠峦区' },
            { code: '230707', name: '新青区' },
            { code: '230708', name: '美溪区' },
            { code: '230709', name: '金山屯区' },
            { code: '230710', name: '五营区' },
            { code: '230711', name: '乌马河区' },
            { code: '230712', name: '汤旺河区' },
            { code: '230713', name: '带岭区' },
            { code: '230714', name: '乌伊岭区' },
            { code: '230715', name: '红星区' },
            { code: '230716', name: '上甘岭区' },
            { code: '230722', name: '嘉荫县' },
            { code: '230781', name: '铁力市' }
          ]
        },
        {
          code: '2308',
          name: '佳木斯市',
          children: [
            { code: '230803', name: '向阳区' },
            { code: '230804', name: '前进区' },
            { code: '230805', name: '东风区' },
            { code: '230811', name: '郊区' },
            { code: '230822', name: '桦南县' },
            { code: '230826', name: '桦川县' },
            { code: '230828', name: '汤原县' },
            { code: '230881', name: '同江市' },
            { code: '230882', name: '富锦市' },
            { code: '230883', name: '抚远市' }
          ]
        },
        {
          code: '2309',
          name: '七台河市',
          children: [
            { code: '230902', name: '新兴区' },
            { code: '230903', name: '桃山区' },
            { code: '230904', name: '茄子河区' },
            { code: '230921', name: '勃利县' }
          ]
        },
        {
          code: '2310',
          name: '牡丹江市',
          children: [
            { code: '231002', name: '东安区' },
            { code: '231003', name: '阳明区' },
            { code: '231004', name: '爱民区' },
            { code: '231005', name: '西安区' },
            { code: '231025', name: '林口县' },
            { code: '231071', name: '牡丹江经济技术开发区' },
            { code: '231081', name: '绥芬河市' },
            { code: '231083', name: '海林市' },
            { code: '231084', name: '宁安市' },
            { code: '231085', name: '穆棱市' },
            { code: '231086', name: '东宁市' }
          ]
        },
        {
          code: '2311',
          name: '黑河市',
          children: [
            { code: '231102', name: '爱辉区' },
            { code: '231121', name: '嫩江县' },
            { code: '231123', name: '逊克县' },
            { code: '231124', name: '孙吴县' },
            { code: '231181', name: '北安市' },
            { code: '231182', name: '五大连池市' }
          ]
        },
        {
          code: '2312',
          name: '绥化市',
          children: [
            { code: '231202', name: '北林区' },
            { code: '231221', name: '望奎县' },
            { code: '231222', name: '兰西县' },
            { code: '231223', name: '青冈县' },
            { code: '231224', name: '庆安县' },
            { code: '231225', name: '明水县' },
            { code: '231226', name: '绥棱县' },
            { code: '231281', name: '安达市' },
            { code: '231282', name: '肇东市' },
            { code: '231283', name: '海伦市' }
          ]
        },
        {
          code: '2327',
          name: '大兴安岭地区',
          children: [
            { code: '232701', name: '漠河市' },
            { code: '232721', name: '呼玛县' },
            { code: '232722', name: '塔河县' },
            { code: '232761', name: '加格达奇区' },
            { code: '232762', name: '松岭区' },
            { code: '232763', name: '新林区' },
            { code: '232764', name: '呼中区' }
          ]
        }
      ]
    },
    {
      code: '31',
      name: '上海市',
      children: [
        {
          code: '3101',
          name: '市辖区',
          children: [
            { code: '310101', name: '黄浦区' },
            { code: '310104', name: '徐汇区' },
            { code: '310105', name: '长宁区' },
            { code: '310106', name: '静安区' },
            { code: '310107', name: '普陀区' },
            { code: '310109', name: '虹口区' },
            { code: '310110', name: '杨浦区' },
            { code: '310112', name: '闵行区' },
            { code: '310113', name: '宝山区' },
            { code: '310114', name: '嘉定区' },
            { code: '310115', name: '浦东新区' },
            { code: '310116', name: '金山区' },
            { code: '310117', name: '松江区' },
            { code: '310118', name: '青浦区' },
            { code: '310120', name: '奉贤区' },
            { code: '310151', name: '崇明区' }
          ]
        }
      ]
    },
    {
      code: '32',
      name: '江苏省',
      children: [
        {
          code: '3201',
          name: '南京市',
          children: [
            { code: '320102', name: '玄武区' },
            { code: '320104', name: '秦淮区' },
            { code: '320105', name: '建邺区' },
            { code: '320106', name: '鼓楼区' },
            { code: '320111', name: '浦口区' },
            { code: '320113', name: '栖霞区' },
            { code: '320114', name: '雨花台区' },
            { code: '320115', name: '江宁区' },
            { code: '320116', name: '六合区' },
            { code: '320117', name: '溧水区' },
            { code: '320118', name: '高淳区' }
          ]
        },
        {
          code: '3202',
          name: '无锡市',
          children: [
            { code: '320205', name: '锡山区' },
            { code: '320206', name: '惠山区' },
            { code: '320211', name: '滨湖区' },
            { code: '320213', name: '梁溪区' },
            { code: '320214', name: '新吴区' },
            { code: '320281', name: '江阴市' },
            { code: '320282', name: '宜兴市' }
          ]
        },
        {
          code: '3203',
          name: '徐州市',
          children: [
            { code: '320302', name: '鼓楼区' },
            { code: '320303', name: '云龙区' },
            { code: '320305', name: '贾汪区' },
            { code: '320311', name: '泉山区' },
            { code: '320312', name: '铜山区' },
            { code: '320321', name: '丰县' },
            { code: '320322', name: '沛县' },
            { code: '320324', name: '睢宁县' },
            { code: '320371', name: '徐州经济技术开发区' },
            { code: '320381', name: '新沂市' },
            { code: '320382', name: '邳州市' }
          ]
        },
        {
          code: '3204',
          name: '常州市',
          children: [
            { code: '320402', name: '天宁区' },
            { code: '320404', name: '钟楼区' },
            { code: '320411', name: '新北区' },
            { code: '320412', name: '武进区' },
            { code: '320413', name: '金坛区' },
            { code: '320481', name: '溧阳市' }
          ]
        },
        {
          code: '3205',
          name: '苏州市',
          children: [
            { code: '320505', name: '虎丘区' },
            { code: '320506', name: '吴中区' },
            { code: '320507', name: '相城区' },
            { code: '320508', name: '姑苏区' },
            { code: '320509', name: '吴江区' },
            { code: '320571', name: '苏州工业园区' },
            { code: '320581', name: '常熟市' },
            { code: '320582', name: '张家港市' },
            { code: '320583', name: '昆山市' },
            { code: '320585', name: '太仓市' }
          ]
        },
        {
          code: '3206',
          name: '南通市',
          children: [
            { code: '320602', name: '崇川区' },
            { code: '320611', name: '港闸区' },
            { code: '320612', name: '通州区' },
            { code: '320623', name: '如东县' },
            { code: '320671', name: '南通经济技术开发区' },
            { code: '320681', name: '启东市' },
            { code: '320682', name: '如皋市' },
            { code: '320684', name: '海门市' },
            { code: '320685', name: '海安市' }
          ]
        },
        {
          code: '3207',
          name: '连云港市',
          children: [
            { code: '320703', name: '连云区' },
            { code: '320706', name: '海州区' },
            { code: '320707', name: '赣榆区' },
            { code: '320722', name: '东海县' },
            { code: '320723', name: '灌云县' },
            { code: '320724', name: '灌南县' },
            { code: '320771', name: '连云港经济技术开发区' },
            { code: '320772', name: '连云港高新技术产业开发区' }
          ]
        },
        {
          code: '3208',
          name: '淮安市',
          children: [
            { code: '320803', name: '淮安区' },
            { code: '320804', name: '淮阴区' },
            { code: '320812', name: '清江浦区' },
            { code: '320813', name: '洪泽区' },
            { code: '320826', name: '涟水县' },
            { code: '320830', name: '盱眙县' },
            { code: '320831', name: '金湖县' },
            { code: '320871', name: '淮安经济技术开发区' }
          ]
        },
        {
          code: '3209',
          name: '盐城市',
          children: [
            { code: '320902', name: '亭湖区' },
            { code: '320903', name: '盐都区' },
            { code: '320904', name: '大丰区' },
            { code: '320921', name: '响水县' },
            { code: '320922', name: '滨海县' },
            { code: '320923', name: '阜宁县' },
            { code: '320924', name: '射阳县' },
            { code: '320925', name: '建湖县' },
            { code: '320971', name: '盐城经济技术开发区' },
            { code: '320981', name: '东台市' }
          ]
        },
        {
          code: '3210',
          name: '扬州市',
          children: [
            { code: '321002', name: '广陵区' },
            { code: '321003', name: '邗江区' },
            { code: '321012', name: '江都区' },
            { code: '321023', name: '宝应县' },
            { code: '321071', name: '扬州经济技术开发区' },
            { code: '321081', name: '仪征市' },
            { code: '321084', name: '高邮市' }
          ]
        },
        {
          code: '3211',
          name: '镇江市',
          children: [
            { code: '321102', name: '京口区' },
            { code: '321111', name: '润州区' },
            { code: '321112', name: '丹徒区' },
            { code: '321171', name: '镇江新区' },
            { code: '321181', name: '丹阳市' },
            { code: '321182', name: '扬中市' },
            { code: '321183', name: '句容市' }
          ]
        },
        {
          code: '3212',
          name: '泰州市',
          children: [
            { code: '321202', name: '海陵区' },
            { code: '321203', name: '高港区' },
            { code: '321204', name: '姜堰区' },
            { code: '321271', name: '泰州医药高新技术产业开发区' },
            { code: '321281', name: '兴化市' },
            { code: '321282', name: '靖江市' },
            { code: '321283', name: '泰兴市' }
          ]
        },
        {
          code: '3213',
          name: '宿迁市',
          children: [
            { code: '321302', name: '宿城区' },
            { code: '321311', name: '宿豫区' },
            { code: '321322', name: '沭阳县' },
            { code: '321323', name: '泗阳县' },
            { code: '321324', name: '泗洪县' },
            { code: '321371', name: '宿迁经济技术开发区' }
          ]
        }
      ]
    },
    {
      code: '33',
      name: '浙江省',
      children: [
        {
          code: '3301',
          name: '杭州市',
          children: [
            { code: '330102', name: '上城区' },
            { code: '330103', name: '下城区' },
            { code: '330104', name: '江干区' },
            { code: '330105', name: '拱墅区' },
            { code: '330106', name: '西湖区' },
            { code: '330108', name: '滨江区' },
            { code: '330109', name: '萧山区' },
            { code: '330110', name: '余杭区' },
            { code: '330111', name: '富阳区' },
            { code: '330112', name: '临安区' },
            { code: '330122', name: '桐庐县' },
            { code: '330127', name: '淳安县' },
            { code: '330182', name: '建德市' }
          ]
        },
        {
          code: '3302',
          name: '宁波市',
          children: [
            { code: '330203', name: '海曙区' },
            { code: '330205', name: '江北区' },
            { code: '330206', name: '北仑区' },
            { code: '330211', name: '镇海区' },
            { code: '330212', name: '鄞州区' },
            { code: '330213', name: '奉化区' },
            { code: '330225', name: '象山县' },
            { code: '330226', name: '宁海县' },
            { code: '330281', name: '余姚市' },
            { code: '330282', name: '慈溪市' }
          ]
        },
        {
          code: '3303',
          name: '温州市',
          children: [
            { code: '330302', name: '鹿城区' },
            { code: '330303', name: '龙湾区' },
            { code: '330304', name: '瓯海区' },
            { code: '330305', name: '洞头区' },
            { code: '330324', name: '永嘉县' },
            { code: '330326', name: '平阳县' },
            { code: '330327', name: '苍南县' },
            { code: '330328', name: '文成县' },
            { code: '330329', name: '泰顺县' },
            { code: '330371', name: '温州经济技术开发区' },
            { code: '330381', name: '瑞安市' },
            { code: '330382', name: '乐清市' }
          ]
        },
        {
          code: '3304',
          name: '嘉兴市',
          children: [
            { code: '330402', name: '南湖区' },
            { code: '330411', name: '秀洲区' },
            { code: '330421', name: '嘉善县' },
            { code: '330424', name: '海盐县' },
            { code: '330481', name: '海宁市' },
            { code: '330482', name: '平湖市' },
            { code: '330483', name: '桐乡市' }
          ]
        },
        {
          code: '3305',
          name: '湖州市',
          children: [
            { code: '330502', name: '吴兴区' },
            { code: '330503', name: '南浔区' },
            { code: '330521', name: '德清县' },
            { code: '330522', name: '长兴县' },
            { code: '330523', name: '安吉县' }
          ]
        },
        {
          code: '3306',
          name: '绍兴市',
          children: [
            { code: '330602', name: '越城区' },
            { code: '330603', name: '柯桥区' },
            { code: '330604', name: '上虞区' },
            { code: '330624', name: '新昌县' },
            { code: '330681', name: '诸暨市' },
            { code: '330683', name: '嵊州市' }
          ]
        },
        {
          code: '3307',
          name: '金华市',
          children: [
            { code: '330702', name: '婺城区' },
            { code: '330703', name: '金东区' },
            { code: '330723', name: '武义县' },
            { code: '330726', name: '浦江县' },
            { code: '330727', name: '磐安县' },
            { code: '330781', name: '兰溪市' },
            { code: '330782', name: '义乌市' },
            { code: '330783', name: '东阳市' },
            { code: '330784', name: '永康市' }
          ]
        },
        {
          code: '3308',
          name: '衢州市',
          children: [
            { code: '330802', name: '柯城区' },
            { code: '330803', name: '衢江区' },
            { code: '330822', name: '常山县' },
            { code: '330824', name: '开化县' },
            { code: '330825', name: '龙游县' },
            { code: '330881', name: '江山市' }
          ]
        },
        {
          code: '3309',
          name: '舟山市',
          children: [
            { code: '330902', name: '定海区' },
            { code: '330903', name: '普陀区' },
            { code: '330921', name: '岱山县' },
            { code: '330922', name: '嵊泗县' }
          ]
        },
        {
          code: '3310',
          name: '台州市',
          children: [
            { code: '331002', name: '椒江区' },
            { code: '331003', name: '黄岩区' },
            { code: '331004', name: '路桥区' },
            { code: '331022', name: '三门县' },
            { code: '331023', name: '天台县' },
            { code: '331024', name: '仙居县' },
            { code: '331081', name: '温岭市' },
            { code: '331082', name: '临海市' },
            { code: '331083', name: '玉环市' }
          ]
        },
        {
          code: '3311',
          name: '丽水市',
          children: [
            { code: '331102', name: '莲都区' },
            { code: '331121', name: '青田县' },
            { code: '331122', name: '缙云县' },
            { code: '331123', name: '遂昌县' },
            { code: '331124', name: '松阳县' },
            { code: '331125', name: '云和县' },
            { code: '331126', name: '庆元县' },
            { code: '331127', name: '景宁畲族自治县' },
            { code: '331181', name: '龙泉市' }
          ]
        }
      ]
    },
    {
      code: '34',
      name: '安徽省',
      children: [
        {
          code: '3401',
          name: '合肥市',
          children: [
            { code: '340102', name: '瑶海区' },
            { code: '340103', name: '庐阳区' },
            { code: '340104', name: '蜀山区' },
            { code: '340111', name: '包河区' },
            { code: '340121', name: '长丰县' },
            { code: '340122', name: '肥东县' },
            { code: '340123', name: '肥西县' },
            { code: '340124', name: '庐江县' },
            { code: '340171', name: '合肥高新技术产业开发区' },
            { code: '340172', name: '合肥经济技术开发区' },
            { code: '340173', name: '合肥新站高新技术产业开发区' },
            { code: '340181', name: '巢湖市' }
          ]
        },
        {
          code: '3402',
          name: '芜湖市',
          children: [
            { code: '340202', name: '镜湖区' },
            { code: '340203', name: '弋江区' },
            { code: '340207', name: '鸠江区' },
            { code: '340208', name: '三山区' },
            { code: '340221', name: '芜湖县' },
            { code: '340222', name: '繁昌县' },
            { code: '340223', name: '南陵县' },
            { code: '340225', name: '无为县' },
            { code: '340271', name: '芜湖经济技术开发区' },
            { code: '340272', name: '安徽芜湖长江大桥经济开发区' }
          ]
        },
        {
          code: '3403',
          name: '蚌埠市',
          children: [
            { code: '340302', name: '龙子湖区' },
            { code: '340303', name: '蚌山区' },
            { code: '340304', name: '禹会区' },
            { code: '340311', name: '淮上区' },
            { code: '340321', name: '怀远县' },
            { code: '340322', name: '五河县' },
            { code: '340323', name: '固镇县' },
            { code: '340371', name: '蚌埠市高新技术开发区' },
            { code: '340372', name: '蚌埠市经济开发区' }
          ]
        },
        {
          code: '3404',
          name: '淮南市',
          children: [
            { code: '340402', name: '大通区' },
            { code: '340403', name: '田家庵区' },
            { code: '340404', name: '谢家集区' },
            { code: '340405', name: '八公山区' },
            { code: '340406', name: '潘集区' },
            { code: '340421', name: '凤台县' },
            { code: '340422', name: '寿县' }
          ]
        },
        {
          code: '3405',
          name: '马鞍山市',
          children: [
            { code: '340503', name: '花山区' },
            { code: '340504', name: '雨山区' },
            { code: '340506', name: '博望区' },
            { code: '340521', name: '当涂县' },
            { code: '340522', name: '含山县' },
            { code: '340523', name: '和县' }
          ]
        },
        {
          code: '3406',
          name: '淮北市',
          children: [
            { code: '340602', name: '杜集区' },
            { code: '340603', name: '相山区' },
            { code: '340604', name: '烈山区' },
            { code: '340621', name: '濉溪县' }
          ]
        },
        {
          code: '3407',
          name: '铜陵市',
          children: [
            { code: '340705', name: '铜官区' },
            { code: '340706', name: '义安区' },
            { code: '340711', name: '郊区' },
            { code: '340722', name: '枞阳县' }
          ]
        },
        {
          code: '3408',
          name: '安庆市',
          children: [
            { code: '340802', name: '迎江区' },
            { code: '340803', name: '大观区' },
            { code: '340811', name: '宜秀区' },
            { code: '340822', name: '怀宁县' },
            { code: '340825', name: '太湖县' },
            { code: '340826', name: '宿松县' },
            { code: '340827', name: '望江县' },
            { code: '340828', name: '岳西县' },
            { code: '340871', name: '安徽安庆经济开发区' },
            { code: '340881', name: '桐城市' },
            { code: '340882', name: '潜山市' }
          ]
        },
        {
          code: '3410',
          name: '黄山市',
          children: [
            { code: '341002', name: '屯溪区' },
            { code: '341003', name: '黄山区' },
            { code: '341004', name: '徽州区' },
            { code: '341021', name: '歙县' },
            { code: '341022', name: '休宁县' },
            { code: '341023', name: '黟县' },
            { code: '341024', name: '祁门县' }
          ]
        },
        {
          code: '3411',
          name: '滁州市',
          children: [
            { code: '341102', name: '琅琊区' },
            { code: '341103', name: '南谯区' },
            { code: '341122', name: '来安县' },
            { code: '341124', name: '全椒县' },
            { code: '341125', name: '定远县' },
            { code: '341126', name: '凤阳县' },
            { code: '341171', name: '苏滁现代产业园' },
            { code: '341172', name: '滁州经济技术开发区' },
            { code: '341181', name: '天长市' },
            { code: '341182', name: '明光市' }
          ]
        },
        {
          code: '3412',
          name: '阜阳市',
          children: [
            { code: '341202', name: '颍州区' },
            { code: '341203', name: '颍东区' },
            { code: '341204', name: '颍泉区' },
            { code: '341221', name: '临泉县' },
            { code: '341222', name: '太和县' },
            { code: '341225', name: '阜南县' },
            { code: '341226', name: '颍上县' },
            { code: '341271', name: '阜阳合肥现代产业园区' },
            { code: '341272', name: '阜阳经济技术开发区' },
            { code: '341282', name: '界首市' }
          ]
        },
        {
          code: '3413',
          name: '宿州市',
          children: [
            { code: '341302', name: '埇桥区' },
            { code: '341321', name: '砀山县' },
            { code: '341322', name: '萧县' },
            { code: '341323', name: '灵璧县' },
            { code: '341324', name: '泗县' },
            { code: '341371', name: '宿州马鞍山现代产业园区' },
            { code: '341372', name: '宿州经济技术开发区' }
          ]
        },
        {
          code: '3415',
          name: '六安市',
          children: [
            { code: '341502', name: '金安区' },
            { code: '341503', name: '裕安区' },
            { code: '341504', name: '叶集区' },
            { code: '341522', name: '霍邱县' },
            { code: '341523', name: '舒城县' },
            { code: '341524', name: '金寨县' },
            { code: '341525', name: '霍山县' }
          ]
        },
        {
          code: '3416',
          name: '亳州市',
          children: [
            { code: '341602', name: '谯城区' },
            { code: '341621', name: '涡阳县' },
            { code: '341622', name: '蒙城县' },
            { code: '341623', name: '利辛县' }
          ]
        },
        {
          code: '3417',
          name: '池州市',
          children: [
            { code: '341702', name: '贵池区' },
            { code: '341721', name: '东至县' },
            { code: '341722', name: '石台县' },
            { code: '341723', name: '青阳县' }
          ]
        },
        {
          code: '3418',
          name: '宣城市',
          children: [
            { code: '341802', name: '宣州区' },
            { code: '341821', name: '郎溪县' },
            { code: '341822', name: '广德县' },
            { code: '341823', name: '泾县' },
            { code: '341824', name: '绩溪县' },
            { code: '341825', name: '旌德县' },
            { code: '341871', name: '宣城市经济开发区' },
            { code: '341881', name: '宁国市' }
          ]
        }
      ]
    },
    {
      code: '35',
      name: '福建省',
      children: [
        {
          code: '3501',
          name: '福州市',
          children: [
            { code: '350102', name: '鼓楼区' },
            { code: '350103', name: '台江区' },
            { code: '350104', name: '仓山区' },
            { code: '350105', name: '马尾区' },
            { code: '350111', name: '晋安区' },
            { code: '350112', name: '长乐区' },
            { code: '350121', name: '闽侯县' },
            { code: '350122', name: '连江县' },
            { code: '350123', name: '罗源县' },
            { code: '350124', name: '闽清县' },
            { code: '350125', name: '永泰县' },
            { code: '350128', name: '平潭县' },
            { code: '350181', name: '福清市' }
          ]
        },
        {
          code: '3502',
          name: '厦门市',
          children: [
            { code: '350203', name: '思明区' },
            { code: '350205', name: '海沧区' },
            { code: '350206', name: '湖里区' },
            { code: '350211', name: '集美区' },
            { code: '350212', name: '同安区' },
            { code: '350213', name: '翔安区' }
          ]
        },
        {
          code: '3503',
          name: '莆田市',
          children: [
            { code: '350302', name: '城厢区' },
            { code: '350303', name: '涵江区' },
            { code: '350304', name: '荔城区' },
            { code: '350305', name: '秀屿区' },
            { code: '350322', name: '仙游县' }
          ]
        },
        {
          code: '3504',
          name: '三明市',
          children: [
            { code: '350402', name: '梅列区' },
            { code: '350403', name: '三元区' },
            { code: '350421', name: '明溪县' },
            { code: '350423', name: '清流县' },
            { code: '350424', name: '宁化县' },
            { code: '350425', name: '大田县' },
            { code: '350426', name: '尤溪县' },
            { code: '350427', name: '沙县' },
            { code: '350428', name: '将乐县' },
            { code: '350429', name: '泰宁县' },
            { code: '350430', name: '建宁县' },
            { code: '350481', name: '永安市' }
          ]
        },
        {
          code: '3505',
          name: '泉州市',
          children: [
            { code: '350502', name: '鲤城区' },
            { code: '350503', name: '丰泽区' },
            { code: '350504', name: '洛江区' },
            { code: '350505', name: '泉港区' },
            { code: '350521', name: '惠安县' },
            { code: '350524', name: '安溪县' },
            { code: '350525', name: '永春县' },
            { code: '350526', name: '德化县' },
            { code: '350527', name: '金门县' },
            { code: '350581', name: '石狮市' },
            { code: '350582', name: '晋江市' },
            { code: '350583', name: '南安市' }
          ]
        },
        {
          code: '3506',
          name: '漳州市',
          children: [
            { code: '350602', name: '芗城区' },
            { code: '350603', name: '龙文区' },
            { code: '350622', name: '云霄县' },
            { code: '350623', name: '漳浦县' },
            { code: '350624', name: '诏安县' },
            { code: '350625', name: '长泰县' },
            { code: '350626', name: '东山县' },
            { code: '350627', name: '南靖县' },
            { code: '350628', name: '平和县' },
            { code: '350629', name: '华安县' },
            { code: '350681', name: '龙海市' }
          ]
        },
        {
          code: '3507',
          name: '南平市',
          children: [
            { code: '350702', name: '延平区' },
            { code: '350703', name: '建阳区' },
            { code: '350721', name: '顺昌县' },
            { code: '350722', name: '浦城县' },
            { code: '350723', name: '光泽县' },
            { code: '350724', name: '松溪县' },
            { code: '350725', name: '政和县' },
            { code: '350781', name: '邵武市' },
            { code: '350782', name: '武夷山市' },
            { code: '350783', name: '建瓯市' }
          ]
        },
        {
          code: '3508',
          name: '龙岩市',
          children: [
            { code: '350802', name: '新罗区' },
            { code: '350803', name: '永定区' },
            { code: '350821', name: '长汀县' },
            { code: '350823', name: '上杭县' },
            { code: '350824', name: '武平县' },
            { code: '350825', name: '连城县' },
            { code: '350881', name: '漳平市' }
          ]
        },
        {
          code: '3509',
          name: '宁德市',
          children: [
            { code: '350902', name: '蕉城区' },
            { code: '350921', name: '霞浦县' },
            { code: '350922', name: '古田县' },
            { code: '350923', name: '屏南县' },
            { code: '350924', name: '寿宁县' },
            { code: '350925', name: '周宁县' },
            { code: '350926', name: '柘荣县' },
            { code: '350981', name: '福安市' },
            { code: '350982', name: '福鼎市' }
          ]
        }
      ]
    },
    {
      code: '36',
      name: '江西省',
      children: [
        {
          code: '3601',
          name: '南昌市',
          children: [
            { code: '360102', name: '东湖区' },
            { code: '360103', name: '西湖区' },
            { code: '360104', name: '青云谱区' },
            { code: '360105', name: '湾里区' },
            { code: '360111', name: '青山湖区' },
            { code: '360112', name: '新建区' },
            { code: '360121', name: '南昌县' },
            { code: '360123', name: '安义县' },
            { code: '360124', name: '进贤县' }
          ]
        },
        {
          code: '3602',
          name: '景德镇市',
          children: [
            { code: '360202', name: '昌江区' },
            { code: '360203', name: '珠山区' },
            { code: '360222', name: '浮梁县' },
            { code: '360281', name: '乐平市' }
          ]
        },
        {
          code: '3603',
          name: '萍乡市',
          children: [
            { code: '360302', name: '安源区' },
            { code: '360313', name: '湘东区' },
            { code: '360321', name: '莲花县' },
            { code: '360322', name: '上栗县' },
            { code: '360323', name: '芦溪县' }
          ]
        },
        {
          code: '3604',
          name: '九江市',
          children: [
            { code: '360402', name: '濂溪区' },
            { code: '360403', name: '浔阳区' },
            { code: '360404', name: '柴桑区' },
            { code: '360423', name: '武宁县' },
            { code: '360424', name: '修水县' },
            { code: '360425', name: '永修县' },
            { code: '360426', name: '德安县' },
            { code: '360428', name: '都昌县' },
            { code: '360429', name: '湖口县' },
            { code: '360430', name: '彭泽县' },
            { code: '360481', name: '瑞昌市' },
            { code: '360482', name: '共青城市' },
            { code: '360483', name: '庐山市' }
          ]
        },
        {
          code: '3605',
          name: '新余市',
          children: [
            { code: '360502', name: '渝水区' },
            { code: '360521', name: '分宜县' }
          ]
        },
        {
          code: '3606',
          name: '鹰潭市',
          children: [
            { code: '360602', name: '月湖区' },
            { code: '360603', name: '余江区' },
            { code: '360681', name: '贵溪市' }
          ]
        },
        {
          code: '3607',
          name: '赣州市',
          children: [
            { code: '360702', name: '章贡区' },
            { code: '360703', name: '南康区' },
            { code: '360704', name: '赣县区' },
            { code: '360722', name: '信丰县' },
            { code: '360723', name: '大余县' },
            { code: '360724', name: '上犹县' },
            { code: '360725', name: '崇义县' },
            { code: '360726', name: '安远县' },
            { code: '360727', name: '龙南县' },
            { code: '360728', name: '定南县' },
            { code: '360729', name: '全南县' },
            { code: '360730', name: '宁都县' },
            { code: '360731', name: '于都县' },
            { code: '360732', name: '兴国县' },
            { code: '360733', name: '会昌县' },
            { code: '360734', name: '寻乌县' },
            { code: '360735', name: '石城县' },
            { code: '360781', name: '瑞金市' }
          ]
        },
        {
          code: '3608',
          name: '吉安市',
          children: [
            { code: '360802', name: '吉州区' },
            { code: '360803', name: '青原区' },
            { code: '360821', name: '吉安县' },
            { code: '360822', name: '吉水县' },
            { code: '360823', name: '峡江县' },
            { code: '360824', name: '新干县' },
            { code: '360825', name: '永丰县' },
            { code: '360826', name: '泰和县' },
            { code: '360827', name: '遂川县' },
            { code: '360828', name: '万安县' },
            { code: '360829', name: '安福县' },
            { code: '360830', name: '永新县' },
            { code: '360881', name: '井冈山市' }
          ]
        },
        {
          code: '3609',
          name: '宜春市',
          children: [
            { code: '360902', name: '袁州区' },
            { code: '360921', name: '奉新县' },
            { code: '360922', name: '万载县' },
            { code: '360923', name: '上高县' },
            { code: '360924', name: '宜丰县' },
            { code: '360925', name: '靖安县' },
            { code: '360926', name: '铜鼓县' },
            { code: '360981', name: '丰城市' },
            { code: '360982', name: '樟树市' },
            { code: '360983', name: '高安市' }
          ]
        },
        {
          code: '3610',
          name: '抚州市',
          children: [
            { code: '361002', name: '临川区' },
            { code: '361003', name: '东乡区' },
            { code: '361021', name: '南城县' },
            { code: '361022', name: '黎川县' },
            { code: '361023', name: '南丰县' },
            { code: '361024', name: '崇仁县' },
            { code: '361025', name: '乐安县' },
            { code: '361026', name: '宜黄县' },
            { code: '361027', name: '金溪县' },
            { code: '361028', name: '资溪县' },
            { code: '361030', name: '广昌县' }
          ]
        },
        {
          code: '3611',
          name: '上饶市',
          children: [
            { code: '361102', name: '信州区' },
            { code: '361103', name: '广丰区' },
            { code: '361121', name: '上饶县' },
            { code: '361123', name: '玉山县' },
            { code: '361124', name: '铅山县' },
            { code: '361125', name: '横峰县' },
            { code: '361126', name: '弋阳县' },
            { code: '361127', name: '余干县' },
            { code: '361128', name: '鄱阳县' },
            { code: '361129', name: '万年县' },
            { code: '361130', name: '婺源县' },
            { code: '361181', name: '德兴市' }
          ]
        }
      ]
    },
    {
      code: '37',
      name: '山东省',
      children: [
        {
          code: '3701',
          name: '济南市',
          children: [
            { code: '370102', name: '历下区' },
            { code: '370103', name: '市中区' },
            { code: '370104', name: '槐荫区' },
            { code: '370105', name: '天桥区' },
            { code: '370112', name: '历城区' },
            { code: '370113', name: '长清区' },
            { code: '370114', name: '章丘区' },
            { code: '370115', name: '济阳区' },
            { code: '370124', name: '平阴县' },
            { code: '370126', name: '商河县' },
            { code: '370171', name: '济南高新技术产业开发区' }
          ]
        },
        {
          code: '3702',
          name: '青岛市',
          children: [
            { code: '370202', name: '市南区' },
            { code: '370203', name: '市北区' },
            { code: '370211', name: '黄岛区' },
            { code: '370212', name: '崂山区' },
            { code: '370213', name: '李沧区' },
            { code: '370214', name: '城阳区' },
            { code: '370215', name: '即墨区' },
            { code: '370271', name: '青岛高新技术产业开发区' },
            { code: '370281', name: '胶州市' },
            { code: '370283', name: '平度市' },
            { code: '370285', name: '莱西市' }
          ]
        },
        {
          code: '3703',
          name: '淄博市',
          children: [
            { code: '370302', name: '淄川区' },
            { code: '370303', name: '张店区' },
            { code: '370304', name: '博山区' },
            { code: '370305', name: '临淄区' },
            { code: '370306', name: '周村区' },
            { code: '370321', name: '桓台县' },
            { code: '370322', name: '高青县' },
            { code: '370323', name: '沂源县' }
          ]
        },
        {
          code: '3704',
          name: '枣庄市',
          children: [
            { code: '370402', name: '市中区' },
            { code: '370403', name: '薛城区' },
            { code: '370404', name: '峄城区' },
            { code: '370405', name: '台儿庄区' },
            { code: '370406', name: '山亭区' },
            { code: '370481', name: '滕州市' }
          ]
        },
        {
          code: '3705',
          name: '东营市',
          children: [
            { code: '370502', name: '东营区' },
            { code: '370503', name: '河口区' },
            { code: '370505', name: '垦利区' },
            { code: '370522', name: '利津县' },
            { code: '370523', name: '广饶县' },
            { code: '370571', name: '东营经济技术开发区' },
            { code: '370572', name: '东营港经济开发区' }
          ]
        },
        {
          code: '3706',
          name: '烟台市',
          children: [
            { code: '370602', name: '芝罘区' },
            { code: '370611', name: '福山区' },
            { code: '370612', name: '牟平区' },
            { code: '370613', name: '莱山区' },
            { code: '370634', name: '长岛县' },
            { code: '370671', name: '烟台高新技术产业开发区' },
            { code: '370672', name: '烟台经济技术开发区' },
            { code: '370681', name: '龙口市' },
            { code: '370682', name: '莱阳市' },
            { code: '370683', name: '莱州市' },
            { code: '370684', name: '蓬莱市' },
            { code: '370685', name: '招远市' },
            { code: '370686', name: '栖霞市' },
            { code: '370687', name: '海阳市' }
          ]
        },
        {
          code: '3707',
          name: '潍坊市',
          children: [
            { code: '370702', name: '潍城区' },
            { code: '370703', name: '寒亭区' },
            { code: '370704', name: '坊子区' },
            { code: '370705', name: '奎文区' },
            { code: '370724', name: '临朐县' },
            { code: '370725', name: '昌乐县' },
            { code: '370772', name: '潍坊滨海经济技术开发区' },
            { code: '370781', name: '青州市' },
            { code: '370782', name: '诸城市' },
            { code: '370783', name: '寿光市' },
            { code: '370784', name: '安丘市' },
            { code: '370785', name: '高密市' },
            { code: '370786', name: '昌邑市' }
          ]
        },
        {
          code: '3708',
          name: '济宁市',
          children: [
            { code: '370811', name: '任城区' },
            { code: '370812', name: '兖州区' },
            { code: '370826', name: '微山县' },
            { code: '370827', name: '鱼台县' },
            { code: '370828', name: '金乡县' },
            { code: '370829', name: '嘉祥县' },
            { code: '370830', name: '汶上县' },
            { code: '370831', name: '泗水县' },
            { code: '370832', name: '梁山县' },
            { code: '370871', name: '济宁高新技术产业开发区' },
            { code: '370881', name: '曲阜市' },
            { code: '370883', name: '邹城市' }
          ]
        },
        {
          code: '3709',
          name: '泰安市',
          children: [
            { code: '370902', name: '泰山区' },
            { code: '370911', name: '岱岳区' },
            { code: '370921', name: '宁阳县' },
            { code: '370923', name: '东平县' },
            { code: '370982', name: '新泰市' },
            { code: '370983', name: '肥城市' }
          ]
        },
        {
          code: '3710',
          name: '威海市',
          children: [
            { code: '371002', name: '环翠区' },
            { code: '371003', name: '文登区' },
            { code: '371071', name: '威海火炬高技术产业开发区' },
            { code: '371072', name: '威海经济技术开发区' },
            { code: '371073', name: '威海临港经济技术开发区' },
            { code: '371082', name: '荣成市' },
            { code: '371083', name: '乳山市' }
          ]
        },
        {
          code: '3711',
          name: '日照市',
          children: [
            { code: '371102', name: '东港区' },
            { code: '371103', name: '岚山区' },
            { code: '371121', name: '五莲县' },
            { code: '371122', name: '莒县' },
            { code: '371171', name: '日照经济技术开发区' }
          ]
        },
        {
          code: '3712',
          name: '莱芜市',
          children: [
            { code: '371202', name: '莱城区' },
            { code: '371203', name: '钢城区' }
          ]
        },
        {
          code: '3713',
          name: '临沂市',
          children: [
            { code: '371302', name: '兰山区' },
            { code: '371311', name: '罗庄区' },
            { code: '371312', name: '河东区' },
            { code: '371321', name: '沂南县' },
            { code: '371322', name: '郯城县' },
            { code: '371323', name: '沂水县' },
            { code: '371324', name: '兰陵县' },
            { code: '371325', name: '费县' },
            { code: '371326', name: '平邑县' },
            { code: '371327', name: '莒南县' },
            { code: '371328', name: '蒙阴县' },
            { code: '371329', name: '临沭县' },
            { code: '371371', name: '临沂高新技术产业开发区' },
            { code: '371372', name: '临沂经济技术开发区' },
            { code: '371373', name: '临沂临港经济开发区' }
          ]
        },
        {
          code: '3714',
          name: '德州市',
          children: [
            { code: '371402', name: '德城区' },
            { code: '371403', name: '陵城区' },
            { code: '371422', name: '宁津县' },
            { code: '371423', name: '庆云县' },
            { code: '371424', name: '临邑县' },
            { code: '371425', name: '齐河县' },
            { code: '371426', name: '平原县' },
            { code: '371427', name: '夏津县' },
            { code: '371428', name: '武城县' },
            { code: '371471', name: '德州经济技术开发区' },
            { code: '371472', name: '德州运河经济开发区' },
            { code: '371481', name: '乐陵市' },
            { code: '371482', name: '禹城市' }
          ]
        },
        {
          code: '3715',
          name: '聊城市',
          children: [
            { code: '371502', name: '东昌府区' },
            { code: '371521', name: '阳谷县' },
            { code: '371522', name: '莘县' },
            { code: '371523', name: '茌平县' },
            { code: '371524', name: '东阿县' },
            { code: '371525', name: '冠县' },
            { code: '371526', name: '高唐县' },
            { code: '371581', name: '临清市' }
          ]
        },
        {
          code: '3716',
          name: '滨州市',
          children: [
            { code: '371602', name: '滨城区' },
            { code: '371603', name: '沾化区' },
            { code: '371621', name: '惠民县' },
            { code: '371622', name: '阳信县' },
            { code: '371623', name: '无棣县' },
            { code: '371625', name: '博兴县' },
            { code: '371681', name: '邹平市' }
          ]
        },
        {
          code: '3717',
          name: '菏泽市',
          children: [
            { code: '371702', name: '牡丹区' },
            { code: '371703', name: '定陶区' },
            { code: '371721', name: '曹县' },
            { code: '371722', name: '单县' },
            { code: '371723', name: '成武县' },
            { code: '371724', name: '巨野县' },
            { code: '371725', name: '郓城县' },
            { code: '371726', name: '鄄城县' },
            { code: '371728', name: '东明县' },
            { code: '371771', name: '菏泽经济技术开发区' },
            { code: '371772', name: '菏泽高新技术开发区' }
          ]
        }
      ]
    },
    {
      code: '41',
      name: '河南省',
      children: [
        {
          code: '4101',
          name: '郑州市',
          children: [
            { code: '410102', name: '中原区' },
            { code: '410103', name: '二七区' },
            { code: '410104', name: '管城回族区' },
            { code: '410105', name: '金水区' },
            { code: '410106', name: '上街区' },
            { code: '410108', name: '惠济区' },
            { code: '410122', name: '中牟县' },
            { code: '410171', name: '郑州经济技术开发区' },
            { code: '410172', name: '郑州高新技术产业开发区' },
            { code: '410173', name: '郑州航空港经济综合实验区' },
            { code: '410181', name: '巩义市' },
            { code: '410182', name: '荥阳市' },
            { code: '410183', name: '新密市' },
            { code: '410184', name: '新郑市' },
            { code: '410185', name: '登封市' }
          ]
        },
        {
          code: '4102',
          name: '开封市',
          children: [
            { code: '410202', name: '龙亭区' },
            { code: '410203', name: '顺河回族区' },
            { code: '410204', name: '鼓楼区' },
            { code: '410205', name: '禹王台区' },
            { code: '410212', name: '祥符区' },
            { code: '410221', name: '杞县' },
            { code: '410222', name: '通许县' },
            { code: '410223', name: '尉氏县' },
            { code: '410225', name: '兰考县' }
          ]
        },
        {
          code: '4103',
          name: '洛阳市',
          children: [
            { code: '410302', name: '老城区' },
            { code: '410303', name: '西工区' },
            { code: '410304', name: '瀍河回族区' },
            { code: '410305', name: '涧西区' },
            { code: '410306', name: '吉利区' },
            { code: '410311', name: '洛龙区' },
            { code: '410322', name: '孟津县' },
            { code: '410323', name: '新安县' },
            { code: '410324', name: '栾川县' },
            { code: '410325', name: '嵩县' },
            { code: '410326', name: '汝阳县' },
            { code: '410327', name: '宜阳县' },
            { code: '410328', name: '洛宁县' },
            { code: '410329', name: '伊川县' },
            { code: '410371', name: '洛阳高新技术产业开发区' },
            { code: '410381', name: '偃师市' }
          ]
        },
        {
          code: '4104',
          name: '平顶山市',
          children: [
            { code: '410402', name: '新华区' },
            { code: '410403', name: '卫东区' },
            { code: '410404', name: '石龙区' },
            { code: '410411', name: '湛河区' },
            { code: '410421', name: '宝丰县' },
            { code: '410422', name: '叶县' },
            { code: '410423', name: '鲁山县' },
            { code: '410425', name: '郏县' },
            { code: '410471', name: '平顶山高新技术产业开发区' },
            { code: '410472', name: '平顶山市新城区' },
            { code: '410481', name: '舞钢市' },
            { code: '410482', name: '汝州市' }
          ]
        },
        {
          code: '4105',
          name: '安阳市',
          children: [
            { code: '410502', name: '文峰区' },
            { code: '410503', name: '北关区' },
            { code: '410505', name: '殷都区' },
            { code: '410506', name: '龙安区' },
            { code: '410522', name: '安阳县' },
            { code: '410523', name: '汤阴县' },
            { code: '410526', name: '滑县' },
            { code: '410527', name: '内黄县' },
            { code: '410571', name: '安阳高新技术产业开发区' },
            { code: '410581', name: '林州市' }
          ]
        },
        {
          code: '4106',
          name: '鹤壁市',
          children: [
            { code: '410602', name: '鹤山区' },
            { code: '410603', name: '山城区' },
            { code: '410611', name: '淇滨区' },
            { code: '410621', name: '浚县' },
            { code: '410622', name: '淇县' },
            { code: '410671', name: '鹤壁经济技术开发区' }
          ]
        },
        {
          code: '4107',
          name: '新乡市',
          children: [
            { code: '410702', name: '红旗区' },
            { code: '410703', name: '卫滨区' },
            { code: '410704', name: '凤泉区' },
            { code: '410711', name: '牧野区' },
            { code: '410721', name: '新乡县' },
            { code: '410724', name: '获嘉县' },
            { code: '410725', name: '原阳县' },
            { code: '410726', name: '延津县' },
            { code: '410727', name: '封丘县' },
            { code: '410728', name: '长垣县' },
            { code: '410771', name: '新乡高新技术产业开发区' },
            { code: '410772', name: '新乡经济技术开发区' },
            { code: '410773', name: '新乡市平原城乡一体化示范区' },
            { code: '410781', name: '卫辉市' },
            { code: '410782', name: '辉县市' }
          ]
        },
        {
          code: '4108',
          name: '焦作市',
          children: [
            { code: '410802', name: '解放区' },
            { code: '410803', name: '中站区' },
            { code: '410804', name: '马村区' },
            { code: '410811', name: '山阳区' },
            { code: '410821', name: '修武县' },
            { code: '410822', name: '博爱县' },
            { code: '410823', name: '武陟县' },
            { code: '410825', name: '温县' },
            { code: '410871', name: '焦作城乡一体化示范区' },
            { code: '410882', name: '沁阳市' },
            { code: '410883', name: '孟州市' }
          ]
        },
        {
          code: '4109',
          name: '濮阳市',
          children: [
            { code: '410902', name: '华龙区' },
            { code: '410922', name: '清丰县' },
            { code: '410923', name: '南乐县' },
            { code: '410926', name: '范县' },
            { code: '410927', name: '台前县' },
            { code: '410928', name: '濮阳县' },
            { code: '410971', name: '河南濮阳工业园区' },
            { code: '410972', name: '濮阳经济技术开发区' }
          ]
        },
        {
          code: '4110',
          name: '许昌市',
          children: [
            { code: '411002', name: '魏都区' },
            { code: '411003', name: '建安区' },
            { code: '411024', name: '鄢陵县' },
            { code: '411025', name: '襄城县' },
            { code: '411071', name: '许昌经济技术开发区' },
            { code: '411081', name: '禹州市' },
            { code: '411082', name: '长葛市' }
          ]
        },
        {
          code: '4111',
          name: '漯河市',
          children: [
            { code: '411102', name: '源汇区' },
            { code: '411103', name: '郾城区' },
            { code: '411104', name: '召陵区' },
            { code: '411121', name: '舞阳县' },
            { code: '411122', name: '临颍县' },
            { code: '411171', name: '漯河经济技术开发区' }
          ]
        },
        {
          code: '4112',
          name: '三门峡市',
          children: [
            { code: '411202', name: '湖滨区' },
            { code: '411203', name: '陕州区' },
            { code: '411221', name: '渑池县' },
            { code: '411224', name: '卢氏县' },
            { code: '411271', name: '河南三门峡经济开发区' },
            { code: '411281', name: '义马市' },
            { code: '411282', name: '灵宝市' }
          ]
        },
        {
          code: '4113',
          name: '南阳市',
          children: [
            { code: '411302', name: '宛城区' },
            { code: '411303', name: '卧龙区' },
            { code: '411321', name: '南召县' },
            { code: '411322', name: '方城县' },
            { code: '411323', name: '西峡县' },
            { code: '411324', name: '镇平县' },
            { code: '411325', name: '内乡县' },
            { code: '411326', name: '淅川县' },
            { code: '411327', name: '社旗县' },
            { code: '411328', name: '唐河县' },
            { code: '411329', name: '新野县' },
            { code: '411330', name: '桐柏县' },
            { code: '411371', name: '南阳高新技术产业开发区' },
            { code: '411372', name: '南阳市城乡一体化示范区' },
            { code: '411381', name: '邓州市' }
          ]
        },
        {
          code: '4114',
          name: '商丘市',
          children: [
            { code: '411402', name: '梁园区' },
            { code: '411403', name: '睢阳区' },
            { code: '411421', name: '民权县' },
            { code: '411422', name: '睢县' },
            { code: '411423', name: '宁陵县' },
            { code: '411424', name: '柘城县' },
            { code: '411425', name: '虞城县' },
            { code: '411426', name: '夏邑县' },
            { code: '411471', name: '豫东综合物流产业聚集区' },
            { code: '411472', name: '河南商丘经济开发区' },
            { code: '411481', name: '永城市' }
          ]
        },
        {
          code: '4115',
          name: '信阳市',
          children: [
            { code: '411502', name: '浉河区' },
            { code: '411503', name: '平桥区' },
            { code: '411521', name: '罗山县' },
            { code: '411522', name: '光山县' },
            { code: '411523', name: '新县' },
            { code: '411524', name: '商城县' },
            { code: '411525', name: '固始县' },
            { code: '411526', name: '潢川县' },
            { code: '411527', name: '淮滨县' },
            { code: '411528', name: '息县' },
            { code: '411571', name: '信阳高新技术产业开发区' }
          ]
        },
        {
          code: '4116',
          name: '周口市',
          children: [
            { code: '411602', name: '川汇区' },
            { code: '411621', name: '扶沟县' },
            { code: '411622', name: '西华县' },
            { code: '411623', name: '商水县' },
            { code: '411624', name: '沈丘县' },
            { code: '411625', name: '郸城县' },
            { code: '411626', name: '淮阳县' },
            { code: '411627', name: '太康县' },
            { code: '411628', name: '鹿邑县' },
            { code: '411671', name: '河南周口经济开发区' },
            { code: '411681', name: '项城市' }
          ]
        },
        {
          code: '4117',
          name: '驻马店市',
          children: [
            { code: '411702', name: '驿城区' },
            { code: '411721', name: '西平县' },
            { code: '411722', name: '上蔡县' },
            { code: '411723', name: '平舆县' },
            { code: '411724', name: '正阳县' },
            { code: '411725', name: '确山县' },
            { code: '411726', name: '泌阳县' },
            { code: '411727', name: '汝南县' },
            { code: '411728', name: '遂平县' },
            { code: '411729', name: '新蔡县' },
            { code: '411771', name: '河南驻马店经济开发区' }
          ]
        },
        {
          code: '4190',
          name: '省直辖县级行政区划',
          children: [{ code: '419001', name: '济源市' }]
        }
      ]
    },
    {
      code: '42',
      name: '湖北省',
      children: [
        {
          code: '4201',
          name: '武汉市',
          children: [
            { code: '420102', name: '江岸区' },
            { code: '420103', name: '江汉区' },
            { code: '420104', name: '硚口区' },
            { code: '420105', name: '汉阳区' },
            { code: '420106', name: '武昌区' },
            { code: '420107', name: '青山区' },
            { code: '420111', name: '洪山区' },
            { code: '420112', name: '东西湖区' },
            { code: '420113', name: '汉南区' },
            { code: '420114', name: '蔡甸区' },
            { code: '420115', name: '江夏区' },
            { code: '420116', name: '黄陂区' },
            { code: '420117', name: '新洲区' }
          ]
        },
        {
          code: '4202',
          name: '黄石市',
          children: [
            { code: '420202', name: '黄石港区' },
            { code: '420203', name: '西塞山区' },
            { code: '420204', name: '下陆区' },
            { code: '420205', name: '铁山区' },
            { code: '420222', name: '阳新县' },
            { code: '420281', name: '大冶市' }
          ]
        },
        {
          code: '4203',
          name: '十堰市',
          children: [
            { code: '420302', name: '茅箭区' },
            { code: '420303', name: '张湾区' },
            { code: '420304', name: '郧阳区' },
            { code: '420322', name: '郧西县' },
            { code: '420323', name: '竹山县' },
            { code: '420324', name: '竹溪县' },
            { code: '420325', name: '房县' },
            { code: '420381', name: '丹江口市' }
          ]
        },
        {
          code: '4205',
          name: '宜昌市',
          children: [
            { code: '420502', name: '西陵区' },
            { code: '420503', name: '伍家岗区' },
            { code: '420504', name: '点军区' },
            { code: '420505', name: '猇亭区' },
            { code: '420506', name: '夷陵区' },
            { code: '420525', name: '远安县' },
            { code: '420526', name: '兴山县' },
            { code: '420527', name: '秭归县' },
            { code: '420528', name: '长阳土家族自治县' },
            { code: '420529', name: '五峰土家族自治县' },
            { code: '420581', name: '宜都市' },
            { code: '420582', name: '当阳市' },
            { code: '420583', name: '枝江市' }
          ]
        },
        {
          code: '4206',
          name: '襄阳市',
          children: [
            { code: '420602', name: '襄城区' },
            { code: '420606', name: '樊城区' },
            { code: '420607', name: '襄州区' },
            { code: '420624', name: '南漳县' },
            { code: '420625', name: '谷城县' },
            { code: '420626', name: '保康县' },
            { code: '420682', name: '老河口市' },
            { code: '420683', name: '枣阳市' },
            { code: '420684', name: '宜城市' }
          ]
        },
        {
          code: '4207',
          name: '鄂州市',
          children: [
            { code: '420702', name: '梁子湖区' },
            { code: '420703', name: '华容区' },
            { code: '420704', name: '鄂城区' }
          ]
        },
        {
          code: '4208',
          name: '荆门市',
          children: [
            { code: '420802', name: '东宝区' },
            { code: '420804', name: '掇刀区' },
            { code: '420822', name: '沙洋县' },
            { code: '420881', name: '钟祥市' },
            { code: '420882', name: '京山市' }
          ]
        },
        {
          code: '4209',
          name: '孝感市',
          children: [
            { code: '420902', name: '孝南区' },
            { code: '420921', name: '孝昌县' },
            { code: '420922', name: '大悟县' },
            { code: '420923', name: '云梦县' },
            { code: '420981', name: '应城市' },
            { code: '420982', name: '安陆市' },
            { code: '420984', name: '汉川市' }
          ]
        },
        {
          code: '4210',
          name: '荆州市',
          children: [
            { code: '421002', name: '沙市区' },
            { code: '421003', name: '荆州区' },
            { code: '421022', name: '公安县' },
            { code: '421023', name: '监利县' },
            { code: '421024', name: '江陵县' },
            { code: '421071', name: '荆州经济技术开发区' },
            { code: '421081', name: '石首市' },
            { code: '421083', name: '洪湖市' },
            { code: '421087', name: '松滋市' }
          ]
        },
        {
          code: '4211',
          name: '黄冈市',
          children: [
            { code: '421102', name: '黄州区' },
            { code: '421121', name: '团风县' },
            { code: '421122', name: '红安县' },
            { code: '421123', name: '罗田县' },
            { code: '421124', name: '英山县' },
            { code: '421125', name: '浠水县' },
            { code: '421126', name: '蕲春县' },
            { code: '421127', name: '黄梅县' },
            { code: '421171', name: '龙感湖管理区' },
            { code: '421181', name: '麻城市' },
            { code: '421182', name: '武穴市' }
          ]
        },
        {
          code: '4212',
          name: '咸宁市',
          children: [
            { code: '421202', name: '咸安区' },
            { code: '421221', name: '嘉鱼县' },
            { code: '421222', name: '通城县' },
            { code: '421223', name: '崇阳县' },
            { code: '421224', name: '通山县' },
            { code: '421281', name: '赤壁市' }
          ]
        },
        {
          code: '4213',
          name: '随州市',
          children: [
            { code: '421303', name: '曾都区' },
            { code: '421321', name: '随县' },
            { code: '421381', name: '广水市' }
          ]
        },
        {
          code: '4228',
          name: '恩施土家族苗族自治州',
          children: [
            { code: '422801', name: '恩施市' },
            { code: '422802', name: '利川市' },
            { code: '422822', name: '建始县' },
            { code: '422823', name: '巴东县' },
            { code: '422825', name: '宣恩县' },
            { code: '422826', name: '咸丰县' },
            { code: '422827', name: '来凤县' },
            { code: '422828', name: '鹤峰县' }
          ]
        },
        {
          code: '4290',
          name: '省直辖县级行政区划',
          children: [
            { code: '429004', name: '仙桃市' },
            { code: '429005', name: '潜江市' },
            { code: '429006', name: '天门市' },
            { code: '429021', name: '神农架林区' }
          ]
        }
      ]
    },
    {
      code: '43',
      name: '湖南省',
      children: [
        {
          code: '4301',
          name: '长沙市',
          children: [
            { code: '430102', name: '芙蓉区' },
            { code: '430103', name: '天心区' },
            { code: '430104', name: '岳麓区' },
            { code: '430105', name: '开福区' },
            { code: '430111', name: '雨花区' },
            { code: '430112', name: '望城区' },
            { code: '430121', name: '长沙县' },
            { code: '430181', name: '浏阳市' },
            { code: '430182', name: '宁乡市' }
          ]
        },
        {
          code: '4302',
          name: '株洲市',
          children: [
            { code: '430202', name: '荷塘区' },
            { code: '430203', name: '芦淞区' },
            { code: '430204', name: '石峰区' },
            { code: '430211', name: '天元区' },
            { code: '430212', name: '渌口区' },
            { code: '430223', name: '攸县' },
            { code: '430224', name: '茶陵县' },
            { code: '430225', name: '炎陵县' },
            { code: '430271', name: '云龙示范区' },
            { code: '430281', name: '醴陵市' }
          ]
        },
        {
          code: '4303',
          name: '湘潭市',
          children: [
            { code: '430302', name: '雨湖区' },
            { code: '430304', name: '岳塘区' },
            { code: '430321', name: '湘潭县' },
            { code: '430371', name: '湖南湘潭高新技术产业园区' },
            { code: '430372', name: '湘潭昭山示范区' },
            { code: '430373', name: '湘潭九华示范区' },
            { code: '430381', name: '湘乡市' },
            { code: '430382', name: '韶山市' }
          ]
        },
        {
          code: '4304',
          name: '衡阳市',
          children: [
            { code: '430405', name: '珠晖区' },
            { code: '430406', name: '雁峰区' },
            { code: '430407', name: '石鼓区' },
            { code: '430408', name: '蒸湘区' },
            { code: '430412', name: '南岳区' },
            { code: '430421', name: '衡阳县' },
            { code: '430422', name: '衡南县' },
            { code: '430423', name: '衡山县' },
            { code: '430424', name: '衡东县' },
            { code: '430426', name: '祁东县' },
            { code: '430471', name: '衡阳综合保税区' },
            { code: '430472', name: '湖南衡阳高新技术产业园区' },
            { code: '430473', name: '湖南衡阳松木经济开发区' },
            { code: '430481', name: '耒阳市' },
            { code: '430482', name: '常宁市' }
          ]
        },
        {
          code: '4305',
          name: '邵阳市',
          children: [
            { code: '430502', name: '双清区' },
            { code: '430503', name: '大祥区' },
            { code: '430511', name: '北塔区' },
            { code: '430521', name: '邵东县' },
            { code: '430522', name: '新邵县' },
            { code: '430523', name: '邵阳县' },
            { code: '430524', name: '隆回县' },
            { code: '430525', name: '洞口县' },
            { code: '430527', name: '绥宁县' },
            { code: '430528', name: '新宁县' },
            { code: '430529', name: '城步苗族自治县' },
            { code: '430581', name: '武冈市' }
          ]
        },
        {
          code: '4306',
          name: '岳阳市',
          children: [
            { code: '430602', name: '岳阳楼区' },
            { code: '430603', name: '云溪区' },
            { code: '430611', name: '君山区' },
            { code: '430621', name: '岳阳县' },
            { code: '430623', name: '华容县' },
            { code: '430624', name: '湘阴县' },
            { code: '430626', name: '平江县' },
            { code: '430671', name: '岳阳市屈原管理区' },
            { code: '430681', name: '汨罗市' },
            { code: '430682', name: '临湘市' }
          ]
        },
        {
          code: '4307',
          name: '常德市',
          children: [
            { code: '430702', name: '武陵区' },
            { code: '430703', name: '鼎城区' },
            { code: '430721', name: '安乡县' },
            { code: '430722', name: '汉寿县' },
            { code: '430723', name: '澧县' },
            { code: '430724', name: '临澧县' },
            { code: '430725', name: '桃源县' },
            { code: '430726', name: '石门县' },
            { code: '430771', name: '常德市西洞庭管理区' },
            { code: '430781', name: '津市市' }
          ]
        },
        {
          code: '4308',
          name: '张家界市',
          children: [
            { code: '430802', name: '永定区' },
            { code: '430811', name: '武陵源区' },
            { code: '430821', name: '慈利县' },
            { code: '430822', name: '桑植县' }
          ]
        },
        {
          code: '4309',
          name: '益阳市',
          children: [
            { code: '430902', name: '资阳区' },
            { code: '430903', name: '赫山区' },
            { code: '430921', name: '南县' },
            { code: '430922', name: '桃江县' },
            { code: '430923', name: '安化县' },
            { code: '430971', name: '益阳市大通湖管理区' },
            { code: '430972', name: '湖南益阳高新技术产业园区' },
            { code: '430981', name: '沅江市' }
          ]
        },
        {
          code: '4310',
          name: '郴州市',
          children: [
            { code: '431002', name: '北湖区' },
            { code: '431003', name: '苏仙区' },
            { code: '431021', name: '桂阳县' },
            { code: '431022', name: '宜章县' },
            { code: '431023', name: '永兴县' },
            { code: '431024', name: '嘉禾县' },
            { code: '431025', name: '临武县' },
            { code: '431026', name: '汝城县' },
            { code: '431027', name: '桂东县' },
            { code: '431028', name: '安仁县' },
            { code: '431081', name: '资兴市' }
          ]
        },
        {
          code: '4311',
          name: '永州市',
          children: [
            { code: '431102', name: '零陵区' },
            { code: '431103', name: '冷水滩区' },
            { code: '431121', name: '祁阳县' },
            { code: '431122', name: '东安县' },
            { code: '431123', name: '双牌县' },
            { code: '431124', name: '道县' },
            { code: '431125', name: '江永县' },
            { code: '431126', name: '宁远县' },
            { code: '431127', name: '蓝山县' },
            { code: '431128', name: '新田县' },
            { code: '431129', name: '江华瑶族自治县' },
            { code: '431171', name: '永州经济技术开发区' },
            { code: '431172', name: '永州市金洞管理区' },
            { code: '431173', name: '永州市回龙圩管理区' }
          ]
        },
        {
          code: '4312',
          name: '怀化市',
          children: [
            { code: '431202', name: '鹤城区' },
            { code: '431221', name: '中方县' },
            { code: '431222', name: '沅陵县' },
            { code: '431223', name: '辰溪县' },
            { code: '431224', name: '溆浦县' },
            { code: '431225', name: '会同县' },
            { code: '431226', name: '麻阳苗族自治县' },
            { code: '431227', name: '新晃侗族自治县' },
            { code: '431228', name: '芷江侗族自治县' },
            { code: '431229', name: '靖州苗族侗族自治县' },
            { code: '431230', name: '通道侗族自治县' },
            { code: '431271', name: '怀化市洪江管理区' },
            { code: '431281', name: '洪江市' }
          ]
        },
        {
          code: '4313',
          name: '娄底市',
          children: [
            { code: '431302', name: '娄星区' },
            { code: '431321', name: '双峰县' },
            { code: '431322', name: '新化县' },
            { code: '431381', name: '冷水江市' },
            { code: '431382', name: '涟源市' }
          ]
        },
        {
          code: '4331',
          name: '湘西土家族苗族自治州',
          children: [
            { code: '433101', name: '吉首市' },
            { code: '433122', name: '泸溪县' },
            { code: '433123', name: '凤凰县' },
            { code: '433124', name: '花垣县' },
            { code: '433125', name: '保靖县' },
            { code: '433126', name: '古丈县' },
            { code: '433127', name: '永顺县' },
            { code: '433130', name: '龙山县' },
            { code: '433172', name: '湖南吉首经济开发区' },
            { code: '433173', name: '湖南永顺经济开发区' }
          ]
        }
      ]
    },
    {
      code: '44',
      name: '广东省',
      children: [
        {
          code: '4401',
          name: '广州市',
          children: [
            { code: '440103', name: '荔湾区' },
            { code: '440104', name: '越秀区' },
            { code: '440105', name: '海珠区' },
            { code: '440106', name: '天河区' },
            { code: '440111', name: '白云区' },
            { code: '440112', name: '黄埔区' },
            { code: '440113', name: '番禺区' },
            { code: '440114', name: '花都区' },
            { code: '440115', name: '南沙区' },
            { code: '440117', name: '从化区' },
            { code: '440118', name: '增城区' }
          ]
        },
        {
          code: '4402',
          name: '韶关市',
          children: [
            { code: '440203', name: '武江区' },
            { code: '440204', name: '浈江区' },
            { code: '440205', name: '曲江区' },
            { code: '440222', name: '始兴县' },
            { code: '440224', name: '仁化县' },
            { code: '440229', name: '翁源县' },
            { code: '440232', name: '乳源瑶族自治县' },
            { code: '440233', name: '新丰县' },
            { code: '440281', name: '乐昌市' },
            { code: '440282', name: '南雄市' }
          ]
        },
        {
          code: '4403',
          name: '深圳市',
          children: [
            { code: '440303', name: '罗湖区' },
            { code: '440304', name: '福田区' },
            { code: '440305', name: '南山区' },
            { code: '440306', name: '宝安区' },
            { code: '440307', name: '龙岗区' },
            { code: '440308', name: '盐田区' },
            { code: '440309', name: '龙华区' },
            { code: '440310', name: '坪山区' },
            { code: '440311', name: '光明区' }
          ]
        },
        {
          code: '4404',
          name: '珠海市',
          children: [
            { code: '440402', name: '香洲区' },
            { code: '440403', name: '斗门区' },
            { code: '440404', name: '金湾区' }
          ]
        },
        {
          code: '4405',
          name: '汕头市',
          children: [
            { code: '440507', name: '龙湖区' },
            { code: '440511', name: '金平区' },
            { code: '440512', name: '濠江区' },
            { code: '440513', name: '潮阳区' },
            { code: '440514', name: '潮南区' },
            { code: '440515', name: '澄海区' },
            { code: '440523', name: '南澳县' }
          ]
        },
        {
          code: '4406',
          name: '佛山市',
          children: [
            { code: '440604', name: '禅城区' },
            { code: '440605', name: '南海区' },
            { code: '440606', name: '顺德区' },
            { code: '440607', name: '三水区' },
            { code: '440608', name: '高明区' }
          ]
        },
        {
          code: '4407',
          name: '江门市',
          children: [
            { code: '440703', name: '蓬江区' },
            { code: '440704', name: '江海区' },
            { code: '440705', name: '新会区' },
            { code: '440781', name: '台山市' },
            { code: '440783', name: '开平市' },
            { code: '440784', name: '鹤山市' },
            { code: '440785', name: '恩平市' }
          ]
        },
        {
          code: '4408',
          name: '湛江市',
          children: [
            { code: '440802', name: '赤坎区' },
            { code: '440803', name: '霞山区' },
            { code: '440804', name: '坡头区' },
            { code: '440811', name: '麻章区' },
            { code: '440823', name: '遂溪县' },
            { code: '440825', name: '徐闻县' },
            { code: '440881', name: '廉江市' },
            { code: '440882', name: '雷州市' },
            { code: '440883', name: '吴川市' }
          ]
        },
        {
          code: '4409',
          name: '茂名市',
          children: [
            { code: '440902', name: '茂南区' },
            { code: '440904', name: '电白区' },
            { code: '440981', name: '高州市' },
            { code: '440982', name: '化州市' },
            { code: '440983', name: '信宜市' }
          ]
        },
        {
          code: '4412',
          name: '肇庆市',
          children: [
            { code: '441202', name: '端州区' },
            { code: '441203', name: '鼎湖区' },
            { code: '441204', name: '高要区' },
            { code: '441223', name: '广宁县' },
            { code: '441224', name: '怀集县' },
            { code: '441225', name: '封开县' },
            { code: '441226', name: '德庆县' },
            { code: '441284', name: '四会市' }
          ]
        },
        {
          code: '4413',
          name: '惠州市',
          children: [
            { code: '441302', name: '惠城区' },
            { code: '441303', name: '惠阳区' },
            { code: '441322', name: '博罗县' },
            { code: '441323', name: '惠东县' },
            { code: '441324', name: '龙门县' }
          ]
        },
        {
          code: '4414',
          name: '梅州市',
          children: [
            { code: '441402', name: '梅江区' },
            { code: '441403', name: '梅县区' },
            { code: '441422', name: '大埔县' },
            { code: '441423', name: '丰顺县' },
            { code: '441424', name: '五华县' },
            { code: '441426', name: '平远县' },
            { code: '441427', name: '蕉岭县' },
            { code: '441481', name: '兴宁市' }
          ]
        },
        {
          code: '4415',
          name: '汕尾市',
          children: [
            { code: '441502', name: '城区' },
            { code: '441521', name: '海丰县' },
            { code: '441523', name: '陆河县' },
            { code: '441581', name: '陆丰市' }
          ]
        },
        {
          code: '4416',
          name: '河源市',
          children: [
            { code: '441602', name: '源城区' },
            { code: '441621', name: '紫金县' },
            { code: '441622', name: '龙川县' },
            { code: '441623', name: '连平县' },
            { code: '441624', name: '和平县' },
            { code: '441625', name: '东源县' }
          ]
        },
        {
          code: '4417',
          name: '阳江市',
          children: [
            { code: '441702', name: '江城区' },
            { code: '441704', name: '阳东区' },
            { code: '441721', name: '阳西县' },
            { code: '441781', name: '阳春市' }
          ]
        },
        {
          code: '4418',
          name: '清远市',
          children: [
            { code: '441802', name: '清城区' },
            { code: '441803', name: '清新区' },
            { code: '441821', name: '佛冈县' },
            { code: '441823', name: '阳山县' },
            { code: '441825', name: '连山壮族瑶族自治县' },
            { code: '441826', name: '连南瑶族自治县' },
            { code: '441881', name: '英德市' },
            { code: '441882', name: '连州市' }
          ]
        },
        {
          code: '4419',
          name: '东莞市',
          children: [
            { code: '441900003', name: '东城街道' },
            { code: '441900004', name: '南城街道' },
            { code: '441900005', name: '万江街道' },
            { code: '441900006', name: '莞城街道' },
            { code: '441900101', name: '石碣镇' },
            { code: '441900102', name: '石龙镇' },
            { code: '441900103', name: '茶山镇' },
            { code: '441900104', name: '石排镇' },
            { code: '441900105', name: '企石镇' },
            { code: '441900106', name: '横沥镇' },
            { code: '441900107', name: '桥头镇' },
            { code: '441900108', name: '谢岗镇' },
            { code: '441900109', name: '东坑镇' },
            { code: '441900110', name: '常平镇' },
            { code: '441900111', name: '寮步镇' },
            { code: '441900112', name: '樟木头镇' },
            { code: '441900113', name: '大朗镇' },
            { code: '441900114', name: '黄江镇' },
            { code: '441900115', name: '清溪镇' },
            { code: '441900116', name: '塘厦镇' },
            { code: '441900117', name: '凤岗镇' },
            { code: '441900118', name: '大岭山镇' },
            { code: '441900119', name: '长安镇' },
            { code: '441900121', name: '虎门镇' },
            { code: '441900122', name: '厚街镇' },
            { code: '441900123', name: '沙田镇' },
            { code: '441900124', name: '道滘镇' },
            { code: '441900125', name: '洪梅镇' },
            { code: '441900126', name: '麻涌镇' },
            { code: '441900127', name: '望牛墩镇' },
            { code: '441900128', name: '中堂镇' },
            { code: '441900129', name: '高埗镇' },
            { code: '441900401', name: '松山湖管委会' },
            { code: '441900402', name: '东莞港' },
            { code: '441900403', name: '东莞生态园' }
          ]
        },
        {
          code: '4420',
          name: '中山市',
          children: [
            { code: '442000001', name: '石岐区街道' },
            { code: '442000002', name: '东区街道' },
            { code: '442000003', name: '火炬开发区街道' },
            { code: '442000004', name: '西区街道' },
            { code: '442000005', name: '南区街道' },
            { code: '442000006', name: '五桂山街道' },
            { code: '442000100', name: '小榄镇' },
            { code: '442000101', name: '黄圃镇' },
            { code: '442000102', name: '民众镇' },
            { code: '442000103', name: '东凤镇' },
            { code: '442000104', name: '东升镇' },
            { code: '442000105', name: '古镇镇' },
            { code: '442000106', name: '沙溪镇' },
            { code: '442000107', name: '坦洲镇' },
            { code: '442000108', name: '港口镇' },
            { code: '442000109', name: '三角镇' },
            { code: '442000110', name: '横栏镇' },
            { code: '442000111', name: '南头镇' },
            { code: '442000112', name: '阜沙镇' },
            { code: '442000113', name: '南朗镇' },
            { code: '442000114', name: '三乡镇' },
            { code: '442000115', name: '板芙镇' },
            { code: '442000116', name: '大涌镇' },
            { code: '442000117', name: '神湾镇' }
          ]
        },
        {
          code: '4451',
          name: '潮州市',
          children: [
            { code: '445102', name: '湘桥区' },
            { code: '445103', name: '潮安区' },
            { code: '445122', name: '饶平县' }
          ]
        },
        {
          code: '4452',
          name: '揭阳市',
          children: [
            { code: '445202', name: '榕城区' },
            { code: '445203', name: '揭东区' },
            { code: '445222', name: '揭西县' },
            { code: '445224', name: '惠来县' },
            { code: '445281', name: '普宁市' }
          ]
        },
        {
          code: '4453',
          name: '云浮市',
          children: [
            { code: '445302', name: '云城区' },
            { code: '445303', name: '云安区' },
            { code: '445321', name: '新兴县' },
            { code: '445322', name: '郁南县' },
            { code: '445381', name: '罗定市' }
          ]
        }
      ]
    },
    {
      code: '45',
      name: '广西壮族自治区',
      children: [
        {
          code: '4501',
          name: '南宁市',
          children: [
            { code: '450102', name: '兴宁区' },
            { code: '450103', name: '青秀区' },
            { code: '450105', name: '江南区' },
            { code: '450107', name: '西乡塘区' },
            { code: '450108', name: '良庆区' },
            { code: '450109', name: '邕宁区' },
            { code: '450110', name: '武鸣区' },
            { code: '450123', name: '隆安县' },
            { code: '450124', name: '马山县' },
            { code: '450125', name: '上林县' },
            { code: '450126', name: '宾阳县' },
            { code: '450127', name: '横县' }
          ]
        },
        {
          code: '4502',
          name: '柳州市',
          children: [
            { code: '450202', name: '城中区' },
            { code: '450203', name: '鱼峰区' },
            { code: '450204', name: '柳南区' },
            { code: '450205', name: '柳北区' },
            { code: '450206', name: '柳江区' },
            { code: '450222', name: '柳城县' },
            { code: '450223', name: '鹿寨县' },
            { code: '450224', name: '融安县' },
            { code: '450225', name: '融水苗族自治县' },
            { code: '450226', name: '三江侗族自治县' }
          ]
        },
        {
          code: '4503',
          name: '桂林市',
          children: [
            { code: '450302', name: '秀峰区' },
            { code: '450303', name: '叠彩区' },
            { code: '450304', name: '象山区' },
            { code: '450305', name: '七星区' },
            { code: '450311', name: '雁山区' },
            { code: '450312', name: '临桂区' },
            { code: '450321', name: '阳朔县' },
            { code: '450323', name: '灵川县' },
            { code: '450324', name: '全州县' },
            { code: '450325', name: '兴安县' },
            { code: '450326', name: '永福县' },
            { code: '450327', name: '灌阳县' },
            { code: '450328', name: '龙胜各族自治县' },
            { code: '450329', name: '资源县' },
            { code: '450330', name: '平乐县' },
            { code: '450332', name: '恭城瑶族自治县' },
            { code: '450381', name: '荔浦市' }
          ]
        },
        {
          code: '4504',
          name: '梧州市',
          children: [
            { code: '450403', name: '万秀区' },
            { code: '450405', name: '长洲区' },
            { code: '450406', name: '龙圩区' },
            { code: '450421', name: '苍梧县' },
            { code: '450422', name: '藤县' },
            { code: '450423', name: '蒙山县' },
            { code: '450481', name: '岑溪市' }
          ]
        },
        {
          code: '4505',
          name: '北海市',
          children: [
            { code: '450502', name: '海城区' },
            { code: '450503', name: '银海区' },
            { code: '450512', name: '铁山港区' },
            { code: '450521', name: '合浦县' }
          ]
        },
        {
          code: '4506',
          name: '防城港市',
          children: [
            { code: '450602', name: '港口区' },
            { code: '450603', name: '防城区' },
            { code: '450621', name: '上思县' },
            { code: '450681', name: '东兴市' }
          ]
        },
        {
          code: '4507',
          name: '钦州市',
          children: [
            { code: '450702', name: '钦南区' },
            { code: '450703', name: '钦北区' },
            { code: '450721', name: '灵山县' },
            { code: '450722', name: '浦北县' }
          ]
        },
        {
          code: '4508',
          name: '贵港市',
          children: [
            { code: '450802', name: '港北区' },
            { code: '450803', name: '港南区' },
            { code: '450804', name: '覃塘区' },
            { code: '450821', name: '平南县' },
            { code: '450881', name: '桂平市' }
          ]
        },
        {
          code: '4509',
          name: '玉林市',
          children: [
            { code: '450902', name: '玉州区' },
            { code: '450903', name: '福绵区' },
            { code: '450921', name: '容县' },
            { code: '450922', name: '陆川县' },
            { code: '450923', name: '博白县' },
            { code: '450924', name: '兴业县' },
            { code: '450981', name: '北流市' }
          ]
        },
        {
          code: '4510',
          name: '百色市',
          children: [
            { code: '451002', name: '右江区' },
            { code: '451021', name: '田阳县' },
            { code: '451022', name: '田东县' },
            { code: '451023', name: '平果县' },
            { code: '451024', name: '德保县' },
            { code: '451026', name: '那坡县' },
            { code: '451027', name: '凌云县' },
            { code: '451028', name: '乐业县' },
            { code: '451029', name: '田林县' },
            { code: '451030', name: '西林县' },
            { code: '451031', name: '隆林各族自治县' },
            { code: '451081', name: '靖西市' }
          ]
        },
        {
          code: '4511',
          name: '贺州市',
          children: [
            { code: '451102', name: '八步区' },
            { code: '451103', name: '平桂区' },
            { code: '451121', name: '昭平县' },
            { code: '451122', name: '钟山县' },
            { code: '451123', name: '富川瑶族自治县' }
          ]
        },
        {
          code: '4512',
          name: '河池市',
          children: [
            { code: '451202', name: '金城江区' },
            { code: '451203', name: '宜州区' },
            { code: '451221', name: '南丹县' },
            { code: '451222', name: '天峨县' },
            { code: '451223', name: '凤山县' },
            { code: '451224', name: '东兰县' },
            { code: '451225', name: '罗城仫佬族自治县' },
            { code: '451226', name: '环江毛南族自治县' },
            { code: '451227', name: '巴马瑶族自治县' },
            { code: '451228', name: '都安瑶族自治县' },
            { code: '451229', name: '大化瑶族自治县' }
          ]
        },
        {
          code: '4513',
          name: '来宾市',
          children: [
            { code: '451302', name: '兴宾区' },
            { code: '451321', name: '忻城县' },
            { code: '451322', name: '象州县' },
            { code: '451323', name: '武宣县' },
            { code: '451324', name: '金秀瑶族自治县' },
            { code: '451381', name: '合山市' }
          ]
        },
        {
          code: '4514',
          name: '崇左市',
          children: [
            { code: '451402', name: '江州区' },
            { code: '451421', name: '扶绥县' },
            { code: '451422', name: '宁明县' },
            { code: '451423', name: '龙州县' },
            { code: '451424', name: '大新县' },
            { code: '451425', name: '天等县' },
            { code: '451481', name: '凭祥市' }
          ]
        }
      ]
    },
    {
      code: '46',
      name: '海南省',
      children: [
        {
          code: '4601',
          name: '海口市',
          children: [
            { code: '460105', name: '秀英区' },
            { code: '460106', name: '龙华区' },
            { code: '460107', name: '琼山区' },
            { code: '460108', name: '美兰区' }
          ]
        },
        {
          code: '4602',
          name: '三亚市',
          children: [
            { code: '460202', name: '海棠区' },
            { code: '460203', name: '吉阳区' },
            { code: '460204', name: '天涯区' },
            { code: '460205', name: '崖州区' }
          ]
        },
        {
          code: '4603',
          name: '三沙市',
          children: [
            { code: '460321', name: '西沙群岛' },
            { code: '460322', name: '南沙群岛' },
            { code: '460323', name: '中沙群岛的岛礁及其海域' }
          ]
        },
        {
          code: '4604',
          name: '儋州市',
          children: [
            { code: '460400100', name: '那大镇' },
            { code: '460400101', name: '和庆镇' },
            { code: '460400102', name: '南丰镇' },
            { code: '460400103', name: '大成镇' },
            { code: '460400104', name: '雅星镇' },
            { code: '460400105', name: '兰洋镇' },
            { code: '460400106', name: '光村镇' },
            { code: '460400107', name: '木棠镇' },
            { code: '460400108', name: '海头镇' },
            { code: '460400109', name: '峨蔓镇' },
            { code: '460400111', name: '王五镇' },
            { code: '460400112', name: '白马井镇' },
            { code: '460400113', name: '中和镇' },
            { code: '460400114', name: '排浦镇' },
            { code: '460400115', name: '东成镇' },
            { code: '460400116', name: '新州镇' },
            { code: '460400499', name: '洋浦经济开发区' },
            { code: '460400500', name: '华南热作学院' }
          ]
        },
        {
          code: '4690',
          name: '省直辖县级行政区划',
          children: [
            { code: '469001', name: '五指山市' },
            { code: '469002', name: '琼海市' },
            { code: '469005', name: '文昌市' },
            { code: '469006', name: '万宁市' },
            { code: '469007', name: '东方市' },
            { code: '469021', name: '定安县' },
            { code: '469022', name: '屯昌县' },
            { code: '469023', name: '澄迈县' },
            { code: '469024', name: '临高县' },
            { code: '469025', name: '白沙黎族自治县' },
            { code: '469026', name: '昌江黎族自治县' },
            { code: '469027', name: '乐东黎族自治县' },
            { code: '469028', name: '陵水黎族自治县' },
            { code: '469029', name: '保亭黎族苗族自治县' },
            { code: '469030', name: '琼中黎族苗族自治县' }
          ]
        }
      ]
    },
    {
      code: '50',
      name: '重庆市',
      children: [
        {
          code: '5001',
          name: '市辖区',
          children: [
            { code: '500101', name: '万州区' },
            { code: '500102', name: '涪陵区' },
            { code: '500103', name: '渝中区' },
            { code: '500104', name: '大渡口区' },
            { code: '500105', name: '江北区' },
            { code: '500106', name: '沙坪坝区' },
            { code: '500107', name: '九龙坡区' },
            { code: '500108', name: '南岸区' },
            { code: '500109', name: '北碚区' },
            { code: '500110', name: '綦江区' },
            { code: '500111', name: '大足区' },
            { code: '500112', name: '渝北区' },
            { code: '500113', name: '巴南区' },
            { code: '500114', name: '黔江区' },
            { code: '500115', name: '长寿区' },
            { code: '500116', name: '江津区' },
            { code: '500117', name: '合川区' },
            { code: '500118', name: '永川区' },
            { code: '500119', name: '南川区' },
            { code: '500120', name: '璧山区' },
            { code: '500151', name: '铜梁区' },
            { code: '500152', name: '潼南区' },
            { code: '500153', name: '荣昌区' },
            { code: '500154', name: '开州区' },
            { code: '500155', name: '梁平区' },
            { code: '500156', name: '武隆区' }
          ]
        },
        {
          code: '5002',
          name: '县',
          children: [
            { code: '500229', name: '城口县' },
            { code: '500230', name: '丰都县' },
            { code: '500231', name: '垫江县' },
            { code: '500233', name: '忠县' },
            { code: '500235', name: '云阳县' },
            { code: '500236', name: '奉节县' },
            { code: '500237', name: '巫山县' },
            { code: '500238', name: '巫溪县' },
            { code: '500240', name: '石柱土家族自治县' },
            { code: '500241', name: '秀山土家族苗族自治县' },
            { code: '500242', name: '酉阳土家族苗族自治县' },
            { code: '500243', name: '彭水苗族土家族自治县' }
          ]
        }
      ]
    },
    {
      code: '51',
      name: '四川省',
      children: [
        {
          code: '5101',
          name: '成都市',
          children: [
            { code: '510104', name: '锦江区' },
            { code: '510105', name: '青羊区' },
            { code: '510106', name: '金牛区' },
            { code: '510107', name: '武侯区' },
            { code: '510108', name: '成华区' },
            { code: '510112', name: '龙泉驿区' },
            { code: '510113', name: '青白江区' },
            { code: '510114', name: '新都区' },
            { code: '510115', name: '温江区' },
            { code: '510116', name: '双流区' },
            { code: '510117', name: '郫都区' },
            { code: '510121', name: '金堂县' },
            { code: '510129', name: '大邑县' },
            { code: '510131', name: '蒲江县' },
            { code: '510132', name: '新津县' },
            { code: '510181', name: '都江堰市' },
            { code: '510182', name: '彭州市' },
            { code: '510183', name: '邛崃市' },
            { code: '510184', name: '崇州市' },
            { code: '510185', name: '简阳市' }
          ]
        },
        {
          code: '5103',
          name: '自贡市',
          children: [
            { code: '510302', name: '自流井区' },
            { code: '510303', name: '贡井区' },
            { code: '510304', name: '大安区' },
            { code: '510311', name: '沿滩区' },
            { code: '510321', name: '荣县' },
            { code: '510322', name: '富顺县' }
          ]
        },
        {
          code: '5104',
          name: '攀枝花市',
          children: [
            { code: '510402', name: '东区' },
            { code: '510403', name: '西区' },
            { code: '510411', name: '仁和区' },
            { code: '510421', name: '米易县' },
            { code: '510422', name: '盐边县' }
          ]
        },
        {
          code: '5105',
          name: '泸州市',
          children: [
            { code: '510502', name: '江阳区' },
            { code: '510503', name: '纳溪区' },
            { code: '510504', name: '龙马潭区' },
            { code: '510521', name: '泸县' },
            { code: '510522', name: '合江县' },
            { code: '510524', name: '叙永县' },
            { code: '510525', name: '古蔺县' }
          ]
        },
        {
          code: '5106',
          name: '德阳市',
          children: [
            { code: '510603', name: '旌阳区' },
            { code: '510604', name: '罗江区' },
            { code: '510623', name: '中江县' },
            { code: '510681', name: '广汉市' },
            { code: '510682', name: '什邡市' },
            { code: '510683', name: '绵竹市' }
          ]
        },
        {
          code: '5107',
          name: '绵阳市',
          children: [
            { code: '510703', name: '涪城区' },
            { code: '510704', name: '游仙区' },
            { code: '510705', name: '安州区' },
            { code: '510722', name: '三台县' },
            { code: '510723', name: '盐亭县' },
            { code: '510725', name: '梓潼县' },
            { code: '510726', name: '北川羌族自治县' },
            { code: '510727', name: '平武县' },
            { code: '510781', name: '江油市' }
          ]
        },
        {
          code: '5108',
          name: '广元市',
          children: [
            { code: '510802', name: '利州区' },
            { code: '510811', name: '昭化区' },
            { code: '510812', name: '朝天区' },
            { code: '510821', name: '旺苍县' },
            { code: '510822', name: '青川县' },
            { code: '510823', name: '剑阁县' },
            { code: '510824', name: '苍溪县' }
          ]
        },
        {
          code: '5109',
          name: '遂宁市',
          children: [
            { code: '510903', name: '船山区' },
            { code: '510904', name: '安居区' },
            { code: '510921', name: '蓬溪县' },
            { code: '510922', name: '射洪县' },
            { code: '510923', name: '大英县' }
          ]
        },
        {
          code: '5110',
          name: '内江市',
          children: [
            { code: '511002', name: '市中区' },
            { code: '511011', name: '东兴区' },
            { code: '511024', name: '威远县' },
            { code: '511025', name: '资中县' },
            { code: '511071', name: '内江经济开发区' },
            { code: '511083', name: '隆昌市' }
          ]
        },
        {
          code: '5111',
          name: '乐山市',
          children: [
            { code: '511102', name: '市中区' },
            { code: '511111', name: '沙湾区' },
            { code: '511112', name: '五通桥区' },
            { code: '511113', name: '金口河区' },
            { code: '511123', name: '犍为县' },
            { code: '511124', name: '井研县' },
            { code: '511126', name: '夹江县' },
            { code: '511129', name: '沐川县' },
            { code: '511132', name: '峨边彝族自治县' },
            { code: '511133', name: '马边彝族自治县' },
            { code: '511181', name: '峨眉山市' }
          ]
        },
        {
          code: '5113',
          name: '南充市',
          children: [
            { code: '511302', name: '顺庆区' },
            { code: '511303', name: '高坪区' },
            { code: '511304', name: '嘉陵区' },
            { code: '511321', name: '南部县' },
            { code: '511322', name: '营山县' },
            { code: '511323', name: '蓬安县' },
            { code: '511324', name: '仪陇县' },
            { code: '511325', name: '西充县' },
            { code: '511381', name: '阆中市' }
          ]
        },
        {
          code: '5114',
          name: '眉山市',
          children: [
            { code: '511402', name: '东坡区' },
            { code: '511403', name: '彭山区' },
            { code: '511421', name: '仁寿县' },
            { code: '511423', name: '洪雅县' },
            { code: '511424', name: '丹棱县' },
            { code: '511425', name: '青神县' }
          ]
        },
        {
          code: '5115',
          name: '宜宾市',
          children: [
            { code: '511502', name: '翠屏区' },
            { code: '511503', name: '南溪区' },
            { code: '511504', name: '叙州区' },
            { code: '511523', name: '江安县' },
            { code: '511524', name: '长宁县' },
            { code: '511525', name: '高县' },
            { code: '511526', name: '珙县' },
            { code: '511527', name: '筠连县' },
            { code: '511528', name: '兴文县' },
            { code: '511529', name: '屏山县' }
          ]
        },
        {
          code: '5116',
          name: '广安市',
          children: [
            { code: '511602', name: '广安区' },
            { code: '511603', name: '前锋区' },
            { code: '511621', name: '岳池县' },
            { code: '511622', name: '武胜县' },
            { code: '511623', name: '邻水县' },
            { code: '511681', name: '华蓥市' }
          ]
        },
        {
          code: '5117',
          name: '达州市',
          children: [
            { code: '511702', name: '通川区' },
            { code: '511703', name: '达川区' },
            { code: '511722', name: '宣汉县' },
            { code: '511723', name: '开江县' },
            { code: '511724', name: '大竹县' },
            { code: '511725', name: '渠县' },
            { code: '511771', name: '达州经济开发区' },
            { code: '511781', name: '万源市' }
          ]
        },
        {
          code: '5118',
          name: '雅安市',
          children: [
            { code: '511802', name: '雨城区' },
            { code: '511803', name: '名山区' },
            { code: '511822', name: '荥经县' },
            { code: '511823', name: '汉源县' },
            { code: '511824', name: '石棉县' },
            { code: '511825', name: '天全县' },
            { code: '511826', name: '芦山县' },
            { code: '511827', name: '宝兴县' }
          ]
        },
        {
          code: '5119',
          name: '巴中市',
          children: [
            { code: '511902', name: '巴州区' },
            { code: '511903', name: '恩阳区' },
            { code: '511921', name: '通江县' },
            { code: '511922', name: '南江县' },
            { code: '511923', name: '平昌县' },
            { code: '511971', name: '巴中经济开发区' }
          ]
        },
        {
          code: '5120',
          name: '资阳市',
          children: [
            { code: '512002', name: '雁江区' },
            { code: '512021', name: '安岳县' },
            { code: '512022', name: '乐至县' }
          ]
        },
        {
          code: '5132',
          name: '阿坝藏族羌族自治州',
          children: [
            { code: '513201', name: '马尔康市' },
            { code: '513221', name: '汶川县' },
            { code: '513222', name: '理县' },
            { code: '513223', name: '茂县' },
            { code: '513224', name: '松潘县' },
            { code: '513225', name: '九寨沟县' },
            { code: '513226', name: '金川县' },
            { code: '513227', name: '小金县' },
            { code: '513228', name: '黑水县' },
            { code: '513230', name: '壤塘县' },
            { code: '513231', name: '阿坝县' },
            { code: '513232', name: '若尔盖县' },
            { code: '513233', name: '红原县' }
          ]
        },
        {
          code: '5133',
          name: '甘孜藏族自治州',
          children: [
            { code: '513301', name: '康定市' },
            { code: '513322', name: '泸定县' },
            { code: '513323', name: '丹巴县' },
            { code: '513324', name: '九龙县' },
            { code: '513325', name: '雅江县' },
            { code: '513326', name: '道孚县' },
            { code: '513327', name: '炉霍县' },
            { code: '513328', name: '甘孜县' },
            { code: '513329', name: '新龙县' },
            { code: '513330', name: '德格县' },
            { code: '513331', name: '白玉县' },
            { code: '513332', name: '石渠县' },
            { code: '513333', name: '色达县' },
            { code: '513334', name: '理塘县' },
            { code: '513335', name: '巴塘县' },
            { code: '513336', name: '乡城县' },
            { code: '513337', name: '稻城县' },
            { code: '513338', name: '得荣县' }
          ]
        },
        {
          code: '5134',
          name: '凉山彝族自治州',
          children: [
            { code: '513401', name: '西昌市' },
            { code: '513422', name: '木里藏族自治县' },
            { code: '513423', name: '盐源县' },
            { code: '513424', name: '德昌县' },
            { code: '513425', name: '会理县' },
            { code: '513426', name: '会东县' },
            { code: '513427', name: '宁南县' },
            { code: '513428', name: '普格县' },
            { code: '513429', name: '布拖县' },
            { code: '513430', name: '金阳县' },
            { code: '513431', name: '昭觉县' },
            { code: '513432', name: '喜德县' },
            { code: '513433', name: '冕宁县' },
            { code: '513434', name: '越西县' },
            { code: '513435', name: '甘洛县' },
            { code: '513436', name: '美姑县' },
            { code: '513437', name: '雷波县' }
          ]
        }
      ]
    },
    {
      code: '52',
      name: '贵州省',
      children: [
        {
          code: '5201',
          name: '贵阳市',
          children: [
            { code: '520102', name: '南明区' },
            { code: '520103', name: '云岩区' },
            { code: '520111', name: '花溪区' },
            { code: '520112', name: '乌当区' },
            { code: '520113', name: '白云区' },
            { code: '520115', name: '观山湖区' },
            { code: '520121', name: '开阳县' },
            { code: '520122', name: '息烽县' },
            { code: '520123', name: '修文县' },
            { code: '520181', name: '清镇市' }
          ]
        },
        {
          code: '5202',
          name: '六盘水市',
          children: [
            { code: '520201', name: '钟山区' },
            { code: '520203', name: '六枝特区' },
            { code: '520221', name: '水城县' },
            { code: '520281', name: '盘州市' }
          ]
        },
        {
          code: '5203',
          name: '遵义市',
          children: [
            { code: '520302', name: '红花岗区' },
            { code: '520303', name: '汇川区' },
            { code: '520304', name: '播州区' },
            { code: '520322', name: '桐梓县' },
            { code: '520323', name: '绥阳县' },
            { code: '520324', name: '正安县' },
            { code: '520325', name: '道真仡佬族苗族自治县' },
            { code: '520326', name: '务川仡佬族苗族自治县' },
            { code: '520327', name: '凤冈县' },
            { code: '520328', name: '湄潭县' },
            { code: '520329', name: '余庆县' },
            { code: '520330', name: '习水县' },
            { code: '520381', name: '赤水市' },
            { code: '520382', name: '仁怀市' }
          ]
        },
        {
          code: '5204',
          name: '安顺市',
          children: [
            { code: '520402', name: '西秀区' },
            { code: '520403', name: '平坝区' },
            { code: '520422', name: '普定县' },
            { code: '520423', name: '镇宁布依族苗族自治县' },
            { code: '520424', name: '关岭布依族苗族自治县' },
            { code: '520425', name: '紫云苗族布依族自治县' }
          ]
        },
        {
          code: '5205',
          name: '毕节市',
          children: [
            { code: '520502', name: '七星关区' },
            { code: '520521', name: '大方县' },
            { code: '520522', name: '黔西县' },
            { code: '520523', name: '金沙县' },
            { code: '520524', name: '织金县' },
            { code: '520525', name: '纳雍县' },
            { code: '520526', name: '威宁彝族回族苗族自治县' },
            { code: '520527', name: '赫章县' }
          ]
        },
        {
          code: '5206',
          name: '铜仁市',
          children: [
            { code: '520602', name: '碧江区' },
            { code: '520603', name: '万山区' },
            { code: '520621', name: '江口县' },
            { code: '520622', name: '玉屏侗族自治县' },
            { code: '520623', name: '石阡县' },
            { code: '520624', name: '思南县' },
            { code: '520625', name: '印江土家族苗族自治县' },
            { code: '520626', name: '德江县' },
            { code: '520627', name: '沿河土家族自治县' },
            { code: '520628', name: '松桃苗族自治县' }
          ]
        },
        {
          code: '5223',
          name: '黔西南布依族苗族自治州',
          children: [
            { code: '522301', name: '兴义市' },
            { code: '522302', name: '兴仁市' },
            { code: '522323', name: '普安县' },
            { code: '522324', name: '晴隆县' },
            { code: '522325', name: '贞丰县' },
            { code: '522326', name: '望谟县' },
            { code: '522327', name: '册亨县' },
            { code: '522328', name: '安龙县' }
          ]
        },
        {
          code: '5226',
          name: '黔东南苗族侗族自治州',
          children: [
            { code: '522601', name: '凯里市' },
            { code: '522622', name: '黄平县' },
            { code: '522623', name: '施秉县' },
            { code: '522624', name: '三穗县' },
            { code: '522625', name: '镇远县' },
            { code: '522626', name: '岑巩县' },
            { code: '522627', name: '天柱县' },
            { code: '522628', name: '锦屏县' },
            { code: '522629', name: '剑河县' },
            { code: '522630', name: '台江县' },
            { code: '522631', name: '黎平县' },
            { code: '522632', name: '榕江县' },
            { code: '522633', name: '从江县' },
            { code: '522634', name: '雷山县' },
            { code: '522635', name: '麻江县' },
            { code: '522636', name: '丹寨县' }
          ]
        },
        {
          code: '5227',
          name: '黔南布依族苗族自治州',
          children: [
            { code: '522701', name: '都匀市' },
            { code: '522702', name: '福泉市' },
            { code: '522722', name: '荔波县' },
            { code: '522723', name: '贵定县' },
            { code: '522725', name: '瓮安县' },
            { code: '522726', name: '独山县' },
            { code: '522727', name: '平塘县' },
            { code: '522728', name: '罗甸县' },
            { code: '522729', name: '长顺县' },
            { code: '522730', name: '龙里县' },
            { code: '522731', name: '惠水县' },
            { code: '522732', name: '三都水族自治县' }
          ]
        }
      ]
    },
    {
      code: '53',
      name: '云南省',
      children: [
        {
          code: '5301',
          name: '昆明市',
          children: [
            { code: '530102', name: '五华区' },
            { code: '530103', name: '盘龙区' },
            { code: '530111', name: '官渡区' },
            { code: '530112', name: '西山区' },
            { code: '530113', name: '东川区' },
            { code: '530114', name: '呈贡区' },
            { code: '530115', name: '晋宁区' },
            { code: '530124', name: '富民县' },
            { code: '530125', name: '宜良县' },
            { code: '530126', name: '石林彝族自治县' },
            { code: '530127', name: '嵩明县' },
            { code: '530128', name: '禄劝彝族苗族自治县' },
            { code: '530129', name: '寻甸回族彝族自治县' },
            { code: '530181', name: '安宁市' }
          ]
        },
        {
          code: '5303',
          name: '曲靖市',
          children: [
            { code: '530302', name: '麒麟区' },
            { code: '530303', name: '沾益区' },
            { code: '530304', name: '马龙区' },
            { code: '530322', name: '陆良县' },
            { code: '530323', name: '师宗县' },
            { code: '530324', name: '罗平县' },
            { code: '530325', name: '富源县' },
            { code: '530326', name: '会泽县' },
            { code: '530381', name: '宣威市' }
          ]
        },
        {
          code: '5304',
          name: '玉溪市',
          children: [
            { code: '530402', name: '红塔区' },
            { code: '530403', name: '江川区' },
            { code: '530422', name: '澄江县' },
            { code: '530423', name: '通海县' },
            { code: '530424', name: '华宁县' },
            { code: '530425', name: '易门县' },
            { code: '530426', name: '峨山彝族自治县' },
            { code: '530427', name: '新平彝族傣族自治县' },
            { code: '530428', name: '元江哈尼族彝族傣族自治县' }
          ]
        },
        {
          code: '5305',
          name: '保山市',
          children: [
            { code: '530502', name: '隆阳区' },
            { code: '530521', name: '施甸县' },
            { code: '530523', name: '龙陵县' },
            { code: '530524', name: '昌宁县' },
            { code: '530581', name: '腾冲市' }
          ]
        },
        {
          code: '5306',
          name: '昭通市',
          children: [
            { code: '530602', name: '昭阳区' },
            { code: '530621', name: '鲁甸县' },
            { code: '530622', name: '巧家县' },
            { code: '530623', name: '盐津县' },
            { code: '530624', name: '大关县' },
            { code: '530625', name: '永善县' },
            { code: '530626', name: '绥江县' },
            { code: '530627', name: '镇雄县' },
            { code: '530628', name: '彝良县' },
            { code: '530629', name: '威信县' },
            { code: '530681', name: '水富市' }
          ]
        },
        {
          code: '5307',
          name: '丽江市',
          children: [
            { code: '530702', name: '古城区' },
            { code: '530721', name: '玉龙纳西族自治县' },
            { code: '530722', name: '永胜县' },
            { code: '530723', name: '华坪县' },
            { code: '530724', name: '宁蒗彝族自治县' }
          ]
        },
        {
          code: '5308',
          name: '普洱市',
          children: [
            { code: '530802', name: '思茅区' },
            { code: '530821', name: '宁洱哈尼族彝族自治县' },
            { code: '530822', name: '墨江哈尼族自治县' },
            { code: '530823', name: '景东彝族自治县' },
            { code: '530824', name: '景谷傣族彝族自治县' },
            { code: '530825', name: '镇沅彝族哈尼族拉祜族自治县' },
            { code: '530826', name: '江城哈尼族彝族自治县' },
            { code: '530827', name: '孟连傣族拉祜族佤族自治县' },
            { code: '530828', name: '澜沧拉祜族自治县' },
            { code: '530829', name: '西盟佤族自治县' }
          ]
        },
        {
          code: '5309',
          name: '临沧市',
          children: [
            { code: '530902', name: '临翔区' },
            { code: '530921', name: '凤庆县' },
            { code: '530922', name: '云县' },
            { code: '530923', name: '永德县' },
            { code: '530924', name: '镇康县' },
            { code: '530925', name: '双江拉祜族佤族布朗族傣族自治县' },
            { code: '530926', name: '耿马傣族佤族自治县' },
            { code: '530927', name: '沧源佤族自治县' }
          ]
        },
        {
          code: '5323',
          name: '楚雄彝族自治州',
          children: [
            { code: '532301', name: '楚雄市' },
            { code: '532322', name: '双柏县' },
            { code: '532323', name: '牟定县' },
            { code: '532324', name: '南华县' },
            { code: '532325', name: '姚安县' },
            { code: '532326', name: '大姚县' },
            { code: '532327', name: '永仁县' },
            { code: '532328', name: '元谋县' },
            { code: '532329', name: '武定县' },
            { code: '532331', name: '禄丰县' }
          ]
        },
        {
          code: '5325',
          name: '红河哈尼族彝族自治州',
          children: [
            { code: '532501', name: '个旧市' },
            { code: '532502', name: '开远市' },
            { code: '532503', name: '蒙自市' },
            { code: '532504', name: '弥勒市' },
            { code: '532523', name: '屏边苗族自治县' },
            { code: '532524', name: '建水县' },
            { code: '532525', name: '石屏县' },
            { code: '532527', name: '泸西县' },
            { code: '532528', name: '元阳县' },
            { code: '532529', name: '红河县' },
            { code: '532530', name: '金平苗族瑶族傣族自治县' },
            { code: '532531', name: '绿春县' },
            { code: '532532', name: '河口瑶族自治县' }
          ]
        },
        {
          code: '5326',
          name: '文山壮族苗族自治州',
          children: [
            { code: '532601', name: '文山市' },
            { code: '532622', name: '砚山县' },
            { code: '532623', name: '西畴县' },
            { code: '532624', name: '麻栗坡县' },
            { code: '532625', name: '马关县' },
            { code: '532626', name: '丘北县' },
            { code: '532627', name: '广南县' },
            { code: '532628', name: '富宁县' }
          ]
        },
        {
          code: '5328',
          name: '西双版纳傣族自治州',
          children: [
            { code: '532801', name: '景洪市' },
            { code: '532822', name: '勐海县' },
            { code: '532823', name: '勐腊县' }
          ]
        },
        {
          code: '5329',
          name: '大理白族自治州',
          children: [
            { code: '532901', name: '大理市' },
            { code: '532922', name: '漾濞彝族自治县' },
            { code: '532923', name: '祥云县' },
            { code: '532924', name: '宾川县' },
            { code: '532925', name: '弥渡县' },
            { code: '532926', name: '南涧彝族自治县' },
            { code: '532927', name: '巍山彝族回族自治县' },
            { code: '532928', name: '永平县' },
            { code: '532929', name: '云龙县' },
            { code: '532930', name: '洱源县' },
            { code: '532931', name: '剑川县' },
            { code: '532932', name: '鹤庆县' }
          ]
        },
        {
          code: '5331',
          name: '德宏傣族景颇族自治州',
          children: [
            { code: '533102', name: '瑞丽市' },
            { code: '533103', name: '芒市' },
            { code: '533122', name: '梁河县' },
            { code: '533123', name: '盈江县' },
            { code: '533124', name: '陇川县' }
          ]
        },
        {
          code: '5333',
          name: '怒江傈僳族自治州',
          children: [
            { code: '533301', name: '泸水市' },
            { code: '533323', name: '福贡县' },
            { code: '533324', name: '贡山独龙族怒族自治县' },
            { code: '533325', name: '兰坪白族普米族自治县' }
          ]
        },
        {
          code: '5334',
          name: '迪庆藏族自治州',
          children: [
            { code: '533401', name: '香格里拉市' },
            { code: '533422', name: '德钦县' },
            { code: '533423', name: '维西傈僳族自治县' }
          ]
        }
      ]
    },
    {
      code: '54',
      name: '西藏自治区',
      children: [
        {
          code: '5401',
          name: '拉萨市',
          children: [
            { code: '540102', name: '城关区' },
            { code: '540103', name: '堆龙德庆区' },
            { code: '540104', name: '达孜区' },
            { code: '540121', name: '林周县' },
            { code: '540122', name: '当雄县' },
            { code: '540123', name: '尼木县' },
            { code: '540124', name: '曲水县' },
            { code: '540127', name: '墨竹工卡县' },
            { code: '540171', name: '格尔木藏青工业园区' },
            { code: '540172', name: '拉萨经济技术开发区' },
            { code: '540173', name: '西藏文化旅游创意园区' },
            { code: '540174', name: '达孜工业园区' }
          ]
        },
        {
          code: '5402',
          name: '日喀则市',
          children: [
            { code: '540202', name: '桑珠孜区' },
            { code: '540221', name: '南木林县' },
            { code: '540222', name: '江孜县' },
            { code: '540223', name: '定日县' },
            { code: '540224', name: '萨迦县' },
            { code: '540225', name: '拉孜县' },
            { code: '540226', name: '昂仁县' },
            { code: '540227', name: '谢通门县' },
            { code: '540228', name: '白朗县' },
            { code: '540229', name: '仁布县' },
            { code: '540230', name: '康马县' },
            { code: '540231', name: '定结县' },
            { code: '540232', name: '仲巴县' },
            { code: '540233', name: '亚东县' },
            { code: '540234', name: '吉隆县' },
            { code: '540235', name: '聂拉木县' },
            { code: '540236', name: '萨嘎县' },
            { code: '540237', name: '岗巴县' }
          ]
        },
        {
          code: '5403',
          name: '昌都市',
          children: [
            { code: '540302', name: '卡若区' },
            { code: '540321', name: '江达县' },
            { code: '540322', name: '贡觉县' },
            { code: '540323', name: '类乌齐县' },
            { code: '540324', name: '丁青县' },
            { code: '540325', name: '察雅县' },
            { code: '540326', name: '八宿县' },
            { code: '540327', name: '左贡县' },
            { code: '540328', name: '芒康县' },
            { code: '540329', name: '洛隆县' },
            { code: '540330', name: '边坝县' }
          ]
        },
        {
          code: '5404',
          name: '林芝市',
          children: [
            { code: '540402', name: '巴宜区' },
            { code: '540421', name: '工布江达县' },
            { code: '540422', name: '米林县' },
            { code: '540423', name: '墨脱县' },
            { code: '540424', name: '波密县' },
            { code: '540425', name: '察隅县' },
            { code: '540426', name: '朗县' }
          ]
        },
        {
          code: '5405',
          name: '山南市',
          children: [
            { code: '540502', name: '乃东区' },
            { code: '540521', name: '扎囊县' },
            { code: '540522', name: '贡嘎县' },
            { code: '540523', name: '桑日县' },
            { code: '540524', name: '琼结县' },
            { code: '540525', name: '曲松县' },
            { code: '540526', name: '措美县' },
            { code: '540527', name: '洛扎县' },
            { code: '540528', name: '加查县' },
            { code: '540529', name: '隆子县' },
            { code: '540530', name: '错那县' },
            { code: '540531', name: '浪卡子县' }
          ]
        },
        {
          code: '5406',
          name: '那曲市',
          children: [
            { code: '540602', name: '色尼区' },
            { code: '540621', name: '嘉黎县' },
            { code: '540622', name: '比如县' },
            { code: '540623', name: '聂荣县' },
            { code: '540624', name: '安多县' },
            { code: '540625', name: '申扎县' },
            { code: '540626', name: '索县' },
            { code: '540627', name: '班戈县' },
            { code: '540628', name: '巴青县' },
            { code: '540629', name: '尼玛县' },
            { code: '540630', name: '双湖县' }
          ]
        },
        {
          code: '5425',
          name: '阿里地区',
          children: [
            { code: '542521', name: '普兰县' },
            { code: '542522', name: '札达县' },
            { code: '542523', name: '噶尔县' },
            { code: '542524', name: '日土县' },
            { code: '542525', name: '革吉县' },
            { code: '542526', name: '改则县' },
            { code: '542527', name: '措勤县' }
          ]
        }
      ]
    },
    {
      code: '61',
      name: '陕西省',
      children: [
        {
          code: '6101',
          name: '西安市',
          children: [
            { code: '610102', name: '新城区' },
            { code: '610103', name: '碑林区' },
            { code: '610104', name: '莲湖区' },
            { code: '610111', name: '灞桥区' },
            { code: '610112', name: '未央区' },
            { code: '610113', name: '雁塔区' },
            { code: '610114', name: '阎良区' },
            { code: '610115', name: '临潼区' },
            { code: '610116', name: '长安区' },
            { code: '610117', name: '高陵区' },
            { code: '610118', name: '鄠邑区' },
            { code: '610122', name: '蓝田县' },
            { code: '610124', name: '周至县' }
          ]
        },
        {
          code: '6102',
          name: '铜川市',
          children: [
            { code: '610202', name: '王益区' },
            { code: '610203', name: '印台区' },
            { code: '610204', name: '耀州区' },
            { code: '610222', name: '宜君县' }
          ]
        },
        {
          code: '6103',
          name: '宝鸡市',
          children: [
            { code: '610302', name: '渭滨区' },
            { code: '610303', name: '金台区' },
            { code: '610304', name: '陈仓区' },
            { code: '610322', name: '凤翔县' },
            { code: '610323', name: '岐山县' },
            { code: '610324', name: '扶风县' },
            { code: '610326', name: '眉县' },
            { code: '610327', name: '陇县' },
            { code: '610328', name: '千阳县' },
            { code: '610329', name: '麟游县' },
            { code: '610330', name: '凤县' },
            { code: '610331', name: '太白县' }
          ]
        },
        {
          code: '6104',
          name: '咸阳市',
          children: [
            { code: '610402', name: '秦都区' },
            { code: '610403', name: '杨陵区' },
            { code: '610404', name: '渭城区' },
            { code: '610422', name: '三原县' },
            { code: '610423', name: '泾阳县' },
            { code: '610424', name: '乾县' },
            { code: '610425', name: '礼泉县' },
            { code: '610426', name: '永寿县' },
            { code: '610428', name: '长武县' },
            { code: '610429', name: '旬邑县' },
            { code: '610430', name: '淳化县' },
            { code: '610431', name: '武功县' },
            { code: '610481', name: '兴平市' },
            { code: '610482', name: '彬州市' }
          ]
        },
        {
          code: '6105',
          name: '渭南市',
          children: [
            { code: '610502', name: '临渭区' },
            { code: '610503', name: '华州区' },
            { code: '610522', name: '潼关县' },
            { code: '610523', name: '大荔县' },
            { code: '610524', name: '合阳县' },
            { code: '610525', name: '澄城县' },
            { code: '610526', name: '蒲城县' },
            { code: '610527', name: '白水县' },
            { code: '610528', name: '富平县' },
            { code: '610581', name: '韩城市' },
            { code: '610582', name: '华阴市' }
          ]
        },
        {
          code: '6106',
          name: '延安市',
          children: [
            { code: '610602', name: '宝塔区' },
            { code: '610603', name: '安塞区' },
            { code: '610621', name: '延长县' },
            { code: '610622', name: '延川县' },
            { code: '610623', name: '子长县' },
            { code: '610625', name: '志丹县' },
            { code: '610626', name: '吴起县' },
            { code: '610627', name: '甘泉县' },
            { code: '610628', name: '富县' },
            { code: '610629', name: '洛川县' },
            { code: '610630', name: '宜川县' },
            { code: '610631', name: '黄龙县' },
            { code: '610632', name: '黄陵县' }
          ]
        },
        {
          code: '6107',
          name: '汉中市',
          children: [
            { code: '610702', name: '汉台区' },
            { code: '610703', name: '南郑区' },
            { code: '610722', name: '城固县' },
            { code: '610723', name: '洋县' },
            { code: '610724', name: '西乡县' },
            { code: '610725', name: '勉县' },
            { code: '610726', name: '宁强县' },
            { code: '610727', name: '略阳县' },
            { code: '610728', name: '镇巴县' },
            { code: '610729', name: '留坝县' },
            { code: '610730', name: '佛坪县' }
          ]
        },
        {
          code: '6108',
          name: '榆林市',
          children: [
            { code: '610802', name: '榆阳区' },
            { code: '610803', name: '横山区' },
            { code: '610822', name: '府谷县' },
            { code: '610824', name: '靖边县' },
            { code: '610825', name: '定边县' },
            { code: '610826', name: '绥德县' },
            { code: '610827', name: '米脂县' },
            { code: '610828', name: '佳县' },
            { code: '610829', name: '吴堡县' },
            { code: '610830', name: '清涧县' },
            { code: '610831', name: '子洲县' },
            { code: '610881', name: '神木市' }
          ]
        },
        {
          code: '6109',
          name: '安康市',
          children: [
            { code: '610902', name: '汉滨区' },
            { code: '610921', name: '汉阴县' },
            { code: '610922', name: '石泉县' },
            { code: '610923', name: '宁陕县' },
            { code: '610924', name: '紫阳县' },
            { code: '610925', name: '岚皋县' },
            { code: '610926', name: '平利县' },
            { code: '610927', name: '镇坪县' },
            { code: '610928', name: '旬阳县' },
            { code: '610929', name: '白河县' }
          ]
        },
        {
          code: '6110',
          name: '商洛市',
          children: [
            { code: '611002', name: '商州区' },
            { code: '611021', name: '洛南县' },
            { code: '611022', name: '丹凤县' },
            { code: '611023', name: '商南县' },
            { code: '611024', name: '山阳县' },
            { code: '611025', name: '镇安县' },
            { code: '611026', name: '柞水县' }
          ]
        }
      ]
    },
    {
      code: '62',
      name: '甘肃省',
      children: [
        {
          code: '6201',
          name: '兰州市',
          children: [
            { code: '620102', name: '城关区' },
            { code: '620103', name: '七里河区' },
            { code: '620104', name: '西固区' },
            { code: '620105', name: '安宁区' },
            { code: '620111', name: '红古区' },
            { code: '620121', name: '永登县' },
            { code: '620122', name: '皋兰县' },
            { code: '620123', name: '榆中县' },
            { code: '620171', name: '兰州新区' }
          ]
        },
        {
          code: '6202',
          name: '嘉峪关市',
          children: [
            { code: '620201100', name: '新城镇' },
            { code: '620201101', name: '峪泉镇' },
            { code: '620201102', name: '文殊镇' },
            { code: '620201401', name: '雄关区' },
            { code: '620201402', name: '镜铁区' },
            { code: '620201403', name: '长城区' }
          ]
        },
        {
          code: '6203',
          name: '金昌市',
          children: [
            { code: '620302', name: '金川区' },
            { code: '620321', name: '永昌县' }
          ]
        },
        {
          code: '6204',
          name: '白银市',
          children: [
            { code: '620402', name: '白银区' },
            { code: '620403', name: '平川区' },
            { code: '620421', name: '靖远县' },
            { code: '620422', name: '会宁县' },
            { code: '620423', name: '景泰县' }
          ]
        },
        {
          code: '6205',
          name: '天水市',
          children: [
            { code: '620502', name: '秦州区' },
            { code: '620503', name: '麦积区' },
            { code: '620521', name: '清水县' },
            { code: '620522', name: '秦安县' },
            { code: '620523', name: '甘谷县' },
            { code: '620524', name: '武山县' },
            { code: '620525', name: '张家川回族自治县' }
          ]
        },
        {
          code: '6206',
          name: '武威市',
          children: [
            { code: '620602', name: '凉州区' },
            { code: '620621', name: '民勤县' },
            { code: '620622', name: '古浪县' },
            { code: '620623', name: '天祝藏族自治县' }
          ]
        },
        {
          code: '6207',
          name: '张掖市',
          children: [
            { code: '620702', name: '甘州区' },
            { code: '620721', name: '肃南裕固族自治县' },
            { code: '620722', name: '民乐县' },
            { code: '620723', name: '临泽县' },
            { code: '620724', name: '高台县' },
            { code: '620725', name: '山丹县' }
          ]
        },
        {
          code: '6208',
          name: '平凉市',
          children: [
            { code: '620802', name: '崆峒区' },
            { code: '620821', name: '泾川县' },
            { code: '620822', name: '灵台县' },
            { code: '620823', name: '崇信县' },
            { code: '620825', name: '庄浪县' },
            { code: '620826', name: '静宁县' },
            { code: '620881', name: '华亭市' }
          ]
        },
        {
          code: '6209',
          name: '酒泉市',
          children: [
            { code: '620902', name: '肃州区' },
            { code: '620921', name: '金塔县' },
            { code: '620922', name: '瓜州县' },
            { code: '620923', name: '肃北蒙古族自治县' },
            { code: '620924', name: '阿克塞哈萨克族自治县' },
            { code: '620981', name: '玉门市' },
            { code: '620982', name: '敦煌市' }
          ]
        },
        {
          code: '6210',
          name: '庆阳市',
          children: [
            { code: '621002', name: '西峰区' },
            { code: '621021', name: '庆城县' },
            { code: '621022', name: '环县' },
            { code: '621023', name: '华池县' },
            { code: '621024', name: '合水县' },
            { code: '621025', name: '正宁县' },
            { code: '621026', name: '宁县' },
            { code: '621027', name: '镇原县' }
          ]
        },
        {
          code: '6211',
          name: '定西市',
          children: [
            { code: '621102', name: '安定区' },
            { code: '621121', name: '通渭县' },
            { code: '621122', name: '陇西县' },
            { code: '621123', name: '渭源县' },
            { code: '621124', name: '临洮县' },
            { code: '621125', name: '漳县' },
            { code: '621126', name: '岷县' }
          ]
        },
        {
          code: '6212',
          name: '陇南市',
          children: [
            { code: '621202', name: '武都区' },
            { code: '621221', name: '成县' },
            { code: '621222', name: '文县' },
            { code: '621223', name: '宕昌县' },
            { code: '621224', name: '康县' },
            { code: '621225', name: '西和县' },
            { code: '621226', name: '礼县' },
            { code: '621227', name: '徽县' },
            { code: '621228', name: '两当县' }
          ]
        },
        {
          code: '6229',
          name: '临夏回族自治州',
          children: [
            { code: '622901', name: '临夏市' },
            { code: '622921', name: '临夏县' },
            { code: '622922', name: '康乐县' },
            { code: '622923', name: '永靖县' },
            { code: '622924', name: '广河县' },
            { code: '622925', name: '和政县' },
            { code: '622926', name: '东乡族自治县' },
            { code: '622927', name: '积石山保安族东乡族撒拉族自治县' }
          ]
        },
        {
          code: '6230',
          name: '甘南藏族自治州',
          children: [
            { code: '623001', name: '合作市' },
            { code: '623021', name: '临潭县' },
            { code: '623022', name: '卓尼县' },
            { code: '623023', name: '舟曲县' },
            { code: '623024', name: '迭部县' },
            { code: '623025', name: '玛曲县' },
            { code: '623026', name: '碌曲县' },
            { code: '623027', name: '夏河县' }
          ]
        }
      ]
    },
    {
      code: '63',
      name: '青海省',
      children: [
        {
          code: '6301',
          name: '西宁市',
          children: [
            { code: '630102', name: '城东区' },
            { code: '630103', name: '城中区' },
            { code: '630104', name: '城西区' },
            { code: '630105', name: '城北区' },
            { code: '630121', name: '大通回族土族自治县' },
            { code: '630122', name: '湟中县' },
            { code: '630123', name: '湟源县' }
          ]
        },
        {
          code: '6302',
          name: '海东市',
          children: [
            { code: '630202', name: '乐都区' },
            { code: '630203', name: '平安区' },
            { code: '630222', name: '民和回族土族自治县' },
            { code: '630223', name: '互助土族自治县' },
            { code: '630224', name: '化隆回族自治县' },
            { code: '630225', name: '循化撒拉族自治县' }
          ]
        },
        {
          code: '6322',
          name: '海北藏族自治州',
          children: [
            { code: '632221', name: '门源回族自治县' },
            { code: '632222', name: '祁连县' },
            { code: '632223', name: '海晏县' },
            { code: '632224', name: '刚察县' }
          ]
        },
        {
          code: '6323',
          name: '黄南藏族自治州',
          children: [
            { code: '632321', name: '同仁县' },
            { code: '632322', name: '尖扎县' },
            { code: '632323', name: '泽库县' },
            { code: '632324', name: '河南蒙古族自治县' }
          ]
        },
        {
          code: '6325',
          name: '海南藏族自治州',
          children: [
            { code: '632521', name: '共和县' },
            { code: '632522', name: '同德县' },
            { code: '632523', name: '贵德县' },
            { code: '632524', name: '兴海县' },
            { code: '632525', name: '贵南县' }
          ]
        },
        {
          code: '6326',
          name: '果洛藏族自治州',
          children: [
            { code: '632621', name: '玛沁县' },
            { code: '632622', name: '班玛县' },
            { code: '632623', name: '甘德县' },
            { code: '632624', name: '达日县' },
            { code: '632625', name: '久治县' },
            { code: '632626', name: '玛多县' }
          ]
        },
        {
          code: '6327',
          name: '玉树藏族自治州',
          children: [
            { code: '632701', name: '玉树市' },
            { code: '632722', name: '杂多县' },
            { code: '632723', name: '称多县' },
            { code: '632724', name: '治多县' },
            { code: '632725', name: '囊谦县' },
            { code: '632726', name: '曲麻莱县' }
          ]
        },
        {
          code: '6328',
          name: '海西蒙古族藏族自治州',
          children: [
            { code: '632801', name: '格尔木市' },
            { code: '632802', name: '德令哈市' },
            { code: '632803', name: '茫崖市' },
            { code: '632821', name: '乌兰县' },
            { code: '632822', name: '都兰县' },
            { code: '632823', name: '天峻县' },
            { code: '632857', name: '大柴旦行政委员会' }
          ]
        }
      ]
    },
    {
      code: '64',
      name: '宁夏回族自治区',
      children: [
        {
          code: '6401',
          name: '银川市',
          children: [
            { code: '640104', name: '兴庆区' },
            { code: '640105', name: '西夏区' },
            { code: '640106', name: '金凤区' },
            { code: '640121', name: '永宁县' },
            { code: '640122', name: '贺兰县' },
            { code: '640181', name: '灵武市' }
          ]
        },
        {
          code: '6402',
          name: '石嘴山市',
          children: [
            { code: '640202', name: '大武口区' },
            { code: '640205', name: '惠农区' },
            { code: '640221', name: '平罗县' }
          ]
        },
        {
          code: '6403',
          name: '吴忠市',
          children: [
            { code: '640302', name: '利通区' },
            { code: '640303', name: '红寺堡区' },
            { code: '640323', name: '盐池县' },
            { code: '640324', name: '同心县' },
            { code: '640381', name: '青铜峡市' }
          ]
        },
        {
          code: '6404',
          name: '固原市',
          children: [
            { code: '640402', name: '原州区' },
            { code: '640422', name: '西吉县' },
            { code: '640423', name: '隆德县' },
            { code: '640424', name: '泾源县' },
            { code: '640425', name: '彭阳县' }
          ]
        },
        {
          code: '6405',
          name: '中卫市',
          children: [
            { code: '640502', name: '沙坡头区' },
            { code: '640521', name: '中宁县' },
            { code: '640522', name: '海原县' }
          ]
        }
      ]
    },
    {
      code: '65',
      name: '新疆维吾尔自治区',
      children: [
        {
          code: '6501',
          name: '乌鲁木齐市',
          children: [
            { code: '650102', name: '天山区' },
            { code: '650103', name: '沙依巴克区' },
            { code: '650104', name: '新市区' },
            { code: '650105', name: '水磨沟区' },
            { code: '650106', name: '头屯河区' },
            { code: '650107', name: '达坂城区' },
            { code: '650109', name: '米东区' },
            { code: '650121', name: '乌鲁木齐县' },
            { code: '650171', name: '乌鲁木齐经济技术开发区' },
            { code: '650172', name: '乌鲁木齐高新技术产业开发区' }
          ]
        },
        {
          code: '6502',
          name: '克拉玛依市',
          children: [
            { code: '650202', name: '独山子区' },
            { code: '650203', name: '克拉玛依区' },
            { code: '650204', name: '白碱滩区' },
            { code: '650205', name: '乌尔禾区' }
          ]
        },
        {
          code: '6504',
          name: '吐鲁番市',
          children: [
            { code: '650402', name: '高昌区' },
            { code: '650421', name: '鄯善县' },
            { code: '650422', name: '托克逊县' }
          ]
        },
        {
          code: '6505',
          name: '哈密市',
          children: [
            { code: '650502', name: '伊州区' },
            { code: '650521', name: '巴里坤哈萨克自治县' },
            { code: '650522', name: '伊吾县' }
          ]
        },
        {
          code: '6523',
          name: '昌吉回族自治州',
          children: [
            { code: '652301', name: '昌吉市' },
            { code: '652302', name: '阜康市' },
            { code: '652323', name: '呼图壁县' },
            { code: '652324', name: '玛纳斯县' },
            { code: '652325', name: '奇台县' },
            { code: '652327', name: '吉木萨尔县' },
            { code: '652328', name: '木垒哈萨克自治县' }
          ]
        },
        {
          code: '6527',
          name: '博尔塔拉蒙古自治州',
          children: [
            { code: '652701', name: '博乐市' },
            { code: '652702', name: '阿拉山口市' },
            { code: '652722', name: '精河县' },
            { code: '652723', name: '温泉县' }
          ]
        },
        {
          code: '6528',
          name: '巴音郭楞蒙古自治州',
          children: [
            { code: '652801', name: '库尔勒市' },
            { code: '652822', name: '轮台县' },
            { code: '652823', name: '尉犁县' },
            { code: '652824', name: '若羌县' },
            { code: '652825', name: '且末县' },
            { code: '652826', name: '焉耆回族自治县' },
            { code: '652827', name: '和静县' },
            { code: '652828', name: '和硕县' },
            { code: '652829', name: '博湖县' },
            { code: '652871', name: '库尔勒经济技术开发区' }
          ]
        },
        {
          code: '6529',
          name: '阿克苏地区',
          children: [
            { code: '652901', name: '阿克苏市' },
            { code: '652922', name: '温宿县' },
            { code: '652923', name: '库车县' },
            { code: '652924', name: '沙雅县' },
            { code: '652925', name: '新和县' },
            { code: '652926', name: '拜城县' },
            { code: '652927', name: '乌什县' },
            { code: '652928', name: '阿瓦提县' },
            { code: '652929', name: '柯坪县' }
          ]
        },
        {
          code: '6530',
          name: '克孜勒苏柯尔克孜自治州',
          children: [
            { code: '653001', name: '阿图什市' },
            { code: '653022', name: '阿克陶县' },
            { code: '653023', name: '阿合奇县' },
            { code: '653024', name: '乌恰县' }
          ]
        },
        {
          code: '6531',
          name: '喀什地区',
          children: [
            { code: '653101', name: '喀什市' },
            { code: '653121', name: '疏附县' },
            { code: '653122', name: '疏勒县' },
            { code: '653123', name: '英吉沙县' },
            { code: '653124', name: '泽普县' },
            { code: '653125', name: '莎车县' },
            { code: '653126', name: '叶城县' },
            { code: '653127', name: '麦盖提县' },
            { code: '653128', name: '岳普湖县' },
            { code: '653129', name: '伽师县' },
            { code: '653130', name: '巴楚县' },
            { code: '653131', name: '塔什库尔干塔吉克自治县' }
          ]
        },
        {
          code: '6532',
          name: '和田地区',
          children: [
            { code: '653201', name: '和田市' },
            { code: '653221', name: '和田县' },
            { code: '653222', name: '墨玉县' },
            { code: '653223', name: '皮山县' },
            { code: '653224', name: '洛浦县' },
            { code: '653225', name: '策勒县' },
            { code: '653226', name: '于田县' },
            { code: '653227', name: '民丰县' }
          ]
        },
        {
          code: '6540',
          name: '伊犁哈萨克自治州',
          children: [
            { code: '654002', name: '伊宁市' },
            { code: '654003', name: '奎屯市' },
            { code: '654004', name: '霍尔果斯市' },
            { code: '654021', name: '伊宁县' },
            { code: '654022', name: '察布查尔锡伯自治县' },
            { code: '654023', name: '霍城县' },
            { code: '654024', name: '巩留县' },
            { code: '654025', name: '新源县' },
            { code: '654026', name: '昭苏县' },
            { code: '654027', name: '特克斯县' },
            { code: '654028', name: '尼勒克县' }
          ]
        },
        {
          code: '6542',
          name: '塔城地区',
          children: [
            { code: '654201', name: '塔城市' },
            { code: '654202', name: '乌苏市' },
            { code: '654221', name: '额敏县' },
            { code: '654223', name: '沙湾县' },
            { code: '654224', name: '托里县' },
            { code: '654225', name: '裕民县' },
            { code: '654226', name: '和布克赛尔蒙古自治县' }
          ]
        },
        {
          code: '6543',
          name: '阿勒泰地区',
          children: [
            { code: '654301', name: '阿勒泰市' },
            { code: '654321', name: '布尔津县' },
            { code: '654322', name: '富蕴县' },
            { code: '654323', name: '福海县' },
            { code: '654324', name: '哈巴河县' },
            { code: '654325', name: '青河县' },
            { code: '654326', name: '吉木乃县' }
          ]
        },
        {
          code: '6590',
          name: '自治区直辖县级行政区划',
          children: [
            { code: '659001', name: '石河子市' },
            { code: '659002', name: '阿拉尔市' },
            { code: '659003', name: '图木舒克市' },
            { code: '659004', name: '五家渠市' },
            { code: '659006', name: '铁门关市' }
          ]
        }
      ]
    }
  ];

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var axios = createCommonjsModule(function (module, exports) {
  /* axios v0.19.0 | (c) 2019 by Matt Zabriskie */
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(commonjsGlobal, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId])
  /******/ 			return installedModules[moduleId].exports;
  /******/
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			exports: {},
  /******/ 			id: moduleId,
  /******/ 			loaded: false
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.loaded = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(0);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, exports, __webpack_require__) {

  	module.exports = __webpack_require__(1);

  /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var bind = __webpack_require__(3);
  	var Axios = __webpack_require__(5);
  	var mergeConfig = __webpack_require__(22);
  	var defaults = __webpack_require__(11);
  	
  	/**
  	 * Create an instance of Axios
  	 *
  	 * @param {Object} defaultConfig The default config for the instance
  	 * @return {Axios} A new instance of Axios
  	 */
  	function createInstance(defaultConfig) {
  	  var context = new Axios(defaultConfig);
  	  var instance = bind(Axios.prototype.request, context);
  	
  	  // Copy axios.prototype to instance
  	  utils.extend(instance, Axios.prototype, context);
  	
  	  // Copy context to instance
  	  utils.extend(instance, context);
  	
  	  return instance;
  	}
  	
  	// Create the default instance to be exported
  	var axios = createInstance(defaults);
  	
  	// Expose Axios class to allow class inheritance
  	axios.Axios = Axios;
  	
  	// Factory for creating new instances
  	axios.create = function create(instanceConfig) {
  	  return createInstance(mergeConfig(axios.defaults, instanceConfig));
  	};
  	
  	// Expose Cancel & CancelToken
  	axios.Cancel = __webpack_require__(23);
  	axios.CancelToken = __webpack_require__(24);
  	axios.isCancel = __webpack_require__(10);
  	
  	// Expose all/spread
  	axios.all = function all(promises) {
  	  return Promise.all(promises);
  	};
  	axios.spread = __webpack_require__(25);
  	
  	module.exports = axios;
  	
  	// Allow use of default import syntax in TypeScript
  	module.exports.default = axios;


  /***/ }),
  /* 2 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var bind = __webpack_require__(3);
  	var isBuffer = __webpack_require__(4);
  	
  	/*global toString:true*/
  	
  	// utils is a library of generic helper functions non-specific to axios
  	
  	var toString = Object.prototype.toString;
  	
  	/**
  	 * Determine if a value is an Array
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an Array, otherwise false
  	 */
  	function isArray(val) {
  	  return toString.call(val) === '[object Array]';
  	}
  	
  	/**
  	 * Determine if a value is an ArrayBuffer
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
  	 */
  	function isArrayBuffer(val) {
  	  return toString.call(val) === '[object ArrayBuffer]';
  	}
  	
  	/**
  	 * Determine if a value is a FormData
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an FormData, otherwise false
  	 */
  	function isFormData(val) {
  	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
  	}
  	
  	/**
  	 * Determine if a value is a view on an ArrayBuffer
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
  	 */
  	function isArrayBufferView(val) {
  	  var result;
  	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
  	    result = ArrayBuffer.isView(val);
  	  } else {
  	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  	  }
  	  return result;
  	}
  	
  	/**
  	 * Determine if a value is a String
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a String, otherwise false
  	 */
  	function isString(val) {
  	  return typeof val === 'string';
  	}
  	
  	/**
  	 * Determine if a value is a Number
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Number, otherwise false
  	 */
  	function isNumber(val) {
  	  return typeof val === 'number';
  	}
  	
  	/**
  	 * Determine if a value is undefined
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if the value is undefined, otherwise false
  	 */
  	function isUndefined(val) {
  	  return typeof val === 'undefined';
  	}
  	
  	/**
  	 * Determine if a value is an Object
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an Object, otherwise false
  	 */
  	function isObject(val) {
  	  return val !== null && typeof val === 'object';
  	}
  	
  	/**
  	 * Determine if a value is a Date
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Date, otherwise false
  	 */
  	function isDate(val) {
  	  return toString.call(val) === '[object Date]';
  	}
  	
  	/**
  	 * Determine if a value is a File
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a File, otherwise false
  	 */
  	function isFile(val) {
  	  return toString.call(val) === '[object File]';
  	}
  	
  	/**
  	 * Determine if a value is a Blob
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Blob, otherwise false
  	 */
  	function isBlob(val) {
  	  return toString.call(val) === '[object Blob]';
  	}
  	
  	/**
  	 * Determine if a value is a Function
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Function, otherwise false
  	 */
  	function isFunction(val) {
  	  return toString.call(val) === '[object Function]';
  	}
  	
  	/**
  	 * Determine if a value is a Stream
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Stream, otherwise false
  	 */
  	function isStream(val) {
  	  return isObject(val) && isFunction(val.pipe);
  	}
  	
  	/**
  	 * Determine if a value is a URLSearchParams object
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
  	 */
  	function isURLSearchParams(val) {
  	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  	}
  	
  	/**
  	 * Trim excess whitespace off the beginning and end of a string
  	 *
  	 * @param {String} str The String to trim
  	 * @returns {String} The String freed of excess whitespace
  	 */
  	function trim(str) {
  	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
  	}
  	
  	/**
  	 * Determine if we're running in a standard browser environment
  	 *
  	 * This allows axios to run in a web worker, and react-native.
  	 * Both environments support XMLHttpRequest, but not fully standard globals.
  	 *
  	 * web workers:
  	 *  typeof window -> undefined
  	 *  typeof document -> undefined
  	 *
  	 * react-native:
  	 *  navigator.product -> 'ReactNative'
  	 * nativescript
  	 *  navigator.product -> 'NativeScript' or 'NS'
  	 */
  	function isStandardBrowserEnv() {
  	  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
  	                                           navigator.product === 'NativeScript' ||
  	                                           navigator.product === 'NS')) {
  	    return false;
  	  }
  	  return (
  	    typeof window !== 'undefined' &&
  	    typeof document !== 'undefined'
  	  );
  	}
  	
  	/**
  	 * Iterate over an Array or an Object invoking a function for each item.
  	 *
  	 * If `obj` is an Array callback will be called passing
  	 * the value, index, and complete array for each item.
  	 *
  	 * If 'obj' is an Object callback will be called passing
  	 * the value, key, and complete object for each property.
  	 *
  	 * @param {Object|Array} obj The object to iterate
  	 * @param {Function} fn The callback to invoke for each item
  	 */
  	function forEach(obj, fn) {
  	  // Don't bother if no value provided
  	  if (obj === null || typeof obj === 'undefined') {
  	    return;
  	  }
  	
  	  // Force an array if not already something iterable
  	  if (typeof obj !== 'object') {
  	    /*eslint no-param-reassign:0*/
  	    obj = [obj];
  	  }
  	
  	  if (isArray(obj)) {
  	    // Iterate over array values
  	    for (var i = 0, l = obj.length; i < l; i++) {
  	      fn.call(null, obj[i], i, obj);
  	    }
  	  } else {
  	    // Iterate over object keys
  	    for (var key in obj) {
  	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
  	        fn.call(null, obj[key], key, obj);
  	      }
  	    }
  	  }
  	}
  	
  	/**
  	 * Accepts varargs expecting each argument to be an object, then
  	 * immutably merges the properties of each object and returns result.
  	 *
  	 * When multiple objects contain the same key the later object in
  	 * the arguments list will take precedence.
  	 *
  	 * Example:
  	 *
  	 * ```js
  	 * var result = merge({foo: 123}, {foo: 456});
  	 * console.log(result.foo); // outputs 456
  	 * ```
  	 *
  	 * @param {Object} obj1 Object to merge
  	 * @returns {Object} Result of all merge properties
  	 */
  	function merge(/* obj1, obj2, obj3, ... */) {
  	  var result = {};
  	  function assignValue(val, key) {
  	    if (typeof result[key] === 'object' && typeof val === 'object') {
  	      result[key] = merge(result[key], val);
  	    } else {
  	      result[key] = val;
  	    }
  	  }
  	
  	  for (var i = 0, l = arguments.length; i < l; i++) {
  	    forEach(arguments[i], assignValue);
  	  }
  	  return result;
  	}
  	
  	/**
  	 * Function equal to merge with the difference being that no reference
  	 * to original objects is kept.
  	 *
  	 * @see merge
  	 * @param {Object} obj1 Object to merge
  	 * @returns {Object} Result of all merge properties
  	 */
  	function deepMerge(/* obj1, obj2, obj3, ... */) {
  	  var result = {};
  	  function assignValue(val, key) {
  	    if (typeof result[key] === 'object' && typeof val === 'object') {
  	      result[key] = deepMerge(result[key], val);
  	    } else if (typeof val === 'object') {
  	      result[key] = deepMerge({}, val);
  	    } else {
  	      result[key] = val;
  	    }
  	  }
  	
  	  for (var i = 0, l = arguments.length; i < l; i++) {
  	    forEach(arguments[i], assignValue);
  	  }
  	  return result;
  	}
  	
  	/**
  	 * Extends object a by mutably adding to it the properties of object b.
  	 *
  	 * @param {Object} a The object to be extended
  	 * @param {Object} b The object to copy properties from
  	 * @param {Object} thisArg The object to bind function to
  	 * @return {Object} The resulting value of object a
  	 */
  	function extend(a, b, thisArg) {
  	  forEach(b, function assignValue(val, key) {
  	    if (thisArg && typeof val === 'function') {
  	      a[key] = bind(val, thisArg);
  	    } else {
  	      a[key] = val;
  	    }
  	  });
  	  return a;
  	}
  	
  	module.exports = {
  	  isArray: isArray,
  	  isArrayBuffer: isArrayBuffer,
  	  isBuffer: isBuffer,
  	  isFormData: isFormData,
  	  isArrayBufferView: isArrayBufferView,
  	  isString: isString,
  	  isNumber: isNumber,
  	  isObject: isObject,
  	  isUndefined: isUndefined,
  	  isDate: isDate,
  	  isFile: isFile,
  	  isBlob: isBlob,
  	  isFunction: isFunction,
  	  isStream: isStream,
  	  isURLSearchParams: isURLSearchParams,
  	  isStandardBrowserEnv: isStandardBrowserEnv,
  	  forEach: forEach,
  	  merge: merge,
  	  deepMerge: deepMerge,
  	  extend: extend,
  	  trim: trim
  	};


  /***/ }),
  /* 3 */
  /***/ (function(module, exports) {
  	
  	module.exports = function bind(fn, thisArg) {
  	  return function wrap() {
  	    var args = new Array(arguments.length);
  	    for (var i = 0; i < args.length; i++) {
  	      args[i] = arguments[i];
  	    }
  	    return fn.apply(thisArg, args);
  	  };
  	};


  /***/ }),
  /* 4 */
  /***/ (function(module, exports) {

  	/*!
  	 * Determine if an object is a Buffer
  	 *
  	 * @author   Feross Aboukhadijeh <https://feross.org>
  	 * @license  MIT
  	 */
  	
  	module.exports = function isBuffer (obj) {
  	  return obj != null && obj.constructor != null &&
  	    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  	};


  /***/ }),
  /* 5 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var buildURL = __webpack_require__(6);
  	var InterceptorManager = __webpack_require__(7);
  	var dispatchRequest = __webpack_require__(8);
  	var mergeConfig = __webpack_require__(22);
  	
  	/**
  	 * Create a new instance of Axios
  	 *
  	 * @param {Object} instanceConfig The default config for the instance
  	 */
  	function Axios(instanceConfig) {
  	  this.defaults = instanceConfig;
  	  this.interceptors = {
  	    request: new InterceptorManager(),
  	    response: new InterceptorManager()
  	  };
  	}
  	
  	/**
  	 * Dispatch a request
  	 *
  	 * @param {Object} config The config specific for this request (merged with this.defaults)
  	 */
  	Axios.prototype.request = function request(config) {
  	  /*eslint no-param-reassign:0*/
  	  // Allow for axios('example/url'[, config]) a la fetch API
  	  if (typeof config === 'string') {
  	    config = arguments[1] || {};
  	    config.url = arguments[0];
  	  } else {
  	    config = config || {};
  	  }
  	
  	  config = mergeConfig(this.defaults, config);
  	  config.method = config.method ? config.method.toLowerCase() : 'get';
  	
  	  // Hook up interceptors middleware
  	  var chain = [dispatchRequest, undefined];
  	  var promise = Promise.resolve(config);
  	
  	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
  	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  	  });
  	
  	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
  	    chain.push(interceptor.fulfilled, interceptor.rejected);
  	  });
  	
  	  while (chain.length) {
  	    promise = promise.then(chain.shift(), chain.shift());
  	  }
  	
  	  return promise;
  	};
  	
  	Axios.prototype.getUri = function getUri(config) {
  	  config = mergeConfig(this.defaults, config);
  	  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  	};
  	
  	// Provide aliases for supported request methods
  	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  	  /*eslint func-names:0*/
  	  Axios.prototype[method] = function(url, config) {
  	    return this.request(utils.merge(config || {}, {
  	      method: method,
  	      url: url
  	    }));
  	  };
  	});
  	
  	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  	  /*eslint func-names:0*/
  	  Axios.prototype[method] = function(url, data, config) {
  	    return this.request(utils.merge(config || {}, {
  	      method: method,
  	      url: url,
  	      data: data
  	    }));
  	  };
  	});
  	
  	module.exports = Axios;


  /***/ }),
  /* 6 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	function encode(val) {
  	  return encodeURIComponent(val).
  	    replace(/%40/gi, '@').
  	    replace(/%3A/gi, ':').
  	    replace(/%24/g, '$').
  	    replace(/%2C/gi, ',').
  	    replace(/%20/g, '+').
  	    replace(/%5B/gi, '[').
  	    replace(/%5D/gi, ']');
  	}
  	
  	/**
  	 * Build a URL by appending params to the end
  	 *
  	 * @param {string} url The base of the url (e.g., http://www.google.com)
  	 * @param {object} [params] The params to be appended
  	 * @returns {string} The formatted url
  	 */
  	module.exports = function buildURL(url, params, paramsSerializer) {
  	  /*eslint no-param-reassign:0*/
  	  if (!params) {
  	    return url;
  	  }
  	
  	  var serializedParams;
  	  if (paramsSerializer) {
  	    serializedParams = paramsSerializer(params);
  	  } else if (utils.isURLSearchParams(params)) {
  	    serializedParams = params.toString();
  	  } else {
  	    var parts = [];
  	
  	    utils.forEach(params, function serialize(val, key) {
  	      if (val === null || typeof val === 'undefined') {
  	        return;
  	      }
  	
  	      if (utils.isArray(val)) {
  	        key = key + '[]';
  	      } else {
  	        val = [val];
  	      }
  	
  	      utils.forEach(val, function parseValue(v) {
  	        if (utils.isDate(v)) {
  	          v = v.toISOString();
  	        } else if (utils.isObject(v)) {
  	          v = JSON.stringify(v);
  	        }
  	        parts.push(encode(key) + '=' + encode(v));
  	      });
  	    });
  	
  	    serializedParams = parts.join('&');
  	  }
  	
  	  if (serializedParams) {
  	    var hashmarkIndex = url.indexOf('#');
  	    if (hashmarkIndex !== -1) {
  	      url = url.slice(0, hashmarkIndex);
  	    }
  	
  	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  	  }
  	
  	  return url;
  	};


  /***/ }),
  /* 7 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	function InterceptorManager() {
  	  this.handlers = [];
  	}
  	
  	/**
  	 * Add a new interceptor to the stack
  	 *
  	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
  	 * @param {Function} rejected The function to handle `reject` for a `Promise`
  	 *
  	 * @return {Number} An ID used to remove interceptor later
  	 */
  	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  	  this.handlers.push({
  	    fulfilled: fulfilled,
  	    rejected: rejected
  	  });
  	  return this.handlers.length - 1;
  	};
  	
  	/**
  	 * Remove an interceptor from the stack
  	 *
  	 * @param {Number} id The ID that was returned by `use`
  	 */
  	InterceptorManager.prototype.eject = function eject(id) {
  	  if (this.handlers[id]) {
  	    this.handlers[id] = null;
  	  }
  	};
  	
  	/**
  	 * Iterate over all the registered interceptors
  	 *
  	 * This method is particularly useful for skipping over any
  	 * interceptors that may have become `null` calling `eject`.
  	 *
  	 * @param {Function} fn The function to call for each interceptor
  	 */
  	InterceptorManager.prototype.forEach = function forEach(fn) {
  	  utils.forEach(this.handlers, function forEachHandler(h) {
  	    if (h !== null) {
  	      fn(h);
  	    }
  	  });
  	};
  	
  	module.exports = InterceptorManager;


  /***/ }),
  /* 8 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var transformData = __webpack_require__(9);
  	var isCancel = __webpack_require__(10);
  	var defaults = __webpack_require__(11);
  	var isAbsoluteURL = __webpack_require__(20);
  	var combineURLs = __webpack_require__(21);
  	
  	/**
  	 * Throws a `Cancel` if cancellation has been requested.
  	 */
  	function throwIfCancellationRequested(config) {
  	  if (config.cancelToken) {
  	    config.cancelToken.throwIfRequested();
  	  }
  	}
  	
  	/**
  	 * Dispatch a request to the server using the configured adapter.
  	 *
  	 * @param {object} config The config that is to be used for the request
  	 * @returns {Promise} The Promise to be fulfilled
  	 */
  	module.exports = function dispatchRequest(config) {
  	  throwIfCancellationRequested(config);
  	
  	  // Support baseURL config
  	  if (config.baseURL && !isAbsoluteURL(config.url)) {
  	    config.url = combineURLs(config.baseURL, config.url);
  	  }
  	
  	  // Ensure headers exist
  	  config.headers = config.headers || {};
  	
  	  // Transform request data
  	  config.data = transformData(
  	    config.data,
  	    config.headers,
  	    config.transformRequest
  	  );
  	
  	  // Flatten headers
  	  config.headers = utils.merge(
  	    config.headers.common || {},
  	    config.headers[config.method] || {},
  	    config.headers || {}
  	  );
  	
  	  utils.forEach(
  	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
  	    function cleanHeaderConfig(method) {
  	      delete config.headers[method];
  	    }
  	  );
  	
  	  var adapter = config.adapter || defaults.adapter;
  	
  	  return adapter(config).then(function onAdapterResolution(response) {
  	    throwIfCancellationRequested(config);
  	
  	    // Transform response data
  	    response.data = transformData(
  	      response.data,
  	      response.headers,
  	      config.transformResponse
  	    );
  	
  	    return response;
  	  }, function onAdapterRejection(reason) {
  	    if (!isCancel(reason)) {
  	      throwIfCancellationRequested(config);
  	
  	      // Transform response data
  	      if (reason && reason.response) {
  	        reason.response.data = transformData(
  	          reason.response.data,
  	          reason.response.headers,
  	          config.transformResponse
  	        );
  	      }
  	    }
  	
  	    return Promise.reject(reason);
  	  });
  	};


  /***/ }),
  /* 9 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	/**
  	 * Transform the data for a request or a response
  	 *
  	 * @param {Object|String} data The data to be transformed
  	 * @param {Array} headers The headers for the request or response
  	 * @param {Array|Function} fns A single function or Array of functions
  	 * @returns {*} The resulting transformed data
  	 */
  	module.exports = function transformData(data, headers, fns) {
  	  /*eslint no-param-reassign:0*/
  	  utils.forEach(fns, function transform(fn) {
  	    data = fn(data, headers);
  	  });
  	
  	  return data;
  	};


  /***/ }),
  /* 10 */
  /***/ (function(module, exports) {
  	
  	module.exports = function isCancel(value) {
  	  return !!(value && value.__CANCEL__);
  	};


  /***/ }),
  /* 11 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var normalizeHeaderName = __webpack_require__(12);
  	
  	var DEFAULT_CONTENT_TYPE = {
  	  'Content-Type': 'application/x-www-form-urlencoded'
  	};
  	
  	function setContentTypeIfUnset(headers, value) {
  	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
  	    headers['Content-Type'] = value;
  	  }
  	}
  	
  	function getDefaultAdapter() {
  	  var adapter;
  	  // Only Node.JS has a process variable that is of [[Class]] process
  	  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
  	    // For node use HTTP adapter
  	    adapter = __webpack_require__(13);
  	  } else if (typeof XMLHttpRequest !== 'undefined') {
  	    // For browsers use XHR adapter
  	    adapter = __webpack_require__(13);
  	  }
  	  return adapter;
  	}
  	
  	var defaults = {
  	  adapter: getDefaultAdapter(),
  	
  	  transformRequest: [function transformRequest(data, headers) {
  	    normalizeHeaderName(headers, 'Accept');
  	    normalizeHeaderName(headers, 'Content-Type');
  	    if (utils.isFormData(data) ||
  	      utils.isArrayBuffer(data) ||
  	      utils.isBuffer(data) ||
  	      utils.isStream(data) ||
  	      utils.isFile(data) ||
  	      utils.isBlob(data)
  	    ) {
  	      return data;
  	    }
  	    if (utils.isArrayBufferView(data)) {
  	      return data.buffer;
  	    }
  	    if (utils.isURLSearchParams(data)) {
  	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
  	      return data.toString();
  	    }
  	    if (utils.isObject(data)) {
  	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
  	      return JSON.stringify(data);
  	    }
  	    return data;
  	  }],
  	
  	  transformResponse: [function transformResponse(data) {
  	    /*eslint no-param-reassign:0*/
  	    if (typeof data === 'string') {
  	      try {
  	        data = JSON.parse(data);
  	      } catch (e) { /* Ignore */ }
  	    }
  	    return data;
  	  }],
  	
  	  /**
  	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
  	   * timeout is not created.
  	   */
  	  timeout: 0,
  	
  	  xsrfCookieName: 'XSRF-TOKEN',
  	  xsrfHeaderName: 'X-XSRF-TOKEN',
  	
  	  maxContentLength: -1,
  	
  	  validateStatus: function validateStatus(status) {
  	    return status >= 200 && status < 300;
  	  }
  	};
  	
  	defaults.headers = {
  	  common: {
  	    'Accept': 'application/json, text/plain, */*'
  	  }
  	};
  	
  	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  	  defaults.headers[method] = {};
  	});
  	
  	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  	});
  	
  	module.exports = defaults;


  /***/ }),
  /* 12 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	module.exports = function normalizeHeaderName(headers, normalizedName) {
  	  utils.forEach(headers, function processHeader(value, name) {
  	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
  	      headers[normalizedName] = value;
  	      delete headers[name];
  	    }
  	  });
  	};


  /***/ }),
  /* 13 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var settle = __webpack_require__(14);
  	var buildURL = __webpack_require__(6);
  	var parseHeaders = __webpack_require__(17);
  	var isURLSameOrigin = __webpack_require__(18);
  	var createError = __webpack_require__(15);
  	
  	module.exports = function xhrAdapter(config) {
  	  return new Promise(function dispatchXhrRequest(resolve, reject) {
  	    var requestData = config.data;
  	    var requestHeaders = config.headers;
  	
  	    if (utils.isFormData(requestData)) {
  	      delete requestHeaders['Content-Type']; // Let the browser set it
  	    }
  	
  	    var request = new XMLHttpRequest();
  	
  	    // HTTP basic authentication
  	    if (config.auth) {
  	      var username = config.auth.username || '';
  	      var password = config.auth.password || '';
  	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
  	    }
  	
  	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
  	
  	    // Set the request timeout in MS
  	    request.timeout = config.timeout;
  	
  	    // Listen for ready state
  	    request.onreadystatechange = function handleLoad() {
  	      if (!request || request.readyState !== 4) {
  	        return;
  	      }
  	
  	      // The request errored out and we didn't get a response, this will be
  	      // handled by onerror instead
  	      // With one exception: request that using file: protocol, most browsers
  	      // will return status as 0 even though it's a successful request
  	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
  	        return;
  	      }
  	
  	      // Prepare the response
  	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
  	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
  	      var response = {
  	        data: responseData,
  	        status: request.status,
  	        statusText: request.statusText,
  	        headers: responseHeaders,
  	        config: config,
  	        request: request
  	      };
  	
  	      settle(resolve, reject, response);
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Handle browser request cancellation (as opposed to a manual cancellation)
  	    request.onabort = function handleAbort() {
  	      if (!request) {
  	        return;
  	      }
  	
  	      reject(createError('Request aborted', config, 'ECONNABORTED', request));
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Handle low level network errors
  	    request.onerror = function handleError() {
  	      // Real errors are hidden from us by the browser
  	      // onerror should only fire if it's a network error
  	      reject(createError('Network Error', config, null, request));
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Handle timeout
  	    request.ontimeout = function handleTimeout() {
  	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
  	        request));
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Add xsrf header
  	    // This is only done if running in a standard browser environment.
  	    // Specifically not if we're in a web worker, or react-native.
  	    if (utils.isStandardBrowserEnv()) {
  	      var cookies = __webpack_require__(19);
  	
  	      // Add xsrf header
  	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
  	        cookies.read(config.xsrfCookieName) :
  	        undefined;
  	
  	      if (xsrfValue) {
  	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
  	      }
  	    }
  	
  	    // Add headers to the request
  	    if ('setRequestHeader' in request) {
  	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
  	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
  	          // Remove Content-Type if data is undefined
  	          delete requestHeaders[key];
  	        } else {
  	          // Otherwise add header to the request
  	          request.setRequestHeader(key, val);
  	        }
  	      });
  	    }
  	
  	    // Add withCredentials to request if needed
  	    if (config.withCredentials) {
  	      request.withCredentials = true;
  	    }
  	
  	    // Add responseType to request if needed
  	    if (config.responseType) {
  	      try {
  	        request.responseType = config.responseType;
  	      } catch (e) {
  	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
  	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
  	        if (config.responseType !== 'json') {
  	          throw e;
  	        }
  	      }
  	    }
  	
  	    // Handle progress if needed
  	    if (typeof config.onDownloadProgress === 'function') {
  	      request.addEventListener('progress', config.onDownloadProgress);
  	    }
  	
  	    // Not all browsers support upload events
  	    if (typeof config.onUploadProgress === 'function' && request.upload) {
  	      request.upload.addEventListener('progress', config.onUploadProgress);
  	    }
  	
  	    if (config.cancelToken) {
  	      // Handle cancellation
  	      config.cancelToken.promise.then(function onCanceled(cancel) {
  	        if (!request) {
  	          return;
  	        }
  	
  	        request.abort();
  	        reject(cancel);
  	        // Clean up request
  	        request = null;
  	      });
  	    }
  	
  	    if (requestData === undefined) {
  	      requestData = null;
  	    }
  	
  	    // Send the request
  	    request.send(requestData);
  	  });
  	};


  /***/ }),
  /* 14 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var createError = __webpack_require__(15);
  	
  	/**
  	 * Resolve or reject a Promise based on response status.
  	 *
  	 * @param {Function} resolve A function that resolves the promise.
  	 * @param {Function} reject A function that rejects the promise.
  	 * @param {object} response The response.
  	 */
  	module.exports = function settle(resolve, reject, response) {
  	  var validateStatus = response.config.validateStatus;
  	  if (!validateStatus || validateStatus(response.status)) {
  	    resolve(response);
  	  } else {
  	    reject(createError(
  	      'Request failed with status code ' + response.status,
  	      response.config,
  	      null,
  	      response.request,
  	      response
  	    ));
  	  }
  	};


  /***/ }),
  /* 15 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var enhanceError = __webpack_require__(16);
  	
  	/**
  	 * Create an Error with the specified message, config, error code, request and response.
  	 *
  	 * @param {string} message The error message.
  	 * @param {Object} config The config.
  	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
  	 * @param {Object} [request] The request.
  	 * @param {Object} [response] The response.
  	 * @returns {Error} The created error.
  	 */
  	module.exports = function createError(message, config, code, request, response) {
  	  var error = new Error(message);
  	  return enhanceError(error, config, code, request, response);
  	};


  /***/ }),
  /* 16 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Update an Error with the specified config, error code, and response.
  	 *
  	 * @param {Error} error The error to update.
  	 * @param {Object} config The config.
  	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
  	 * @param {Object} [request] The request.
  	 * @param {Object} [response] The response.
  	 * @returns {Error} The error.
  	 */
  	module.exports = function enhanceError(error, config, code, request, response) {
  	  error.config = config;
  	  if (code) {
  	    error.code = code;
  	  }
  	
  	  error.request = request;
  	  error.response = response;
  	  error.isAxiosError = true;
  	
  	  error.toJSON = function() {
  	    return {
  	      // Standard
  	      message: this.message,
  	      name: this.name,
  	      // Microsoft
  	      description: this.description,
  	      number: this.number,
  	      // Mozilla
  	      fileName: this.fileName,
  	      lineNumber: this.lineNumber,
  	      columnNumber: this.columnNumber,
  	      stack: this.stack,
  	      // Axios
  	      config: this.config,
  	      code: this.code
  	    };
  	  };
  	  return error;
  	};


  /***/ }),
  /* 17 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	// Headers whose duplicates are ignored by node
  	// c.f. https://nodejs.org/api/http.html#http_message_headers
  	var ignoreDuplicateOf = [
  	  'age', 'authorization', 'content-length', 'content-type', 'etag',
  	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  	  'referer', 'retry-after', 'user-agent'
  	];
  	
  	/**
  	 * Parse headers into an object
  	 *
  	 * ```
  	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
  	 * Content-Type: application/json
  	 * Connection: keep-alive
  	 * Transfer-Encoding: chunked
  	 * ```
  	 *
  	 * @param {String} headers Headers needing to be parsed
  	 * @returns {Object} Headers parsed into an object
  	 */
  	module.exports = function parseHeaders(headers) {
  	  var parsed = {};
  	  var key;
  	  var val;
  	  var i;
  	
  	  if (!headers) { return parsed; }
  	
  	  utils.forEach(headers.split('\n'), function parser(line) {
  	    i = line.indexOf(':');
  	    key = utils.trim(line.substr(0, i)).toLowerCase();
  	    val = utils.trim(line.substr(i + 1));
  	
  	    if (key) {
  	      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
  	        return;
  	      }
  	      if (key === 'set-cookie') {
  	        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
  	      } else {
  	        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
  	      }
  	    }
  	  });
  	
  	  return parsed;
  	};


  /***/ }),
  /* 18 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	module.exports = (
  	  utils.isStandardBrowserEnv() ?
  	
  	  // Standard browser envs have full support of the APIs needed to test
  	  // whether the request URL is of the same origin as current location.
  	    (function standardBrowserEnv() {
  	      var msie = /(msie|trident)/i.test(navigator.userAgent);
  	      var urlParsingNode = document.createElement('a');
  	      var originURL;
  	
  	      /**
  	    * Parse a URL to discover it's components
  	    *
  	    * @param {String} url The URL to be parsed
  	    * @returns {Object}
  	    */
  	      function resolveURL(url) {
  	        var href = url;
  	
  	        if (msie) {
  	        // IE needs attribute set twice to normalize properties
  	          urlParsingNode.setAttribute('href', href);
  	          href = urlParsingNode.href;
  	        }
  	
  	        urlParsingNode.setAttribute('href', href);
  	
  	        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
  	        return {
  	          href: urlParsingNode.href,
  	          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
  	          host: urlParsingNode.host,
  	          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
  	          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
  	          hostname: urlParsingNode.hostname,
  	          port: urlParsingNode.port,
  	          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
  	            urlParsingNode.pathname :
  	            '/' + urlParsingNode.pathname
  	        };
  	      }
  	
  	      originURL = resolveURL(window.location.href);
  	
  	      /**
  	    * Determine if a URL shares the same origin as the current location
  	    *
  	    * @param {String} requestURL The URL to test
  	    * @returns {boolean} True if URL shares the same origin, otherwise false
  	    */
  	      return function isURLSameOrigin(requestURL) {
  	        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
  	        return (parsed.protocol === originURL.protocol &&
  	            parsed.host === originURL.host);
  	      };
  	    })() :
  	
  	  // Non standard browser envs (web workers, react-native) lack needed support.
  	    (function nonStandardBrowserEnv() {
  	      return function isURLSameOrigin() {
  	        return true;
  	      };
  	    })()
  	);


  /***/ }),
  /* 19 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	module.exports = (
  	  utils.isStandardBrowserEnv() ?
  	
  	  // Standard browser envs support document.cookie
  	    (function standardBrowserEnv() {
  	      return {
  	        write: function write(name, value, expires, path, domain, secure) {
  	          var cookie = [];
  	          cookie.push(name + '=' + encodeURIComponent(value));
  	
  	          if (utils.isNumber(expires)) {
  	            cookie.push('expires=' + new Date(expires).toGMTString());
  	          }
  	
  	          if (utils.isString(path)) {
  	            cookie.push('path=' + path);
  	          }
  	
  	          if (utils.isString(domain)) {
  	            cookie.push('domain=' + domain);
  	          }
  	
  	          if (secure === true) {
  	            cookie.push('secure');
  	          }
  	
  	          document.cookie = cookie.join('; ');
  	        },
  	
  	        read: function read(name) {
  	          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  	          return (match ? decodeURIComponent(match[3]) : null);
  	        },
  	
  	        remove: function remove(name) {
  	          this.write(name, '', Date.now() - 86400000);
  	        }
  	      };
  	    })() :
  	
  	  // Non standard browser env (web workers, react-native) lack needed support.
  	    (function nonStandardBrowserEnv() {
  	      return {
  	        write: function write() {},
  	        read: function read() { return null; },
  	        remove: function remove() {}
  	      };
  	    })()
  	);


  /***/ }),
  /* 20 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Determines whether the specified URL is absolute
  	 *
  	 * @param {string} url The URL to test
  	 * @returns {boolean} True if the specified URL is absolute, otherwise false
  	 */
  	module.exports = function isAbsoluteURL(url) {
  	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  	  // by any combination of letters, digits, plus, period, or hyphen.
  	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  	};


  /***/ }),
  /* 21 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Creates a new URL by combining the specified URLs
  	 *
  	 * @param {string} baseURL The base URL
  	 * @param {string} relativeURL The relative URL
  	 * @returns {string} The combined URL
  	 */
  	module.exports = function combineURLs(baseURL, relativeURL) {
  	  return relativeURL
  	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
  	    : baseURL;
  	};


  /***/ }),
  /* 22 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	/**
  	 * Config-specific merge-function which creates a new config-object
  	 * by merging two configuration objects together.
  	 *
  	 * @param {Object} config1
  	 * @param {Object} config2
  	 * @returns {Object} New object resulting from merging config2 to config1
  	 */
  	module.exports = function mergeConfig(config1, config2) {
  	  // eslint-disable-next-line no-param-reassign
  	  config2 = config2 || {};
  	  var config = {};
  	
  	  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
  	    if (typeof config2[prop] !== 'undefined') {
  	      config[prop] = config2[prop];
  	    }
  	  });
  	
  	  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
  	    if (utils.isObject(config2[prop])) {
  	      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
  	    } else if (typeof config2[prop] !== 'undefined') {
  	      config[prop] = config2[prop];
  	    } else if (utils.isObject(config1[prop])) {
  	      config[prop] = utils.deepMerge(config1[prop]);
  	    } else if (typeof config1[prop] !== 'undefined') {
  	      config[prop] = config1[prop];
  	    }
  	  });
  	
  	  utils.forEach([
  	    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
  	    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
  	    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
  	    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
  	    'socketPath'
  	  ], function defaultToConfig2(prop) {
  	    if (typeof config2[prop] !== 'undefined') {
  	      config[prop] = config2[prop];
  	    } else if (typeof config1[prop] !== 'undefined') {
  	      config[prop] = config1[prop];
  	    }
  	  });
  	
  	  return config;
  	};


  /***/ }),
  /* 23 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * A `Cancel` is an object that is thrown when an operation is canceled.
  	 *
  	 * @class
  	 * @param {string=} message The message.
  	 */
  	function Cancel(message) {
  	  this.message = message;
  	}
  	
  	Cancel.prototype.toString = function toString() {
  	  return 'Cancel' + (this.message ? ': ' + this.message : '');
  	};
  	
  	Cancel.prototype.__CANCEL__ = true;
  	
  	module.exports = Cancel;


  /***/ }),
  /* 24 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var Cancel = __webpack_require__(23);
  	
  	/**
  	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
  	 *
  	 * @class
  	 * @param {Function} executor The executor function.
  	 */
  	function CancelToken(executor) {
  	  if (typeof executor !== 'function') {
  	    throw new TypeError('executor must be a function.');
  	  }
  	
  	  var resolvePromise;
  	  this.promise = new Promise(function promiseExecutor(resolve) {
  	    resolvePromise = resolve;
  	  });
  	
  	  var token = this;
  	  executor(function cancel(message) {
  	    if (token.reason) {
  	      // Cancellation has already been requested
  	      return;
  	    }
  	
  	    token.reason = new Cancel(message);
  	    resolvePromise(token.reason);
  	  });
  	}
  	
  	/**
  	 * Throws a `Cancel` if cancellation has been requested.
  	 */
  	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  	  if (this.reason) {
  	    throw this.reason;
  	  }
  	};
  	
  	/**
  	 * Returns an object that contains a new `CancelToken` and a function that, when called,
  	 * cancels the `CancelToken`.
  	 */
  	CancelToken.source = function source() {
  	  var cancel;
  	  var token = new CancelToken(function executor(c) {
  	    cancel = c;
  	  });
  	  return {
  	    token: token,
  	    cancel: cancel
  	  };
  	};
  	
  	module.exports = CancelToken;


  /***/ }),
  /* 25 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Syntactic sugar for invoking a function and expanding an array for arguments.
  	 *
  	 * Common use case would be to use `Function.prototype.apply`.
  	 *
  	 *  ```js
  	 *  function f(x, y, z) {}
  	 *  var args = [1, 2, 3];
  	 *  f.apply(null, args);
  	 *  ```
  	 *
  	 * With `spread` this example can be re-written.
  	 *
  	 *  ```js
  	 *  spread(function(x, y, z) {})([1, 2, 3]);
  	 *  ```
  	 *
  	 * @param {Function} callback
  	 * @returns {Function}
  	 */
  	module.exports = function spread(callback) {
  	  return function wrap(arr) {
  	    return callback.apply(null, arr);
  	  };
  	};


  /***/ })
  /******/ ])
  });

  });

  //
  function normalizeCity(data) {
    data.map(v => {
      v.value = v.name;
      v.key = v.code;
      if (v.children) {
        v.children = normalizeCity(v.children);
      }
    });
    return data;
  }
  normalizeCity(data);

  const ax = axios.create();

  var script$2 = {
    name: 'App',
    components: {
      cell,
      btn
    },
    data() {
      return {
        title1: '',
        title2: '',
        title3: '',
        title4: '',
        title5: '',
        title6: '',
        title7: '',
        baseArr2: [],
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        show6: false,
        show7: false,
        loading2: true,
        loading6: true,
        data1: [],
        data2: [],
        data3: [],
        data4: [
          {
            value: '水果',
            children: [
              {
                value: '西瓜',
                children: [
                  {
                    value: '无子瓜',
                    children: [
                      {
                        value: '3块'
                      },
                      {
                        value: '5块',
                        children: [
                          '一斤',
                          '两斤',
                          {
                            key: '3',
                            value: '三斤'
                          },
                          '四斤'
                        ]
                      },
                      {
                        value: '7块'
                      }
                    ]
                  },
                  {
                    value: '口口脆'
                  }
                ]
              },
              {
                value: '梨子'
              },
              {
                value: '香蕉'
              }
            ]
          },
          {
            value: '蔬菜',
            children: [
              {
                value: '胡萝卜'
              },
              {
                value: '大白菜'
              },
              {
                value: '茄子',
                children: [
                  {
                    value: '大茄子'
                  },
                  {
                    value: '中茄子'
                  },
                  {
                    value: '小茄子'
                  }
                ]
              }
            ]
          },
          {
            value: '肉类',
            children: [
              {
                value: '猪肉',
                children: [
                  {
                    value: '前腿肉'
                  },
                  {
                    value: '后腿肉'
                  }
                ]
              },
              {
                value: '羊肉'
              },
              {
                value: '牛肉'
              }
            ]
          }
        ],
        data5: data,
        data6: [],
        data7: [],
        btn1: [
          '重新初始化数据(转联动)',
          '重新初始化数据(转非联动)',
          '获取当前data(console查看)',
          '获取当前index(console查看)'
        ],
        btn2: [
          '点击异步设置值',
          '获取当前data(console查看)',
          '获取当前index(console查看)'
        ],
        btn3: [
          '点击设置索引为10 10 10 10 10',
          '点击设置值为10 10 10 10 10',
          '点击设置key为20k 20k 20k 20k 20k',
          '获取当前data(console查看)',
          '获取当前index(console查看)'
        ],
        btn4: [
          '点击设置值为水果 西瓜 无子瓜 5块 两斤',
          '点击设置索引为2 0 1',
          '点击将第一栏滚动到索引2',
          '获取当前data(console查看)',
          '获取当前index(console查看)'
        ],
        btn5: [
          '点击设置索引为3 1 2',
          '点击设置值为 四川省 成都市 武侯区',
          '点击设置key为 32 3201 320102',
          '获取当前data(console查看)',
          '获取当前index(console查看)'
        ],
        btn6: [],
        btn7: [],
        newData1: [
          {
            value: '外部1',
            children: ['内部1', '内部2', '内部3', '内部4']
          },
          {
            value: '外部2'
          }
        ]
      };
    },
    created() {
      const baseArr1 = [];
      const baseArr2 = [];
      for (let i = 1; i <= 40; i++) {
        baseArr1.push(i);
        baseArr2.push({
          key: i + 'k',
          value: i
        });
      }
      this.data1 = [baseArr1];
      this.baseArr2 = [baseArr2];
      this.data3 = [baseArr2, baseArr2, baseArr2, baseArr2, baseArr2];
      let province = [];
      let city = [];
      let area = [];
      Promise.all([
        this.get('100000'),
        this.get('410000'),
        this.get('410300')
      ]).then(values => {
        province = values[0];
        city = values[1];
        area = values[2];
        this.$refs.select6.setData([province, city, area]);
        this.loading6 = false;
      });
    },
    methods: {
      doReady1(data) {
        this.title1 = `数据:${data.join(',')}`;
      },
      doClick1() {
        this.show1 = true;
      },
      doSet1(i) {
        const newData1 = [
          {
            value: '外部1',
            children: [
              '内部1',
              '内部2',
              '内部3',
              {
                value: '内部4',
                children: ['终极内部1', '终极内部2']
              }
            ]
          },
          {
            value: '外部2'
          }
        ];
        switch (i) {
          case 0:
            this.$refs.select1.setData(newData1, [0, 3]).then(([data, key]) => {
              this.title1 = `数据:${data.join(',')}`;
            });
            break;
          case 1:
            this.$refs.select1.setData(this.data1, [10]).then(([data, key]) => {
              this.title1 = `数据:${data.join(',')}`;
            });
            break;
          case 2:
            // eslint-disable-next-line
            console.log(this.$refs.select1.getData());
            break;
          case 3:
            // eslint-disable-next-line
            console.log(this.$refs.select1.getIndex());
            break;
        }
      },
      doShow1() {
        // eslint-disable-next-line
        console.log('1-show');
      },
      doHide1() {
        // eslint-disable-next-line
       console.log('1-hide');
      },
      doConfirm1(data) {
        this.title1 = `数据:${data.join(',')}`;
      },
      doChange1(weight, data) {
        // eslint-disable-next-line
        console.log(`1-change:${data.join(',')}`);
      },
      doReady2(data, key) {
        this.title2 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doClick2() {
        this.show2 = true;
      },
      doSet2(i) {
        switch (i) {
          case 0:
            this.$refs.select2.setData(this.baseArr2, [5]).then(([data, key]) => {
              this.title2 = `数据:${data.join(',')},key:${key.join(',')}`;
              this.loading2 = false;
            });
            break;
          case 1:
            // eslint-disable-next-line
            console.log(this.$refs.select2.getData());
            break;
          case 2:
            // eslint-disable-next-line
            console.log(this.$refs.select2.getIndex());
            break;
        }
      },
      doShow2() {
        // eslint-disable-next-line
        console.log('2-show');
      },
      doHide2() {
        // eslint-disable-next-line
       console.log('2-hide');
      },
      doConfirm2(data) {
        this.title2 = `数据:${data.join(',')}`;
      },
      doChange2(weight, data, key) {
        // eslint-disable-next-line
        console.log(`2-change:${data.join(',')}`);
        this.title2 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doReady3(data, key) {
        this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doClick3() {
        this.show3 = true;
      },
      doSet3(i) {
        switch (i) {
          case 0:
            this.$refs.select3
              .setIndex([10, 10, 10, 10, 10])
              .then(([data, key]) => {
                this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
              });
            break;
          case 1:
            this.$refs.select3
              .setValue([10, 10, 10, 10, 10])
              .then(([data, key]) => {
                this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
              });
            break;
          case 2:
            this.$refs.select3
              .setKey(['20k', '20k', '20k', '20k', '20k'])
              .then(([data, key]) => {
                this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
              });
            break;
          case 3:
            // eslint-disable-next-line
          console.log(this.$refs.select3.getData());
            break;
          case 4:
            // eslint-disable-next-line
          console.log(this.$refs.select3.getIndex());
            break;
        }
      },
      doShow3() {
        // eslint-disable-next-line
        console.log('3-show');
      },
      doHide3() {
        // eslint-disable-next-line
       console.log('3-hide');
      },
      doConfirm3(data, key) {
        this.title3 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doChange3(weight, data) {
        // eslint-disable-next-line
        console.log(`3-change:${data.join(',')}`);
      },
      doReady4(data, key) {
        this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doClick4() {
        this.show4 = true;
      },
      doSet4(i) {
        switch (i) {
          case 0:
            this.$refs.select4
              .setValue(['水果', '西瓜', '无子瓜', '5块', '两斤'])
              .then(([data, key]) => {
                this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
              });
            break;
          case 1:
            this.$refs.select4.setIndex([2, 0, 1]).then(([data, key]) => {
              this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 2:
            this.$refs.select4.scrollTo(0, 2).then(([data, key]) => {
              this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 3:
            // eslint-disable-next-line
          console.log(this.$refs.select4.getData());
            break;
          case 4:
            // eslint-disable-next-line
          console.log(this.$refs.select4.getIndex());
            break;
        }
      },
      doShow4() {
        // eslint-disable-next-line
        console.log('4-show');
      },
      doHide4() {
        // eslint-disable-next-line
       console.log('4-hide');
      },
      doConfirm4(data, key) {
        this.title4 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doChange4(weight, data) {
        // eslint-disable-next-line
        console.log(`4-change:${data.join(',')}`);
      },
      doReady5(data, key) {
        this.title5 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doClick5() {
        this.show5 = true;
      },
      doSet5(i) {
        switch (i) {
          case 0:
            this.$refs.select5.setIndex([3, 1, 2]).then(([data, key]) => {
              this.title5 = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 1:
            this.$refs.select5
              .setValue(['四川省', '成都市', '武侯区'])
              .then(([data, key]) => {
                this.title5 = `数据:${data.join(',')},key:${key.join(',')}`;
              });
            break;
          case 2:
            this.$refs.select5
              .setKey(['32', '3201', '320104'])
              .then(([data, key]) => {
                this.title5 = `数据:${data.join(',')},key:${key.join(',')}`;
              });
            break;
          case 3:
            // eslint-disable-next-line
          console.log(this.$refs.select5.getData());
            break;
          case 4:
            // eslint-disable-next-line
          console.log(this.$refs.select5.getIndex());
            break;
        }
      },
      doShow5() {
        // eslint-disable-next-line
        console.log('5-show');
      },
      doHide5() {
        // eslint-disable-next-line
       console.log('5-hide');
      },
      async get(code) {
        if (!code) {
          return [];
        }
        const data = await ax.get('https://restapi.amap.com/v3/config/district', {
          params: {
            key: '7c4c08ad5e1dcbca9601f09fab939f68',
            keywords: code || '',
            extensions: 'base'
          }
        });
        return data.data.districts[0].districts.map(v => ({
          key: v.adcode,
          value: v.name
        }));
      },
      doConfirm5(data, key) {
        this.title5 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doChange5(weight, data) {
        // eslint-disable-next-line
        console.log(`5-change:${data.join(',')}`);
      },
      doReady6(data, key) {
        this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doClick6() {
        this.show6 = true;
      },
      doShow6() {
        // eslint-disable-next-line
        console.log('6-show');
      },
      doHide6() {
        // eslint-disable-next-line
       console.log('6-hide');
      },
      doConfirm6(data, key) {
        this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      doChange6(weight, data, key) {
        const curKey = key[weight];
        switch (weight) {
          case 0:
            this.loading6 = true;
            this.get(curKey).then(res => {
              if (res.length) {
                this.get(res[0].key).then(inner => {
                  this.$refs.select6
                    .setColumnData([1, 2], [res, inner])
                    .then(([data, key]) => {
                      this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
                      this.loading6 = false;
                    });
                });
              } else {
                this.$refs.select6.setColumnData(1, res).then(([data, key]) => {
                  this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
                  this.loading6 = false;
                });
              }
            });
            break;
          case 1:
            this.loading6 = true;
            this.get(curKey).then(res => {
              this.$refs.select6.setColumnData(2, res).then(([data, key]) => {
                this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
                this.loading6 = false;
              });
            });
            break;
          case 2:
            this.title6 = `数据:${data.join(',')},key:${key.join(',')}`;
        }
      }
    }
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", [
      _c(
        "div",
        [
          _c("cell", { attrs: { force: "", title: "一层非联动" } }),
          _vm._v(" "),
          _c("cell", {
            attrs: { title: _vm.title1 },
            on: { click: _vm.doClick1 }
          }),
          _vm._v(" "),
          _vm._l(_vm.btn1, function(item, index) {
            return _c(
              "btn",
              {
                key: index,
                on: {
                  click: function($event) {
                    return _vm.doSet1(index)
                  }
                }
              },
              [_vm._v("\n      " + _vm._s(item) + "\n    ")]
            )
          }),
          _vm._v(" "),
          _c("q-select", {
            ref: "select1",
            attrs: { title: "一层非联动", data: _vm.data1 },
            on: {
              ready: _vm.doReady1,
              show: _vm.doShow1,
              hide: _vm.doHide1,
              change: _vm.doChange1,
              confirm: _vm.doConfirm1
            },
            model: {
              value: _vm.show1,
              callback: function($$v) {
                _vm.show1 = $$v;
              },
              expression: "show1"
            }
          })
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "div",
        [
          _c("cell", { attrs: { force: "", title: "一层非联动异步" } }),
          _vm._v(" "),
          _c("cell", {
            attrs: { hideDetails: "", title: _vm.title2 },
            on: { click: _vm.doClick2 }
          }),
          _vm._v(" "),
          _c("q-select", {
            ref: "select2",
            attrs: {
              title: "一层非联动异步",
              inline: "",
              loading: _vm.loading2,
              data: _vm.data2
            },
            on: {
              ready: _vm.doReady2,
              show: _vm.doShow2,
              hide: _vm.doHide2,
              change: _vm.doChange2,
              confirm: _vm.doConfirm2
            },
            model: {
              value: _vm.show2,
              callback: function($$v) {
                _vm.show2 = $$v;
              },
              expression: "show2"
            }
          }),
          _vm._v(" "),
          _vm._l(_vm.btn2, function(item, index) {
            return _c(
              "btn",
              {
                key: index,
                on: {
                  click: function($event) {
                    return _vm.doSet2(index)
                  }
                }
              },
              [_vm._v("\n      " + _vm._s(item) + "\n    ")]
            )
          })
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "div",
        [
          _c("cell", { attrs: { force: "", title: "多层非联动实测" } }),
          _vm._v(" "),
          _c("cell", {
            attrs: { title: _vm.title3 },
            on: { click: _vm.doClick3 }
          }),
          _vm._v(" "),
          _vm._l(_vm.btn3, function(item, index) {
            return _c(
              "btn",
              {
                key: index,
                on: {
                  click: function($event) {
                    return _vm.doSet3(index)
                  }
                }
              },
              [_vm._v("\n      " + _vm._s(item) + "\n    ")]
            )
          }),
          _vm._v(" "),
          _c("q-select", {
            ref: "select3",
            attrs: { title: "多层非联动实测", count: 9, data: _vm.data3 },
            on: {
              ready: _vm.doReady3,
              show: _vm.doShow3,
              hide: _vm.doHide3,
              change: _vm.doChange3,
              confirm: _vm.doConfirm3
            },
            model: {
              value: _vm.show3,
              callback: function($$v) {
                _vm.show3 = $$v;
              },
              expression: "show3"
            }
          })
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "div",
        [
          _c("cell", { attrs: { force: "", title: "简单联动" } }),
          _vm._v(" "),
          _c("cell", {
            attrs: { title: _vm.title4 },
            on: { click: _vm.doClick4 }
          }),
          _vm._v(" "),
          _vm._l(_vm.btn4, function(item, index) {
            return _c(
              "btn",
              {
                key: index,
                on: {
                  click: function($event) {
                    return _vm.doSet4(index)
                  }
                }
              },
              [_vm._v("\n      " + _vm._s(item) + "\n    ")]
            )
          }),
          _vm._v(" "),
          _c("q-select", {
            ref: "select4",
            attrs: { title: "简单联动", data: _vm.data4 },
            on: {
              ready: _vm.doReady4,
              show: _vm.doShow4,
              hide: _vm.doHide4,
              change: _vm.doChange4,
              confirm: _vm.doConfirm4
            },
            model: {
              value: _vm.show4,
              callback: function($$v) {
                _vm.show4 = $$v;
              },
              expression: "show4"
            }
          })
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "div",
        [
          _c("cell", { attrs: { force: "", title: "省市区联动实测" } }),
          _vm._v(" "),
          _c("cell", {
            attrs: { title: _vm.title5 },
            on: { click: _vm.doClick5 }
          }),
          _vm._v(" "),
          _vm._l(_vm.btn5, function(item, index) {
            return _c(
              "btn",
              {
                key: index,
                on: {
                  click: function($event) {
                    return _vm.doSet5(index)
                  }
                }
              },
              [_vm._v("\n      " + _vm._s(item) + "\n    ")]
            )
          }),
          _vm._v(" "),
          _c("q-select", {
            ref: "select5",
            attrs: { title: "省市区联动实测", data: _vm.data5 },
            on: {
              ready: _vm.doReady5,
              show: _vm.doShow5,
              hide: _vm.doHide5,
              change: _vm.doChange5,
              confirm: _vm.doConfirm5
            },
            model: {
              value: _vm.show5,
              callback: function($$v) {
                _vm.show5 = $$v;
              },
              expression: "show5"
            }
          })
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "div",
        [
          _c("cell", { attrs: { force: "", title: "省市区非联动异步实测" } }),
          _vm._v(" "),
          _c("cell", {
            attrs: { hideDetails: "", title: _vm.title6 },
            on: { click: _vm.doClick6 }
          }),
          _vm._v(" "),
          _c("q-select", {
            ref: "select6",
            attrs: {
              title: "省市区非联动异步实测",
              data: _vm.data6,
              inline: "",
              loading: _vm.loading6
            },
            on: {
              ready: _vm.doReady6,
              show: _vm.doShow6,
              hide: _vm.doHide6,
              change: _vm.doChange6,
              confirm: _vm.doConfirm6
            },
            model: {
              value: _vm.show6,
              callback: function($$v) {
                _vm.show6 = $$v;
              },
              expression: "show6"
            }
          })
        ],
        1
      )
    ])
  };
  var __vue_staticRenderFns__$2 = [];
  __vue_render__$2._withStripped = true;

    /* style */
    const __vue_inject_styles__$2 = undefined;
    /* scoped */
    const __vue_scope_id__$2 = undefined;
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var App = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      undefined,
      undefined
    );

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
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  var Dom = (function () {
      function Dom() {
          this.initialDomString = '';
      }
      Dom.prototype.init = function (data, options, inline, callback) {
          var _this = this;
          var id = options.id, loading = options.loading;
          var baseSize = Math.floor(options.count / 2) * options.chunkHeight;
          if (!inline) {
              this.initialDomString += "\n        <div class=\"q-select-header q-select-header--" + id + "\">\n          <div class=\"q-select-header-cancel q-select-header-cancel--" + id + "\">\n            <div class=\"q-select-header-cancel__value q-select-header-cancel__value--" + id + "\">" + (options.cancelBtn ||
                  '取消') + "</div>\n          </div>\n          <div class=\"q-select-header-title q-select-header-title--" + id + "\">\n            <div class=\"q-select-header-title__value q-select-header-title__value--" + id + "\">" + (options.title ||
                  '请选择') + "</div>\n          </div>\n          <div class=\"q-select-header-confirm q-select-header-confirm--" + id + "\">\n            <div class=\"q-select-header-confirm__value q-select-header-confirm__value--" + id + "\">" + (options.confirmBtn ||
                  '确定') + "</div>\n          </div>\n        </div>\n      ";
          }
          this.initialDomString += "\n      <div style=\"height:" + options.count * options.chunkHeight + "px;display:" + (loading ? 'flex' : 'none') + "\" class=\"q-select-loading q-select-loading--" + id + "\">\n        <svg class=\"q-select-loading-svg\" viewBox=\"25 25 50 50\">\n          <circle\n            class=\"q-select-loading-svg__circle\"\n            cx=\"50\"\n            cy=\"50\"\n            r=\"20\"\n            fill=\"none\"\n          />\n        </svg>\n      </div>\n      <div style=\"height:" + options.count *
              options.chunkHeight + "px\" class=\"q-select-box q-select-box--" + id + "\">\n    ";
          data.forEach(function (v) {
              _this.initialDomString += "\n      <div class=\"q-select-box-item q-select-box-item--" + id + "\">\n        <div class=\"q-select-box-item__overlay q-select-box-item__overlay--" + id + "\" style=\"background-size: 100% " + (!loading ? baseSize + 'px' : '100%') + ";\"></div>\n        <div class=\"q-select-box-item__highlight q-select-box-item__highlight--" + id + "\" style=\"top: " + baseSize + "px;height: " + options.chunkHeight + "px\"></div>\n        <div class=\"q-select-box-item-collections q-select-box-item-collections--" + id + "\">\n        " + v
                  .map(function (p) {
                  return "<div style=\"line-height: " + options.chunkHeight + "px;\" class=\"q-select-box-item-collections__tick q-select-box-item-collections__tick--" + id + "\">\n              " + p.value + "\n            </div>";
              })
                  .join('') + "\n        </div>\n      </div>\n      ";
          });
          callback(this.initialDomString);
      };
      Dom.prototype.remove = function () {
          this.initialDomString = '';
      };
      Dom.diff = function (dataTrans, dataTransLater, weight, id, chunkHeight, touches, hand, callback) {
          var $collections = Dom.findAll("q-select-box-item-collections--" + id);
          var $select = Dom.find("q-select-box--" + id);
          if (dataTrans.length < dataTransLater.length) {
              if ($collections.length < dataTransLater.length) {
                  var $overlayArr = [];
                  var $chunksArr = [];
                  var $highlightArr = [];
                  for (var y = hand ? weight : weight + 1; y < dataTrans.length; y++) {
                      var collection = $collections[y];
                      Dom.diffForDatas(collection, id, chunkHeight, touches[y].data, dataTransLater[y]);
                  }
                  for (var v = $collections.length; v < dataTransLater.length; v++) {
                      var fragment = document.createDocumentFragment();
                      var $box = Dom.create('div');
                      Dom.addClass($box, ['q-select-box-item', "q-select-box-item--" + id]);
                      var $overlay = Dom.create('div');
                      Dom.addClass($overlay, [
                          'q-select-box-item__overlay',
                          "q-select-box-item__overlay--" + id
                      ]);
                      var $highlight = Dom.create('div');
                      Dom.addClass($highlight, [
                          'q-select-box-item__highlight',
                          "q-select-box-item__highlight--" + id
                      ]);
                      Dom.addStyle($highlight, { height: chunkHeight + "px" });
                      $box.appendChild($overlay);
                      $box.appendChild($highlight);
                      var $chunks = Dom.create('div');
                      Dom.addClass($chunks, [
                          'q-select-box-item-collections',
                          "q-select-box-item-collections--" + id
                      ]);
                      for (var y = 0; y < dataTransLater[v].length; y++) {
                          var $div = Dom.create('div');
                          Dom.addClass($div, [
                              'q-select-box-item-collections__tick',
                              "q-select-box-item-collections__tick--" + id
                          ]);
                          Dom.addStyle($div, { lineHeight: chunkHeight + "px" });
                          $div.textContent = dataTransLater[v][y].value;
                          fragment.appendChild($div);
                      }
                      $chunks.appendChild(fragment);
                      $box.appendChild($chunks);
                      $select.appendChild($box);
                      $overlayArr[v] = $overlay;
                      $chunksArr[v] = $chunks;
                      $highlightArr[v] = $highlight;
                  }
                  callback && callback($overlayArr, $chunksArr, $highlightArr);
              }
              else {
                  for (var y = hand ? weight : weight + 1; y < dataTransLater.length; y++) {
                      var collection = Dom.findIndex("q-select-box-item-collections--" + id, y);
                      Dom.diffForDatas(collection, id, chunkHeight, touches[y].data, dataTransLater[y]);
                  }
                  callback && callback();
              }
          }
          else if (dataTrans.length === dataTransLater.length) {
              for (var y = hand ? weight : weight + 1; y < dataTransLater.length; y++) {
                  Dom.diffForDatas($collections[y], id, chunkHeight, dataTrans[y], dataTransLater[y]);
              }
              callback && callback();
          }
          else if (dataTrans.length > dataTransLater.length) {
              for (var y = hand ? weight : weight + 1; y < dataTransLater.length; y++) {
                  Dom.diffForDatas($collections[y], id, chunkHeight, dataTrans[y], dataTransLater[y]);
              }
              callback && callback();
          }
      };
      Dom.diffForDatas = function (collect, id, chunkHeight, dataTransList, dataTransListLater) {
          var diffLen = dataTransListLater.length - dataTransList.length;
          var dataTransListLen = dataTransList.length;
          var dataTransListLaterLen = dataTransListLater.length;
          if (diffLen > 0) {
              var fragment = document.createDocumentFragment();
              for (var y = 0; y < dataTransListLen; y++) {
                  var value = dataTransListLater[y].value;
                  collect.children[y].textContent = value;
              }
              for (var y = dataTransListLen; y < dataTransListLaterLen; y++) {
                  var div = document.createElement('div');
                  var value = dataTransListLater[y].value;
                  Dom.addClass(div, [
                      'q-select-box-item-collections__tick',
                      "q-select-box-item-collections__tick--" + id
                  ]);
                  Dom.addStyle(div, { lineHeight: chunkHeight + "px" });
                  div.textContent = value;
                  fragment.appendChild(div);
              }
              collect.appendChild(fragment);
          }
          else {
              for (var y = 0; y < dataTransListLaterLen; y++) {
                  var value = dataTransListLater[y].value;
                  collect.children[y].textContent = value;
              }
              var children = Array.from(collect.children).slice();
              for (var y = dataTransListLaterLen; y < dataTransListLen; y++) {
                  collect.removeChild(children[y]);
              }
          }
      };
      Dom.create = function (tag) {
          return document.createElement(tag);
      };
      Dom.find = function (className) {
          return document.querySelector("." + className);
      };
      Dom.findIndex = function (className, index) {
          var $els = Array.from(document.querySelectorAll("." + className));
          return $els[index];
      };
      Dom.findLast = function (className) {
          var $els = Array.from(document.querySelectorAll("." + className));
          return $els[$els.length - 1];
      };
      Dom.addClass = function (el, className) {
          el.className = Array.isArray(className) ? className.join(' ') : className;
      };
      Dom.addStyle = function (el, style) {
          var _this = this;
          if (Array.isArray(style)) {
              style.map(function (v) { return _this.addStyle(el, v); });
          }
          else {
              for (var key in style) {
                  el.style[key] = style[key];
              }
          }
      };
      Dom.remove = function (parent, child) {
          parent.removeChild(child);
      };
      Dom.findAll = function (className) {
          return document.querySelectorAll("." + className);
      };
      Dom.bind = function (el, event, fn, options) {
          el.addEventListener(event, fn, options);
      };
      Dom.unbind = function (el, event) {
          el.removeEventListener(event, function () { });
      };
      return Dom;
  }());

  function easeOutCubic(pos) {
      return Math.pow(pos - 1, 3) + 1;
  }
  function isPlainObj(obj) {
      return Object.prototype.toString.call(obj).slice(8, -1) === 'Object';
  }
  function isPlainNumber(obj) {
      return isFinite(obj);
  }
  function assert(condition, msg) {
      return true;
  }
  function sameIndex(a, b) {
      return a.length === b.length && a.every(function (v, i) { return v === b[i]; });
  }
  function tips(condition, msg) {
      return true;
  }
  function nextTick$1(fn) {
      try {
          Promise.resolve().then(function () {
              fn();
          });
      }
      catch (error) {
          setTimeout(function () {
              fn();
          });
      }
  }
  function deepClone(val) {
      if (Array.isArray(val)) {
          return val.map(function (v) { return deepClone(v); });
      }
      else {
          var res = {};
          for (var key in val) {
              var item = val[key];
              res[key] = isPlainObj(item) ? deepClone(item) : item;
          }
          return res;
      }
  }

  var Animate = (function () {
      function Animate(duration) {
          if (duration === void 0) { duration = 200; }
          this.start = 0;
          this.end = 0;
          this.diff = 0;
          this.dir = 'bottom';
          this.count = 0;
          this.ratio = 0;
          this.result = 0;
          this.animateId = 0;
          this.duration = duration;
          this.pipline = true;
      }
      Animate.prototype.getAnimateCount = function (duration) {
          return duration / 16;
      };
      Animate.prototype.getDirection = function () {
          return this.start > this.end ? 'top' : 'bottom';
      };
      Animate.prototype.run = function (start, end, callback, last, duration) {
          if (start === end) {
              last && last(end);
              return;
          }
          if (duration === 0) {
              last && last(end);
              return;
          }
          this.pipline = true;
          this.ratio = 0;
          this.start = start;
          this.end = end;
          this.result = start;
          this.diff = Math.abs(this.start - this.end);
          this.count = Math.ceil(this.getAnimateCount(duration || this.duration));
          this.dir = this.getDirection();
          this.doAnimate(callback, last);
      };
      Animate.prototype.stop = function () {
          this.pipline = false;
          this.ratio = 0;
          window.cancelAnimationFrame(this.animateId);
      };
      Animate.prototype.doAnimate = function (callback, last) {
          if (!this.pipline) {
              return;
          }
          this.ratio += 1 / this.count;
          if (this.ratio <= 1) {
              this.result =
                  this.start +
                      this.diff * easeOutCubic(this.ratio) * (this.dir === 'bottom' ? 1 : -1);
              this.animateId = window.requestAnimationFrame(this.doAnimate.bind(this, callback, last));
          }
          else {
              this.result = this.end;
              window.cancelAnimationFrame(this.animateId);
              last && last(this.end);
              this.ratio = 0;
          }
          callback && callback(this.result);
      };
      return Animate;
  }());

  var Touch = (function () {
      function Touch(data, aim, overlay, collection, hightlightEl, curIndex, pre, endCall, fromDiff) {
          this.overlay = overlay;
          this.collection = collection;
          this.hightlightEl = hightlightEl;
          this.pre = pre;
          this.endCall = endCall;
          this.curIndex = curIndex;
          this.preIndex = curIndex;
          this.preTrans = 0;
          this.animateSlide = new Animate(2000);
          this.animateShrink = new Animate(250);
          this.data = data;
          this.average = Math.floor(pre.count / 2);
          this.maxScrollTop = 0;
          this.minScrollTop = 0;
          this.featureScrollTop = 0;
          this.isAnimating = false;
          this.aim = aim;
          this.hidden = false;
          this.lastTime = 0;
          this.positions = [];
          this.touchStart = 0;
          this.touchDiff = 0;
          this.fromDiff = fromDiff || false;
          this.init();
      }
      Touch.prototype.init = function () {
          Dom.bind(this.overlay, 'touchstart', this.doTouchStart.bind(this));
          Dom.bind(this.overlay, 'touchmove', this.doTouchMove.bind(this));
          Dom.bind(this.overlay, 'touchend', this.doTouchEnd.bind(this));
          this.initTrans();
      };
      Touch.prototype.active = function (index) {
          Dom.findIndex("q-select-box-item--" + this.pre.id, index).style.display =
              'flex';
          this.hidden = false;
      };
      Touch.prototype.deactive = function (index) {
          Dom.findIndex("q-select-box-item--" + this.pre.id, index).style.display =
              'none';
          this.hidden = true;
      };
      Touch.prototype.reset = function (data, reset) {
          this.data = data;
          this.preIndex = this.curIndex;
          this.setMinScrollTop(this.data);
          if (reset) {
              this.preIndex = 0;
              this.curIndex = 0;
              this.scrollTo(0);
          }
          else {
              this.scrollTo(this.pre.dynamicIndex[this.aim]);
          }
      };
      Touch.prototype.initTrans = function () {
          var val = (this.average - this.curIndex) * this.pre.chunkHeight;
          this.preTrans = val;
          this.initScrollTop(this.average * this.pre.chunkHeight);
          this.setTrans(val);
          if (this.fromDiff) {
              this.setSize();
          }
      };
      Touch.prototype.setSize = function () {
          var baseSize = Math.floor(this.pre.$options.count / 2) * this.pre.$options.chunkHeight;
          Dom.addStyle(this.overlay, {
              backgroundSize: "100% " + baseSize + "px"
          });
          if (this.hightlightEl) {
              Dom.addStyle(this.hightlightEl, {
                  top: baseSize + "px"
              });
          }
      };
      Touch.prototype.shrinkSize = function () {
          Dom.addStyle(this.overlay, {
              backgroundSize: "100% 100%"
          });
      };
      Touch.prototype.initScrollTop = function (top) {
          this.maxScrollTop = top;
          this.setMinScrollTop(this.data);
      };
      Touch.prototype.setMinScrollTop = function (data) {
          this.minScrollTop =
              this.maxScrollTop - (data.length - 1) * this.pre.chunkHeight;
      };
      Touch.prototype.setTrans = function (value) {
          this.collection.style.transform = "translate3d(0," + value + "px,0)";
      };
      Touch.prototype.getTouchCenter = function (touches) {
          if (touches.length >= 2) {
              return (touches[0].pageY + touches[1].pageY) / 2;
          }
          else {
              return touches[0].pageY;
          }
      };
      Touch.prototype.doTouchStart = function (e) {
          if (!this.data.length) {
              return;
          }
          this.touchStart = this.getTouchCenter(e.touches);
          this.animateSlide.stop();
          this.animateShrink.stop();
      };
      Touch.prototype.doTouchMove = function (e) {
          e.preventDefault();
          if (!this.data.length) {
              return;
          }
          var time = e.timeStamp;
          this.touchDiff =
              this.getTouchCenter(e.touches) - this.touchStart + this.preTrans;
          if (this.positions.length > 60) {
              this.positions.splice(0, 30);
          }
          this.positions.push({
              top: this.touchDiff,
              time: time
          });
          this.lastTime = time;
          this.setTrans(this.touchDiff);
      };
      Touch.prototype.doTouchEnd = function (e) {
          if (!this.data.length) {
              return;
          }
          var time = e.timeStamp;
          this.isAnimating = true;
          if (time - this.lastTime <= 100) {
              this.doSlideAnimate(time);
          }
          else {
              this.doShrinkAnimate();
          }
      };
      Touch.prototype.doSlideAnimate = function (time) {
          var pre;
          var post = this.positions.length - 1;
          pre = this.positions.filter(function (v) { return v.time >= time - 100; })[0];
          var timeOffset = this.positions[post].time - pre.time;
          var movedTop = this.touchDiff - pre.top;
          var decelerationTrans;
          decelerationTrans = (movedTop / timeOffset) * (1000 / 60);
          var featureScrollTop = this.touchDiff;
          var duration = 0;
          var isFrezzed = false;
          this.positions.length = 0;
          while (Math.abs(decelerationTrans) >= 0.1) {
              duration += 16;
              decelerationTrans = decelerationTrans * 0.95;
              featureScrollTop += decelerationTrans;
              if (featureScrollTop >= this.maxScrollTop) {
                  isFrezzed = true;
                  featureScrollTop = this.maxScrollTop;
                  break;
              }
              if (featureScrollTop <= this.minScrollTop) {
                  isFrezzed = true;
                  featureScrollTop = this.minScrollTop;
                  break;
              }
          }
          this.preIndex = this.curIndex;
          var featureIndex = this.getFeatureIndex(featureScrollTop);
          var realFeatureScrollTop = isFrezzed
              ? featureScrollTop
              : this.getFeatureScrollTop(featureIndex);
          if (Math.abs(movedTop) <= 10 || duration <= 250) {
              this.shrinkAnimateToEnd(realFeatureScrollTop);
          }
          else {
              this.slideAnimateToEnd(realFeatureScrollTop, duration);
          }
      };
      Touch.prototype.doShrinkAnimate = function () {
          this.shrinkAnimateToEnd(this.touchDiff);
      };
      Touch.prototype.scrollTo = function (index) {
          var featureScrollTop = this.getFeatureScrollTop(index);
          this.shrinkAnimateToEnd(featureScrollTop, true);
      };
      Touch.prototype.slideAnimateToEnd = function (realFeatureScrollTop, duration) {
          var _this = this;
          this.animateSlide.run(this.touchDiff, realFeatureScrollTop, function (res) {
              _this.touchDiff = res;
              _this.preTrans = res;
              _this.setTrans(res);
          }, function (end) {
              _this.animateFinishedCall(end);
          }, duration);
      };
      Touch.prototype.shrinkAnimateToEnd = function (featureScrollTop, fast) {
          var _this = this;
          var index = this.getFeatureIndex(featureScrollTop);
          featureScrollTop = this.getFeatureScrollTop(index);
          this.animateShrink.run(this.touchDiff, featureScrollTop, function (res) {
              _this.setTrans(res);
              _this.preTrans = res;
              _this.touchDiff = res;
          }, function (end) {
              _this.animateFinishedCall(end, fast);
          }, fast ? 0 : 250);
      };
      Touch.prototype.animateFinishedCall = function (end, fast) {
          this.isAnimating = false;
          this.preTrans = end;
          this.touchDiff = end;
          this.setTrans(end);
          this.curIndex = this.getFeatureIndex(end);
          if (this.preIndex === this.curIndex || fast) {
              return;
          }
          var curData = this.data[this.curIndex];
          if (!this.fromDiff) {
              this.endCall({
                  key: curData.key,
                  value: curData.value,
                  index: this.curIndex
              }, this.aim);
          }
          this.preIndex = this.curIndex;
      };
      Touch.prototype.getFeatureIndex = function (featureScrollTop) {
          var curI = this.average - Math.round(featureScrollTop / this.pre.chunkHeight);
          var len = this.data.length;
          return curI < 0 ? 0 : curI > len - 1 ? len - 1 : curI;
      };
      Touch.prototype.getFeatureScrollTop = function (featureIndex) {
          return (this.average - featureIndex) * this.pre.chunkHeight;
      };
      return Touch;
  }());

  var id = 0;
  var Layer = (function () {
      function Layer(options) {
          this.$options = options;
          this.id = id++;
          this.target = null;
          if (options.target) {
              var $target = document.querySelector(options.target);
              if ($target) {
                  this.target = $target;
              }
              else {
                  assert(false, "can not catch " + options.target + ",make sure you have set a right flag of a element");
              }
          }
          this.$options.id = this.id;
          this.count = options.count = isPlainNumber(+options.count)
              ? +options.count
              : 7;
          this.chunkHeight = options.chunkHeight = isPlainNumber(+options.chunkHeight)
              ? +options.chunkHeight
              : 40;
          this.data = options.data;
          this.dataTrans = [];
          this.index = options.index;
          this.dynamicIndex = [];
          this.realIndex = [];
          this.isGanged = this.data.every(function (v) { return isPlainObj(v); });
          this.touchs = [];
          this.dynamicData = [];
          this.realData = [];
          this.cachedCall = [];
          this.isReady = false;
          this.hidden = true;
          this.loading = !!options.loading;
          this.dom = new Dom();
          this.validateOptions() && this.init();
      }
      Layer.prototype.validateOptions = function () {
          var _this = this;
          function tipsForFn(value) {
              if (this.$options[value] && typeof this.$options[value] !== 'function') {
                  tips(false, value + " must be a function but not get " + this.$options[value]);
                  this.$options[value] = function () { };
              }
          }
          if (this.count % 2 !== 1 && (this.count < 5 || this.count > 9)) {
              tips(false, "count can only be 5 or 7 or 9, but now get " + this.count);
              this.count = this.$options.count = 5;
          }
          if (this.chunkHeight < 30 || this.chunkHeight > 100) {
              tips(false, "chunkHeight must greater than 30 and less than 100,but now get " + this.chunkHeight);
              this.chunkHeight = this.$options.chunkHeight = 40;
          }
          ['ready', 'cancel', 'confirm', 'show', 'close'].map(function (v) {
              return tipsForFn.call(_this, v);
          });
          if (!this.validateData() || !this.validateIndex()) {
              return false;
          }
          return true;
      };
      Layer.prototype.validateData = function (forceData) {
          var data = forceData || this.$options.data;
          if (!data ||
              !Array.isArray(data) ||
              (Array.isArray(data) && data.length === 0)) {
              this.data = [['']];
          }
          function validateGangedData(data, firstLevel) {
              return data.every(function (v) {
                  if (isPlainObj(v)) {
                      var levelBool = true;
                      var childBool = true;
                      if (firstLevel) {
                          levelBool = assert(v.value, 'value is required if in the first level of GangedData');
                      }
                      else {
                          childBool = assert(v.value, 'value is required if you use object to define a property of GangedData');
                      }
                      if ((childBool || levelBool) && v.children && v.children.length) {
                          return validateGangedData(v.children, false);
                      }
                      return true;
                  }
                  else {
                      return assert(typeof v === 'string' || typeof v === 'number', "value can only be number or string if you use object to define a property of GangedData but now get " + v);
                  }
              });
          }
          if (this.isGanged) {
              return validateGangedData(data, true);
          }
          else {
              return data.every(function (v) {
                  if (!Array.isArray(v)) {
                      return false;
                  }
                  return v.every(function (p) {
                      if (isPlainObj(p)) {
                          return assert(p.value, 'value is required if NotGangedData is a object');
                      }
                      else if (typeof p !== 'string' && typeof p !== 'number') {
                          return assert(false, "value can only be number or string if NotGangedData is not a object but now get " + p + " which is " + typeof p);
                      }
                      return true;
                  });
              });
          }
      };
      Layer.prototype.validateIndex = function (forceIndex) {
          var index = forceIndex || this.$options.index;
          if (!index) {
              return true;
          }
          if (!Array.isArray(index)) {
              return assert(false, "index must be an Array, but now get " + index);
          }
          return index.every(function (v) {
              if (typeof v !== 'number') {
                  return assert(false, "index can only be a number, but now get " + v);
              }
              return true;
          });
      };
      Layer.prototype.init = function () {
          var _this = this;
          this.normalizeData();
          this.dom.init(this.dataTrans, this.$options, !!this.target, function (domString) {
              var $bk = Dom.find('q-select-bk');
              if (!$bk && !_this.target) {
                  var $bk_1 = Dom.create('div');
                  Dom.addClass($bk_1, 'q-select-bk');
                  Dom.addStyle($bk_1, [
                      {
                          zIndex: isPlainNumber(+_this.$options.bkIndex)
                              ? +_this.$options.bkIndex
                              : 500
                      },
                      {
                          display: 'none'
                      }
                  ]);
                  document.body.appendChild($bk_1);
              }
              var $el = Dom.create('div');
              Dom.addClass($el, ['q-select', "q-select--" + _this.id]);
              if (!_this.target) {
                  Dom.addStyle($el, [
                      {
                          zIndex: isPlainNumber(+_this.$options.selectIndex)
                              ? +_this.$options.selectIndex
                              : 600
                      },
                      {
                          display: 'none'
                      }
                  ]);
              }
              else {
                  Dom.addStyle($el, [
                      {
                          position: 'static'
                      }
                  ]);
              }
              $el.innerHTML = domString;
              if (!_this.target) {
                  document.body.appendChild($el);
              }
              else {
                  _this.target.appendChild($el);
                  _this.hidden = false;
              }
              _this.dom.remove();
              _this.prepareMount();
          });
      };
      Layer.prototype.normalizeIndex = function (dataTransLater, forceIndex) {
          var _this = this;
          this.index = forceIndex || this.index;
          this.index =
              this.index || Array.from({ length: dataTransLater.length }).fill(0);
          this.index.map(function (v, i) {
              if (v < 0) {
                  _this.index[i] = 0;
              }
              if (dataTransLater[i]) {
                  var len = dataTransLater[i].length;
                  if (v > len - 1) {
                      _this.index[i] = len - 1;
                  }
              }
              return v;
          });
          var lenDiff = this.index.length - dataTransLater.length;
          this.index =
              lenDiff >= 0
                  ? this.index.slice(0, dataTransLater.length)
                  : this.index.concat(Array.from({ length: Math.abs(lenDiff) }).fill(0));
          this.dynamicIndex = this.index.slice();
          this.realIndex = this.index.slice();
      };
      Layer.prototype.normalizeData = function (forceData, index) {
          if (this.isGanged) {
              this.normalizeGangedData();
              this.dataTrans = this.genGangedData(this.data);
          }
          else {
              if (forceData) {
                  if (Array.isArray(forceData) && Array.isArray(index)) {
                      for (var i = 0; i < forceData.length - 1; i++) {
                          this.data[index[i]] = forceData[index[i]];
                      }
                  }
                  else {
                      this.data[index] = forceData;
                  }
              }
              this.normalizeNotGangedData();
              this.dataTrans = deepClone(this.data);
          }
      };
      Layer.prototype.normalizeGangedData = function () {
          function loop(data) {
              data.map(function (v, i) {
                  if (!isPlainObj(v)) {
                      data[i] = v = {
                          value: v,
                          key: v,
                          children: []
                      };
                  }
                  else {
                      v.key = v.key || v.value;
                  }
                  if (v.children && v.children.length) {
                      loop(v.children);
                  }
                  else {
                      v.children = [];
                  }
                  return v;
              });
          }
          loop(this.data);
      };
      Layer.prototype.normalizeNotGangedData = function () {
          this.data.map(function (v) {
              for (var key in v) {
                  var item = v[key];
                  if (isPlainObj(item)) {
                      item.key = item.key || item.value;
                  }
                  else {
                      v[key] = {
                          key: item,
                          value: item
                      };
                  }
              }
          });
      };
      Layer.prototype.prepareMount = function () {
          var _this = this;
          this.normalizeIndex(this.dataTrans);
          var $overlays = Dom.findAll("q-select-box-item__overlay--" + this.id);
          var $collections = Dom.findAll("q-select-box-item-collections--" + this.id);
          var $highlights = Dom.findAll("q-select-box-item__highlight--" + this.id);
          this.dynamicData = this.dataTrans.reduce(function (acc, val, index) {
              acc[index] = val[_this.index[index]] || {};
              acc[index].index = index;
              return acc;
          }, []);
          this.realData = deepClone(this.dynamicData);
          if (!this.target) {
              this.mountActions();
          }
          this.mountTouches($overlays, $collections, $highlights);
      };
      Layer.prototype.mountActions = function () {
          var _this = this;
          var $confirm = Dom.find("q-select-header-confirm--" + this.id);
          var $cancel = Dom.find("q-select-header-cancel--" + this.id);
          function reset() {
              this.dynamicIndex = this.realIndex.slice();
              if (this.isGanged) {
                  var dataTrans = deepClone(this.dataTrans);
                  var dataTransLater = this.genGangedData(this.data, this.realIndex);
                  this.diff(dataTrans, dataTransLater, 0, true, false, true);
              }
              this.stopAll();
          }
          Dom.bind($confirm, 'click', function () {
              var _a;
              if (_this.touchs.filter(function (v) { return !v.hidden; }).every(function (v) { return !v.isAnimating; })) {
                  _this.realIndex = _this.dynamicIndex.slice();
                  _this.realData = deepClone(_this.dynamicData);
              }
              else {
                  _this.dynamicData = deepClone(_this.realData);
                  reset.call(_this);
              }
              _this.closeSelect();
              _this.$options.confirm && (_a = _this.$options).confirm.apply(_a, _this.getChangeCallData());
          });
          Dom.bind($cancel, 'click', function () {
              if (!_this.$options.disableDefaultCancel) {
                  _this.closeSelect();
              }
              reset.call(_this);
              _this.$options.cancel && _this.$options.cancel();
          });
      };
      Layer.prototype.mountTouches = function ($overlays, $collections, $highlights) {
          var _a;
          var _this = this;
          this.dataTrans.forEach(function (v, i) {
              _this.touchs[i] = new Touch(v, i, $overlays[i], $collections[i], $highlights[i], _this.dynamicIndex[i], _this, _this.touchCallback.bind(_this));
          });
          this.setBoxWidth();
          this.isReady = true;
          this.$options.ready && (_a = this.$options).ready.apply(_a, this.getChangeCallData());
      };
      Layer.prototype.closeSelect = function () {
          var _a;
          if (this.hidden) {
              return;
          }
          var $select = Dom.find("q-select--" + this.id);
          var $bk = Dom.find("q-select-bk");
          Dom.addStyle($select, {
              display: 'none'
          });
          Dom.addStyle($bk, {
              display: 'none'
          });
          this.hidden = true;
          this.$options.hide && (_a = this.$options).hide.apply(_a, this.getChangeCallData());
      };
      Layer.prototype.destroySelect = function () {
          var _this = this;
          nextTick$1(function () {
              _this.__proto__ = null;
              for (var key in _this) {
                  _this[key] = null;
              }
              Dom.remove(document.body, Dom.find("q-select--" + id));
          });
      };
      Layer.prototype.showSelect = function () {
          var _a;
          if (!this.hidden) {
              return;
          }
          var $select = Dom.find("q-select--" + this.id);
          var $bk = Dom.find("q-select-bk");
          Dom.addStyle($select, { display: 'block' });
          Dom.addStyle($bk, { display: 'block' });
          this.hidden = false;
          this.$options.show && (_a = this.$options).show.apply(_a, this.getChangeCallData());
      };
      Layer.prototype.stopAll = function () {
          var _this = this;
          this.touchs
              .filter(function (v) { return !v.hidden; })
              .forEach(function (v, i) {
              v.animateShrink.stop();
              v.animateSlide.stop();
              v.scrollTo(_this.realIndex[i]);
              v.setMinScrollTop(_this.dataTrans[i]);
          });
      };
      Layer.prototype.setIndexAndData = function (dataTransLater) {
          var _this = this;
          dataTransLater.forEach(function (v, i) {
              var curIndex = _this.dynamicIndex[i];
              if (curIndex > v.length - 1) {
                  _this.realIndex[i] = _this.dynamicIndex[i] = curIndex = v.length - 1;
              }
              if (curIndex < 0) {
                  _this.realIndex[i] = _this.dynamicIndex[i] = curIndex = 0;
              }
              _this.dynamicData[i] = __assign({}, dataTransLater[i][curIndex], { index: curIndex });
              _this.realData[i] = __assign({}, dataTransLater[i][curIndex], { index: curIndex });
          });
      };
      Layer.prototype.setBoxWidth = function () {
          var $box = Dom.findAll("q-select-box-item--" + this.id);
          var width = 100 / this.touchs.filter(function (v) { return !v.hidden; }).length + '%';
          $box.forEach(function (v) {
              v.style.width = width;
          });
      };
      Layer.prototype.touchCallback = function (value, i) {
          this.dynamicIndex[i] = value.index;
          if (this.target) {
              this.realIndex[i] = value.index;
          }
          if (!this.isGanged) {
              this.notGangedCallback(value, i);
          }
          else {
              this.gangedCallback(value, i);
          }
      };
      Layer.prototype.notGangedCallback = function (value, i) {
          var _a;
          this.dynamicData[i] = value;
          var cache = function () { };
          cache.priority = i;
          this.cachedCall.push(cache);
          if (this.touchs.every(function (v) { return !v.isAnimating; }) && !this.hidden) {
              var weight = Math.min.apply(Math, this.cachedCall.reduce(function (acc, val) {
                  acc.push(+val.priority);
                  return acc;
              }, []));
              var changeCallData = this.getChangeCallData();
              this.$options.change && (_a = this.$options).change.apply(_a, [weight].concat(changeCallData));
              this.cachedCall.length = 0;
          }
      };
      Layer.prototype.gangedCallback = function (value, i) {
          var callback = function () { };
          callback.priority = i;
          callback.value = value;
          var activeTouches = this.touchs.filter(function (v) { return !v.hidden; });
          this.cachedCall[i] = callback;
          if (activeTouches.every(function (v) { return !v.isAnimating; })) {
              var weight = Math.min.apply(Math, this.cachedCall.reduce(function (acc, val) {
                  acc.push(+val.priority);
                  return acc;
              }, []));
              this.dynamicIndex = this.dynamicIndex.slice(0, weight + 1);
              for (var y = weight + 1; y < activeTouches.length; y++) {
                  this.dynamicIndex[y] = 0;
              }
              var dataTransLater = this.genGangedData(this.data, this.dynamicIndex);
              this.diff(this.dataTrans, dataTransLater, weight, false, true);
          }
      };
      Layer.prototype.getChangeCallData = function () {
          var valueCollections = this.dynamicData.reduce(function (acc, val) {
              acc.push(val.value);
              return acc;
          }, []);
          var keyCollections = this.dynamicData.reduce(function (acc, val) {
              acc.push(val.key);
              return acc;
          }, []);
          var dynamicData = this.dynamicData;
          return [valueCollections, keyCollections, dynamicData];
      };
      Layer.prototype.diff = function (dataTrans, dataTransLater, weight, ignoreChange, resetIndex, trigger) {
          var _this = this;
          Dom.diff(dataTrans, dataTransLater, weight, this.id, this.chunkHeight, this.touchs, trigger, function ($overlay, $collection, $highlight) {
              var _a;
              if (dataTransLater.length > dataTrans.length) {
                  _this.dynamicData[weight] = __assign({}, dataTransLater[weight][_this.dynamicIndex[weight]], { index: _this.dynamicIndex[weight] });
                  for (var y = trigger ? weight : weight + 1; y < dataTransLater.length; y++) {
                      if (!_this.touchs[y]) {
                          _this.touchs[y] = new Touch(dataTransLater[y], y, $overlay[y], $collection[y], $highlight[y], _this.dynamicIndex[y], _this, _this.touchCallback.bind(_this));
                          if (!trigger || resetIndex) {
                              _this.dynamicIndex[y] = 0;
                          }
                          _this.touchs[y].setSize();
                          _this.dynamicData[y] = __assign({}, dataTransLater[y][_this.dynamicIndex[y]], { index: _this.dynamicIndex[y] });
                      }
                      else {
                          _this.touchs[y].reset(dataTransLater[y], resetIndex);
                          _this.touchs[y].active(y);
                          if (!trigger || resetIndex) {
                              _this.dynamicIndex[y] = 0;
                          }
                          _this.dynamicData[y] = __assign({}, dataTransLater[y][_this.dynamicIndex[y]], { index: _this.dynamicIndex[y] });
                      }
                      _this.setBoxWidth();
                  }
                  if ($overlay) {
                      $overlay.length = 0;
                      $collection.length = 0;
                      $highlight.length = 0;
                  }
              }
              else if (dataTransLater.length === dataTrans.length) {
                  _this.resetExistTouch(weight, dataTransLater, trigger, resetIndex);
              }
              else {
                  var spliceArr = [];
                  for (var y = dataTransLater.length; y < dataTrans.length; y++) {
                      _this.touchs[y].deactive(y);
                      spliceArr.push(y);
                  }
                  _this.resetExistTouch(weight, dataTransLater, trigger, resetIndex);
                  _this.dynamicIndex.splice(spliceArr[0], spliceArr.length);
                  _this.dynamicData.splice(spliceArr[0], spliceArr.length);
                  spliceArr.length = 0;
                  _this.setBoxWidth();
              }
              if (!ignoreChange) {
                  var changeCallData = _this.getChangeCallData();
                  _this.$options.change && (_a = _this.$options).change.apply(_a, [weight].concat(changeCallData));
              }
              _this.dataTrans = dataTransLater;
              _this.cachedCall.length = 0;
          });
      };
      Layer.prototype.resetExistTouch = function (weight, dataTransLater, trigger, resetIndex) {
          if (dataTransLater[weight]) {
              this.dynamicData[weight] = __assign({}, dataTransLater[weight][this.dynamicIndex[weight]], { index: this.dynamicIndex[weight] });
          }
          for (var y = trigger ? weight : weight + 1; y < this.touchs.filter(function (v) { return !v.hidden; }).length; y++) {
              if (!trigger || resetIndex) {
                  this.dynamicIndex[y] = 0;
              }
              this.dynamicData[y] = __assign({}, dataTransLater[y][this.dynamicIndex[y]], { index: this.dynamicIndex[y] });
              this.touchs[y].reset(dataTransLater[y], resetIndex);
          }
      };
      Layer.prototype.genGangedData = function (data, preciseIndex) {
          var index = 0;
          var dataTrans = [];
          function genGangedDataChildren(child) {
              dataTrans[index] = [];
              for (var _i = 0, child_1 = child; _i < child_1.length; _i++) {
                  var item = child_1[_i];
                  dataTrans[index].push({
                      key: item.key,
                      value: item.value
                  });
              }
              var curIndex = (preciseIndex || [])[index] || 0;
              index++;
              if (child[curIndex] && child[curIndex].children.length) {
                  genGangedDataChildren(child[curIndex].children);
              }
          }
          genGangedDataChildren(data);
          this.completeDynamicIndex(dataTrans);
          return dataTrans;
      };
      Layer.prototype.completeDynamicIndex = function (data) {
          for (var i = this.dynamicIndex.length; i < data.length; i++) {
              this.dynamicIndex[i] = 0;
          }
      };
      Layer.prototype.callReady = function () {
          var _a;
          this.$options.ready && (_a = this.$options).ready.apply(_a, this.getChangeCallData());
      };
      return Layer;
  }());

  var QSelect = (function (_super) {
      __extends(QSelect, _super);
      function QSelect() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      QSelect.prototype.setColumnData = function (column, data) {
          var _this = this;
          return new Promise(function (resolve, reject) {
              try {
                  var preTrans = _this.dataTrans.slice();
                  var realData = [];
                  if (Array.isArray(column)) {
                      var i = 0;
                      for (var _i = 0, column_1 = column; _i < column_1.length; _i++) {
                          var item = column_1[_i];
                          realData[+item] = data[i];
                          i++;
                      }
                  }
                  else {
                      realData = data;
                  }
                  var max = Array.isArray(column)
                      ? column[column.length - 1] + 1
                      : column + 1;
                  var min = Array.isArray(column) ? column[0] : column;
                  _this.normalizeData(realData, column);
                  _this.dataTrans = _this.dataTrans.slice(0, max).filter(function (v) { return v.length; });
                  _this.dynamicIndex = _this.dynamicIndex.slice(0, max);
                  _this.diff(preTrans, _this.dataTrans, min, true, true, true);
                  _this.realData = deepClone(_this.dynamicData);
                  resolve(_this.getChangeCallData());
              }
              catch (error) {
                  reject(error);
              }
          });
      };
      QSelect.prototype.scrollTo = function (column, index) {
          var later = this.dynamicIndex.slice();
          later[column] = index;
          return this.setIndex(later);
      };
      QSelect.prototype.setIndex = function (index) {
          var _this = this;
          return new Promise(function (resolve, reject) {
              try {
                  if (_this.validateIndex(index)) {
                      _this._setIndex(index);
                      resolve(_this.getChangeCallData());
                  }
                  else {
                      reject();
                  }
              }
              catch (error) {
                  reject(error);
              }
          });
      };
      QSelect.prototype._setIndex = function (index, preDataTrans, diff) {
          var _this = this;
          var preIndex = this.realIndex.slice();
          this.dynamicIndex = index.slice();
          this.realIndex = index.slice();
          if (!sameIndex(preIndex, index) || diff) {
              if (!this.isGanged) {
                  if (diff) {
                      this.diff(preDataTrans, this.dataTrans, 0, true, true, true);
                  }
                  this.dynamicIndex = index.slice();
                  this.realIndex = index.slice();
                  this.setIndexAndData(this.dataTrans);
                  this.touchs
                      .filter(function (v) { return !v.hidden; })
                      .forEach(function (v, i) { return v.scrollTo(_this.realIndex[i]); });
                  this.callReady();
              }
              else {
                  var dataTransLater_1 = this.genGangedData(this.data, index);
                  this.dynamicIndex.map(function (v, i) {
                      if (v < 0) {
                          _this.dynamicIndex[i] = 0;
                          _this.realIndex[i] = 0;
                      }
                      var len = (dataTransLater_1[i] || dataTransLater_1[dataTransLater_1.length - 1]).length;
                      if (v > len - 1) {
                          _this.dynamicIndex[i] = len - 1;
                          _this.realIndex[i] = len - 1;
                      }
                      return v;
                  });
                  this.diff(preDataTrans || this.dataTrans, dataTransLater_1, 0, true, false, true);
                  this.realIndex = this.dynamicIndex.slice();
                  this.realData = deepClone(this.dynamicData);
                  this.callReady();
              }
          }
      };
      QSelect.prototype.setValue = function (value) {
          return this._setKeyAndValue('value', value);
      };
      QSelect.prototype.setKey = function (key) {
          return this._setKeyAndValue('key', key);
      };
      QSelect.prototype._setKeyAndValue = function (type, value) {
          var _this = this;
          return new Promise(function (resolve, reject) {
              var findedIndex = [];
              var index = 0;
              function findIndex(data) {
                  data.forEach(function (v, i) {
                      if (v[type] === value[index]) {
                          index++;
                          findedIndex.push(i);
                          findIndex(v.children);
                      }
                  });
              }
              try {
                  if (_this.isGanged) {
                      findIndex(_this.data);
                      var dataTransLater = _this.genGangedData(_this.data, findedIndex);
                      for (var y = findedIndex.length; y < dataTransLater.length; y++) {
                          findedIndex[y] = 0;
                      }
                  }
                  else {
                      _this.dataTrans.forEach(function (v, i) {
                          var res = v.findIndex(function (w) { return w[type] === value[i]; });
                          findedIndex.push(res === -1 ? 0 : res);
                      });
                  }
                  _this._setIndex(findedIndex);
                  resolve(_this.getChangeCallData());
              }
              catch (error) {
                  reject(error);
              }
          });
      };
      QSelect.prototype.setData = function (data, index) {
          var _this = this;
          return new Promise(function (resolve, reject) {
              _this.isGanged = data.every(function (v) { return isPlainObj(v); });
              if (_this.validateData(data) &&
                  (index ? _this.validateIndex(index) : true)) {
                  var preDataTrans = deepClone(_this.dataTrans);
                  _this.data = data;
                  _this.normalizeData();
                  _this._setIndex(index ||
                      Array.from({ length: _this.dataTrans.length }).fill(0), preDataTrans, true);
                  resolve(_this.getChangeCallData());
              }
              else {
                  reject();
              }
          });
      };
      QSelect.prototype.getData = function () {
          return this.getChangeCallData();
      };
      QSelect.prototype.getIndex = function () {
          return this.realIndex;
      };
      QSelect.prototype.getValue = function () {
          return this.dynamicData.reduce(function (acc, val) {
              acc.push(val.value);
              return acc;
          }, []);
      };
      QSelect.prototype.getKey = function () {
          return this.dynamicData.reduce(function (acc, val) {
              acc.push(val.key);
              return acc;
          }, []);
      };
      QSelect.prototype.close = function () {
          return this.closeSelect();
      };
      QSelect.prototype.show = function () {
          return this.showSelect();
      };
      QSelect.prototype.destroy = function () {
          return this.destroySelect();
      };
      QSelect.prototype.setLoading = function () {
          this.loading = true;
          var $loading = Dom.find("q-select-loading--" + this.id);
          Dom.addStyle($loading, [{ display: 'flex' }]);
          this.touchs
              .filter(function (v) { return !v.hidden; })
              .forEach(function (v) {
              v.shrinkSize();
          });
      };
      QSelect.prototype.cancelLoading = function () {
          this.loading = false;
          var $loading = Dom.find("q-select-loading--" + this.id);
          Dom.addStyle($loading, { display: 'none' });
          this.touchs
              .filter(function (v) { return !v.hidden; })
              .forEach(function (v) {
              v.setSize();
          });
      };
      return QSelect;
  }(Layer));

  var toString$1 = function (x) { return Object.prototype.toString.call(x); };
  var hasSymbol$1 = typeof Symbol === 'function' && Symbol.for;
  var noopFn = function (_) { return _; };
  var sharedPropertyDefinition$1 = {
      enumerable: true,
      configurable: true,
      get: noopFn,
      set: noopFn,
  };
  function proxy$1(target, key, getter, setter) {
      sharedPropertyDefinition$1.get = getter;
      sharedPropertyDefinition$1.set = setter || noopFn;
      Object.defineProperty(target, key, sharedPropertyDefinition$1);
  }
  var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  function hasOwn$1(obj, key) {
      return hasOwnProperty$1.call(obj, key);
  }
  function assert$1(condition, msg) {
      if (!condition)
          throw new Error("[vue-function-api] " + msg);
  }
  function isArray(x) {
      return toString$1(x) === '[object Array]';
  }
  function isPlainObject$1(x) {
      return toString$1(x) === '[object Object]';
  }

  var currentVue = null;
  var currentVM = null;
  function getCurrentVue() {
      {
          assert$1(currentVue, "must call Vue.use(plugin) before using any function.");
      }
      return currentVue;
  }
  function setCurrentVue(vue) {
      currentVue = vue;
  }
  function getCurrentVM() {
      return currentVM;
  }
  function setCurrentVM(vue) {
      currentVM = vue;
  }

  var AbstractWrapper = /** @class */ (function () {
      function AbstractWrapper() {
      }
      AbstractWrapper.prototype.setVmProperty = function (vm, propName) {
          var _this = this;
          this._vm = vm;
          this._propName = propName;
          var props = vm.$options.props;
          var methods = vm.$options.methods;
          var computed = vm.$options.computed;
          var warn = getCurrentVue().util.warn;
          if (!(propName in vm)) {
              proxy$1(vm, propName, function () { return _this.value; }, function (val) {
                  _this.value = val;
              });
              {
                  this.exposeToDevtool();
              }
          }
          else {
              if (hasOwn$1(vm.$data, propName)) {
                  warn("The setup binding property \"" + propName + "\" is already declared as a data.", vm);
              }
              else if (props && hasOwn$1(props, propName)) {
                  warn("The setup binding property \"" + propName + "\" is already declared as a prop.", vm);
              }
              else if (methods && hasOwn$1(methods, propName)) {
                  warn("The setup binding property \"" + propName + "\" is already declared as a method.", vm);
              }
              else if (computed && propName in computed) {
                  warn("The setup binding property \"" + propName + "\" is already declared as a computed.", vm);
              }
              else {
                  warn("The setup binding property \"" + propName + "\" is already declared.", vm);
              }
          }
      };
      return AbstractWrapper;
  }());

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
  /* global Reflect, Promise */

  var extendStatics$1 = function(d, b) {
      extendStatics$1 = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics$1(d, b);
  };

  function __extends$1(d, b) {
      extendStatics$1(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign$1 = function() {
      __assign$1 = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign$1.apply(this, arguments);
  };

  var ValueWrapper = /** @class */ (function (_super) {
      __extends$1(ValueWrapper, _super);
      function ValueWrapper(_internal) {
          var _this = _super.call(this) || this;
          _this._internal = _internal;
          return _this;
      }
      Object.defineProperty(ValueWrapper.prototype, "value", {
          get: function () {
              return this._internal.$$state;
          },
          set: function (v) {
              this._internal.$$state = v;
          },
          enumerable: true,
          configurable: true
      });
      ValueWrapper.prototype.exposeToDevtool = function () {
          var _this = this;
          {
              var vm = this._vm;
              var name_1 = this._propName;
              proxy$1(vm._data, name_1, function () { return _this.value; }, function (val) {
                  _this.value = val;
              });
          }
      };
      return ValueWrapper;
  }(AbstractWrapper));

  var ComputedWrapper = /** @class */ (function (_super) {
      __extends$1(ComputedWrapper, _super);
      function ComputedWrapper(_internal) {
          var _this = _super.call(this) || this;
          _this._internal = _internal;
          return _this;
      }
      Object.defineProperty(ComputedWrapper.prototype, "value", {
          get: function () {
              return this._internal.read();
          },
          set: function (val) {
              if (!this._internal.write) {
                  {
                      getCurrentVue().util.warn('Computed property' +
                          (this._propName ? " \"" + this._propName + "\"" : '') +
                          ' was assigned to but it has no setter.', this._vm);
                  }
              }
              else {
                  this._internal.write(val);
              }
          },
          enumerable: true,
          configurable: true
      });
      ComputedWrapper.prototype.exposeToDevtool = function () {
          var _this = this;
          {
              var vm = this._vm;
              var name_1 = this._propName;
              if (!vm.$options.computed) {
                  vm.$options.computed = {};
              }
              proxy$1(vm.$options.computed, name_1, function () { return ({
                  get: function () { return _this.value; },
                  set: function (val) {
                      _this.value = val;
                  },
              }); });
          }
      };
      return ComputedWrapper;
  }(AbstractWrapper));

  function isWrapper(obj) {
      return obj instanceof AbstractWrapper;
  }
  function ensureCurrentVMInFn(hook) {
      var vm = getCurrentVM();
      {
          assert$1(vm, "\"" + hook + "\" get called outside of \"setup()\"");
      }
      return vm;
  }
  function observable(obj) {
      var Vue = getCurrentVue();
      if (Vue.observable) {
          return Vue.observable(obj);
      }
      var silent = Vue.config.silent;
      Vue.config.silent = true;
      var vm = new Vue({
          data: {
              $$state: obj,
          },
      });
      Vue.config.silent = silent;
      return vm._data.$$state;
  }

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData$1(to, from) {
      if (!from)
          return to;
      var key;
      var toVal;
      var fromVal;
      var keys = hasSymbol$1 ? Reflect.ownKeys(from) : Object.keys(from);
      for (var i = 0; i < keys.length; i++) {
          key = keys[i];
          // in case the object is already observed...
          if (key === '__ob__')
              continue;
          toVal = to[key];
          fromVal = from[key];
          if (!hasOwn$1(to, key)) {
              to[key] = fromVal;
          }
          else if (toVal !== fromVal &&
              (isPlainObject$1(toVal) && !isWrapper(toVal)) &&
              (isPlainObject$1(fromVal) && !isWrapper(toVal))) {
              mergeData$1(toVal, fromVal);
          }
      }
      return to;
  }
  function install(Vue, _install) {
      if (currentVue && currentVue === Vue) {
          {
              assert$1(false, 'already installed. Vue.use(plugin) should be called only once');
          }
          return;
      }
      Vue.config.optionMergeStrategies.setup = function (parent, child) {
          return function mergedSetupFn(props, context) {
              return mergeData$1(typeof child === 'function' ? child(props, context) || {} : {}, typeof parent === 'function' ? parent(props, context) || {} : {});
          };
      };
      setCurrentVue(Vue);
      _install(Vue);
  }

  function mixin(Vue) {
      Vue.mixin({
          created: vuexInit,
      });
      /**
       * Vuex init hook, injected into each instances init hooks list.
       */
      function vuexInit() {
          var vm = this;
          var setup = vm.$options.setup;
          if (!setup) {
              return;
          }
          if (typeof setup !== 'function') {
              {
                  Vue.util.warn('The "setup" option should be a function that returns a object in component definitions.', vm);
              }
              return;
          }
          var binding;
          setCurrentVM(vm);
          var ctx = createContext(vm);
          try {
              binding = setup(vm.$props || {}, ctx);
          }
          catch (err) {
              {
                  Vue.util.warn("there is an error occuring in \"setup\"", vm);
              }
              console.log(err);
          }
          finally {
              setCurrentVM(null);
          }
          if (!binding)
              return;
          if (!isPlainObject$1(binding)) {
              {
                  assert$1(false, "\"setup\" must return a \"Object\", get \"" + Object.prototype.toString
                      .call(binding)
                      .slice(8, -1) + "\"");
              }
              return;
          }
          Object.keys(binding).forEach(function (name) {
              var bindingValue = binding[name];
              if (isWrapper(bindingValue)) {
                  bindingValue.setVmProperty(vm, name);
              }
              else {
                  vm[name] = bindingValue;
              }
          });
      }
      function createContext(vm) {
          var ctx = {};
          var props = [
              // 'el', // has workaround
              // 'options',
              'parent',
              'root',
              // 'children', // very likely
              'refs',
              'slots',
              // 'scopedSlots', // has workaround
              // 'isServer',
              // 'ssrContext',
              // 'vnode',
              'attrs',
          ];
          var methodWithoutReturn = [
              // 'on',  // very likely
              // 'once', // very likely
              // 'off', // very likely
              'emit',
          ];
          props.forEach(function (key) {
              proxy$1(ctx, key, function () { return vm["$" + key]; }, function () {
                  Vue.util.warn("Cannot assign to '" + key + "' because it is a read-only property", vm);
              });
          });
          methodWithoutReturn.forEach(function (key) {
              return proxy$1(ctx, key, function () {
                  var vmKey = "$" + key;
                  return function () {
                      var args = [];
                      for (var _i = 0; _i < arguments.length; _i++) {
                          args[_i] = arguments[_i];
                      }
                      var fn = vm[vmKey];
                      fn.apply(vm, args);
                  };
              });
          });
          return ctx;
      }
  }

  function upWrapping(obj) {
      if (!obj) {
          return obj;
      }
      var keys = Object.keys(obj);
      for (var index = 0; index < keys.length; index++) {
          var key = keys[index];
          var value_1 = obj[key];
          if (isWrapper(value_1)) {
              obj[key] = value_1.value;
          }
          else if (isPlainObject$1(value_1) || isArray(value_1)) {
              obj[key] = upWrapping(value_1);
          }
      }
      return obj;
  }
  function value(value) {
      return new ValueWrapper(observable({ $$state: isArray(value) || isPlainObject$1(value) ? upWrapping(value) : value }));
  }

  var genName = function (name) { return "on" + (name[0].toUpperCase() + name.slice(1)); };
  function createLifeCycle(lifeCyclehook) {
      return function (callback) {
          var vm = ensureCurrentVMInFn(genName(lifeCyclehook));
          vm.$on("hook:" + lifeCyclehook, callback);
      };
  }
  function createLifeCycles(lifeCyclehooks, name) {
      return function (callback) {
          var vm = ensureCurrentVMInFn(name);
          lifeCyclehooks.forEach(function (lifeCyclehook) { return vm.$on("hook:" + lifeCyclehook, callback); });
      };
  }
  var onCreated = createLifeCycle('created');
  // only one event will be fired between destroyed and deactivated when an unmount occurs
  var onUnmounted = createLifeCycles(['destroyed', 'deactivated'], genName('unmounted'));

  function createSymbol(name) {
      return hasSymbol$1 ? Symbol.for(name) : name;
  }
  var WatcherPreFlushQueueKey = createSymbol('vfa.key.preFlushQueue');
  var WatcherPostFlushQueueKey = createSymbol('vfa.key.postFlushQueue');

  var initValue = {};
  var fallbackVM;
  function hasWatchEnv(vm) {
      return vm[WatcherPreFlushQueueKey] !== undefined;
  }
  function installWatchEnv(vm) {
      vm[WatcherPreFlushQueueKey] = [];
      vm[WatcherPostFlushQueueKey] = [];
      vm.$on('hook:beforeUpdate', createFlusher(WatcherPreFlushQueueKey));
      vm.$on('hook:updated', createFlusher(WatcherPostFlushQueueKey));
  }
  function createFlusher(key) {
      return function () {
          flushQueue(this, key);
      };
  }
  function flushQueue(vm, key) {
      var queue = vm[key];
      for (var index = 0; index < queue.length; index++) {
          queue[index]();
      }
      queue.length = 0;
  }
  function flushWatcherCallback(vm, fn, mode) {
      // flush all when beforeUpdate and updated are not fired
      function fallbackFlush() {
          vm.$nextTick(function () {
              if (vm[WatcherPreFlushQueueKey].length) {
                  flushQueue(vm, WatcherPreFlushQueueKey);
              }
              if (vm[WatcherPostFlushQueueKey].length) {
                  flushQueue(vm, WatcherPostFlushQueueKey);
              }
          });
      }
      switch (mode) {
          case 'pre':
              fallbackFlush();
              vm[WatcherPreFlushQueueKey].push(fn);
              break;
          case 'post':
              fallbackFlush();
              vm[WatcherPostFlushQueueKey].push(fn);
              break;
          case 'sync':
              fn();
              break;
          default:
              assert$1(false, "flush must be one of [\"post\", \"pre\", \"sync\"], but got " + mode);
              break;
      }
  }
  function createSingleSourceWatcher(vm, source, cb, options) {
      var getter;
      if (isWrapper(source)) {
          getter = function () { return source.value; };
      }
      else {
          getter = source;
      }
      var callbackRef = function (n, o) {
          callbackRef = flush;
          if (!options.lazy) {
              cb(n, o);
          }
          else {
              flush(n, o);
          }
      };
      var flush = function (n, o) {
          flushWatcherCallback(vm, function () {
              cb(n, o);
          }, options.flush);
      };
      return vm.$watch(getter, function (n, o) {
          callbackRef(n, o);
      }, {
          immediate: !options.lazy,
          deep: options.deep,
          // @ts-ignore
          sync: options.flush === 'sync',
      });
  }
  function createMuiltSourceWatcher(vm, sources, cb, options) {
      var execCallbackAfterNumRun = options.lazy ? false : sources.length;
      var pendingCallback = false;
      var watcherContext = [];
      function execCallback() {
          cb.apply(vm, watcherContext.reduce(function (acc, ctx) {
              acc[0].push((ctx.value === initValue ? ctx.getter() : ctx.value));
              acc[1].push((ctx.oldValue === initValue ? undefined : ctx.oldValue));
              return acc;
          }, [[], []]));
      }
      function stop() {
          watcherContext.forEach(function (ctx) { return ctx.watcherStopHandle(); });
      }
      var callbackRef = function () {
          if (execCallbackAfterNumRun !== false) {
              if (--execCallbackAfterNumRun === 0) {
                  execCallbackAfterNumRun = false;
                  callbackRef = flush;
                  execCallback();
              }
          }
          else {
              callbackRef = flush;
              flush();
          }
      };
      var flush = function () {
          if (!pendingCallback) {
              pendingCallback = true;
              vm.$nextTick(function () {
                  flushWatcherCallback(vm, function () {
                      pendingCallback = false;
                      execCallback();
                  }, options.flush);
              });
          }
      };
      sources.forEach(function (source) {
          var getter;
          if (isWrapper(source)) {
              getter = function () { return source.value; };
          }
          else {
              getter = source;
          }
          var watcherCtx = {
              getter: getter,
              value: initValue,
              oldValue: initValue,
          };
          // must push watcherCtx before create watcherStopHandle
          watcherContext.push(watcherCtx);
          watcherCtx.watcherStopHandle = vm.$watch(getter, function (n, o) {
              watcherCtx.value = n;
              watcherCtx.oldValue = o;
              callbackRef();
          }, {
              immediate: !options.lazy,
              deep: options.deep,
              // @ts-ignore
              // always set to true, so we can fully control the schedule
              sync: true,
          });
      });
      return stop;
  }
  function watch(source, cb, options) {
      if (options === void 0) { options = {}; }
      var opts = __assign$1({
          lazy: false,
          deep: false,
          flush: 'post',
      }, options);
      var vm = getCurrentVM();
      if (!vm) {
          if (!fallbackVM) {
              var Vue_1 = getCurrentVue();
              var silent = Vue_1.config.silent;
              Vue_1.config.silent = true;
              fallbackVM = new Vue_1();
              Vue_1.config.silent = silent;
          }
          vm = fallbackVM;
          opts.flush = 'sync';
      }
      if (!hasWatchEnv(vm))
          installWatchEnv(vm);
      if (isArray(source)) {
          return createMuiltSourceWatcher(vm, source, cb, opts);
      }
      return createSingleSourceWatcher(vm, source, cb, opts);
  }

  var _install = function (Vue) { return install(Vue, mixin); };
  var plugin = {
      install: _install,
  };
  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  if (currentVue && typeof window !== 'undefined' && window.Vue) {
      _install(window.Vue);
  }

  function assert$2(condition, msg) {
      return true;
  }

  var script$3 = {
      setup: function (props, context) {
          var pending = value(true);
          var uid = value(0);
          var ins = {};
          onCreated(function () {
              Vue.nextTick(function () {
                  ins = new QSelect({
                      data: props.data,
                      index: props.index,
                      target: props.inline ? ".q-select-inline--" + uid.value : '',
                      count: props.count,
                      title: props.title,
                      chunkHeight: props.chunkHeight,
                      loading: props.loading,
                      ready: function (value, key, data) {
                          pending = false;
                          context.emit('ready', value, key, data);
                      },
                      cancel: function () {
                          context.emit('input', false);
                          context.emit('cancel');
                      },
                      confirm: function (value, key, data) {
                          context.emit('input', false);
                          context.emit('confirm', value, key, data);
                      },
                      change: function (weight, value, key, data) {
                          context.emit('change', weight, value, key, data);
                      },
                      show: function () {
                          context.emit('show');
                      },
                      hide: function () {
                          context.emit('hide');
                      }
                  });
              });
          });
          var warnIns = function () {
              if (!ins) {
                  return assert$2(false, 'You should new QSelect before you use it');
              }
              else {
                  return true;
              }
          };
          var show = function () {
              if (warnIns()) {
                  return ins.showSelect();
              }
          };
          var close = function () {
              if (warnIns()) {
                  return ins.closeSelect();
              }
          };
          var destroy = function () {
              if (warnIns()) {
                  return ins.destroySelect();
              }
          };
          var setData = function (data, index) {
              if (warnIns()) {
                  return ins.setData(data, index);
              }
          };
          var setColumnData = function (column, data) {
              if (warnIns()) {
                  return ins.setColumnData(column, data);
              }
          };
          var scrollTo = function (column, index) {
              if (warnIns()) {
                  return ins.scrollTo(column, index);
              }
          };
          var setIndex = function (index) {
              if (warnIns()) {
                  return ins.setIndex(index);
              }
          };
          var setValue = function (value) {
              if (warnIns()) {
                  return ins.setValue(value);
              }
          };
          var setKey = function (key) {
              if (warnIns()) {
                  return ins.setKey(key);
              }
          };
          var getData = function () {
              if (warnIns()) {
                  return ins.getChangeCallData();
              }
          };
          var getIndex = function () {
              if (warnIns()) {
                  return ins.getIndex();
              }
          };
          var getValue = function () {
              if (warnIns()) {
                  return ins.getValue();
              }
          };
          var getKey = function () {
              if (warnIns()) {
                  return ins.getKey();
              }
          };
          var setLoading = function () {
              if (warnIns()) {
                  return ins.setLoading();
              }
          };
          var cancelLoading = function () {
              if (warnIns()) {
                  return ins.cancelLoading();
              }
          };
          watch(function () { return props.visible; }, function (val) {
              if (val) {
                  if (pending) {
                      Vue.nextTick(function () {
                          show();
                      });
                  }
                  else {
                      show();
                  }
              }
              else {
                  if (!pending) {
                      close();
                  }
              }
          });
          watch(function () { return props.loading; }, function (val) {
              if (val) {
                  if (pending) ;
                  else {
                      setLoading();
                  }
              }
              else {
                  if (!pending) {
                      cancelLoading();
                  }
              }
          });
          return {
              pending: pending,
              ins: ins,
              show: show,
              close: close,
              destroy: destroy,
              setData: setData,
              setColumnData: setColumnData,
              scrollTo: scrollTo,
              setIndex: setIndex,
              setValue: setValue,
              setKey: setKey,
              getData: getData,
              getIndex: getIndex,
              getValue: getValue,
              getKey: getKey,
              setLoading: setLoading,
              cancelLoading: cancelLoading,
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
              default: function () { return [['']]; }
          },
          index: {
              type: Array,
              default: function () { return []; }
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
      render: function (h) {
          this.uid = this._uid;
          if (this.inline) {
              return h('div', { class: "q-select-inline--" + this._uid });
          }
          else {
              return h('');
          }
      }
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = undefined;
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = undefined;
    /* style inject */
    
    /* style inject SSR */
    

    
    var QSelect$1 = normalizeComponent_1(
      {},
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      undefined,
      undefined
    );

  var QSelect$2 = {
      install: function (Vue) {
          Vue.use(plugin);
          Vue.component('QSelect', QSelect$1);
      }
  };

  Vue.use(QSelect$2);
  new Vue({
    el: '#app',
    render: h => h(App)
  });

}));
