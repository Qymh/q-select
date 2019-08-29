import Touch from './touch';
import Dom from './dom';
import { assert, isPlainObj, tips, isPlainNumber, deepClone } from './uitls';

let id = 0;

class Layer {
  // 当前id
  public id: number;

  // 当前内联target
  public target: Element | null;

  // 配置
  public $options: QOptions;

  // 下拉展示数量
  public count: number;

  // 一个下拉块的高度
  public chunkHeight: number;

  // 传递的data
  public data: Data;

  // 构造后的值
  public dataTrans: DataTrans[][];

  // 当前索引
  public index: number[];

  // 动态索引
  public dynamicIndex: number[];

  // 真实索引
  public realIndex: number[];

  // 是否是联动
  public isGanged: boolean;

  // 触摸实例
  public touchs: Touch[];

  // 当前生效的值
  public dynamicData: DataCallback[];

  // 真实生效的值
  public realData: DataCallback[];

  // 缓存回调函数数组
  public cachedCall: Function[];

  // 是否加载完毕
  public isReady: boolean;

  // 是否隐藏
  public hidden: boolean;

  // dom操作
  public dom: Dom;

  // 是否处于加载中
  public loading: boolean;

  constructor(options: QOptions) {
    this.$options = options || {};
    options = options || {};
    this.id = id++;
    this.target = null;
    if (options.target) {
      const $target = document.querySelector(options.target);
      if ($target) {
        this.target = $target;
      } else {
        assert(
          false,
          `can not catch ${options.target},make sure you have set a right flag of a element`
        );
      }
    }
    this.$options.id = this.id;
    this.count = options.count = isPlainNumber(+options.count)
      ? +options.count
      : 7;
    this.chunkHeight = options.chunkHeight = isPlainNumber(+options.chunkHeight)
      ? +options.chunkHeight
      : 40;
    this.data = deepClone(options.data);
    this.dataTrans = [];
    this.index = options.index;
    this.dynamicIndex = [];
    this.realIndex = [];
    this.touchs = [];
    this.dynamicData = [];
    this.realData = [];
    this.cachedCall = [];
    this.isReady = false;
    this.isGanged = false;
    this.hidden = true;
    this.loading = !!options.loading;
    this.dom = new Dom();
    this.validateOptions() && this.init();
  }

  /**
   * 验证用户输入的options是否符合规范
   */
  validateOptions() {
    function tipsForFn(this: Layer, value: FunctionKeys) {
      if (this.$options[value] && typeof this.$options[value] !== 'function') {
        tips(
          false,
          `${value} must be a function but not get ${this.$options[value]}`
        );
        this.$options[value] = () => {};
      }
    }
    if (this.count % 2 !== 1 && (this.count < 5 || this.count > 9)) {
      tips(false, `count can only be 5 or 7 or 9, but now get ${this.count}`);
      this.count = this.$options.count = 7;
    }
    if (this.chunkHeight < 30 || this.chunkHeight > 60) {
      tips(
        false,
        `chunkHeight must greater than 30 and less than 60,but now get ${this.chunkHeight}`
      );
      this.chunkHeight = this.$options.chunkHeight = 40;
    }
    ['ready', 'cancel', 'confirm', 'show', 'close'].map(v =>
      tipsForFn.call(this, v as FunctionKeys)
    );
    if (!this.validateData() || !this.validateIndex()) {
      return false;
    }
    return true;
  }

