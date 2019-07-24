// eslint-disable-next-line
import Touch from './touch';

class Dom {
  public initialDomString: string;

  constructor() {
    this.initialDomString = '';
  }

  /**
   * 初始化dom
   * @param data 格式化后的data
   * @param options 配置
   * @param inline 是否是内联
   * @param callback 回调
   */
  init(
    data: DataTrans[][],
    options: QOptions,
    inline: boolean,
    callback: Function
  ) {
    const { id, loading } = options;
    const baseSize = Math.floor(options.count / 2) * options.chunkHeight;
    if (!inline) {
      this.initialDomString += `
        <div class="q-select-header q-select-header--${id}">
          <div class="q-select-header-cancel q-select-header-cancel--${id}">
            <div class="q-select-header-cancel__value q-select-header-cancel__value--${id}">${options.cancelBtn ||
        '取消'}</div>
          </div>
          <div class="q-select-header-title q-select-header-title--${id}">
            <div class="q-select-header-title__value q-select-header-title__value--${id}">${options.title ||
        '请选择'}</div>
          </div>
          <div class="q-select-header-confirm q-select-header-confirm--${id}">
            <div class="q-select-header-confirm__value q-select-header-confirm__value--${id}">${options.confirmBtn ||
        '确定'}</div>
          </div>
        </div>
      `;
    }
    this.initialDomString += `
      <div style="height:${options.count * options.chunkHeight}px;display:${
      loading ? 'flex' : 'none'
    }" class="q-select-loading q-select-loading--${id}">
        <svg class="q-select-loading-svg" viewBox="25 25 50 50">
          <circle
            class="q-select-loading-svg__circle"
            cx="50"
            cy="50"
            r="20"
            fill="none"
          />
        </svg>
      </div>
      <div style="height:${options.count *
        options.chunkHeight}px" class="q-select-box q-select-box--${id}">
    `;
    data.forEach(v => {
      this.initialDomString += `
      <div class="q-select-box-item q-select-box-item--${id}">
        <div class="q-select-box-item__overlay q-select-box-item__overlay--${id}" style="background-size: 100% ${
        !loading ? baseSize + 'px' : '100%'
      };"></div>
        <div class="q-select-box-item__highlight q-select-box-item__highlight--${id}" style="top: ${baseSize}px;height: ${
        options.chunkHeight
      }px"></div>
        <div class="q-select-box-item-collections q-select-box-item-collections--${id}">
        ${v
          .map(
            p =>
              `<div style="line-height: ${options.chunkHeight}px;" class="q-select-box-item-collections__tick q-select-box-item-collections__tick--${id}">
              ${p.value}
            </div>`
          )
          .join('')}
        </div>
      </div>
      `;
    });
    callback(this.initialDomString);
  }

  /**
   * 防止内存泄露重置变量
   */
  remove() {
    this.initialDomString = '';
  }

