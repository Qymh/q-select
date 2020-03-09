/**
 * @qymh/vue-q-select v0.4.10
 * (c) 2020 Qymh
 * @license MIT
 */
import VueCompositionApi, { createComponent, ref, onMounted, onBeforeUnmount, watch } from '@vue/composition-api';
import QSelect from '@qymh/q-select';

function assert(condition, msg) {
    if (process.env.NODE_ENV === 'development') {
        if (!condition) {
            return Boolean(console.error("[SelectQ]: " + msg));
        }
        else {
            return true;
        }
    }
    return true;
}

var Component = createComponent({
    setup: function (props, context) {
        var pending = ref(true);
        var uid = ref(0);
        var ins;
        onMounted(function () {
            ins = new QSelect({
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
                ready: function (value, key, data) {
                    pending.value = false;
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
                hide: function () { }
            });
        });
        onBeforeUnmount(function () {
            ins && ins.destroy();
        });
        var warnIns = function () {
            if (!ins) {
                return assert(false, 'You should new QSelect before you use it');
            }
            else {
                return true;
            }
        };
        var show = function () {
            if (warnIns()) {
                context.emit('input', true);
                return ins.show();
            }
        };
        var close = function () {
            if (warnIns()) {
                context.emit('input', false);
                return ins.close();
            }
        };
        var destroy = function () {
            if (warnIns()) {
                return ins.destroy();
            }
        };
        var setData = function (data, index) {
            if (warnIns()) {
                return ins.setData(data, index);
            }
            return '';
        };
        var setColumnData = function (column, data) {
            if (warnIns()) {
                return ins.setColumnData(column, data);
            }
            return '';
        };
        var scrollTo = function (column, index) {
            if (warnIns()) {
                return ins.scrollTo(column, index);
            }
            return '';
        };
        var setIndex = function (index) {
            if (warnIns()) {
                return ins.setIndex(index);
            }
            return '';
        };
        var setTitle = function (title) {
            if (warnIns()) {
                return ins.setTitle(title);
            }
        };
        var setValue = function (value) {
            if (warnIns()) {
                return ins.setValue(value);
            }
            return '';
        };
        var setKey = function (key) {
            if (warnIns()) {
                return ins.setKey(key);
            }
            return '';
        };
        var getData = function () {
            if (warnIns()) {
                return ins.getData();
            }
            return [];
        };
        var getIndex = function () {
            if (warnIns()) {
                return ins.getIndex();
            }
            return [];
        };
        var getValue = function () {
            if (warnIns()) {
                return ins.getValue();
            }
            return [];
        };
        var getKey = function () {
            if (warnIns()) {
                return ins.getKey();
            }
            return [];
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
        watch(function () { return props.defaultKey; }, function (val) {
            if (val && val.length) {
                if (pending.value) {
                    VueSlash.nextTick(function () {
                        ins.setKey(props.defaultKey);
                    });
                }
                else {
                    ins.setKey(props.defaultKey);
                }
            }
        });
        watch(function () { return props.defaultValue; }, function (val) {
            if (val && val.length) {
                if (pending.value) {
                    VueSlash.nextTick(function () {
                        ins.setValue(props.defaultValue);
                    });
                }
                else {
                    ins.setValue(props.defaultValue);
                }
            }
        });
        watch(function () { return props.visible; }, function (val) {
            if (val) {
                if (pending.value) {
                    VueSlash.nextTick(function () {
                        show();
                    });
                }
                else {
                    show();
                }
            }
            else {
                if (!pending.value) {
                    context.emit('hide');
                    close();
                }
            }
        });
        watch(function () { return props.loading; }, function (val) {
            if (val) {
                if (pending.value) ;
                else {
                    setLoading();
                }
            }
            else {
                if (!pending.value) {
                    cancelLoading();
                }
            }
        });
        watch(function () { return props.data; }, function (val) {
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
        watch(function () { return props.index; }, function (val) {
            setIndex(val);
        }, {
            lazy: true
        });
        watch(function () { return props.title; }, function (val) {
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
        },
        defaultKey: {
            type: Array,
            default: function () { return []; }
        },
        defaultValue: {
            type: Array,
            default: function () { return []; }
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
    render: function (h) {
        this.uid = this._uid;
        if (this.inline) {
            return h('div', { class: "q-select-inline--" + this._uid });
        }
        else {
            return h('');
        }
    }
});

var VueSlash;
var index = {
    install: function (Vue, options) {
        if (options === void 0) { options = {}; }
        VueSlash = Vue;
        Vue.use(VueCompositionApi);
        Vue.component(options.name || 'QSelect', Component);
    }
};

export default index;
export { VueSlash };
