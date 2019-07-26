import Layer from './layer';
import Dom from './dom';
import '../style/q-select.css';
import { deepClone, sameIndex, isPlainObj, assert, firstUpper } from './uitls';

function argumentsAssert(
  argumentsVar: any[],
  argumentsStr: string[],
  functionName: string,
  reject?: any
) {
  argumentsVar.forEach((v, i) => {
    if (
      !assert(
        !!v,
        `${argumentsStr[i]} is required as the first argument of ${functionName}`
      )
    ) {
      reject && reject();
    }
  });
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
        argumentsAssert(
          [column, data],
          ['column', 'data'],
          'setColumnData',
          reject
        );
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
        this.normalizeData(realData as NotGangedData, column);
        this.dataTrans = this.dataTrans.slice(0, max).filter(v => v.length);
        this.dynamicIndex = this.dynamicIndex.slice(0, max);
        this.diff(preTrans, this.dataTrans, min, true, true, true);
        this.realData = deepClone(this.dynamicData);
        resolve(this.getChangeCallData());
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
    argumentsAssert([column, index], ['column', 'index'], 'scrollTo');
    assert(!!index, 'index is required');
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
          this._setIndex(index);
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
  _setIndex(index: number[], preDataTrans?: DataTrans[][], diff?: boolean) {
    const preIndex = [...this.realIndex];
    this.dynamicIndex = [...index];
    this.realIndex = [...index];
    if (!sameIndex(preIndex, index) || diff) {
      if (!this.isGanged) {
        if (diff) {
          this.diff(
            preDataTrans as DataTrans[][],
            this.dataTrans,
            0,
            true,
            true,
            true
          );
        }
        this.dynamicIndex = [...index];
        this.realIndex = [...index];
        this.setIndexAndData(this.dataTrans);
        this.touchs
          .filter(v => !v.hidden)
          .forEach((v, i) => v.scrollTo(this.realIndex[i]));
        this.callReady();
      } else {
        const dataTransLater = this.genGangedData(
          this.data as GangedData[],
          index
        );
        this.dynamicIndex.map((v, i) => {
          if (v < 0) {
            this.dynamicIndex[i] = 0;
            this.realIndex[i] = 0;
          }
          const len = (
            dataTransLater[i] || dataTransLater[dataTransLater.length - 1]
          ).length;
          if (v > len - 1) {
            this.dynamicIndex[i] = len - 1;
            this.realIndex[i] = len - 1;
          }
          return v;
        });
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
        this._setIndex(findedIndex);
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
        this.data = data;
        this.normalizeData();
        this._setIndex(
          index ||
            Array.from<number>({ length: this.dataTrans.length }).fill(0),
          preDataTrans,
          true
        );
        resolve(this.getChangeCallData());
      } else {
        reject();
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
}

export default QSelect;