  /**
   * 验证data规范
   * @param forceData 需要覆盖验证的data
   */
  validateData(forceData?: Data, forceType?: boolean): boolean {
    let data = forceData || this.$options.data;
    if (
      !data ||
      !Array.isArray(data) ||
      (Array.isArray(data) && data.length === 0)
    ) {
      tips(false, 'data can only be an array');
      this.data = data = [['']];
    }

    this.isGanged =
      forceType !== undefined
        ? forceType
        : data.every((v: any) => isPlainObj(v));

    /**
     * 递归验证联动下的data
     * @param data 验证的联动data
     * @param firstLevel 是否是第一层
     */
    function validateGangedData(
      data: GangedData[],
      firstLevel: boolean
    ): boolean {
      return data.every(v => {
        if (isPlainObj(v)) {
          let levelBool = true;
          let childBool = true;
          if (firstLevel) {
            levelBool = assert(
              v.value,
              'value is required if in the first level of GangedData'
            );
          } else {
            childBool = assert(
              v.value,
              'value is required if you use object to define a property of GangedData'
            );
          }
          if ((childBool || levelBool) && v.children && v.children.length) {
            return validateGangedData(v.children, false);
          }
          return true;
        } else {
          return assert(
            typeof v === 'string' || typeof v === 'number',
            `value can only be number or string if you use object to define a property of GangedData but now get ${v}`
          );
        }
      });
    }

    // 联动校验
    if (this.isGanged) {
      return validateGangedData(data as GangedData[], true);
    }
    // 非联动校验
    else {
      return (data as NotGangedData[]).every(v => {
        if (!Array.isArray(v)) {
          assert(false, `NotGangedData must contain arrays, but now get ${v}`);
          return false;
        }
        return v.every((p: NotGangedDataObj | string | number) => {
          if (isPlainObj(p)) {
            if ((p as any).children && (p as any).children.length) {
              return assert(
                false,
                'notGangedData can not has prop which is children'
              );
            } else {
              return assert(
                (p as NotGangedDataObj).value !== undefined,
                'value is required if NotGangedData is an object'
              );
            }
          } else if (typeof p !== 'string' && typeof p !== 'number') {
            return assert(
              false,
              `value can only be number or string if NotGangedData is not an object but now get ${p} which is ${typeof p}`
            );
          }
          return true;
        });
      });
    }
  }

  /**
   * 验证index规范
   * @param forceIndex 需要覆盖验证的index
   */
  validateIndex(forceIndex?: number[]): boolean {
    const index = forceIndex || this.$options.index;
    if (!index) {
      return true;
    }
    if (!Array.isArray(index)) {
      return assert(false, `index must be an Array, but now get ${index}`);
    }
    return index.every(v => {
      if (typeof v !== 'number') {
        return assert(false, `index can only be a number, but now get ${v}`);
      }
      return true;
    });
  }

  /**
   * 初始化
   */
  init() {
    // 格式化联动和非联动data为统一值
    this.normalizeData();
    // 初始化第一次的dom
    this.dom.init(
      this.dataTrans,
      this.$options,
      !!this.target,
      (domString: string) => {
        const $bk = Dom.find('q-select-bk');
        // 创建背景
        if (!$bk && !this.target) {
          const $bk = Dom.create('div');
          Dom.addClass($bk, 'q-select-bk');
          Dom.addStyle($bk, [
            {
              zIndex: isPlainNumber(+this.$options.bkIndex)
                ? +this.$options.bkIndex
                : 500
            },
            {
              display: 'none'
            }
          ]);
          document.body.appendChild($bk);
        }
        const $el = Dom.create('div');
        Dom.addClass($el, ['q-select', `q-select--${this.id}`]);
        if (!this.target) {
          Dom.addStyle($el, [
            {
              zIndex: isPlainNumber(+this.$options.selectIndex)
                ? +this.$options.selectIndex
                : 600
            },
            {
              display: 'none'
            }
          ]);
        } else {
          Dom.addStyle($el, [
            {
              position: 'static'
            }
          ]);
        }
        $el.innerHTML = domString;
        if (!this.target) {
          document.body.appendChild($el);
        } else {
          this.target.appendChild($el);
          this.hidden = false;
        }
        this.dom.remove();
        this.prepareMount();
      }
    );
  }

  /**
   * 格式化index
   * @param dataTransLater 之后的数据
   * @param forceIndex 需要覆盖的index
   */
  normalizeIndex(dataTransLater: DataTrans[][], forceIndex?: number[]) {
    this.index = forceIndex || this.index;
    this.index =
      this.index || Array.from({ length: dataTransLater.length }).fill(0);
    this.index.map((v, i) => {
      if (v < 0) {
        this.index[i] = 0;
      }
      if (dataTransLater[i]) {
        const len = dataTransLater[i].length;
        if (v > len - 1) {
          this.index[i] = len - 1;
        }
      }
      return v;
    });
    const lenDiff = this.index.length - dataTransLater.length;
    this.index =
      lenDiff >= 0
        ? this.index.slice(0, dataTransLater.length)
        : [
            ...this.index,
            ...Array.from<number>({ length: Math.abs(lenDiff) }).fill(0)
          ];
    this.dynamicIndex = [...this.index];
    this.realIndex = [...this.index];
  }

