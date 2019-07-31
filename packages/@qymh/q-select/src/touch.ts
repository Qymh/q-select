import Dom from './dom';
import Animate from './animate';
// eslint-disable-next-line
import Layer from './layer';

class Touch {
  // 蒙层元素
  public overlay: HTMLElement;

  // 集合元素
  public collection: HTMLElement;

  // 高亮元素
  public hightlightEl?: HTMLElement;

  // Layer的this
  public pre: Layer;

  // 触碰动画结束后的回调
  public endCall: Function;

  // 当前索引
  public curIndex: number;

  // 之前索引
  public preIndex: number;

  // 当前滑动的transform
  public preTrans: number;

  // 滚动动画
  public animateSlide: Animate;

  // 收缩动画
  public animateShrink: Animate;

  // 当前栏数据
  public data: DataTrans[];

  // 平均数
  public average: number;

  // 最顶部滚动距离
  public maxScrollTop: number;

  // 最底部滚动距离
  public minScrollTop: number;

  // 用于滚动时最后滚动到的top值
  public featureScrollTop: number;

  // 是否处于动画中
  public isAnimating: boolean;

  // 当前栏目的索引值
  public aim: number;

  // 当前栏目是否隐藏
  public hidden: boolean;

  // 最后触碰时间
  private lastTime: number;

  // 滚动的位移集合
  private positions: {
    time: number;
    top: number;
  }[];

  // 触碰开始值
  private touchStart: number;

  // 触碰结束值
  public touchDiff: number;

  public fromDiff: boolean;