  static diff(
    dataTrans: DataTrans[][],
    dataTransLater: DataTrans[][],
    weight: number,
    id: number,
    chunkHeight: number,
    touches?: Touch[],
    hand?: boolean,
    callback?: Function
  ) {
    const $collections = Dom.findAll(`q-select-box-item-collections--${id}`);
    const $select = Dom.find(`q-select-box--${id}`);
    // 增加数据类型量
    if (dataTrans.length < dataTransLater.length) {
      if ($collections.length < dataTransLater.length) {
        const $overlayArr = [];
        const $chunksArr = [];
        const $highlightArr = [];
        for (let y = hand ? weight : weight + 1; y < dataTrans.length; y++) {
          const collection = $collections[y];
          Dom.diffForDatas(
            collection,
            id,
            chunkHeight,
            (touches as Touch[])[y].data,
            dataTransLater[y]
          );
        }
        for (let v = $collections.length; v < dataTransLater.length; v++) {
          const fragment = document.createDocumentFragment();
          const $box = Dom.create('div');
          Dom.addClass($box, ['q-select-box-item', `q-select-box-item--${id}`]);
          const $overlay = Dom.create('div');
          Dom.addClass($overlay, [
            'q-select-box-item__overlay',
            `q-select-box-item__overlay--${id}`
          ]);
          const $highlight = Dom.create('div');
          Dom.addClass($highlight, [
            'q-select-box-item__highlight',
            `q-select-box-item__highlight--${id}`
          ]);
          Dom.addStyle($highlight, { height: `${chunkHeight}px` });
          $box.appendChild($overlay);
          $box.appendChild($highlight);
          const $chunks = Dom.create('div');
          Dom.addClass($chunks, [
            'q-select-box-item-collections',
            `q-select-box-item-collections--${id}`
          ]);
          for (let y = 0; y < dataTransLater[v].length; y++) {
            const $div = Dom.create('div');
            Dom.addClass($div, [
              'q-select-box-item-collections__tick',
              `q-select-box-item-collections__tick--${id}`
            ]);
            Dom.addStyle($div, { lineHeight: `${chunkHeight}px` });
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
      } else {
        for (
          let y = hand ? weight : weight + 1;
          y < dataTransLater.length;
          y++
        ) {
          const collection = Dom.findIndex(
            `q-select-box-item-collections--${id}`,
            y
          );
          Dom.diffForDatas(
            collection,
            id,
            chunkHeight,
            (touches as Touch[])[y].data,
            dataTransLater[y]
          );
        }
        callback && callback();
      }
    }
    // 当数据的类型量一样
    else if (dataTrans.length === dataTransLater.length) {
      for (let y = hand ? weight : weight + 1; y < dataTransLater.length; y++) {
        Dom.diffForDatas(
          $collections[y],
          id,
          chunkHeight,
          dataTrans[y],
          dataTransLater[y]
        );
      }
      callback && callback();
    }
    // 减少数据量
    else if (dataTrans.length > dataTransLater.length) {
      for (let y = hand ? weight : weight + 1; y < dataTransLater.length; y++) {
        Dom.diffForDatas(
          $collections[y],
          id,
          chunkHeight,
          dataTrans[y],
          dataTransLater[y]
        );
      }
      callback && callback();
    }
  }

  static diffForDatas(
    collect: HTMLElement,
    id: number,
    chunkHeight: number,
    dataTransList: DataTrans[],
    dataTransListLater: DataTrans[]
  ) {
    const diffLen = dataTransListLater.length - dataTransList.length;
    const dataTransListLen = dataTransList.length;
    const dataTransListLaterLen = dataTransListLater.length;
    if (diffLen > 0) {
      const fragment = document.createDocumentFragment();
      for (let y = 0; y < dataTransListLen; y++) {
        const { value } = dataTransListLater[y];
        collect.children[y].textContent = value;
      }
      for (let y = dataTransListLen; y < dataTransListLaterLen; y++) {
        const div = document.createElement('div');
        const { value } = dataTransListLater[y];
        Dom.addClass(div, [
          'q-select-box-item-collections__tick',
          `q-select-box-item-collections__tick--${id}`
        ]);
        Dom.addStyle(div, { lineHeight: `${chunkHeight}px` });
        div.textContent = value;
        fragment.appendChild(div);
      }
      collect.appendChild(fragment);
    } else {
      for (let y = 0; y < dataTransListLaterLen; y++) {
        const { value } = dataTransListLater[y];
        collect.children[y].textContent = value;
      }
      const children = [...Array.from(collect.children)];
      for (let y = dataTransListLaterLen; y < dataTransListLen; y++) {
        collect.removeChild(children[y]);
      }
    }
  }

  static create(tag: string): HTMLElement {
    return document.createElement(tag);
  }

  static find(className: string): HTMLElement {
    return document.querySelector(`.${className}`) as HTMLElement;
  }

  static findIndex(className: string, index: number): HTMLElement {
    const $els = Array.from(document.querySelectorAll(`.${className}`));
    return $els[index] as HTMLElement;
  }

  static findLast(className: string): HTMLElement {
    const $els = Array.from(document.querySelectorAll(`.${className}`));
    return $els[$els.length - 1] as HTMLElement;
  }

  static addClass(el: HTMLElement, className: string | string[]) {
    el.className = Array.isArray(className) ? className.join(' ') : className;
  }

  static addStyle(el: HTMLElement, style: obj | obj[]) {
    if (Array.isArray(style)) {
      style.map(v => this.addStyle(el, v));
    } else {
      for (const key in style) {
        el.style[key as any] = style[key];
      }
    }
  }

  static remove(parent: HTMLElement, child: HTMLElement) {
    parent.removeChild(child);
  }

  static findAll(className: string): NodeListOf<HTMLElement> {
    return document.querySelectorAll(`.${className}`);
  }

  static bind(
    el: HTMLElement,
    event: string,
    fn: (this: HTMLElement, e: any) => any,
    options?: any
  ) {
    el.addEventListener(event, fn, options);
  }

  static unbind(el: HTMLElement, event: string) {
    el.removeEventListener(event, () => {});
  }
}

export default Dom;