  /**
   * 格式化data
   * @param forceData 需要覆盖的data
   * @param index 有覆盖data时指定的索引值
   */
  normalizeData(
    forceData?: NotGangedData | NotGangedData[],
    index?: number | number[]
  ) {
    if (this.isGanged) {
      this.normalizeGangedData();
      // 将联动的data值格式化为与非联动数据结构一样的值
      this.dataTrans = this.genGangedData(this.data as GangedData[]);
    } else {
      if (forceData) {
        if (Array.isArray(forceData) && Array.isArray(index)) {
          for (let i = 0; i < forceData.length - 1; i++) {
            this.data[index[i]] = forceData[index[i]] as NotGangedData;
          }
        } else {
          this.data[index as number] = forceData as NotGangedData;
        }
      }
      this.normalizeNotGangedData();
      this.dataTrans = deepClone(this.data as DataTrans[][]);
    }
  }

  /**
   * 格式化联动下的data
   */
  normalizeGangedData() {
    /**
     * 递归格式化联动下的data
     * @param data 联动下的data
     */
    function loop(data: GangedData[]) {
      data.map((v, i) => {
        if (!isPlainObj(v)) {
          data[i] = v = {
            value: v,
            key: v,
            children: []
          };
        } else {
          v.key = v.key || v.value;
        }
        if (v.children && v.children.length) {
          loop(v.children);
        } else {
          v.children = [];
        }
        return v;
      });
    }
    loop(this.data as GangedData[]);
  }

  /**
   * 格式化非联动data
   */
  normalizeNotGangedData() {
    (this.data as NotGangedData[]).map(v => {
      for (const key in v) {
        const item = v[key] as NotGangedDataObj;
        if (isPlainObj(item)) {
          item.key = item.key || item.value;
        } else {
          v[key] = {
            key: item,
            value: item
          };
        }
      }
      return v;
    });
  }

  /**
   * 准备挂载
   */
  prepareMount() {
    // 格式化index
    this.normalizeIndex(this.dataTrans);
    const $overlays = Dom.findAll(`q-select-box-item__overlay--${this.id}`);
    const $collections = Dom.findAll(
      `q-select-box-item-collections--${this.id}`
    );
    const $highlights = Dom.findAll(`q-select-box-item__highlight--${this.id}`);
    // 设置初始值
    this.dynamicData = (this.dataTrans as any).reduce(
      (acc: DataCallback[], val: DataCallback[], index: number) => {
        acc[index] = val[this.index[index]] || {};
        acc[index].index = index;
        return acc;
      },
      []
    );
    this.realData = deepClone(this.dynamicData);
    // 在内联下不显示头部栏 所以仅在非内联下绑定头部栏点击事件
    if (!this.target) {
      this.mountActions();
    }
    this.mountTouches($overlays, $collections, $highlights);
  }

  /**
   * 挂载头部事件
   */
  mountActions() {
    const $confirm = Dom.find(`q-select-header-confirm--${this.id}`);
    const $cancel = Dom.find(`q-select-header-cancel--${this.id}`);
    function reset(this: Layer) {
      this.dynamicIndex = [...this.realIndex];
      if (this.isGanged) {
        const dataTrans = deepClone(this.dataTrans);
        const dataTransLater = this.genGangedData(
          this.data as GangedData[],
          this.realIndex
        );
        this.diff(dataTrans, dataTransLater, 0, true, false, true);
      }
      this.stopAll();
    }
    Dom.bind($confirm, 'click', () => {
      if (this.touchs.filter(v => !v.hidden).every(v => !v.isAnimating)) {
        this.realIndex = [...this.dynamicIndex];
        this.realData = deepClone(this.dynamicData);
      } else {
        this.dynamicData = deepClone(this.realData);
        reset.call(this);
      }
      this.closeSelect();
      this.$options.confirm &&
        this.$options.confirm(...this.getChangeCallData());
    });
    Dom.bind($cancel, 'click', () => {
      if (!this.$options.disableDefaultCancel) {
        this.closeSelect();
      }
      reset.call(this);
      this.$options.cancel && this.$options.cancel();
    });
  }