  constructor(
    data: DataTrans[],
    aim: number,
    overlay: HTMLElement,
    collection: HTMLElement,
    hightlightEl: HTMLElement | undefined,
    curIndex: number,
    pre: Layer,
    endCall: Function,
    fromDiff?: boolean
  ) {
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

  /**
   * 初始
   */
  init() {
    Dom.bind(this.overlay, 'touchstart', this.doTouchStart.bind(this));
    Dom.bind(this.overlay, 'touchmove', this.doTouchMove.bind(this));
    Dom.bind(this.overlay, 'touchend', this.doTouchEnd.bind(this));
    this.initTrans();
  }

  /**
   * 激活当前touch栏目
   * @param index 当前索引
   */
  active(index: number) {
    Dom.findIndex(`q-select-box-item--${this.pre.id}`, index).style.display =
      'flex';
    this.hidden = false;
  }

  /**
   * 隐藏当前touch栏目
   * @param index 当前索引
   */
  deactive(index: number) {
    Dom.findIndex(`q-select-box-item--${this.pre.id}`, index).style.display =
      'none';
    this.hidden = true;
  }

  /**
   * 重置当期touch
   * @param data 重置后的data优化值
   * @param reset 是否重置touch
   */
  reset(data: DataTrans[], reset?: boolean) {
    this.data = data;
    this.preIndex = this.curIndex;
    this.setMinScrollTop(this.data);
    if (reset) {
      this.preIndex = 0;
      this.curIndex = 0;
      this.scrollTo(0);
    } else {
      this.scrollTo(this.pre.dynamicIndex[this.aim]);
    }
  }

  /**
   * 初始化transform
   */
  initTrans() {
    const val = (this.average - this.curIndex) * this.pre.chunkHeight;
    this.preTrans = val;
    this.initScrollTop(this.average * this.pre.chunkHeight);
    this.setTrans(val);
    if (this.fromDiff) {
      this.setSize();
    }
  }

  /**
   * 设置highlight的top和蒙层的size
   */
  setSize() {
    const baseSize =
      Math.floor(this.pre.$options.count / 2) * this.pre.$options.chunkHeight;
    Dom.addStyle(this.overlay, {
      backgroundSize: `100% ${baseSize}px`
    });
    if (this.hightlightEl) {
      Dom.addStyle(this.hightlightEl, {
        top: `${baseSize}px`
      });
    }
  }

  /**
   * 收缩蒙层size
   */
  shrinkSize() {
    Dom.addStyle(this.overlay, {
      backgroundSize: `100% 100%`
    });
  }

  /**
   * 获取最顶部和最底部滚动高度
   * @param top 最大滚动距离
   */
  initScrollTop(top: number) {
    this.maxScrollTop = top;
    this.setMinScrollTop(this.data);
  }

  /**
   * 设置最底部滚动高度
   * @param data data优化值
   */
  setMinScrollTop(data: DataTrans[]) {
    this.minScrollTop =
      this.maxScrollTop - (data.length - 1) * this.pre.chunkHeight;
  }

  /**
   * 设置transform
   * @param value transformY
   */
  setTrans(value: number) {
    this.collection.style.transform = `translate3d(0,${value}px,0)`;
  }

  /**
   * 获取触碰中间值
   * @param touches 触碰e.touches
   */
  getTouchCenter(touches: TouchList): number {
    if (touches.length >= 2) {
      return (touches[0].pageY + touches[1].pageY) / 2;
    } else {
      return touches[0].pageY;
    }
  }

  /**
   * 触碰开始
   * @param e event
   */
  doTouchStart(e: TouchEvent) {
    if (!this.data.length) {
      return;
    }
    this.touchStart = this.getTouchCenter(e.touches);
    this.animateSlide.stop();
    this.animateShrink.stop();
  }

  /**
   * 触碰移动
   * @param e event
   */
  doTouchMove(e: TouchEvent) {
    e.preventDefault();
    if (!this.data.length) {
      return;
    }
    const { timeStamp: time } = e;
    this.touchDiff =
      this.getTouchCenter(e.touches) - this.touchStart + this.preTrans;
    if (this.positions.length > 60) {
      this.positions.splice(0, 30);
    }
    this.positions.push({
      top: this.touchDiff,
      time
    });
    this.lastTime = time;
    this.setTrans(this.touchDiff);
  }

  /**
   * 触碰结束
   * @param e event
   */
  doTouchEnd(e: TouchEvent) {
    if (!this.data.length) {
      return;
    }
    const { timeStamp: time } = e;
    this.isAnimating = true;
    if (time - this.lastTime <= 100) {
      this.doSlideAnimate(time);
    } else {
      this.doShrinkAnimate();
    }
  }

  /**
   * 滑动动画
   * @param time 时间戳
   */
  doSlideAnimate(time: number) {
    const post = this.positions.length - 1;
    const pre = this.positions.filter(v => v.time >= time - 100)[0];
    const timeOffset = this.positions[post].time - pre.time;
    const movedTop = this.touchDiff - pre.top;
    let decelerationTrans;
    decelerationTrans = (movedTop / timeOffset) * (1000 / 60);
    let featureScrollTop = this.touchDiff;
    let duration = 0;
    let isFrezzed = false;
    this.positions.length = 0;
    // 先计算会滚动到的位置
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
    // 获取滚动修正后的索引
    const featureIndex = this.getFeatureIndex(featureScrollTop);
    // 获取滚动修正后的top值
    const realFeatureScrollTop = isFrezzed
      ? featureScrollTop
      : this.getFeatureScrollTop(featureIndex);
    if (Math.abs(movedTop) <= 10 || duration <= 250) {
      this.shrinkAnimateToEnd(realFeatureScrollTop);
    } else {
      this.slideAnimateToEnd(realFeatureScrollTop, duration);
    }
  }

  /**
   * 收缩动画
   */
  doShrinkAnimate() {
    this.shrinkAnimateToEnd(this.touchDiff);
  }

  /**
   * 手动移动到位移
   * @param index 移动到的索引
   */
  scrollTo(index: number) {
    const featureScrollTop = this.getFeatureScrollTop(index);
    this.shrinkAnimateToEnd(featureScrollTop, true);
  }

  /**
   * 滑动到位移
   * @param realFeatureScrollTop 最终滚动位置
   * @param duration 动画时长
   */
  slideAnimateToEnd(realFeatureScrollTop: number, duration?: number) {
    this.animateSlide.run(
      this.touchDiff,
      realFeatureScrollTop,
      (res: number) => {
        this.touchDiff = res;
        this.preTrans = res;
        this.setTrans(res);
      },
      (end: number) => {
        this.animateFinishedCall(end);
      },
      duration
    );
  }

  /**
   * 收缩到位移
   * @param featureScrollTop 最终滚动位置
   * @param fast 是否是快速收缩
   */
  shrinkAnimateToEnd(featureScrollTop: number, fast?: boolean) {
    const index = this.getFeatureIndex(featureScrollTop);
    featureScrollTop = this.getFeatureScrollTop(index);
    this.animateShrink.run(
      this.touchDiff,
      featureScrollTop,
      (res: number) => {
        this.setTrans(res);
        this.preTrans = res;
        this.touchDiff = res;
      },
      (end: number) => {
        this.animateFinishedCall(end, fast);
      },
      fast ? 0 : 250
    );
  }

  /**
   * 动画完成回调
   * @param end 最终滚动位置
   * @param fast 是否是快速收缩
   */
  animateFinishedCall(end: number, fast?: boolean) {
    this.isAnimating = false;
    this.preTrans = end;
    this.touchDiff = end;
    this.setTrans(end);
    this.curIndex = this.getFeatureIndex(end);
    if (this.preIndex === this.curIndex || fast) {
      return;
    }
    const curData = this.data[this.curIndex];
    if (!this.fromDiff) {
      this.endCall(
        {
          key: curData.key,
          value: curData.value,
          index: this.curIndex
        },
        this.aim
      );
    }
    this.preIndex = this.curIndex;
  }

  /**
   * 获取滚动后的索引
   * @param featureScrollTop 最终滚动位置
   */
  getFeatureIndex(featureScrollTop: number) {
    const curI =
      this.average - Math.round(featureScrollTop / this.pre.chunkHeight);
    const len = this.data.length;
    return curI < 0 ? 0 : curI > len - 1 ? len - 1 : curI;
  }

  /**
   * 获取滚动后的top
   * @param featureIndex 最终滚动的索引
   */
  getFeatureScrollTop(featureIndex: number) {
    return (this.average - featureIndex) * this.pre.chunkHeight;
  }

  // 摧毁当前touch
  destroy() {
    Dom.unbind(this.overlay, 'touchstart');
    Dom.unbind(this.overlay, 'touchmove');
    Dom.unbind(this.overlay, 'touchend');
  }
}

export default Touch;
