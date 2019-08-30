import Layer from './layer';
import Dom from './dom';
import '../style/q-select.css';
import {
  deepClone,
  sameIndex,
  isPlainObj,
  assert,
  firstUpper,
  isDefined
} from './uitls';

function argumentsAssert(
  argumentsVar: any[],
  argumentsStr: string[],
  functionName: string,
  reject?: any
) {
  let bool = false;
  argumentsVar.forEach((v, i) => {
    if (
      !assert(
        isDefined(v),
        `${argumentsStr[i]} is required as the ${i} argument of ${functionName}`
      )
    ) {
      if (!bool) {
        bool = true;
      }
      reject && reject();
    }
  });
  return bool;
}

class QSelect extends Layer {
  /**
   * 设置一行值
   * @param column 栏目索引
   * @param data 要设置的值
   */
  setColumnData(
    column: number | number[],
    data: NotGangedData | NotGangedData[]
  ) {
    return new Promise((resolve, reject) => {
      try {
        if (
          argumentsAssert(
            [column, data],
            ['column', 'data'],
            'setColumnData',
            reject
          )
        ) {
          return;
        }

        if (this.touchs.filter(v => !v.hidden).some(v => v.isAnimating)) {
          reject('[SelectQ]: Please wait for animating stops');
          return;
        }

        const preTrans = [...this.dataTrans];
        let realData = [];
        if (Array.isArray(column)) {
          let i = 0;
          for (const item of column) {
            realData[+item] = data[i];
            i++;
          }
        } else {
          realData = data;
        }
        const max = Array.isArray(column)
          ? column[column.length - 1] + 1
          : column + 1;
        const min = Array.isArray(column) ? column[0] : column;
        const validateData = Array.isArray(column) ? realData : [realData];
        if (this.validateData(validateData as any, false)) {
          this.normalizeData(realData as NotGangedData, column);
          this.dataTrans = this.dataTrans.slice(0, max).filter(v => v.length);
          this.normalizeIndex(this.dataTrans, this.dynamicIndex);
          this.realIndex = [...this.dynamicIndex];
          this.diff(preTrans, this.dataTrans, min, true, true, true);
          this.realData = deepClone(this.dynamicData);
          resolve(this.getChangeCallData());
        } else {
          reject();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 单栏目滚动
   * @param column 栏目索引
   * @param index 索引
   */
  scrollTo(column: number, index: number) {
    if (argumentsAssert([column, index], ['column', 'index'], 'scrollTo')) {
      return;
    }
    const later = [...this.dynamicIndex];
    later[column] = index;
    return this.setIndex(later);
  }

  /**
   * 设置索引
   * @param index 当前索引集合
   */
  setIndex(index: number[]) {
    return new Promise((resolve, reject) => {
      try {
        argumentsAssert([index], ['index'], 'setIndex', reject);
        if (this.validateIndex(index)) {
          this._setIndex(index, reject);
          resolve(this.getChangeCallData());
        } else {
          reject();
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 底层设置索引方法
   * @param index 索引集合
   * @param preDataTrans
   * @param diff 是否需要进行diff
   */
  _setIndex(
    index: number[],
    reject: Function,
    preDataTrans?: DataTrans[][],
    diff?: boolean
  ) {
    if (this.touchs.filter(v => !v.hidden).some(v => v.isAnimating)) {
      reject('[SelectQ]: Please wait for animating stops');
      return;
    }
    const preIndex = [...this.dynamicIndex];
    this.dynamicIndex = [...index];
    this.realIndex = [...index];
    if (!sameIndex(preIndex, index) || diff) {
      if (!this.isGanged) {
        this.normalizeIndex(this.dataTrans, index);
        if (diff) {
          this.diff(
            preDataTrans as DataTrans[][],
            this.dataTrans,
            0,
            true,
            !(index && index.length),
            true
          );
        }
        this.setIndexAndData(this.dataTrans);
        this.touchs
          .filter(v => !v.hidden)
          .forEach((v, i) => v.scrollTo(this.realIndex[i] || 0));
        this.callReady();
      } else {
        const dataTransLater = this.genGangedData(
          this.data as GangedData[],
          this.dynamicIndex
        );
        this.diff(
          preDataTrans || this.dataTrans,
          dataTransLater,
          0,
          true,
          false,
          true
        );
        this.realIndex = [...this.dynamicIndex];
        this.realData = deepClone(this.dynamicData);
        this.callReady();
      }
      this.touchs
        .filter(v => !v.hidden)
        .forEach((v, i) => {
          v.curIndex = v.preIndex = this.realIndex[i] || 0;
        });
    }
  }

  /**
   * 设置值
   * @param value 值集合
   */
  setValue(value: any[]) {
    return this._setKeyAndValue('value', value);
  }

  /**
   * 设置key
   * @param key key集合
   */
  setKey(key: any[]) {
    return this._setKeyAndValue('key', key);
  }

  /**
   * 底层设置key和索引方法
   * @param type 类型
   * @param value 集合
   */
  _setKeyAndValue(type: 'key' | 'value', value: any[]) {
    return new Promise((resolve, reject) => {
      argumentsAssert([value], [type], `set${firstUpper(type)}`, reject);
      const findedIndex: number[] = [];
      let index = 0;
      function findIndex(data: GangedData[]) {
        data.forEach((v, i) => {
          if (v[type] === value[index]) {
            index++;
            findedIndex.push(i);
            findIndex(v.children);
          }
        });
      }
      try {
        if (this.isGanged) {
          findIndex(this.data as GangedData[]);
          const dataTransLater = this.genGangedData(
            this.data as GangedData[],
            findedIndex
          );
          for (let y = findedIndex.length; y < dataTransLater.length; y++) {
            findedIndex[y] = 0;
          }
        } else {
          this.dataTrans.forEach((v, i) => {
            const res = v.findIndex(w => w[type] === value[i]);
            findedIndex.push(res === -1 ? 0 : res);
          });
        }
        this._setIndex(findedIndex, reject);
        resolve(this.getChangeCallData());
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 重新渲染值
   * @param data 重置的data
   * @param index 重置的索引
   */
  setData(data: Data, index?: number[]) {
    return new Promise((resolve, reject) => {
      this.isGanged = data.every((v: any) => isPlainObj(v));
      if (
        this.validateData(data) &&
        (index ? this.validateIndex(index) : true)
      ) {
        const preDataTrans = deepClone(this.dataTrans);
        this.data = deepClone(data);
        this.normalizeData();
        this._setIndex(
          index ||
            Array.from<number>({ length: this.dataTrans.length }).fill(0),
          reject,
          preDataTrans,
          true
        );
        resolve(this.getChangeCallData());
      } else {
        reject('wrong data or index');
      }
    });
  }

  /**
   * 获取当前的data集合
   */
  getData() {
    return this.getChangeCallData();
  }

  /**
   * 获取当前索引
   */
  getIndex() {
    return this.realIndex;
  }

  /**
   * 获取当前value
   */
  getValue() {
    return this.dynamicData.reduce((acc: any[], val) => {
      acc.push(val.value);
      return acc;
    }, []);
  }

  /**
   * 获取当前key
   */
  getKey() {
    return this.dynamicData.reduce((acc: any[], val) => {
      acc.push(val.key);
      return acc;
    }, []);
  }

  /**
   * 关闭选择框
   */
  close() {
    return this.closeSelect();
  }

  /**
   * 显示选择框
   */
  show() {
    return this.showSelect();
  }

  /**
   * 摧毁选择框
   */
  destroy() {
    return this.destroySelect();
  }

  /**
   * 设置loading加载
   */
  setLoading() {
    this.loading = true;
    const $loading = Dom.find(`q-select-loading--${this.id}`);
    Dom.addStyle($loading, [{ display: 'flex' }]);
    this.touchs
      .filter(v => !v.hidden)
      .forEach(v => {
        v.shrinkSize();
      });
  }

  /**
   * 取消loading加载
   */
  cancelLoading() {
    this.loading = false;
    const $loading = Dom.find(`q-select-loading--${this.id}`);
    Dom.addStyle($loading, { display: 'none' });
    this.touchs
      .filter(v => !v.hidden)
      .forEach(v => {
        v.setSize();
      });
  }

  /**
   * 设置标题
   * @param title 标题
   */
  setTitle(title: string) {
    if (!argumentsAssert([title], ['title'], 'setTitle')) {
      const $title = Dom.find(`q-select-header-title__value--${this.id}`);
      $title.innerHTML = title;
    }
  }
}

export default QSelect;