  /**
   * 挂载touch事件
   * @param $overlays 蒙层集合
   * @param $collections 元素集合
   * @param $highlights 高亮集合
   */
  mountTouches(
    $overlays: NodeListOf<HTMLElement>,
    $collections: NodeListOf<HTMLElement>,
    $highlights: NodeListOf<HTMLElement>
  ) {
    this.dataTrans.forEach((v, i) => {
      this.touchs[i] = new Touch(
        v,
        i,
        $overlays[i],
        $collections[i],
        $highlights[i],
        this.dynamicIndex[i],
        this,
        this.touchCallback.bind(this)
      );
    });
    this.setBoxWidth();
    this.isReady = true;
    this.$options.ready && this.$options.ready(...this.getChangeCallData());
  }

  /**
   * 关闭select
   */
  closeSelect() {
    if (this.hidden) {
      return;
    }
    const $select = Dom.find(`q-select--${this.id}`);
    const $bk = Dom.find(`q-select-bk`);
    Dom.addStyle($bk, {
      display: 'none'
    });
    this.slideAnimation('out', $select, () => {
      Dom.addStyle($select, {
        display: 'none'
      });
      this.hidden = true;
      this.$options.hide && this.$options.hide(...this.getChangeCallData());
    });
  }

  /**
   * 销毁当前select
   */
  destroySelect() {
    this.touchs.forEach(v => v.destroy());
    Dom.remove(document.body, Dom.find(`q-select-bk`));
    Dom.remove(document.body, Dom.find(`q-select--${this.id}`));
    // eslint-disable-next-line
    (this as any).__proto__ = null;
    for (const key in this) {
      (this as any)[key] = null;
    }
  }

  /**
   * 展示select
   */
  showSelect() {
    if (!this.hidden) {
      return;
    }
    const $select = Dom.find(`q-select--${this.id}`);
    const $bk = Dom.find(`q-select-bk`);
    Dom.addStyle($select, { display: 'block' });
    Dom.addStyle($bk, { display: 'block' });
    this.slideAnimation('in', $select, () => {
      this.hidden = false;
      this.$options.show && this.$options.show(...this.getChangeCallData());
    });
  }

  /**
   * 平滑进入离开动画
   * @param type 进入还是离开
   * @param $select 下拉选择元素
   * @param callback 回调
   */
  slideAnimation(type: 'in' | 'out', $select: HTMLElement, callback: Function) {
    Dom.addClass($select, [
      'animated',
      type === 'in' ? 'slideInUp' : 'slideOutDown'
    ]);
    const timer = setTimeout(() => {
      Dom.removeClass($select, [
        'animated',
        type === 'in' ? 'slideInUp' : 'slideOutDown'
      ]);
      callback && callback();
      clearTimeout(timer);
    }, 200);
  }

  /**
   * 停止所有正在滚动的栏目 并将滚动重置回滚动前的位置
   */
  stopAll() {
    this.touchs
      .filter(v => !v.hidden)
      .forEach((v, i) => {
        v.animateShrink.stop();
        v.animateSlide.stop();
        v.scrollTo(this.realIndex[i]);
        v.setMinScrollTop(this.dataTrans[i]);
      });
  }

  /**
   * 设置index和data
   * @param dataTransLater 联动改变后的优化data值
   */
  setIndexAndData(dataTransLater: DataTrans[][]) {
    dataTransLater.forEach((v, i) => {
      let curIndex = this.dynamicIndex[i];
      if (curIndex > v.length - 1) {
        this.realIndex[i] = this.dynamicIndex[i] = curIndex = v.length - 1;
      }
      if (curIndex < 0) {
        this.realIndex[i] = this.dynamicIndex[i] = curIndex = 0;
      }
      this.dynamicData[i] = {
        ...dataTransLater[i][curIndex],
        index: curIndex
      };
      this.realData[i] = {
        ...dataTransLater[i][curIndex],
        index: curIndex
      };
    });
  }

  /**
   * 设置盒子宽度
   */
  setBoxWidth() {
    const $box = Dom.findAll(`q-select-box-item--${this.id}`);
    const width = 100 / this.touchs.filter(v => !v.hidden).length + '%';
    $box.forEach(v => {
      v.style.width = width;
    });
  }

