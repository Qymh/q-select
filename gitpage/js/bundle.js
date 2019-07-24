(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

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
    function nextTick(fn) {
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
            nextTick(function () {
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
            this.dynamicData[weight] = __assign({}, dataTransLater[weight][this.dynamicIndex[weight]], { index: this.dynamicIndex[weight] });
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
        Layer.prototype.setLoading = function () {
            this.loading = true;
            var $loading = Dom.find("q-select-loading--" + this.id);
            Dom.addStyle($loading, [{ display: 'flex' }]);
            this.touchs
                .filter(function (v) { return !v.hidden; })
                .forEach(function (v) {
                v.shrinkSize();
            });
        };
        Layer.prototype.cancelLoading = function () {
            this.loading = false;
            var $loading = Dom.find("q-select-loading--" + this.id);
            Dom.addStyle($loading, { display: 'none' });
            this.touchs
                .filter(function (v) { return !v.hidden; })
                .forEach(function (v) {
                v.setSize();
            });
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
                    _this.diff(preTrans, _this.dataTrans, min, false, true, true);
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
                    this.setIndexAndData(this.dataTrans);
                    this.touchs.forEach(function (v, i) { return v.scrollTo(_this.realIndex[i]); });
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
        return QSelect;
    }(Layer));

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

    function unwrapExports (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

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

    var vconsole_min = createCommonjsModule(function (module, exports) {
    /*!
     * vConsole v3.3.2 (https://github.com/Tencent/vConsole)
     * 
     * Tencent is pleased to support the open source community by making vConsole available.
     * Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
     * Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at
     * http://opensource.org/licenses/MIT
     * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
     */
    !function(e,t){module.exports=t();}(window,function(){return function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}return o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n});},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0});},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=6)}([function(e,t,o){var n,r,i;r=[t],void 0===(i="function"==typeof(n=function(e){function t(e){return (t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e){return "[object Number]"==Object.prototype.toString.call(e)}function n(e){return "[object String]"==Object.prototype.toString.call(e)}function r(e){return "[object Array]"==Object.prototype.toString.call(e)}function i(e){return "[object Boolean]"==Object.prototype.toString.call(e)}function a(e){return void 0===e}function l(e){return null===e}function c(e){return "[object Symbol]"==Object.prototype.toString.call(e)}function s(e){return !("[object Object]"!=Object.prototype.toString.call(e)&&(o(e)||n(e)||i(e)||r(e)||l(e)||d(e)||a(e)||c(e)))}function d(e){return "[object Function]"==Object.prototype.toString.call(e)}function u(e){var t=Object.prototype.toString.call(e);return "[object global]"==t||"[object Window]"==t||"[object DOMWindow]"==t}function f(e){if(!s(e)&&!r(e))return [];if(r(e)){var t=[];return e.forEach(function(e,o){t.push(o);}),t}return Object.getOwnPropertyNames(e).sort()}Object.defineProperty(e,"__esModule",{value:!0}),e.getDate=function(e){var t=e>0?new Date(e):new Date,o=t.getDate()<10?"0"+t.getDate():t.getDate(),n=t.getMonth()<9?"0"+(t.getMonth()+1):t.getMonth()+1,r=t.getFullYear(),i=t.getHours()<10?"0"+t.getHours():t.getHours(),a=t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes(),l=t.getSeconds()<10?"0"+t.getSeconds():t.getSeconds(),c=t.getMilliseconds()<10?"0"+t.getMilliseconds():t.getMilliseconds();return c<100&&(c="0"+c),{time:+t,year:r,month:n,day:o,hour:i,minute:a,second:l,millisecond:c}},e.isNumber=o,e.isString=n,e.isArray=r,e.isBoolean=i,e.isUndefined=a,e.isNull=l,e.isSymbol=c,e.isObject=s,e.isFunction=d,e.isElement=function(e){return "object"===("undefined"==typeof HTMLElement?"undefined":t(HTMLElement))?e instanceof HTMLElement:e&&"object"===t(e)&&null!==e&&1===e.nodeType&&"string"==typeof e.nodeName},e.isWindow=u,e.isPlainObject=function(e){var o,n=Object.prototype.hasOwnProperty;if(!e||"object"!==t(e)||e.nodeType||u(e))return !1;try{if(e.constructor&&!n.call(e,"constructor")&&!n.call(e.constructor.prototype,"isPrototypeOf"))return !1}catch(e){return !1}for(o in e);return void 0===o||n.call(e,o)},e.htmlEncode=function(e){return document.createElement("a").appendChild(document.createTextNode(e)).parentNode.innerHTML},e.JSONStringify=function(e){if(!s(e)&&!r(e))return JSON.stringify(e);var t="{",o="}";r(e)&&(t="[",o="]");for(var n=t,i=f(e),a=0;a<i.length;a++){var l=i[a],u=e[l];try{r(e)||(s(l)||r(l)||c(l)?n+=Object.prototype.toString.call(l):n+=l,n+=": "),r(u)?n+="Array["+u.length+"]":s(u)||c(u)||d(u)?n+=Object.prototype.toString.call(u):n+=JSON.stringify(u),a<i.length-1&&(n+=", ");}catch(e){continue}}return n+=o},e.getObjAllKeys=f,e.getObjName=function(e){return Object.prototype.toString.call(e).replace("[object ","").replace("]","")},e.setStorage=function(e,t){window.localStorage&&(e="vConsole_"+e,localStorage.setItem(e,t));},e.getStorage=function(e){if(window.localStorage)return e="vConsole_"+e,localStorage.getItem(e)};})?n.apply(t,r):n)||(e.exports=i);},function(e,t,o){var n,r,i;r=[t,o(0),o(10)],void 0===(i="function"==typeof(n=function(o,n,r){var i;Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=(i=r)&&i.__esModule?i:{default:i};var a={one:function(e,t){try{return (t||document).querySelector(e)||void 0}catch(e){return}},all:function(e,t){try{var o=(t||document).querySelectorAll(e);return Array.from(o)}catch(e){return []}},addClass:function(e,t){if(e){(0, n.isArray)(e)||(e=[e]);for(var o=0;o<e.length;o++){var r=e[o].className||"",i=r.split(" ");i.indexOf(t)>-1||(i.push(t),e[o].className=i.join(" "));}}},removeClass:function(e,t){if(e){(0, n.isArray)(e)||(e=[e]);for(var o=0;o<e.length;o++){for(var r=e[o].className.split(" "),i=0;i<r.length;i++)r[i]==t&&(r[i]="");e[o].className=r.join(" ").trim();}}},hasClass:function(e,t){return !(!e||!e.classList)&&e.classList.contains(t)},bind:function(e,t,o,r){e&&((0, n.isArray)(e)||(e=[e]),e.forEach(function(e){e.addEventListener(t,o,!!r);}));},delegate:function(e,t,o,n){e&&e.addEventListener(t,function(t){var r=a.all(o,e);if(r)e:for(var i=0;i<r.length;i++)for(var l=t.target;l;){if(l==r[i]){n.call(l,t);break e}if((l=l.parentNode)==e)break}},!1);}};a.render=r.default;var l=a;o.default=l,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t,o){var n,r,i;r=[t],void 0===(i="function"==typeof(n=function(o){function n(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var r=function(){function e(t){var o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"newPlugin";!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.id=t,this.name=o,this.isReady=!1,this.eventList={};}return t=e,(o=[{key:"on",value:function(e,t){return this.eventList[e]=t,this}},{key:"trigger",value:function(e,t){if("function"==typeof this.eventList[e])this.eventList[e].call(this,t);else{var o="on"+e.charAt(0).toUpperCase()+e.slice(1);"function"==typeof this[o]&&this[o].call(this,t);}return this}},{key:"id",get:function(){return this._id},set:function(e){if(!e)throw"Plugin ID cannot be empty";this._id=e.toLowerCase();}},{key:"name",get:function(){return this._name},set:function(e){if(!e)throw"Plugin name cannot be empty";this._name=e;}},{key:"vConsole",get:function(){return this._vConsole||void 0},set:function(e){if(!e)throw"vConsole cannot be empty";this._vConsole=e;}}])&&n(t.prototype,o),e;var t,o;}();o.default=r,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t,o){e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var o=function(e,t){var o=e[1]||"",n=e[3];if(!n)return o;if(t&&"function"==typeof btoa){var r=(a=n,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */"),i=n.sources.map(function(e){return "/*# sourceURL="+n.sourceRoot+e+" */"});return [o].concat(i).concat([r]).join("\n")}var a;return [o].join("\n")}(t,e);return t[2]?"@media "+t[2]+"{"+o+"}":o}).join("")},t.i=function(e,o){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},r=0;r<this.length;r++){var i=this[r][0];null!=i&&(n[i]=!0);}for(r=0;r<e.length;r++){var a=e[r];null!=a[0]&&n[a[0]]||(o&&!a[2]?a[2]=o:o&&(a[2]="("+a[2]+") and ("+o+")"),t.push(a));}},t};},function(e,t,o){var n,r,i={},a=(n=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=n.apply(this,arguments)),r}),l=function(e){var t={};return function(e,o){if("function"==typeof e)return e();if(void 0===t[e]){var n=function(e,t){return t?t.querySelector(e):document.querySelector(e)}.call(this,e,o);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head;}catch(e){n=null;}t[e]=n;}return t[e]}}(),c=null,s=0,d=[],u=o(13);function f(e,t){for(var o=0;o<e.length;o++){var n=e[o],r=i[n.id];if(r){r.refs++;for(var a=0;a<r.parts.length;a++)r.parts[a](n.parts[a]);for(;a<n.parts.length;a++)r.parts.push(m(n.parts[a],t));}else{var l=[];for(a=0;a<n.parts.length;a++)l.push(m(n.parts[a],t));i[n.id]={id:n.id,refs:1,parts:l};}}}function v(e,t){for(var o=[],n={},r=0;r<e.length;r++){var i=e[r],a=t.base?i[0]+t.base:i[0],l={css:i[1],media:i[2],sourceMap:i[3]};n[a]?n[a].parts.push(l):o.push(n[a]={id:a,parts:[l]});}return o}function p(e,t){var o=l(e.insertInto);if(!o)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var n=d[d.length-1];if("top"===e.insertAt)n?n.nextSibling?o.insertBefore(t,n.nextSibling):o.appendChild(t):o.insertBefore(t,o.firstChild),d.push(t);else if("bottom"===e.insertAt)o.appendChild(t);else{if("object"!=typeof e.insertAt||!e.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var r=l(e.insertAt.before,o);o.insertBefore(t,r);}}function b(e){if(null===e.parentNode)return !1;e.parentNode.removeChild(e);var t=d.indexOf(e);t>=0&&d.splice(t,1);}function h(e){var t=document.createElement("style");if(void 0===e.attrs.type&&(e.attrs.type="text/css"),void 0===e.attrs.nonce){var n=function(){return o.nc}();n&&(e.attrs.nonce=n);}return g(t,e.attrs),p(e,t),t}function g(e,t){Object.keys(t).forEach(function(o){e.setAttribute(o,t[o]);});}function m(e,t){var o,n,r,i;if(t.transform&&e.css){if(!(i="function"==typeof t.transform?t.transform(e.css):t.transform.default(e.css)))return function(){};e.css=i;}if(t.singleton){var a=s++;o=c||(c=h(t)),n=w.bind(null,o,a,!1),r=w.bind(null,o,a,!0);}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(o=function(e){var t=document.createElement("link");return void 0===e.attrs.type&&(e.attrs.type="text/css"),e.attrs.rel="stylesheet",g(t,e.attrs),p(e,t),t}(t),n=function(e,t,o){var n=o.css,r=o.sourceMap,i=void 0===t.convertToAbsoluteUrls&&r;(t.convertToAbsoluteUrls||i)&&(n=u(n));r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var a=new Blob([n],{type:"text/css"}),l=e.href;e.href=URL.createObjectURL(a),l&&URL.revokeObjectURL(l);}.bind(null,o,t),r=function(){b(o),o.href&&URL.revokeObjectURL(o.href);}):(o=h(t),n=function(e,t){var o=t.css,n=t.media;n&&e.setAttribute("media",n);if(e.styleSheet)e.styleSheet.cssText=o;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(o));}}.bind(null,o),r=function(){b(o);});return n(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;n(e=t);}else r();}}e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(t=t||{}).attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||"boolean"==typeof t.singleton||(t.singleton=a()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var o=v(e,t);return f(o,t),function(e){for(var n=[],r=0;r<o.length;r++){var a=o[r];(l=i[a.id]).refs--,n.push(l);}e&&f(v(e,t),t);for(r=0;r<n.length;r++){var l;if(0===(l=n[r]).refs){for(var c=0;c<l.parts.length;c++)l.parts[c]();delete i[l.id];}}}};var y,_=(y=[],function(e,t){return y[e]=t,y.filter(Boolean).join("\n")});function w(e,t,o,n){var r=o?"":n.css;if(e.styleSheet)e.styleSheet.cssText=_(t,r);else{var i=document.createTextNode(r),a=e.childNodes;a[t]&&e.removeChild(a[t]),a.length?e.insertBefore(i,a[t]):e.appendChild(i);}}},function(e,t,o){var n,r,i;r=[t,o(0),o(1),o(2),o(20),o(21),o(22)],void 0===(i="function"==typeof(n=function(o,n,r,i,a,l,c){function s(e){return e&&e.__esModule?e:{default:e}}function d(e){return (d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function f(e,t){return !t||"object"!==d(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function v(e){return (v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e,t){return (p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,n=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,o):{};n.get||n.set?Object.defineProperty(t,o,n):t[o]=e[o];}return t.default=e,t}(n),r=s(r),i=s(i),a=s(a),l=s(l),c=s(c);var b=1e3,h=[],g={},m=function(e){function t(){var e,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var n=arguments.length,r=new Array(n),i=0;i<n;i++)r[i]=arguments[i];return o=f(this,(e=v(t)).call.apply(e,[this].concat(r))),h.push(o.id),o.tplTabbox="",o.allowUnformattedLog=!0,o.isReady=!1,o.isShow=!1,o.$tabbox=null,o.console={},o.logList=[],o.isInBottom=!0,o.maxLogNumber=b,o.logNumber=0,o.mockConsole(),o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t);}(t,e),o=t,(i=[{key:"onInit",value:function(){this.$tabbox=r.default.render(this.tplTabbox,{}),this.updateMaxLogNumber();}},{key:"onRenderTab",value:function(e){e(this.$tabbox);}},{key:"onAddTopBar",value:function(e){for(var t=this,o=["All","Log","Info","Warn","Error"],n=[],i=0;i<o.length;i++)n.push({name:o[i],data:{type:o[i].toLowerCase()},className:"",onClick:function(){if(r.default.hasClass(this,"vc-actived"))return !1;t.showLogType(this.dataset.type||"all");}});n[0].className="vc-actived",e(n);}},{key:"onAddTool",value:function(e){var t=this,o=[{name:"Clear",global:!1,onClick:function(){t.clearLog(),t.vConsole.triggerEvent("clearLog");}}];e(o);}},{key:"onReady",value:function(){var e=this;e.isReady=!0;var t=r.default.all(".vc-subtab",e.$tabbox);r.default.bind(t,"click",function(o){if(o.preventDefault(),r.default.hasClass(this,"vc-actived"))return !1;r.default.removeClass(t,"vc-actived"),r.default.addClass(this,"vc-actived");var n=this.dataset.type,i=r.default.one(".vc-log",e.$tabbox);r.default.removeClass(i,"vc-log-partly-log"),r.default.removeClass(i,"vc-log-partly-info"),r.default.removeClass(i,"vc-log-partly-warn"),r.default.removeClass(i,"vc-log-partly-error"),"all"==n?r.default.removeClass(i,"vc-log-partly"):(r.default.addClass(i,"vc-log-partly"),r.default.addClass(i,"vc-log-partly-"+n));});var o=r.default.one(".vc-content");r.default.bind(o,"scroll",function(t){e.isShow&&(o.scrollTop+o.offsetHeight>=o.scrollHeight?e.isInBottom=!0:e.isInBottom=!1);});for(var n=0;n<e.logList.length;n++)e.printLog(e.logList[n]);e.logList=[];}},{key:"onRemove",value:function(){window.console.log=this.console.log,window.console.info=this.console.info,window.console.warn=this.console.warn,window.console.debug=this.console.debug,window.console.error=this.console.error,window.console.time=this.console.time,window.console.timeEnd=this.console.timeEnd,window.console.clear=this.console.clear,this.console={};var e=h.indexOf(this.id);e>-1&&h.splice(e,1);}},{key:"onShow",value:function(){this.isShow=!0,1==this.isInBottom&&this.autoScrollToBottom();}},{key:"onHide",value:function(){this.isShow=!1;}},{key:"onShowConsole",value:function(){1==this.isInBottom&&this.autoScrollToBottom();}},{key:"onUpdateOption",value:function(){this.vConsole.option.maxLogNumber!=this.maxLogNumber&&(this.updateMaxLogNumber(),this.limitMaxLogs());}},{key:"updateMaxLogNumber",value:function(){this.maxLogNumber=this.vConsole.option.maxLogNumber||b,this.maxLogNumber=Math.max(1,this.maxLogNumber);}},{key:"limitMaxLogs",value:function(){if(this.isReady)for(;this.logNumber>this.maxLogNumber;){var e=r.default.one(".vc-item",this.$tabbox);if(!e)break;e.parentNode.removeChild(e),this.logNumber--;}}},{key:"showLogType",value:function(e){var t=r.default.one(".vc-log",this.$tabbox);r.default.removeClass(t,"vc-log-partly-log"),r.default.removeClass(t,"vc-log-partly-info"),r.default.removeClass(t,"vc-log-partly-warn"),r.default.removeClass(t,"vc-log-partly-error"),"all"==e?r.default.removeClass(t,"vc-log-partly"):(r.default.addClass(t,"vc-log-partly"),r.default.addClass(t,"vc-log-partly-"+e));}},{key:"autoScrollToBottom",value:function(){this.vConsole.option.disableLogScrolling||this.scrollToBottom();}},{key:"scrollToBottom",value:function(){var e=r.default.one(".vc-content");e&&(e.scrollTop=e.scrollHeight-e.offsetHeight);}},{key:"mockConsole",value:function(){var e=this,t=this,o=["log","info","warn","debug","error"];window.console?(o.map(function(e){t.console[e]=window.console[e];}),t.console.time=window.console.time,t.console.timeEnd=window.console.timeEnd,t.console.clear=window.console.clear):window.console={},o.map(function(t){window.console[t]=function(){for(var o=arguments.length,n=new Array(o),r=0;r<o;r++)n[r]=arguments[r];e.printLog({logType:t,logs:n});};});var n={};window.console.time=function(e){n[e]=Date.now();},window.console.timeEnd=function(e){var t=n[e];t?(console.log(e+":",Date.now()-t+"ms"),delete n[e]):console.log(e+": 0ms");},window.console.clear=function(){t.clearLog();for(var e=arguments.length,o=new Array(e),n=0;n<e;n++)o[n]=arguments[n];t.console.clear.apply(window.console,o);};}},{key:"clearLog",value:function(){r.default.one(".vc-log",this.$tabbox).innerHTML="",this.logNumber=0,g={};}},{key:"printOriginLog",value:function(e){"function"==typeof this.console[e.logType]&&this.console[e.logType].apply(window.console,e.logs);}},{key:"printLog",value:function(e){var t=e.logs||[];if(t.length||e.content){t=[].slice.call(t||[]);var o=/^\[(\w+)\]$/i,r="",i=!1;if(n.isString(t[0])){var a=t[0].match(o);null!==a&&a.length>0&&(r=a[1].toLowerCase(),i=h.indexOf(r)>-1);}if(r===this.id||!0!==i&&"default"===this.id)if(e._id||(e._id="__vc_"+Math.random().toString(36).substring(2,8)),e.date||(e.date=+new Date),this.isReady){n.isString(t[0])&&i&&(t[0]=t[0].replace(o,""),""===t[0]&&t.shift());for(var l={_id:e._id,logType:e.logType,logText:[],hasContent:!!e.content,count:1},c=0;c<t.length;c++)n.isFunction(t[c])?l.logText.push(t[c].toString()):n.isObject(t[c])||n.isArray(t[c])?l.logText.push(n.JSONStringify(t[c])):l.logText.push(t[c]);l.logText=l.logText.join(" "),l.hasContent||g.logType!==l.logType||g.logText!==l.logText?(this.printNewLog(e,t),g=l):this.printRepeatLog(),this.isInBottom&&this.isShow&&this.autoScrollToBottom(),e.noOrigin||this.printOriginLog(e);}else this.logList.push(e);else e.noOrigin||this.printOriginLog(e);}}},{key:"printRepeatLog",value:function(){var e=r.default.one("#"+g._id),t=r.default.one(".vc-item-repeat",e);t||((t=document.createElement("i")).className="vc-item-repeat",e.insertBefore(t,e.lastChild)),g.count,g.count++,t.innerHTML=g.count;}},{key:"printNewLog",value:function(e,t){for(var o=r.default.render(a.default,{_id:e._id,logType:e.logType,style:e.style||""}),i=r.default.one(".vc-item-content",o),l=0;l<t.length;l++){var c=void 0;try{if(""===t[l])continue;c=n.isFunction(t[l])?"<span> "+t[l].toString()+"</span>":n.isObject(t[l])||n.isArray(t[l])?this.getFoldedLine(t[l]):"<span> "+n.htmlEncode(t[l]).replace(/\n/g,"<br/>")+"</span>";}catch(e){c="<span> ["+d(t[l])+"]</span>";}c&&("string"==typeof c?i.insertAdjacentHTML("beforeend",c):i.insertAdjacentElement("beforeend",c));}n.isObject(e.content)&&i.insertAdjacentElement("beforeend",e.content),r.default.one(".vc-log",this.$tabbox).insertAdjacentElement("beforeend",o),this.logNumber++,this.limitMaxLogs();}},{key:"getFoldedLine",value:function(e,t){var o=this;if(!t){var i=n.JSONStringify(e),a=i.substr(0,36);t=n.getObjName(e),i.length>36&&(a+="..."),t+=" "+a;}var s=r.default.render(l.default,{outer:t,lineType:"obj"});return r.default.bind(r.default.one(".vc-fold-outer",s),"click",function(t){t.preventDefault(),t.stopPropagation(),r.default.hasClass(s,"vc-toggle")?(r.default.removeClass(s,"vc-toggle"),r.default.removeClass(r.default.one(".vc-fold-inner",s),"vc-toggle"),r.default.removeClass(r.default.one(".vc-fold-outer",s),"vc-toggle")):(r.default.addClass(s,"vc-toggle"),r.default.addClass(r.default.one(".vc-fold-inner",s),"vc-toggle"),r.default.addClass(r.default.one(".vc-fold-outer",s),"vc-toggle"));var i=r.default.one(".vc-fold-inner",s);return setTimeout(function(){if(0==i.children.length&&e){for(var t=n.getObjAllKeys(e),a=0;a<t.length;a++){var s=void 0,d="undefined",u="";try{s=e[t[a]];}catch(e){continue}n.isString(s)?(d="string",s='"'+s+'"'):n.isNumber(s)?d="number":n.isBoolean(s)?d="boolean":n.isNull(s)?(d="null",s="null"):n.isUndefined(s)?(d="undefined",s="undefined"):n.isFunction(s)?(d="function",s="function()"):n.isSymbol(s)&&(d="symbol");var f=void 0;if(n.isArray(s)){var v=n.getObjName(s)+"["+s.length+"]";f=o.getFoldedLine(s,r.default.render(c.default,{key:t[a],keyType:u,value:v,valueType:"array"},!0));}else if(n.isObject(s)){var p=n.getObjName(s);f=o.getFoldedLine(s,r.default.render(c.default,{key:n.htmlEncode(t[a]),keyType:u,value:p,valueType:"object"},!0));}else{e.hasOwnProperty&&!e.hasOwnProperty(t[a])&&(u="private");var b={lineType:"kv",key:n.htmlEncode(t[a]),keyType:u,value:n.htmlEncode(s),valueType:d};f=r.default.render(l.default,b);}i.insertAdjacentElement("beforeend",f);}if(n.isObject(e)){var h,g=e.__proto__;h=n.isObject(g)?o.getFoldedLine(g,r.default.render(c.default,{key:"__proto__",keyType:"private",value:n.getObjName(g),valueType:"object"},!0)):r.default.render(c.default,{key:"__proto__",keyType:"private",value:"null",valueType:"null"}),i.insertAdjacentElement("beforeend",h);}}}),!1}),s}}])&&u(o.prototype,i),t;var o,i;}(i.default);m.AddedLogID=[];var y=m;o.default=y,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t,o){var n,r,i;r=[t,o(7),o(8),o(2)],void 0===(i="function"==typeof(n=function(o,n,r,i){function a(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=a(r),i=a(i),r.default.VConsolePlugin=i.default;var l=r.default;o.default=l,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t,o){var n,r,i;r=[],void 0===(i="function"==typeof(n=function(){if("undefined"==typeof Symbol){window.Symbol=function(){};var e="__symbol_iterator_key";window.Symbol.iterator=e,Array.prototype[e]=function(){var e=this,t=0;return {next:function(){return {done:e.length===t,value:e.length===t?void 0:e[t++]}}}};}})?n.apply(t,r):n)||(e.exports=i);},function(e,t,o){var n,r,i;r=[t,o(9),o(0),o(1),o(11),o(14),o(15),o(16),o(17),o(18),o(19),o(25),o(27),o(31),o(38)],void 0===(i="function"==typeof(n=function(o,n,r,i,a,l,c,s,d,u,f,v,p,b,h){function g(e){return e&&e.__esModule?e:{default:e}}function m(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,n=g(n),r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,o):{};n.get||n.set?Object.defineProperty(t,o,n):t[o]=e[o];}return t.default=e,t}(r),i=g(i),l=g(l),c=g(c),s=g(s),d=g(d),u=g(u),f=g(f),v=g(v),p=g(p),b=g(b),h=g(h);var y="#__vconsole",_=function(){function e(t){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),i.default.one(y))console.debug("vConsole is already exists.");else{var o=this;if(this.version=n.default.version,this.$dom=null,this.isInited=!1,this.option={defaultPlugins:["system","network","element","storage"]},this.activedTab="",this.tabList=[],this.pluginList={},this.switchPos={x:10,y:10,startX:0,startY:0,endX:0,endY:0},this.tool=r,this.$=i.default,r.isObject(t))for(var a in t)this.option[a]=t[a];this._addBuiltInPlugins();var l,c=function(){o.isInited||(o._render(),o._mockTap(),o._bindEvent(),o._autoRun());};if(void 0!==document)"complete"==document.readyState?c():i.default.bind(window,"load",c);else l=setTimeout(function e(){document&&"complete"==document.readyState?(l&&clearTimeout(l),c()):l=setTimeout(e,1);},1);}}return t=e,(o=[{key:"_addBuiltInPlugins",value:function(){this.addPlugin(new f.default("default","Log"));var e=this.option.defaultPlugins,t={system:{proto:v.default,name:"System"},network:{proto:p.default,name:"Network"},element:{proto:b.default,name:"Element"},storage:{proto:h.default,name:"Storage"}};if(e&&r.isArray(e))for(var o=0;o<e.length;o++){var n=t[e[o]];n?this.addPlugin(new n.proto(e[o],n.name)):console.debug("Unrecognized default plugin ID:",e[o]);}}},{key:"_render",value:function(){if(!i.default.one(y)){var e=document.createElement("div");e.innerHTML=l.default,document.documentElement.insertAdjacentElement("beforeend",e.children[0]);}this.$dom=i.default.one(y);var t=i.default.one(".vc-switch",this.$dom),o=1*r.getStorage("switch_x"),n=1*r.getStorage("switch_y");(o||n)&&(o+t.offsetWidth>document.documentElement.offsetWidth&&(o=document.documentElement.offsetWidth-t.offsetWidth),n+t.offsetHeight>document.documentElement.offsetHeight&&(n=document.documentElement.offsetHeight-t.offsetHeight),o<0&&(o=0),n<0&&(n=0),this.switchPos.x=o,this.switchPos.y=n,i.default.one(".vc-switch").style.right=o+"px",i.default.one(".vc-switch").style.bottom=n+"px");var a=window.devicePixelRatio||1,c=document.querySelector('[name="viewport"]');if(c&&c.content){var s=c.content.match(/initial\-scale\=\d+(\.\d+)?/),d=s?parseFloat(s[0].split("=")[1]):1;d<1&&(this.$dom.style.fontSize=13*a+"px");}i.default.one(".vc-mask",this.$dom).style.display="none";}},{key:"_mockTap",value:function(){var e,t,o,n=!1,r=null;this.$dom.addEventListener("touchstart",function(n){if(void 0===e){var i=n.targetTouches[0];t=i.pageX,o=i.pageY,e=n.timeStamp,r=n.target.nodeType===Node.TEXT_NODE?n.target.parentNode:n.target;}},!1),this.$dom.addEventListener("touchmove",function(e){var r=e.changedTouches[0];(Math.abs(r.pageX-t)>10||Math.abs(r.pageY-o)>10)&&(n=!0);}),this.$dom.addEventListener("touchend",function(t){if(!1===n&&t.timeStamp-e<700&&null!=r){var o=r.tagName.toLowerCase(),i=!1;switch(o){case"textarea":i=!0;break;case"input":switch(r.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":i=!1;break;default:i=!r.disabled&&!r.readOnly;}}i?r.focus():t.preventDefault();var a=t.changedTouches[0],l=document.createEvent("MouseEvents");l.initMouseEvent("click",!0,!0,window,1,a.screenX,a.screenY,a.clientX,a.clientY,!1,!1,!1,!1,0,null),l.forwardedTouchEvent=!0,l.initEvent("click",!0,!0),r.dispatchEvent(l);}e=void 0,n=!1,r=null;},!1);}},{key:"_bindEvent",value:function(){var e=this,t=i.default.one(".vc-switch",e.$dom);i.default.bind(t,"touchstart",function(t){e.switchPos.startX=t.touches[0].pageX,e.switchPos.startY=t.touches[0].pageY;}),i.default.bind(t,"touchend",function(t){e.switchPos.x=e.switchPos.endX,e.switchPos.y=e.switchPos.endY,e.switchPos.startX=0,e.switchPos.startY=0,r.setStorage("switch_x",e.switchPos.x),r.setStorage("switch_y",e.switchPos.y);}),i.default.bind(t,"touchmove",function(o){if(o.touches.length>0){var n=o.touches[0].pageX-e.switchPos.startX,r=o.touches[0].pageY-e.switchPos.startY,i=e.switchPos.x-n,a=e.switchPos.y-r;i+t.offsetWidth>document.documentElement.offsetWidth&&(i=document.documentElement.offsetWidth-t.offsetWidth),a+t.offsetHeight>document.documentElement.offsetHeight&&(a=document.documentElement.offsetHeight-t.offsetHeight),i<0&&(i=0),a<0&&(a=0),t.style.right=i+"px",t.style.bottom=a+"px",e.switchPos.endX=i,e.switchPos.endY=a,o.preventDefault();}}),i.default.bind(i.default.one(".vc-switch",e.$dom),"click",function(){e.show();}),i.default.bind(i.default.one(".vc-hide",e.$dom),"click",function(){e.hide();}),i.default.bind(i.default.one(".vc-mask",e.$dom),"click",function(t){if(t.target!=i.default.one(".vc-mask"))return !1;e.hide();}),i.default.delegate(i.default.one(".vc-tabbar",e.$dom),"click",".vc-tab",function(t){var o=this.dataset.tab;o!=e.activedTab&&e.showTab(o);}),i.default.bind(i.default.one(".vc-panel",e.$dom),"transitionend webkitTransitionEnd oTransitionEnd otransitionend",function(t){if(t.target!=i.default.one(".vc-panel"))return !1;i.default.hasClass(e.$dom,"vc-toggle")||(t.target.style.display="none");});var o=i.default.one(".vc-content",e.$dom),n=!1;i.default.bind(o,"touchstart",function(e){var t=o.scrollTop,r=o.scrollHeight,a=t+o.offsetHeight;0===t?(o.scrollTop=1,0===o.scrollTop&&(i.default.hasClass(e.target,"vc-cmd-input")||(n=!0))):a===r&&(o.scrollTop=t-1,o.scrollTop===t&&(i.default.hasClass(e.target,"vc-cmd-input")||(n=!0)));}),i.default.bind(o,"touchmove",function(e){n&&e.preventDefault();}),i.default.bind(o,"touchend",function(e){n=!1;});}},{key:"_autoRun",value:function(){for(var e in this.isInited=!0,this.pluginList)this._initPlugin(this.pluginList[e]);this.tabList.length>0&&this.showTab(this.tabList[0]),this.triggerEvent("ready");}},{key:"triggerEvent",value:function(e,t){e="on"+e.charAt(0).toUpperCase()+e.slice(1),r.isFunction(this.option[e])&&this.option[e].apply(this,t);}},{key:"_initPlugin",value:function(e){var t=this;e.vConsole=this,e.trigger("init"),e.trigger("renderTab",function(o){t.tabList.push(e.id);var n=i.default.render(c.default,{id:e.id,name:e.name});i.default.one(".vc-tabbar",t.$dom).insertAdjacentElement("beforeend",n);var a=i.default.render(s.default,{id:e.id});o&&(r.isString(o)?a.innerHTML+=o:r.isFunction(o.appendTo)?o.appendTo(a):r.isElement(o)&&a.insertAdjacentElement("beforeend",o)),i.default.one(".vc-content",t.$dom).insertAdjacentElement("beforeend",a);}),e.trigger("addTopBar",function(o){if(o)for(var n=i.default.one(".vc-topbar",t.$dom),a=function(t){var a=o[t],l=i.default.render(d.default,{name:a.name||"Undefined",className:a.className||"",pluginID:e.id});if(a.data)for(var c in a.data)l.dataset[c]=a.data[c];r.isFunction(a.onClick)&&i.default.bind(l,"click",function(t){var o=a.onClick.call(l);!1===o||(i.default.removeClass(i.default.all(".vc-topbar-"+e.id),"vc-actived"),i.default.addClass(l,"vc-actived"));}),n.insertAdjacentElement("beforeend",l);},l=0;l<o.length;l++)a(l);}),e.trigger("addTool",function(o){if(o)for(var n=i.default.one(".vc-tool-last",t.$dom),a=function(t){var a=o[t],l=i.default.render(u.default,{name:a.name||"Undefined",pluginID:e.id});1==a.global&&i.default.addClass(l,"vc-global-tool"),r.isFunction(a.onClick)&&i.default.bind(l,"click",function(e){a.onClick.call(l);}),n.parentNode.insertBefore(l,n);},l=0;l<o.length;l++)a(l);}),e.isReady=!0,e.trigger("ready");}},{key:"_triggerPluginsEvent",value:function(e){for(var t in this.pluginList)this.pluginList[t].isReady&&this.pluginList[t].trigger(e);}},{key:"_triggerPluginEvent",value:function(e,t){var o=this.pluginList[e];o&&o.isReady&&o.trigger(t);}},{key:"addPlugin",value:function(e){return void 0!==this.pluginList[e.id]?(console.debug("Plugin "+e.id+" has already been added."),!1):(this.pluginList[e.id]=e,this.isInited&&(this._initPlugin(e),1==this.tabList.length&&this.showTab(this.tabList[0])),!0)}},{key:"removePlugin",value:function(e){e=(e+"").toLowerCase();var t=this.pluginList[e];if(void 0===t)return console.debug("Plugin "+e+" does not exist."),!1;if(t.trigger("remove"),this.isInited){var o=i.default.one("#__vc_tab_"+e);o&&o.parentNode.removeChild(o);for(var n=i.default.all(".vc-topbar-"+e,this.$dom),r=0;r<n.length;r++)n[r].parentNode.removeChild(n[r]);var a=i.default.one("#__vc_log_"+e);a&&a.parentNode.removeChild(a);for(var l=i.default.all(".vc-tool-"+e,this.$dom),c=0;c<l.length;c++)l[c].parentNode.removeChild(l[c]);}var s=this.tabList.indexOf(e);s>-1&&this.tabList.splice(s,1);try{delete this.pluginList[e];}catch(t){this.pluginList[e]=void 0;}return this.activedTab==e&&this.tabList.length>0&&this.showTab(this.tabList[0]),!0}},{key:"show",value:function(){if(this.isInited){var e=this,t=i.default.one(".vc-panel",this.$dom);t.style.display="block",setTimeout(function(){i.default.addClass(e.$dom,"vc-toggle"),e._triggerPluginsEvent("showConsole");var t=i.default.one(".vc-mask",e.$dom);t.style.display="block";},10);}}},{key:"hide",value:function(){if(this.isInited){i.default.removeClass(this.$dom,"vc-toggle"),this._triggerPluginsEvent("hideConsole");var e=i.default.one(".vc-mask",this.$dom),t=i.default.one(".vc-panel",this.$dom);i.default.bind(e,"transitionend",function(o){e.style.display="none",t.style.display="none";});}}},{key:"showSwitch",value:function(){if(this.isInited){var e=i.default.one(".vc-switch",this.$dom);e.style.display="block";}}},{key:"hideSwitch",value:function(){if(this.isInited){var e=i.default.one(".vc-switch",this.$dom);e.style.display="none";}}},{key:"showTab",value:function(e){if(this.isInited){var t=i.default.one("#__vc_log_"+e);i.default.removeClass(i.default.all(".vc-tab",this.$dom),"vc-actived"),i.default.addClass(i.default.one("#__vc_tab_"+e),"vc-actived"),i.default.removeClass(i.default.all(".vc-logbox",this.$dom),"vc-actived"),i.default.addClass(t,"vc-actived");var o=i.default.all(".vc-topbar-"+e,this.$dom);i.default.removeClass(i.default.all(".vc-toptab",this.$dom),"vc-toggle"),i.default.addClass(o,"vc-toggle"),o.length>0?i.default.addClass(i.default.one(".vc-content",this.$dom),"vc-has-topbar"):i.default.removeClass(i.default.one(".vc-content",this.$dom),"vc-has-topbar"),i.default.removeClass(i.default.all(".vc-tool",this.$dom),"vc-toggle"),i.default.addClass(i.default.all(".vc-tool-"+e,this.$dom),"vc-toggle"),this.activedTab&&this._triggerPluginEvent(this.activedTab,"hide"),this.activedTab=e,this._triggerPluginEvent(this.activedTab,"show");}}},{key:"setOption",value:function(e,t){if(r.isString(e))this.option[e]=t,this._triggerPluginsEvent("updateOption");else if(r.isObject(e)){for(var o in e)this.option[o]=e[o];this._triggerPluginsEvent("updateOption");}else console.debug("The first parameter of vConsole.setOption() must be a string or an object.");}},{key:"destroy",value:function(){if(this.isInited){for(var e=Object.keys(this.pluginList),t=e.length-1;t>=0;t--)this.removePlugin(e[t]);this.$dom.parentNode.removeChild(this.$dom),this.isInited=!1;}}}])&&m(t.prototype,o),e;var t,o;}();o.default=_,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e){e.exports={name:"vconsole",version:"3.3.2",description:"A lightweight, extendable front-end developer tool for mobile web page.",homepage:"https://github.com/Tencent/vConsole",main:"dist/vconsole.min.js",typings:"./index.d.ts",scripts:{test:"mocha",dist:"webpack"},keywords:["console","debug","mobile"],repository:{type:"git",url:"git+https://github.com/Tencent/vConsole.git"},dependencies:{},devDependencies:{"@babel/core":"^7.2.2","@babel/plugin-proposal-class-properties":"^7.3.0","@babel/plugin-proposal-export-namespace-from":"^7.2.0","@babel/plugin-proposal-object-rest-spread":"^7.3.1","@babel/preset-env":"^7.3.1","babel-loader":"^8.0.4","babel-plugin-add-module-exports":"^1.0.0",chai:"^4.2.0","copy-webpack-plugin":"^5.0.3","css-loader":"^2.1.0","html-loader":"^0.5.5",jsdom:"^13.2.0","json-loader":"^0.5.7",less:"^3.9.0","less-loader":"^4.1.0",mocha:"^5.2.0","style-loader":"^0.23.1",webpack:"^4.29.0","webpack-cli":"^3.2.1"},author:"Tencent",license:"MIT"};},function(e,t,o){var n,r,i;r=[t],void 0===(i="function"==typeof(n=function(o){Object.defineProperty(o,"__esModule",{value:!0}),o.default=function(e,t,o){var n=/\{\{([^\}]+)\}\}/g,r="",i="",a=0,l=[],c=function(e,t){""!==e&&(t?e.match(/^ ?else/g)?r+="} "+e+" {\n":e.match(/\/(if|for|switch)/g)?r+="}\n":e.match(/^ ?if|for|switch/g)?r+=e+" {\n":e.match(/^ ?(break|continue) ?$/g)?r+=e+";\n":e.match(/^ ?(case|default)/g)?r+=e+":\n":r+="arr.push("+e+");\n":r+='arr.push("'+e.replace(/"/g,'\\"')+'");\n');};for(window.__mito_data=t,window.__mito_code="",window.__mito_result="",e=(e=e.replace(/(\{\{ ?switch(.+?)\}\})[\r\n\t ]+\{\{/g,"$1{{")).replace(/^[\r\n]/,"").replace(/\n/g,"\\\n").replace(/\r/g,"\\\r"),i="(function(){\n",r="var arr = [];\n";l=n.exec(e);)c(e.slice(a,l.index),!1),c(l[1],!0),a=l.index+l[0].length;c(e.substr(a,e.length-a),!1),i+=r="with (__mito_data) {\n"+(r+='__mito_result = arr.join("");')+"\n}",i+="})();";var s=document.getElementsByTagName("script"),d="";s.length>0&&(d=s[0].nonce||"");var u=document.createElement("SCRIPT");u.innerHTML=i,u.setAttribute("nonce",d),document.documentElement.appendChild(u);var f=__mito_result;if(document.documentElement.removeChild(u),!o){var v=document.createElement("DIV");v.innerHTML=f,f=v.children[0];}return f},e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t,o){var n=o(12);"string"==typeof n&&(n=[[e.i,n,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};o(4)(n,r);n.locals&&(e.exports=n.locals);},function(e,t,o){(e.exports=o(3)(!1)).push([e.i,'#__vconsole {\n  color: #000;\n  font-size: 13px;\n  font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\n  /* global */\n  /* compoment */\n}\n#__vconsole .vc-max-height {\n  max-height: 19.23076923em;\n}\n#__vconsole .vc-max-height-line {\n  max-height: 3.38461538em;\n}\n#__vconsole .vc-min-height {\n  min-height: 3.07692308em;\n}\n#__vconsole dd,\n#__vconsole dl,\n#__vconsole pre {\n  margin: 0;\n}\n#__vconsole .vc-switch {\n  display: block;\n  position: fixed;\n  right: 0.76923077em;\n  bottom: 0.76923077em;\n  color: #FFF;\n  background-color: #04BE02;\n  line-height: 1;\n  font-size: 1.07692308em;\n  padding: 0.61538462em 1.23076923em;\n  z-index: 10000;\n  border-radius: 0.30769231em;\n  box-shadow: 0 0 0.61538462em rgba(0, 0, 0, 0.4);\n}\n#__vconsole .vc-mask {\n  display: none;\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0, 0, 0, 0);\n  z-index: 10001;\n  transition: background 0.3s;\n  -webkit-tap-highlight-color: transparent;\n  overflow-y: scroll;\n}\n#__vconsole .vc-panel {\n  display: none;\n  position: fixed;\n  min-height: 85%;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 10002;\n  background-color: #EFEFF4;\n  -webkit-transition: -webkit-transform 0.3s;\n  transition: -webkit-transform 0.3s;\n  transition: transform 0.3s;\n  transition: transform 0.3s, -webkit-transform 0.3s;\n  -webkit-transform: translate(0, 100%);\n  transform: translate(0, 100%);\n}\n#__vconsole .vc-tabbar {\n  border-bottom: 1px solid #D9D9D9;\n  overflow-x: auto;\n  height: 3em;\n  width: auto;\n  white-space: nowrap;\n}\n#__vconsole .vc-tabbar .vc-tab {\n  display: inline-block;\n  line-height: 3em;\n  padding: 0 1.15384615em;\n  border-right: 1px solid #D9D9D9;\n  text-decoration: none;\n  color: #000;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n#__vconsole .vc-tabbar .vc-tab:active {\n  background-color: rgba(0, 0, 0, 0.15);\n}\n#__vconsole .vc-tabbar .vc-tab.vc-actived {\n  background-color: #FFF;\n}\n#__vconsole .vc-content {\n  background-color: #FFF;\n  overflow-x: hidden;\n  overflow-y: auto;\n  position: absolute;\n  top: 3.07692308em;\n  left: 0;\n  right: 0;\n  bottom: 3.07692308em;\n  -webkit-overflow-scrolling: touch;\n  margin-bottom: constant(safe-area-inset-bottom);\n  margin-bottom: env(safe-area-inset-bottom);\n}\n#__vconsole .vc-content.vc-has-topbar {\n  top: 5.46153846em;\n}\n#__vconsole .vc-topbar {\n  background-color: #FBF9FE;\n  display: flex;\n  display: -webkit-box;\n  flex-direction: row;\n  flex-wrap: wrap;\n  -webkit-box-direction: row;\n  -webkit-flex-wrap: wrap;\n  width: 100%;\n}\n#__vconsole .vc-topbar .vc-toptab {\n  display: none;\n  flex: 1;\n  -webkit-box-flex: 1;\n  line-height: 2.30769231em;\n  padding: 0 1.15384615em;\n  border-bottom: 1px solid #D9D9D9;\n  text-decoration: none;\n  text-align: center;\n  color: #000;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n#__vconsole .vc-topbar .vc-toptab.vc-toggle {\n  display: block;\n}\n#__vconsole .vc-topbar .vc-toptab:active {\n  background-color: rgba(0, 0, 0, 0.15);\n}\n#__vconsole .vc-topbar .vc-toptab.vc-actived {\n  border-bottom: 1px solid #3e82f7;\n}\n#__vconsole .vc-logbox {\n  display: none;\n  position: relative;\n  min-height: 100%;\n}\n#__vconsole .vc-logbox i {\n  font-style: normal;\n}\n#__vconsole .vc-logbox .vc-log {\n  padding-bottom: 3em;\n  -webkit-tap-highlight-color: transparent;\n}\n#__vconsole .vc-logbox .vc-log:empty:before {\n  content: "Empty";\n  color: #999;\n  position: absolute;\n  top: 45%;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  font-size: 1.15384615em;\n  text-align: center;\n}\n#__vconsole .vc-logbox .vc-item {\n  margin: 0;\n  padding: 0.46153846em 0.61538462em;\n  overflow: hidden;\n  line-height: 1.3;\n  border-bottom: 1px solid #EEE;\n  word-break: break-word;\n}\n#__vconsole .vc-logbox .vc-item-info {\n  color: #6A5ACD;\n}\n#__vconsole .vc-logbox .vc-item-debug {\n  color: #DAA520;\n}\n#__vconsole .vc-logbox .vc-item-warn {\n  color: #FFA500;\n  border-color: #FFB930;\n  background-color: #FFFACD;\n}\n#__vconsole .vc-logbox .vc-item-error {\n  color: #DC143C;\n  border-color: #F4A0AB;\n  background-color: #FFE4E1;\n}\n#__vconsole .vc-logbox .vc-log.vc-log-partly .vc-item {\n  display: none;\n}\n#__vconsole .vc-logbox .vc-log.vc-log-partly-log .vc-item-log,\n#__vconsole .vc-logbox .vc-log.vc-log-partly-info .vc-item-info,\n#__vconsole .vc-logbox .vc-log.vc-log-partly-warn .vc-item-warn,\n#__vconsole .vc-logbox .vc-log.vc-log-partly-error .vc-item-error {\n  display: block;\n}\n#__vconsole .vc-logbox .vc-item .vc-item-content {\n  margin-right: 4.61538462em;\n  display: inline-block;\n}\n#__vconsole .vc-logbox .vc-item .vc-item-repeat {\n  display: inline-block;\n  margin-right: 0.30769231em;\n  padding: 0 6.5px;\n  color: #D7E0EF;\n  background-color: #42597F;\n  border-radius: 8.66666667px;\n}\n#__vconsole .vc-logbox .vc-item.vc-item-error .vc-item-repeat {\n  color: #901818;\n  background-color: #DC2727;\n}\n#__vconsole .vc-logbox .vc-item.vc-item-warn .vc-item-repeat {\n  color: #987D20;\n  background-color: #F4BD02;\n}\n#__vconsole .vc-logbox .vc-item .vc-item-code {\n  display: block;\n  white-space: pre-wrap;\n  overflow: auto;\n  position: relative;\n}\n#__vconsole .vc-logbox .vc-item .vc-item-code.vc-item-code-input,\n#__vconsole .vc-logbox .vc-item .vc-item-code.vc-item-code-output {\n  padding-left: 0.92307692em;\n}\n#__vconsole .vc-logbox .vc-item .vc-item-code.vc-item-code-input:before,\n#__vconsole .vc-logbox .vc-item .vc-item-code.vc-item-code-output:before {\n  content: "›";\n  position: absolute;\n  top: -0.23076923em;\n  left: 0;\n  font-size: 1.23076923em;\n  color: #6A5ACD;\n}\n#__vconsole .vc-logbox .vc-item .vc-item-code.vc-item-code-output:before {\n  content: "‹";\n}\n#__vconsole .vc-logbox .vc-item .vc-fold {\n  display: block;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n}\n#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-outer {\n  display: block;\n  font-style: italic;\n  padding-left: 0.76923077em;\n  position: relative;\n}\n#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-outer:active {\n  background-color: #E6E6E6;\n}\n#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-outer:before {\n  content: "";\n  position: absolute;\n  top: 0.30769231em;\n  left: 0.15384615em;\n  width: 0;\n  height: 0;\n  border: transparent solid 0.30769231em;\n  border-left-color: #000;\n}\n#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-outer.vc-toggle:before {\n  top: 0.46153846em;\n  left: 0;\n  border-top-color: #000;\n  border-left-color: transparent;\n}\n#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-inner {\n  display: none;\n  margin-left: 0.76923077em;\n}\n#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-inner.vc-toggle {\n  display: block;\n}\n#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-inner .vc-code-key {\n  margin-left: 0.76923077em;\n}\n#__vconsole .vc-logbox .vc-item .vc-fold .vc-fold-outer .vc-code-key {\n  margin-left: 0;\n}\n#__vconsole .vc-logbox .vc-code-key {\n  color: #905;\n}\n#__vconsole .vc-logbox .vc-code-private-key {\n  color: #D391B5;\n}\n#__vconsole .vc-logbox .vc-code-function {\n  color: #905;\n  font-style: italic;\n}\n#__vconsole .vc-logbox .vc-code-number,\n#__vconsole .vc-logbox .vc-code-boolean {\n  color: #0086B3;\n}\n#__vconsole .vc-logbox .vc-code-string {\n  color: #183691;\n}\n#__vconsole .vc-logbox .vc-code-null,\n#__vconsole .vc-logbox .vc-code-undefined {\n  color: #666;\n}\n#__vconsole .vc-logbox .vc-cmd {\n  position: absolute;\n  height: 3.07692308em;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  border-top: 1px solid #D9D9D9;\n  display: block!important;\n}\n#__vconsole .vc-logbox .vc-cmd .vc-cmd-input-wrap {\n  display: block;\n  height: 2.15384615em;\n  margin-right: 3.07692308em;\n  padding: 0.46153846em 0.61538462em;\n}\n#__vconsole .vc-logbox .vc-cmd .vc-cmd-input {\n  width: 100%;\n  border: none;\n  resize: none;\n  outline: none;\n  padding: 0;\n  font-size: 0.92307692em;\n}\n#__vconsole .vc-logbox .vc-cmd .vc-cmd-input::-webkit-input-placeholder {\n  line-height: 2.15384615em;\n}\n#__vconsole .vc-logbox .vc-cmd .vc-cmd-btn {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 3.07692308em;\n  border: none;\n  background-color: #EFEFF4;\n  outline: none;\n  -webkit-touch-callout: none;\n  font-size: 1em;\n}\n#__vconsole .vc-logbox .vc-cmd .vc-cmd-btn:active {\n  background-color: rgba(0, 0, 0, 0.15);\n}\n#__vconsole .vc-logbox .vc-cmd .vc-cmd-prompted {\n  position: fixed;\n  width: 100%;\n  background-color: #FBF9FE;\n  border: 1px solid #D9D9D9;\n  overflow-x: scroll;\n  display: none;\n}\n#__vconsole .vc-logbox .vc-cmd .vc-cmd-prompted li {\n  list-style: none;\n  line-height: 30px;\n  padding: 0 0.46153846em;\n  border-bottom: 1px solid #D9D9D9;\n}\n#__vconsole .vc-logbox .vc-group .vc-group-preview {\n  -webkit-touch-callout: none;\n}\n#__vconsole .vc-logbox .vc-group .vc-group-preview:active {\n  background-color: #E6E6E6;\n}\n#__vconsole .vc-logbox .vc-group .vc-group-detail {\n  display: none;\n  padding: 0 0 0.76923077em 1.53846154em;\n  border-bottom: 1px solid #EEE;\n}\n#__vconsole .vc-logbox .vc-group.vc-actived .vc-group-detail {\n  display: block;\n  background-color: #FBF9FE;\n}\n#__vconsole .vc-logbox .vc-group.vc-actived .vc-table-row {\n  background-color: #FFF;\n}\n#__vconsole .vc-logbox .vc-group.vc-actived .vc-group-preview {\n  background-color: #FBF9FE;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-row {\n  display: flex;\n  display: -webkit-flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  -webkit-box-direction: row;\n  -webkit-flex-wrap: wrap;\n  overflow: hidden;\n  border-bottom: 1px solid #EEE;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-row.vc-left-border {\n  border-left: 1px solid #EEE;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-col {\n  flex: 1;\n  -webkit-box-flex: 1;\n  padding: 0.23076923em 0.30769231em;\n  border-left: 1px solid #EEE;\n  overflow: auto;\n  white-space: pre-wrap;\n  word-break: break-word;\n  /*white-space: nowrap;\n        text-overflow: ellipsis;*/\n  -webkit-overflow-scrolling: touch;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-col:first-child {\n  border: none;\n}\n#__vconsole .vc-logbox .vc-table .vc-small .vc-table-col {\n  padding: 0 0.30769231em;\n  font-size: 0.92307692em;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-col-2 {\n  flex: 2;\n  -webkit-box-flex: 2;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-col-3 {\n  flex: 3;\n  -webkit-box-flex: 3;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-col-4 {\n  flex: 4;\n  -webkit-box-flex: 4;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-col-5 {\n  flex: 5;\n  -webkit-box-flex: 5;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-col-6 {\n  flex: 6;\n  -webkit-box-flex: 6;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-row-error {\n  border-color: #F4A0AB;\n  background-color: #FFE4E1;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-row-error .vc-table-col {\n  color: #DC143C;\n  border-color: #F4A0AB;\n}\n#__vconsole .vc-logbox .vc-table .vc-table-col-title {\n  font-weight: bold;\n}\n#__vconsole .vc-logbox.vc-actived {\n  display: block;\n}\n#__vconsole .vc-toolbar {\n  border-top: 1px solid #D9D9D9;\n  line-height: 3em;\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  display: flex;\n  display: -webkit-box;\n  flex-direction: row;\n  -webkit-box-direction: row;\n}\n#__vconsole .vc-toolbar .vc-tool {\n  display: none;\n  text-decoration: none;\n  color: #000;\n  width: 50%;\n  flex: 1;\n  -webkit-box-flex: 1;\n  text-align: center;\n  position: relative;\n  -webkit-touch-callout: none;\n}\n#__vconsole .vc-toolbar .vc-tool.vc-toggle,\n#__vconsole .vc-toolbar .vc-tool.vc-global-tool {\n  display: block;\n}\n#__vconsole .vc-toolbar .vc-tool:active {\n  background-color: rgba(0, 0, 0, 0.15);\n}\n#__vconsole .vc-toolbar .vc-tool:after {\n  content: " ";\n  position: absolute;\n  top: 0.53846154em;\n  bottom: 0.53846154em;\n  right: 0;\n  border-left: 1px solid #D9D9D9;\n}\n#__vconsole .vc-toolbar .vc-tool-last:after {\n  border: none;\n}\n@supports (bottom: constant(safe-area-inset-bottom)) or (bottom: env(safe-area-inset-bottom)) {\n  #__vconsole .vc-toolbar,\n  #__vconsole .vc-switch {\n    bottom: constant(safe-area-inset-bottom);\n    bottom: env(safe-area-inset-bottom);\n  }\n}\n#__vconsole.vc-toggle .vc-switch {\n  display: none;\n}\n#__vconsole.vc-toggle .vc-mask {\n  background: rgba(0, 0, 0, 0.6);\n  display: block;\n}\n#__vconsole.vc-toggle .vc-panel {\n  -webkit-transform: translate(0, 0);\n  transform: translate(0, 0);\n}\n',""]);},function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var o=t.protocol+"//"+t.host,n=o+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var r,i=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});return /^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)?e:(r=0===i.indexOf("//")?i:0===i.indexOf("/")?o+i:n+i.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")})};},function(e,t){e.exports='<div id="__vconsole" class="">\n  <div class="vc-switch">vConsole</div>\n  <div class="vc-mask">\n  </div>\n  <div class="vc-panel">\n    <div class="vc-tabbar">\n    </div>\n    <div class="vc-topbar">\n    </div>\n    <div class="vc-content">\n    </div>\n    <div class="vc-toolbar">\n      <a class="vc-tool vc-global-tool vc-tool-last vc-hide">Hide</a>\n    </div>\n  </div>\n</div>';},function(e,t){e.exports='<a class="vc-tab" data-tab="{{id}}" id="__vc_tab_{{id}}">{{name}}</a>';},function(e,t){e.exports='<div class="vc-logbox" id="__vc_log_{{id}}">\n  \n</div>';},function(e,t){e.exports='<a class="vc-toptab vc-topbar-{{pluginID}}{{if (className)}} {{className}}{{/if}}">{{name}}</a>';},function(e,t){e.exports='<a class="vc-tool vc-tool-{{pluginID}}">{{name}}</a>';},function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__,factory;factory=function(_exports,_query,tool,_log,_tabbox_default,_item_code){function _interopRequireWildcard(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,o):{};n.get||n.set?Object.defineProperty(t,o,n):t[o]=e[o];}return t.default=e,t}function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _typeof(e){return (_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function _createClass(e,t,o){return t&&_defineProperties(e.prototype,t),o&&_defineProperties(e,o),e}function _possibleConstructorReturn(e,t){return !t||"object"!==_typeof(t)&&"function"!=typeof t?_assertThisInitialized(e):t}function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _get(e,t,o){return (_get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,o){var n=_superPropBase(e,t);if(n){var r=Object.getOwnPropertyDescriptor(n,t);return r.get?r.get.call(o):r.value}})(e,t,o||e)}function _superPropBase(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=_getPrototypeOf(e)););return e}function _getPrototypeOf(e){return (_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_setPrototypeOf(e,t);}function _setPrototypeOf(e,t){return (_setPrototypeOf=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(_exports,"__esModule",{value:!0}),_exports.default=void 0,_query=_interopRequireDefault(_query),tool=_interopRequireWildcard(tool),_log=_interopRequireDefault(_log),_tabbox_default=_interopRequireDefault(_tabbox_default),_item_code=_interopRequireDefault(_item_code);var VConsoleDefaultTab=function(_VConsoleLogTab){function VConsoleDefaultTab(){var e,t;_classCallCheck(this,VConsoleDefaultTab);for(var o=arguments.length,n=new Array(o),r=0;r<o;r++)n[r]=arguments[r];return (t=_possibleConstructorReturn(this,(e=_getPrototypeOf(VConsoleDefaultTab)).call.apply(e,[this].concat(n)))).tplTabbox=_tabbox_default.default,t}return _inherits(VConsoleDefaultTab,_VConsoleLogTab),_createClass(VConsoleDefaultTab,[{key:"onReady",value:function onReady(){var that=this;_get(_getPrototypeOf(VConsoleDefaultTab.prototype),"onReady",this).call(this),window.winKeys=Object.getOwnPropertyNames(window).sort(),window.keyTypes={};for(var i=0;i<winKeys.length;i++)keyTypes[winKeys[i]]=_typeof(window[winKeys[i]]);var cacheObj={},ID_REGEX=/[a-zA-Z_0-9\$\-\u00A2-\uFFFF]/,retrievePrecedingIdentifier=function(e,t,o){o=o||ID_REGEX;for(var n=[],r=t-1;r>=0&&o.test(e[r]);r--)n.push(e[r]);if(0==n.length){o=/\./;for(var i=t-1;i>=0&&o.test(e[i]);i--)n.push(e[i]);}if(0===n.length){var a=e.match(/[\(\)\[\]\{\}]/gi)||[];return a[a.length-1]}return n.reverse().join("")};_query.default.bind(_query.default.one(".vc-cmd-input"),"keyup",function(e){var isDeleteKeyCode=8===e.keyCode||46===e.keyCode,$prompted=_query.default.one(".vc-cmd-prompted");$prompted.style.display="none",$prompted.innerHTML="";var tempValue=this.value,value=retrievePrecedingIdentifier(this.value,this.value.length);if(value&&value.length>0){if(/\(/.test(value)&&!isDeleteKeyCode)return void(_query.default.one(".vc-cmd-input").value+=")");if(/\[/.test(value)&&!isDeleteKeyCode)return void(_query.default.one(".vc-cmd-input").value+="]");if(/\{/.test(value)&&!isDeleteKeyCode)return void(_query.default.one(".vc-cmd-input").value+="}");if("."===value){var key=retrievePrecedingIdentifier(tempValue,tempValue.length-1);if(!cacheObj[key])try{cacheObj[key]=Object.getOwnPropertyNames(eval("("+key+")")).sort();}catch(e){}try{for(var _i3=0;_i3<cacheObj[key].length;_i3++){var $li=document.createElement("li"),_key=cacheObj[key][_i3];$li.innerHTML=_key,$li.onclick=function(){_query.default.one(".vc-cmd-input").value="",_query.default.one(".vc-cmd-input").value=tempValue+this.innerHTML,$prompted.style.display="none";},$prompted.appendChild($li);}}catch(e){}}else if("."!==value.substring(value.length-1)&&value.indexOf(".")<0){for(var _i4=0;_i4<winKeys.length;_i4++)if(winKeys[_i4].toLowerCase().indexOf(value.toLowerCase())>=0){var _$li=document.createElement("li");_$li.innerHTML=winKeys[_i4],_$li.onclick=function(){_query.default.one(".vc-cmd-input").value="",_query.default.one(".vc-cmd-input").value=this.innerHTML,"function"==keyTypes[this.innerHTML]&&(_query.default.one(".vc-cmd-input").value+="()"),$prompted.style.display="none";},$prompted.appendChild(_$li);}}else{var arr=value.split(".");if(cacheObj[arr[0]]){cacheObj[arr[0]].sort();for(var _i5=0;_i5<cacheObj[arr[0]].length;_i5++){var _$li2=document.createElement("li"),_key3=cacheObj[arr[0]][_i5];_key3.indexOf(arr[1])>=0&&(_$li2.innerHTML=_key3,_$li2.onclick=function(){_query.default.one(".vc-cmd-input").value="",_query.default.one(".vc-cmd-input").value=tempValue+this.innerHTML,$prompted.style.display="none";},$prompted.appendChild(_$li2));}}}if($prompted.children.length>0){var m=Math.min(200,31*$prompted.children.length);$prompted.style.display="block",$prompted.style.height=m+"px",$prompted.style.marginTop=-m+"px";}}else $prompted.style.display="none";}),_query.default.bind(_query.default.one(".vc-cmd",this.$tabbox),"submit",function(e){e.preventDefault();var t=_query.default.one(".vc-cmd-input",e.target),o=t.value;t.value="",""!==o&&that.evalCommand(o);var n=_query.default.one(".vc-cmd-prompted");n&&(n.style.display="none");});var code="";code+="if (!!window) {",code+="window.__vConsole_cmd_result = undefined;",code+="window.__vConsole_cmd_error = false;",code+="}";var scriptList=document.getElementsByTagName("script"),nonce="";scriptList.length>0&&(nonce=scriptList[0].nonce||"");var script=document.createElement("SCRIPT");script.innerHTML=code,script.setAttribute("nonce",nonce),document.documentElement.appendChild(script),document.documentElement.removeChild(script);}},{key:"mockConsole",value:function(){_get(_getPrototypeOf(VConsoleDefaultTab.prototype),"mockConsole",this).call(this);var e=this;tool.isFunction(window.onerror)&&(this.windowOnError=window.onerror),window.onerror=function(t,o,n,r,i){var a=t;o&&(a+="\n"+o.replace(location.origin,"")),(n||r)&&(a+=":"+n+":"+r);var l=!!i&&!!i.stack&&i.stack.toString()||"";e.printLog({logType:"error",logs:[a,l],noOrigin:!0}),tool.isFunction(e.windowOnError)&&e.windowOnError.call(window,t,o,n,r,i);};}},{key:"evalCommand",value:function(e){this.printLog({logType:"log",content:_query.default.render(_item_code.default,{content:e,type:"input"}),style:""});var t,o=void 0;try{o=eval.call(window,"("+e+")");}catch(t){try{o=eval.call(window,e);}catch(e){}}tool.isArray(o)||tool.isObject(o)?t=this.getFoldedLine(o):(tool.isNull(o)?o="null":tool.isUndefined(o)?o="undefined":tool.isFunction(o)?o="function()":tool.isString(o)&&(o='"'+o+'"'),t=_query.default.render(_item_code.default,{content:o,type:"output"})),this.printLog({logType:"log",content:t,style:""}),window.winKeys=Object.getOwnPropertyNames(window).sort();}}]),VConsoleDefaultTab}(_log.default),_default=VConsoleDefaultTab;_exports.default=_default,module.exports=exports.default;},__WEBPACK_AMD_DEFINE_ARRAY__=[exports,__webpack_require__(1),__webpack_require__(0),__webpack_require__(5),__webpack_require__(23),__webpack_require__(24)],void 0===(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=factory)?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__);},function(e,t){e.exports='<div id="{{_id}}" class="vc-item vc-item-{{logType}} {{style}}">\n\t<div class="vc-item-content"></div>\n</div>';},function(e,t){e.exports='<div class="vc-fold">\n  {{if (lineType == \'obj\')}}\n    <i class="vc-fold-outer">{{outer}}</i>\n    <div class="vc-fold-inner"></div>\n  {{else if (lineType == \'value\')}}\n    <i class="vc-code-{{valueType}}">{{value}}</i>\n  {{else if (lineType == \'kv\')}}\n    <i class="vc-code-key{{if (keyType)}} vc-code-{{keyType}}-key{{/if}}">{{key}}</i>: <i class="vc-code-{{valueType}}">{{value}}</i>\n  {{/if}}\n</div>';},function(e,t){e.exports='<span>\n  <i class="vc-code-key{{if (keyType)}} vc-code-{{keyType}}-key{{/if}}">{{key}}</i>: <i class="vc-code-{{valueType}}">{{value}}</i>\n</span>';},function(e,t){e.exports='<div>\n  <div class="vc-log"></div>\n  <form class="vc-cmd">\n    <button class="vc-cmd-btn" type="submit">OK</button>\n    <ul class=\'vc-cmd-prompted\'></ul>\n    <div class="vc-cmd-input-wrap">\n      <textarea class="vc-cmd-input" placeholder="command..."></textarea>\n    </div>\n  </form>\n</div>';},function(e,t){e.exports='<pre class="vc-item-code vc-item-code-{{type}}">{{content}}</pre>';},function(e,t,o){var n,r,i;r=[t,o(5),o(26)],void 0===(i="function"==typeof(n=function(o,n,r){function i(e){return e&&e.__esModule?e:{default:e}}function a(e){return (a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function c(e,t){return !t||"object"!==a(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function s(e,t,o){return (s="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,o){var n=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=d(e)););return e}(e,t);if(n){var r=Object.getOwnPropertyDescriptor(n,t);return r.get?r.get.call(o):r.value}})(e,t,o||e)}function d(e){return (d=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,t){return (u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,n=i(n),r=i(r);var f=function(e){function t(){var e,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var n=arguments.length,i=new Array(n),a=0;a<n;a++)i[a]=arguments[a];return (o=c(this,(e=d(t)).call.apply(e,[this].concat(i)))).tplTabbox=r.default,o.allowUnformattedLog=!1,o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t);}(t,e),o=t,(n=[{key:"onInit",value:function(){s(d(t.prototype),"onInit",this).call(this),this.printSystemInfo();}},{key:"printSystemInfo",value:function(){var e=navigator.userAgent,t="",o=e.match(/(ipod).*\s([\d_]+)/i),n=e.match(/(ipad).*\s([\d_]+)/i),r=e.match(/(iphone)\sos\s([\d_]+)/i),i=e.match(/(android)\s([\d\.]+)/i);t="Unknown",i?t="Android "+i[2]:r?t="iPhone, iOS "+r[2].replace(/_/g,"."):n?t="iPad, iOS "+n[2].replace(/_/g,"."):o&&(t="iPod, iOS "+o[2].replace(/_/g,"."));var a=t,l=e.match(/MicroMessenger\/([\d\.]+)/i);t="Unknown",l&&l[1]?(t=l[1],a+=", WeChat "+t,console.info("[system]","System:",a)):console.info("[system]","System:",a),t="Unknown",t="https:"==location.protocol?"HTTPS":"http:"==location.protocol?"HTTP":location.protocol.replace(":",""),a=t;var c=e.toLowerCase().match(/ nettype\/([^ ]+)/g);t="Unknown",c&&c[0]?(c=c[0].split("/"),t=c[1],a+=", "+t,console.info("[system]","Network:",a)):console.info("[system]","Protocol:",a),console.info("[system]","UA:",e),setTimeout(function(){var e=window.performance||window.msPerformance||window.webkitPerformance;if(e&&e.timing){var t=e.timing;t.navigationStart&&console.info("[system]","navigationStart:",t.navigationStart),t.navigationStart&&t.domainLookupStart&&console.info("[system]","navigation:",t.domainLookupStart-t.navigationStart+"ms"),t.domainLookupEnd&&t.domainLookupStart&&console.info("[system]","dns:",t.domainLookupEnd-t.domainLookupStart+"ms"),t.connectEnd&&t.connectStart&&(t.connectEnd&&t.secureConnectionStart?console.info("[system]","tcp (ssl):",t.connectEnd-t.connectStart+"ms ("+(t.connectEnd-t.secureConnectionStart)+"ms)"):console.info("[system]","tcp:",t.connectEnd-t.connectStart+"ms")),t.responseStart&&t.requestStart&&console.info("[system]","request:",t.responseStart-t.requestStart+"ms"),t.responseEnd&&t.responseStart&&console.info("[system]","response:",t.responseEnd-t.responseStart+"ms"),t.domComplete&&t.domLoading&&(t.domContentLoadedEventStart&&t.domLoading?console.info("[system]","domComplete (domLoaded):",t.domComplete-t.domLoading+"ms ("+(t.domContentLoadedEventStart-t.domLoading)+"ms)"):console.info("[system]","domComplete:",t.domComplete-t.domLoading+"ms")),t.loadEventEnd&&t.loadEventStart&&console.info("[system]","loadEvent:",t.loadEventEnd-t.loadEventStart+"ms"),t.navigationStart&&t.loadEventEnd&&console.info("[system]","total (DOM):",t.loadEventEnd-t.navigationStart+"ms ("+(t.domComplete-t.navigationStart)+"ms)");}},0);}}])&&l(o.prototype,n),t;var o,n;}(n.default);o.default=f,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t){e.exports='<div>\n  <div class="vc-log"></div>\n</div>';},function(e,t,o){var n,r,i;r=[t,o(1),o(0),o(2),o(28),o(29),o(30)],void 0===(i="function"==typeof(n=function(o,n,r,i,a,l,c){function s(e){return e&&e.__esModule?e:{default:e}}function d(e){return (d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function f(e,t){return !t||"object"!==d(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function v(e){return (v=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function p(e,t){return (p=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,n=s(n),r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,o):{};n.get||n.set?Object.defineProperty(t,o,n):t[o]=e[o];}return t.default=e,t}(r),i=s(i),a=s(a),l=s(l),c=s(c);var b=function(e){function t(){var e,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var r=arguments.length,i=new Array(r),l=0;l<r;l++)i[l]=arguments[l];return (o=f(this,(e=v(t)).call.apply(e,[this].concat(i)))).$tabbox=n.default.render(a.default,{}),o.$header=null,o.reqList={},o.domList={},o.isReady=!1,o.isShow=!1,o.isInBottom=!0,o._open=void 0,o._send=void 0,o.mockAjax(),o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&p(e,t);}(t,e),o=t,(i=[{key:"onRenderTab",value:function(e){e(this.$tabbox);}},{key:"onAddTool",value:function(e){var t=this,o=[{name:"Clear",global:!1,onClick:function(e){t.clearLog();}}];e(o);}},{key:"onReady",value:function(){var e=this;e.isReady=!0,this.renderHeader(),n.default.delegate(n.default.one(".vc-log",this.$tabbox),"click",".vc-group-preview",function(t){var o=this.dataset.reqid,r=this.parentNode;n.default.hasClass(r,"vc-actived")?(n.default.removeClass(r,"vc-actived"),e.updateRequest(o,{actived:!1})):(n.default.addClass(r,"vc-actived"),e.updateRequest(o,{actived:!0})),t.preventDefault();});var t=n.default.one(".vc-content");for(var o in n.default.bind(t,"scroll",function(o){e.isShow&&(t.scrollTop+t.offsetHeight>=t.scrollHeight?e.isInBottom=!0:e.isInBottom=!1);}),e.reqList)e.updateRequest(o,{});}},{key:"onRemove",value:function(){window.XMLHttpRequest&&(window.XMLHttpRequest.prototype.open=this._open,window.XMLHttpRequest.prototype.send=this._send,this._open=void 0,this._send=void 0);}},{key:"onShow",value:function(){this.isShow=!0,1==this.isInBottom&&this.scrollToBottom();}},{key:"onHide",value:function(){this.isShow=!1;}},{key:"onShowConsole",value:function(){1==this.isInBottom&&this.scrollToBottom();}},{key:"scrollToBottom",value:function(){var e=n.default.one(".vc-content");e.scrollTop=e.scrollHeight-e.offsetHeight;}},{key:"clearLog",value:function(){for(var e in this.reqList={},this.domList)this.domList[e].remove(),this.domList[e]=void 0;this.domList={},this.renderHeader();}},{key:"renderHeader",value:function(){var e=Object.keys(this.reqList).length,t=n.default.render(l.default,{count:e}),o=n.default.one(".vc-log",this.$tabbox);this.$header?this.$header.parentNode.replaceChild(t,this.$header):o.parentNode.insertBefore(t,o),this.$header=t;}},{key:"updateRequest",value:function(e,t){var o=Object.keys(this.reqList).length,i=this.reqList[e]||{};for(var a in t)i[a]=t[a];if(this.reqList[e]=i,this.isReady){var l={id:e,url:i.url,status:i.status,method:i.method||"-",costTime:i.costTime>0?i.costTime+"ms":"-",header:i.header||null,getData:i.getData||null,postData:i.postData||null,response:null,actived:!!i.actived};switch(i.responseType){case"":case"text":if(r.isString(i.response))try{l.response=JSON.parse(i.response),l.response=JSON.stringify(l.response,null,1),l.response=r.htmlEncode(l.response);}catch(e){l.response=r.htmlEncode(i.response);}else void 0!==i.response&&(l.response=Object.prototype.toString.call(i.response));break;case"json":void 0!==i.response&&(l.response=JSON.stringify(i.response,null,1),l.response=r.htmlEncode(l.response));break;case"blob":case"document":case"arraybuffer":default:void 0!==i.response&&(l.response=Object.prototype.toString.call(i.response));}0==i.readyState||1==i.readyState?l.status="Pending":2==i.readyState||3==i.readyState?l.status="Loading":4==i.readyState||(l.status="Unknown");var s=n.default.render(c.default,l),d=this.domList[e];i.status>=400&&n.default.addClass(n.default.one(".vc-group-preview",s),"vc-table-row-error"),d?d.parentNode.replaceChild(s,d):n.default.one(".vc-log",this.$tabbox).insertAdjacentElement("beforeend",s),this.domList[e]=s;var u=Object.keys(this.reqList).length;u!=o&&this.renderHeader(),this.isInBottom&&this.scrollToBottom();}}},{key:"mockAjax",value:function(){var e=window.XMLHttpRequest;if(e){var t=this,o=window.XMLHttpRequest.prototype.open,n=window.XMLHttpRequest.prototype.send;t._open=o,t._send=n,window.XMLHttpRequest.prototype.open=function(){var e=this,n=[].slice.call(arguments),r=n[0],i=n[1],a=t.getUniqueID(),l=null;e._requestID=a,e._method=r,e._url=i;var c=e.onreadystatechange||function(){},s=function(){var o=t.reqList[a]||{};if(o.readyState=e.readyState,o.status=0,e.readyState>1&&(o.status=e.status),o.responseType=e.responseType,0==e.readyState)o.startTime||(o.startTime=+new Date);else if(1==e.readyState)o.startTime||(o.startTime=+new Date);else if(2==e.readyState){o.header={};for(var n=e.getAllResponseHeaders()||"",r=n.split("\n"),i=0;i<r.length;i++){var s=r[i];if(s){var d=s.split(": "),u=d[0],f=d.slice(1).join(": ");o.header[u]=f;}}}else 3==e.readyState||(4==e.readyState?(clearInterval(l),o.endTime=+new Date,o.costTime=o.endTime-(o.startTime||o.endTime),o.response=e.response):clearInterval(l));return e._noVConsole||t.updateRequest(a,o),c.apply(e,arguments)};e.onreadystatechange=s;var d=-1;return l=setInterval(function(){d!=e.readyState&&(d=e.readyState,s.call(e));},10),o.apply(e,n)},window.XMLHttpRequest.prototype.send=function(){var e=[].slice.call(arguments),o=e[0],i=t.reqList[this._requestID]||{};i.method=this._method.toUpperCase();var a=this._url.split("?");if(i.url=a.shift(),a.length>0){i.getData={},a=(a=a.join("?")).split("&");var l=!0,c=!1,s=void 0;try{for(var d,u=a[Symbol.iterator]();!(l=(d=u.next()).done);l=!0){var f=d.value;f=f.split("="),i.getData[f[0]]=decodeURIComponent(f[1]);}}catch(e){c=!0,s=e;}finally{try{l||null==u.return||u.return();}finally{if(c)throw s}}}if("POST"==i.method)if(r.isString(o)){var v=o.split("&");i.postData={};var p=!0,b=!1,h=void 0;try{for(var g,m=v[Symbol.iterator]();!(p=(g=m.next()).done);p=!0){var y=g.value;y=y.split("="),i.postData[y[0]]=y[1];}}catch(e){b=!0,h=e;}finally{try{p||null==m.return||m.return();}finally{if(b)throw h}}}else r.isPlainObject(o)&&(i.postData=o);return this._noVConsole||t.updateRequest(this._requestID,i),n.apply(this,e)};}}},{key:"getUniqueID",value:function(){var e="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0,o="x"==e?t:3&t|8;return o.toString(16)});return e}}])&&u(o.prototype,i),t;var o,i;}(i.default);o.default=b,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t){e.exports='<div class="vc-table">\n  <div class="vc-log"></div>\n</div>';},function(e,t){e.exports='<dl class="vc-table-row">\n  <dd class="vc-table-col vc-table-col-4">Name {{if (count > 0)}}({{count}}){{/if}}</dd>\n  <dd class="vc-table-col">Method</dd>\n  <dd class="vc-table-col">Status</dd>\n  <dd class="vc-table-col">Time</dd>\n</dl>';},function(e,t){e.exports='<div class="vc-group {{actived ? \'vc-actived\' : \'\'}}">\n  <dl class="vc-table-row vc-group-preview" data-reqid="{{id}}">\n    <dd class="vc-table-col vc-table-col-4">{{url}}</dd>\n    <dd class="vc-table-col">{{method}}</dd>\n    <dd class="vc-table-col">{{status}}</dd>\n    <dd class="vc-table-col">{{costTime}}</dd>\n  </dl>\n  <div class="vc-group-detail">\n    {{if (header !== null)}}\n    <div>\n      <dl class="vc-table-row vc-left-border">\n        <dt class="vc-table-col vc-table-col-title">Headers</dt>\n      </dl>\n      {{for (var key in header)}}\n      <div class="vc-table-row vc-left-border vc-small">\n        <div class="vc-table-col vc-table-col-2">{{key}}</div>\n        <div class="vc-table-col vc-table-col-4 vc-max-height-line">{{header[key]}}</div>\n      </div>\n      {{/for}}\n    </div>\n    {{/if}}\n    {{if (getData !== null)}}\n    <div>\n      <dl class="vc-table-row vc-left-border">\n        <dt class="vc-table-col vc-table-col-title">Query String Parameters</dt>\n      </dl>\n      {{for (var key in getData)}}\n      <div class="vc-table-row vc-left-border vc-small">\n        <div class="vc-table-col vc-table-col-2">{{key}}</div>\n        <div class="vc-table-col vc-table-col-4 vc-max-height-line">{{getData[key]}}</div>\n      </div>\n      {{/for}}\n    </div>\n    {{/if}}\n    {{if (postData !== null)}}\n    <div>\n      <dl class="vc-table-row vc-left-border">\n        <dt class="vc-table-col vc-table-col-title">Form Data</dt>\n      </dl>\n      {{for (var key in postData)}}\n      <div class="vc-table-row vc-left-border vc-small">\n        <div class="vc-table-col vc-table-col-2">{{key}}</div>\n        <div class="vc-table-col vc-table-col-4 vc-max-height-line">{{postData[key]}}</div>\n      </div>\n      {{/for}}\n    </div>\n    {{/if}}\n    <div>\n      <dl class="vc-table-row vc-left-border">\n        <dt class="vc-table-col vc-table-col-title">Response</dt>\n      </dl>\n      <div class="vc-table-row vc-left-border vc-small">\n        <pre class="vc-table-col vc-max-height vc-min-height">{{response || \'\'}}</pre>\n      </div>\n    </div>\n  </div>\n</div>';},function(e,t,o){var n,r,i;r=[t,o(32),o(2),o(34),o(35),o(0),o(1)],void 0===(i="function"==typeof(n=function(o,n,r,i,a,l,c){function s(e){return e&&e.__esModule?e:{default:e}}function d(e){return (d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function u(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function f(e){return (f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function v(e,t){return (v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function p(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a),l=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,o):{};n.get||n.set?Object.defineProperty(t,o,n):t[o]=e[o];}return t.default=e,t}(l),c=s(c);var b=function(e){function t(){var e,o,n,r;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var a=arguments.length,l=new Array(a),s=0;s<a;s++)l[s]=arguments[s];n=this,r=(e=f(t)).call.apply(e,[this].concat(l)),o=!r||"object"!==d(r)&&"function"!=typeof r?p(n):r;var u=p(p(o));u.isInited=!1,u.node={},u.$tabbox=c.default.render(i.default,{}),u.nodes=[],u.activedElem={};var v=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;return u.observer=new v(function(e){for(var t=0;t<e.length;t++){var o=e[t];u._isInVConsole(o.target)||u.onMutation(o);}}),o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t);}(t,e),o=t,(n=[{key:"onRenderTab",value:function(e){e(this.$tabbox);}},{key:"onAddTool",value:function(e){var t=this,o=[{name:"Expand",global:!1,onClick:function(e){if(t.activedElem)if(c.default.hasClass(t.activedElem,"vc-toggle"))for(var o=0;o<t.activedElem.childNodes.length;o++){var n=t.activedElem.childNodes[o];if(c.default.hasClass(n,"vcelm-l")&&!c.default.hasClass(n,"vcelm-noc")&&!c.default.hasClass(n,"vc-toggle")){c.default.one(".vcelm-node",n).click();break}}else c.default.one(".vcelm-node",t.activedElem).click();}},{name:"Collapse",global:!1,onClick:function(e){t.activedElem&&(c.default.hasClass(t.activedElem,"vc-toggle")?c.default.one(".vcelm-node",t.activedElem).click():t.activedElem.parentNode&&c.default.hasClass(t.activedElem.parentNode,"vcelm-l")&&c.default.one(".vcelm-node",t.activedElem.parentNode).click());}}];e(o);}},{key:"onShow",value:function(){if(!this.isInited){this.isInited=!0,this.node=this.getNode(document.documentElement);var e=this.renderView(this.node,c.default.one(".vc-log",this.$tabbox)),t=c.default.one(".vcelm-node",e);t&&t.click(),this.observer.observe(document.documentElement,{attributes:!0,childList:!0,characterData:!0,subtree:!0});}}},{key:"onRemove",value:function(){this.observer.disconnect();}},{key:"onMutation",value:function(e){switch(e.type){case"childList":e.removedNodes.length>0&&this.onChildRemove(e),e.addedNodes.length>0&&this.onChildAdd(e);break;case"attributes":this.onAttributesChange(e);break;case"characterData":this.onCharacterDataChange(e);}}},{key:"onChildRemove",value:function(e){var t=e.target,o=t.__vconsole_node;if(o){for(var n=0;n<e.removedNodes.length;n++){var r=e.removedNodes[n],i=r.__vconsole_node;i&&i.view&&i.view.parentNode.removeChild(i.view);}this.getNode(t);}}},{key:"onChildAdd",value:function(e){var t=e.target,o=t.__vconsole_node;if(o){this.getNode(t),o.view&&c.default.removeClass(o.view,"vcelm-noc");for(var n=0;n<e.addedNodes.length;n++){var r=e.addedNodes[n],i=r.__vconsole_node;if(i)if(null!==e.nextSibling){var a=e.nextSibling.__vconsole_node;a.view&&this.renderView(i,a.view,"insertBefore");}else o.view&&(o.view.lastChild?this.renderView(i,o.view.lastChild,"insertBefore"):this.renderView(i,o.view));}}}},{key:"onAttributesChange",value:function(e){var t=e.target.__vconsole_node;t&&(t=this.getNode(e.target)).view&&this.renderView(t,t.view,!0);}},{key:"onCharacterDataChange",value:function(e){var t=e.target.__vconsole_node;t&&(t=this.getNode(e.target)).view&&this.renderView(t,t.view,!0);}},{key:"renderView",value:function(e,t,o){var n=this,r=new a.default(e).get();switch(e.view=r,c.default.delegate(r,"click",".vcelm-node",function(t){t.stopPropagation();var o=this.parentNode;if(!c.default.hasClass(o,"vcelm-noc")){n.activedElem=o,c.default.hasClass(o,"vc-toggle")?c.default.removeClass(o,"vc-toggle"):c.default.addClass(o,"vc-toggle");for(var r=-1,i=0;i<o.children.length;i++){var a=o.children[i];c.default.hasClass(a,"vcelm-l")&&(r++,a.children.length>0||(e.childNodes[r]?n.renderView(e.childNodes[r],a,"replace"):a.style.display="none"));}}}),o){case"replace":t.parentNode.replaceChild(r,t);break;case"insertBefore":t.parentNode.insertBefore(r,t);break;default:t.appendChild(r);}return r}},{key:"getNode",value:function(e){if(!this._isIgnoredElement(e)){var t=e.__vconsole_node||{};if(t.nodeType=e.nodeType,t.nodeName=e.nodeName,t.tagName=e.tagName||"",t.textContent="",t.nodeType!=e.TEXT_NODE&&t.nodeType!=e.DOCUMENT_TYPE_NODE||(t.textContent=e.textContent),t.id=e.id||"",t.className=e.className||"",t.attributes=[],e.hasAttributes&&e.hasAttributes())for(var o=0;o<e.attributes.length;o++)t.attributes.push({name:e.attributes[o].name,value:e.attributes[o].value||""});if(t.childNodes=[],e.childNodes.length>0)for(var n=0;n<e.childNodes.length;n++){var r=this.getNode(e.childNodes[n]);r&&t.childNodes.push(r);}return e.__vconsole_node=t,t}}},{key:"_isIgnoredElement",value:function(e){return e.nodeType==e.TEXT_NODE&&""==e.textContent.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$|\n+/g,"")}},{key:"_isInVConsole",value:function(e){for(var t=e;null!=t;){if("__vconsole"==t.id)return !0;t=t.parentNode||void 0;}return !1}}])&&u(o.prototype,n),t;var o,n;}(r.default);o.default=b,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t,o){var n=o(33);"string"==typeof n&&(n=[[e.i,n,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};o(4)(n,r);n.locals&&(e.exports=n.locals);},function(e,t,o){(e.exports=o(3)(!1)).push([e.i,'/* color */\n.vcelm-node {\n  color: #183691;\n}\n.vcelm-k {\n  color: #0086B3;\n}\n.vcelm-v {\n  color: #905;\n}\n/* layout */\n.vcelm-l {\n  padding-left: 8px;\n  position: relative;\n  word-wrap: break-word;\n  line-height: 1;\n}\n/*.vcelm-l.vcelm-noc {\n  padding-left: 0;\n}*/\n.vcelm-l.vc-toggle > .vcelm-node {\n  display: block;\n}\n.vcelm-l .vcelm-node:active {\n  background-color: rgba(0, 0, 0, 0.15);\n}\n.vcelm-l.vcelm-noc .vcelm-node:active {\n  background-color: transparent;\n}\n.vcelm-t {\n  white-space: pre-wrap;\n  word-wrap: break-word;\n}\n/* level */\n.vcelm-l .vcelm-l {\n  display: none;\n}\n.vcelm-l.vc-toggle > .vcelm-l {\n  margin-left: 4px;\n  display: block;\n}\n/* arrow */\n.vcelm-l:before {\n  content: "";\n  display: block;\n  position: absolute;\n  top: 6px;\n  left: 3px;\n  width: 0;\n  height: 0;\n  border: transparent solid 3px;\n  border-left-color: #000;\n}\n.vcelm-l.vc-toggle:before {\n  display: block;\n  top: 6px;\n  left: 0;\n  border-top-color: #000;\n  border-left-color: transparent;\n}\n.vcelm-l.vcelm-noc:before {\n  display: none;\n}\n',""]);},function(e,t){e.exports='<div>\n  <div class="vc-log"></div>\n</div>';},function(e,t,o){var n,r,i;r=[t,o(36),o(37),o(0),o(1)],void 0===(i="function"==typeof(n=function(o,n,r,i,a){function l(e){return e&&e.__esModule?e:{default:e}}function c(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,n=l(n),r=l(r),i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,o):{};n.get||n.set?Object.defineProperty(t,o,n):t[o]=e[o];}return t.default=e,t}(i),a=l(a);var s=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.node=t,this.view=this._create(this.node);}return t=e,(o=[{key:"get",value:function(){return this.view}},{key:"_create",value:function(e,t){var o=document.createElement("DIV");switch(a.default.addClass(o,"vcelm-l"),e.nodeType){case o.ELEMENT_NODE:this._createElementNode(e,o);break;case o.TEXT_NODE:this._createTextNode(e,o);break;case o.COMMENT_NODE:case o.DOCUMENT_NODE:case o.DOCUMENT_TYPE_NODE:case o.DOCUMENT_FRAGMENT_NODE:}return o}},{key:"_createTextNode",value:function(e,t){a.default.addClass(t,"vcelm-t vcelm-noc"),e.textContent&&t.appendChild(function(e){return document.createTextNode(e)}(e.textContent.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")));}},{key:"_createElementNode",value:function(e,t){var o,i=(o=(o=e.tagName)?o.toLowerCase():"",["br","hr","img","input","link","meta"].indexOf(o)>-1),l=i;0==e.childNodes.length&&(l=!0);var c=a.default.render(n.default,{node:e}),s=a.default.render(r.default,{node:e});if(l)a.default.addClass(t,"vcelm-noc"),t.appendChild(c),i||t.appendChild(s);else{t.appendChild(c);for(var d=0;d<e.childNodes.length;d++){var u=document.createElement("DIV");a.default.addClass(u,"vcelm-l"),t.appendChild(u);}i||t.appendChild(s);}}}])&&c(t.prototype,o),e;var t,o;}();o.default=s,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t){e.exports='<span class="vcelm-node">&lt;{{node.tagName.toLowerCase()}}{{if (node.className || node.attributes.length)}}\n  <i class="vcelm-k">\n    {{for (var i = 0; i < node.attributes.length; i++)}}\n      {{if (node.attributes[i].value !== \'\')}}\n        {{node.attributes[i].name}}="<i class="vcelm-v">{{node.attributes[i].value}}</i>"{{else}}\n        {{node.attributes[i].name}}{{/if}}{{/for}}</i>{{/if}}&gt;</span>';},function(e,t){e.exports='<span class="vcelm-node">&lt;/{{node.tagName.toLowerCase()}}&gt;</span>';},function(e,t,o){var n,r,i;r=[t,o(2),o(39),o(40),o(0),o(1)],void 0===(i="function"==typeof(n=function(o,n,r,i,a,l){function c(e){return e&&e.__esModule?e:{default:e}}function s(e){return (s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function d(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n);}}function u(e,t){return !t||"object"!==s(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function f(e){return (f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function v(e,t){return (v=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,n=c(n),r=c(r),i=c(i),a=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,o):{};n.get||n.set?Object.defineProperty(t,o,n):t[o]=e[o];}return t.default=e,t}(a),l=c(l);var p=function(e){function t(){var e,o;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var n=arguments.length,i=new Array(n),a=0;a<n;a++)i[a]=arguments[a];return (o=u(this,(e=f(t)).call.apply(e,[this].concat(i)))).$tabbox=l.default.render(r.default,{}),o.currentType="",o.typeNameMap={cookies:"Cookies",localstorage:"LocalStorage",sessionstorage:"SessionStorage"},o}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&v(e,t);}(t,e),o=t,(n=[{key:"onRenderTab",value:function(e){e(this.$tabbox);}},{key:"onAddTopBar",value:function(e){for(var t=this,o=["Cookies","LocalStorage","SessionStorage"],n=[],r=0;r<o.length;r++)n.push({name:o[r],data:{type:o[r].toLowerCase()},className:"",onClick:function(){if(l.default.hasClass(this,"vc-actived"))return !1;t.currentType=this.dataset.type,t.renderStorage();}});n[0].className="vc-actived",e(n);}},{key:"onAddTool",value:function(e){var t=this,o=[{name:"Refresh",global:!1,onClick:function(e){t.renderStorage();}},{name:"Clear",global:!1,onClick:function(e){t.clearLog();}}];e(o);}},{key:"onReady",value:function(){}},{key:"onShow",value:function(){""==this.currentType&&(this.currentType="cookies",this.renderStorage());}},{key:"clearLog",value:function(){if(this.currentType&&window.confirm){var e=window.confirm("Remove all "+this.typeNameMap[this.currentType]+"?");if(!e)return !1}switch(this.currentType){case"cookies":this.clearCookieList();break;case"localstorage":this.clearLocalStorageList();break;case"sessionstorage":this.clearSessionStorageList();break;default:return !1}this.renderStorage();}},{key:"renderStorage",value:function(){var e=[];switch(this.currentType){case"cookies":e=this.getCookieList();break;case"localstorage":e=this.getLocalStorageList();break;case"sessionstorage":e=this.getSessionStorageList();break;default:return !1}var t=l.default.one(".vc-log",this.$tabbox);if(0==e.length)t.innerHTML="";else{for(var o=0;o<e.length;o++)e[o].name=a.htmlEncode(e[o].name),e[o].value=a.htmlEncode(e[o].value);t.innerHTML=l.default.render(i.default,{list:e},!0);}}},{key:"getCookieList",value:function(){if(!document.cookie||!navigator.cookieEnabled)return [];for(var e=[],t=document.cookie.split(";"),o=0;o<t.length;o++){var n=t[o].split("="),r=n.shift().replace(/^ /,""),i=n.join("=");try{r=decodeURIComponent(r),i=decodeURIComponent(i);}catch(e){console.log(e,r,i);}e.push({name:r,value:i});}return e}},{key:"getLocalStorageList",value:function(){if(!window.localStorage)return [];try{for(var e=[],t=0;t<localStorage.length;t++){var o=localStorage.key(t),n=localStorage.getItem(o);e.push({name:o,value:n});}return e}catch(e){return []}}},{key:"getSessionStorageList",value:function(){if(!window.sessionStorage)return [];try{for(var e=[],t=0;t<sessionStorage.length;t++){var o=sessionStorage.key(t),n=sessionStorage.getItem(o);e.push({name:o,value:n});}return e}catch(e){return []}}},{key:"clearCookieList",value:function(){if(document.cookie&&navigator.cookieEnabled){for(var e=this.getCookieList(),t=0;t<e.length;t++)document.cookie=e[t].name+"=;expires=Thu, 01 Jan 1970 00:00:00 GMT";this.renderStorage();}}},{key:"clearLocalStorageList",value:function(){if(window.localStorage)try{localStorage.clear(),this.renderStorage();}catch(e){alert("localStorage.clear() fail.");}}},{key:"clearSessionStorageList",value:function(){if(window.sessionStorage)try{sessionStorage.clear(),this.renderStorage();}catch(e){alert("sessionStorage.clear() fail.");}}}])&&d(o.prototype,n),t;var o,n;}(n.default);o.default=p,e.exports=t.default;})?n.apply(t,r):n)||(e.exports=i);},function(e,t){e.exports='<div class="vc-table">\n  <div class="vc-log"></div>\n</div>';},function(e,t){e.exports='<div>\n  <dl class="vc-table-row">\n    <dd class="vc-table-col">Name</dd>\n    <dd class="vc-table-col vc-table-col-2">Value</dd>\n  </dl>\n  {{for (var i = 0; i < list.length; i++)}}\n  <dl class="vc-table-row">\n    <dd class="vc-table-col">{{list[i].name}}</dd>\n    <dd class="vc-table-col vc-table-col-2">{{list[i].value}}</dd>\n  </dl>\n  {{/for}}\n</div>';}])});
    });

    var VConsole = unwrapExports(vconsole_min);
    var vconsole_min_1 = vconsole_min.VConsole;

    new VConsole();

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

    // 一层非联动
    const data1 = [];
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
    const $show1 = document.querySelector('.cell__title--1');
    for (let i = 1; i <= 40; i++) {
      data1.push(i);
    }
    const qSelect1 = new QSelect({
      title: '一层非联动',
      data: [data1],
      index: [2],
      ready(data) {
        $show1.textContent = `数据:${data.join(',')}`;
      },
      show() {
        // eslint-disable-next-line
        console.log('1-show');
      },
      hide() {
        // eslint-disable-next-line
        console.log('1-hide');
      },
      cancel() {
        // eslint-disable-next-line
        console.log('1-cancel');
      },
      change(weight, data) {
        // eslint-disable-next-line
        console.log(`1-change:${data.join(',')}`);
      },
      confirm(data) {
        $show1.textContent = `数据:${data.join(',')}`;
      }
    });
    const $setBtn1 = document.querySelectorAll('.settings__btn--1');
    $setBtn1.forEach((v, i) => {
      v.addEventListener('click', () => {
        switch (i) {
          case 0:
            qSelect1.setData(newData1, [0, 3, 1]).then(([data]) => {
              $show1.textContent = `数据:${data.join(',')}`;
            });
            break;
          case 1:
            qSelect1.setData(data1, [10]).then(([data]) => {
              $show1.textContent = `数据:${data.join(',')}`;
            });
            break;
          case 2:
            // eslint-disable-next-line
            console.log(qSelect1.getData());
            break;
          case 3:
            // eslint-disable-next-line
            console.log(qSelect1.getIndex());
            break;
        }
      });
    });
    const $click1 = document.querySelector('.cell__details--1');
    $click1.addEventListener('click', () => {
      qSelect1.show();
    });
    // 一层非联动带key值
    const data2 = [];
    const $show2 = document.querySelector('.cell__title--2');
    for (let i = 1; i <= 40; i++) {
      data2.push({
        value: i,
        key: i + 'somekey'
      });
    }
    const qSelect2 = new QSelect({
      title: '一层非联动带key值',
      data: [],
      loading: true,
      target: '.inline2',
      ready(data, key) {
        $show2.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      show() {
        // eslint-disable-next-line
        console.log('2-show');
      },
      hide() {
        // eslint-disable-next-line
        console.log('2-hide');
      },
      cancel() {
        // eslint-disable-next-line
        console.log('2-cancel');
      },
      change(weight, data, key) {
        $show2.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      confirm(data, key) {
        $show2.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      }
    });
    const $setBtn2 = document.querySelectorAll('.settings__btn--2');
    $setBtn2.forEach((v, i) => {
      v.addEventListener('click', () => {
        switch (i) {
          case 0:
            qSelect2.setData(data2).then(([data, key]) => {
              qSelect2.cancelLoading();
              $show2.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 1:
            // eslint-disable-next-line
            console.log(qSelect2.getData());
            break;
          case 2:
            // eslint-disable-next-line
            console.log(qSelect2.getIndex());
            break;
        }
      });
    });

    // 多级非联动带key值
    const data3 = [];
    const $show3 = document.querySelector('.cell__title--3');
    for (let i = 1; i <= 40; i++) {
      data3.push({
        value: i,
        key: i + 'k'
      });
    }
    const qSelect3 = new QSelect({
      title: '多级非联动带key值',
      data: [data3, data3, data3, data3, data3],
      ready(data, key) {
        $show3.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      show() {
        // eslint-disable-next-line
        console.log('3-show');
      },
      hide() {
        // eslint-disable-next-line
        console.log('3-hide');
      },
      cancel() {
        // eslint-disable-next-line
        console.log('3-cancel');
      },
      change(weight, data) {
        // eslint-disable-next-line
        console.log(`3-change:${data.join(',')}`);
      },
      confirm(data, key) {
        $show3.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      }
    });
    const $click3 = document.querySelector('.cell__details--3');
    $click3.addEventListener('click', () => {
      qSelect3.show();
    });

    // 多级非联动实测
    const data4 = [];
    const $show4 = document.querySelector('.cell__title--4');
    for (let i = 1; i <= 40; i++) {
      data4.push({
        value: i,
        key: i + 'k'
      });
    }
    const qSelect4 = new QSelect({
      title: '多级非联动实测',
      data: [data4, data4, data4, data4, data4],
      count: 9,
      ready(data, key) {
        $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      show() {
        // eslint-disable-next-line
        console.log('4-show');
      },
      hide() {
        // eslint-disable-next-line
        console.log('4-hide');
      },
      cancel() {
        // eslint-disable-next-line
        console.log('4-cancel');
      },
      change(weight, data) {
        // eslint-disable-next-line
        console.log(`4-change:${data.join(',')}`);
      },
      confirm(data, key) {
        $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      }
    });
    const $click4 = document.querySelector('.cell__details--4');
    const $setBtn4 = document.querySelectorAll('.settings__btn--4');
    $setBtn4.forEach((v, i) => {
      v.addEventListener('click', () => {
        switch (i) {
          case 0:
            qSelect4.setIndex([10, 10, 10, 10, 10]).then(([data, key]) => {
              $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 1:
            qSelect4.setValue([10, 10, 10, 10, 10]).then(([data, key]) => {
              $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 2:
            qSelect4
              .setKey(['20k', '20k', '20k', '20k', '20k'])
              .then(([data, key]) => {
                $show4.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
              });
            break;
          case 3:
            // eslint-disable-next-line
            console.log(qSelect4.getData());
            break;
          case 4:
            // eslint-disable-next-line
            console.log(qSelect4.getIndex());
            break;
        }
      });
    });
    $click4.addEventListener('click', () => {
      qSelect4.show();
    });

    // 简单联动
    const data5 = [
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
    ];
    const $show5 = document.querySelector('.cell__title--5');

    const qSelect5 = new QSelect({
      title: '简单联动',
      data: data5,
      ready(data, key) {
        $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      change(weight, data) {
        // eslint-disable-next-line
        console.log(`5-change:${data.join(',')}`);
      },
      confirm(data, key) {
        $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      }
    });
    const $setBtn5 = document.querySelectorAll('.settings__btn--5');
    $setBtn5.forEach((v, i) => {
      v.addEventListener('click', () => {
        switch (i) {
          case 0:
            qSelect5
              .setValue(['水果', '西瓜', '无子瓜', '5块', '两斤'])
              .then(([data, key]) => {
                $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
              });
            break;
          case 1:
            qSelect5.setIndex([2, 0, 3]).then(([data, key]) => {
              $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 2:
            qSelect5.scrollTo(0, 2).then(([data, key]) => {
              $show5.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 3:
            // eslint-disable-next-line
            console.log(qSelect5.getData());
            break;
          case 4:
            // eslint-disable-next-line
            console.log(qSelect5.getIndex());
            break;
        }
      });
    });
    const $click5 = document.querySelector('.cell__details--5');
    $click5.addEventListener('click', () => {
      qSelect5.show();
    });

    // 省市区联动实测
    const $show6 = document.querySelector('.cell__title--6');
    const qSelect6 = new QSelect({
      title: '省市区联动实测',
      data: data,
      ready(data, key) {
        $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      },
      change(weight, data) {
        // eslint-disable-next-line
        console.log(`6-change:${data.join(',')}`);
      },
      confirm(data, key) {
        $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
      }
    });
    const $click6 = document.querySelector('.cell__details--6');
    $click6.addEventListener('click', () => {
      qSelect6.show();
    });
    const $setBtn6 = document.querySelectorAll('.settings__btn--6');
    $setBtn6.forEach((v, i) => {
      v.addEventListener('click', () => {
        switch (i) {
          case 0:
            qSelect6.setIndex([3, 1, 2]).then(([data, key]) => {
              $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 1:
            qSelect6
              .setValue(['四川省', '成都市', '武侯区'])
              .then(([data, key]) => {
                $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
              });
            break;
          case 2:
            qSelect6.setKey(['32', '3201', '320104']).then(([data, key]) => {
              $show6.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
            });
            break;
          case 3:
            // eslint-disable-next-line
            console.log(qSelect6.getData());
            break;
          case 4:
            // eslint-disable-next-line
            console.log(qSelect6.getIndex());
            break;
        }
      });
    });

    // 省市区非联动异步实测
    const $show7 = document.querySelector('.cell__title--7');
    let province = [];
    let city = [];
    let area = [];
    const ax = axios.create();
    async function get(code) {
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
    }
    Promise.all([get('100000'), get('410000'), get('410300')]).then(values => {
      province = values[0];
      city = values[1];
      area = values[2];

      const base = [province, city, area];

      const qSelect7 = new QSelect({
        title: '省市区非联动异步实测',
        data: base,
        target: '.inline7',
        ready(data, key) {
          $show7.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        },
        change(weight, data, key) {
          const curKey = key[weight];
          switch (weight) {
            case 0:
              qSelect7.setLoading();
              get(curKey).then(res => {
                if (res.length) {
                  get(res[0].key).then(inner => {
                    qSelect7
                      .setColumnData([1, 2], [res, inner])
                      .then(([data, key]) => {
                        $show7.textContent = `数据:${data.join(',')},key:${key.join(
                      ','
                    )}`;
                        qSelect7.cancelLoading();
                      });
                  });
                } else {
                  qSelect7.setColumnData(1, res).then(([data, key]) => {
                    $show7.textContent = `数据:${data.join(',')},key:${key.join(
                  ','
                )}`;
                    qSelect7.cancelLoading();
                  });
                }
              });
              break;
            case 1:
              qSelect7.setLoading();
              get(curKey).then(res => {
                qSelect7.setColumnData(2, res).then(([data, key]) => {
                  $show7.textContent = `数据:${data.join(',')},key:${key.join(
                ','
              )}`;
                  qSelect7.cancelLoading();
                });
              });
              break;
            case 2:
              $show7.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
          }
        },
        confirm(data, key) {
          $show7.textContent = `数据:${data.join(',')},key:${key.join(',')}`;
        }
      });
    });

}));