  /**
   * 触碰完成回调
   * @param value 回调的data优化值
   * @param i 索引
   */
  touchCallback(value: DataCallback, i: number) {
    this.dynamicIndex[i] = value.index;
    // 在内联挂载的情况下 直接赋值为真实索引
    if (this.target) {
      this.realIndex[i] = value.index;
    }
    // 非联动
    if (!this.isGanged) {
      this.notGangedCallback(value, i);
    } else {
      this.gangedCallback(value, i);
    }
  }

  /**
   * 非联动回调
   * @param value 回调的data优化值
   * @param i 索引
   */
  notGangedCallback(value: DataCallback, i: number) {
    this.dynamicData[i] = value;
    const cache = () => {};
    cache.priority = i;
    this.cachedCall.push(cache);
    if (this.touchs.every(v => !v.isAnimating) && !this.hidden) {
      const weight = Math.min(
        ...(this.cachedCall as any).reduce((acc: any, val: any) => {
          acc.push(+val.priority);
          return acc;
        }, [])
      );
      const changeCallData = this.getChangeCallData();
      this.$options.change && this.$options.change(weight, ...changeCallData);
      this.cachedCall.length = 0;
    }
  }

  /**
   * 联动回调
   * @param value 回调的data优化值
   * @param i 索引
   */
  gangedCallback(value: DataCallback, i: number) {
    const callback: any = () => {};
    callback.priority = i;
    callback.value = value;
    const activeTouches = this.touchs.filter(v => !v.hidden);
    this.cachedCall[i] = callback;
    if (activeTouches.every(v => !v.isAnimating)) {
      const weight = Math.min(
        ...(this.cachedCall as any).reduce((acc: any, val: any) => {
          acc.push(+val.priority);
          return acc;
        }, [])
      );
      this.dynamicIndex = this.dynamicIndex.slice(0, weight + 1);
      for (let y = weight + 1; y < activeTouches.length; y++) {
        this.dynamicIndex[y] = 0;
      }
      const dataTransLater = this.genGangedData(
        this.data as GangedData[],
        this.dynamicIndex
      );
      this.diff(this.dataTrans, dataTransLater, weight, false, true);
    }
  }

  // 获取touch改变触发回调发送的data值
  getChangeCallData(): any[] {
    const valueCollections: any[] = this.dynamicData.reduce(
      (acc: any[], val) => {
        acc.push(val.value);
        return acc;
      },
      []
    );
    const keyCollections: any[] = this.dynamicData.reduce((acc: any[], val) => {
      acc.push(val.key);
      return acc;
    }, []);
    const dynamicData = this.dynamicData;
    return [valueCollections, keyCollections, dynamicData];
  }

  /**
   * diff 算法
   * @param dataTrans data优化值
   * @param dataTransLater 之后的data优化值
   * @param weight 索引权重
   * @param ignoreChange 是否忽略发送change事件
   * @param resetIndex 是否重置index
   * @param trigger 是否是手动触发的diff事件而不是触摸动画结束回调
   */
  diff(
    dataTrans: DataTrans[][],
    dataTransLater: DataTrans[][],
    weight: number,
    ignoreChange?: boolean,
    resetIndex?: boolean,
    trigger?: boolean
  ) {
    Dom.diff(
      dataTrans,
      dataTransLater,
      weight,
      this.id,
      this.chunkHeight,
      this.touchs,
      trigger,
      (
        $overlay: HTMLElement[],
        $collection: HTMLElement[],
        $highlight: HTMLElement[]
      ) => {
        if (dataTransLater.length > dataTrans.length) {
          this.dynamicData[weight] = {
            ...dataTransLater[weight][this.dynamicIndex[weight]],
            index: this.dynamicIndex[weight]
          };
          for (
            let y = trigger ? weight : weight + 1;
            y < dataTransLater.length;
            y++
          ) {
            if (!this.touchs[y]) {
              this.touchs[y] = new Touch(
                dataTransLater[y],
                y,
                $overlay[y],
                $collection[y],
                $highlight[y],
                this.dynamicIndex[y],
                this,
                this.touchCallback.bind(this)
              );
              if (!trigger || resetIndex) {
                this.dynamicIndex[y] = 0;
              }
              this.touchs[y].setSize();
              this.dynamicData[y] = {
                ...dataTransLater[y][this.dynamicIndex[y]],
                index: this.dynamicIndex[y]
              };
            } else {
              this.touchs[y].reset(dataTransLater[y], resetIndex);
              this.touchs[y].active(y);
              if (!trigger || resetIndex) {
                this.dynamicIndex[y] = 0;
              }
              this.dynamicData[y] = {
                ...dataTransLater[y][this.dynamicIndex[y]],
                index: this.dynamicIndex[y]
              };
            }
            this.setBoxWidth();
          }
          if ($overlay) {
            $overlay.length = 0;
            $collection.length = 0;
            $highlight.length = 0;
          }
        } else if (dataTransLater.length === dataTrans.length) {
          this.resetExistTouch(weight, dataTransLater, trigger, resetIndex);
        } else {
          const spliceArr = [];
          for (let y = dataTransLater.length; y < dataTrans.length; y++) {
            this.touchs[y].deactive(y);
            spliceArr.push(y);
          }
          this.resetExistTouch(weight, dataTransLater, trigger, resetIndex);
          this.dynamicIndex.splice(spliceArr[0], spliceArr.length);
          this.dynamicData.splice(spliceArr[0], spliceArr.length);
          spliceArr.length = 0;
          this.setBoxWidth();
        }
        if (!ignoreChange) {
          const changeCallData = this.getChangeCallData();
          this.$options.change &&
            this.$options.change(weight, ...changeCallData);
        }
        this.dataTrans = dataTransLater;
        this.cachedCall.length = 0;
      }
    );
  }

  /**
   * 重置当前存在的touch
   * @param weight 索引权重
   * @param dataTransLater 之后的data优化值
   * @param trigger 是否是手动触发的diff事件而不是触摸动画结束回调
   * @param resetIndex 是否重置indexs
   */
  resetExistTouch(
    weight: number,
    dataTransLater: DataTrans[][],
    trigger?: boolean,
    resetIndex?: boolean
  ) {
    if (dataTransLater[weight]) {
      this.dynamicData[weight] = {
        ...dataTransLater[weight][this.dynamicIndex[weight]],
        index: this.dynamicIndex[weight]
      };
    }
    for (
      let y = trigger ? weight : weight + 1;
      y < this.touchs.filter(v => !v.hidden).length;
      y++
    ) {
      if (!trigger || resetIndex) {
        this.dynamicIndex[y] = 0;
      }
      this.dynamicData[y] = {
        ...dataTransLater[y][this.dynamicIndex[y]],
        index: this.dynamicIndex[y]
      };
      this.touchs[y].reset(dataTransLater[y], resetIndex);
    }
  }

  /**
   * 将联动的data值格式化为与非联动数据结构一样的值
   * @param data data
   * @param preciseIndex 指定转义后的索引
   *
   */
  genGangedData(data: GangedData[], preciseIndex?: number[]): DataTrans[][] {
    let index = 0;
    const dataTrans: DataTrans[][] = [];
    function genGangedDataChildren(this: Layer, child: GangedData[]) {
      dataTrans[index] = [];
      for (const item of child) {
        dataTrans[index].push({
          key: item.key,
          value: item.value
        });
      }
      const curIndex = (preciseIndex || [])[index] || 0;
      index++;
      if (child[curIndex]) {
        if (child[curIndex].children.length) {
          genGangedDataChildren.call(this, child[curIndex].children);
        }
      } else if (child[0] && child[0].children.length) {
        genGangedDataChildren.call(this, child[0].children);
      }
    }
    genGangedDataChildren.call(this, data);
    this.completeDynamicIndex(dataTrans);
    return dataTrans;
  }

  /**
   * 补全动态index
   * @param data data优化值
   */
  completeDynamicIndex(data: DataTrans[][]) {
    for (let i = 0; i < this.dynamicIndex.length; i++) {
      if (data[i] && this.dynamicIndex[i] > data[i].length - 1) {
        this.dynamicIndex[i] = data[i].length - 1;
      }
      if (this.dynamicIndex[i] < 0) {
        this.dynamicIndex[i] = 0;
      }
    }
    for (let i = this.dynamicIndex.length; i < data.length; i++) {
      this.dynamicIndex[i] = 0;
    }
    this.dynamicIndex = this.dynamicIndex.slice(0, data.length);
  }

  /**
   * 触发ready
   */
  callReady() {
    this.$options.ready && this.$options.ready(...this.getChangeCallData());
  }
}

export default Layer;
