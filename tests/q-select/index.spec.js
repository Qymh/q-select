import QSelect from '../../packages/@qymh/q-select/src/index.ts';

function mockError() {
  return jest.spyOn(console, 'error').mockImplementation(() => {
    jest.restoreAllMocks();
  });
}

function mockTips() {
  return jest.spyOn(console, 'warn').mockImplementation(() => {
    jest.restoreAllMocks();
  });
}

function env() {
  process.env.NODE_ENV = 'development';
}

function prod() {
  process.env.NODE_ENV = 'production';
}

describe('options', () => {
  beforeAll(() => {
    env();
  });
  afterAll(() => {
    prod();
  });

  it('works', () => {
    const ins = new QSelect();
    expect(ins).toBeDefined();
  });

  describe('validateOptions', () => {
    describe('target', () => {
      it('not has target', () => {
        const error = mockError();
        new QSelect({
          data: [[1]],
          target: '#test'
        });
        expect(error).toHaveBeenCalled();
      });

      it('hasTarget', () => {
        const $div = document.createElement('div');
        $div.id = 'test';
        document.body.appendChild($div);
        const ins = new QSelect({
          data: [[1]],
          target: '#test'
        });
        expect(ins.target).toBe($div);
        document.body.removeChild($div);
      });
    });

    describe('count', () => {
      it('odd', () => {
        const error = mockTips();
        const ins = new QSelect({
          data: [[1]],
          count: 2
        });
        expect(error).toHaveBeenCalled();
        expect(ins.count).toBe(7);
      });

      it('smaller than 5', () => {
        const error = mockTips();
        const ins = new QSelect({
          data: [[1]],
          count: 2
        });
        expect(error).toHaveBeenCalled();
        expect(ins.count).toBe(7);
      });

      it('bigger than 9', () => {
        const error = mockTips();
        const ins = new QSelect({
          data: [[1]],
          count: 10
        });
        expect(error).toHaveBeenCalled();
        expect(ins.count).toBe(7);
      });
    });

    describe('chunkHeight', () => {
      it('smaller than 30', () => {
        const error = mockTips();
        const ins = new QSelect({
          data: [[1]],
          chunkHeight: 20
        });
        expect(error).toHaveBeenCalled();
        expect(ins.chunkHeight).toBe(40);
      });

      it('bigger than 60', () => {
        const error = mockTips();
        const ins = new QSelect({
          data: [[1]],
          chunkHeight: 70
        });
        expect(error).toHaveBeenCalled();
        expect(ins.chunkHeight).toBe(40);
      });
    });

    describe('function call', () => {
      it('not a function', () => {
        const error = mockTips();
        const ins = new QSelect({
          ready: 1,
          cancel: 1,
          confirm: 1,
          show: 1,
          close: 1
        });
        expect(error).toHaveBeenCalled();
        expect(typeof ins.$options.ready).toBe('function');
        expect(typeof ins.$options.cancel).toBe('function');
        expect(typeof ins.$options.confirm).toBe('function');
        expect(typeof ins.$options.show).toBe('function');
        expect(typeof ins.$options.close).toBe('function');
      });
    });
  });

  describe('validateData', () => {
    describe('emptyData', () => {
      it('undefined Data', () => {
        const ins = new QSelect({ data: undefined });
        expect(ins.data).toStrictEqual([[{ key: '', value: '' }]]);
      });

      it('not an array', () => {
        const ins = new QSelect({ data: {} });
        expect(ins.data).toStrictEqual([[{ key: '', value: '' }]]);
      });

      it('empty array', () => {
        const ins = new QSelect({ data: [] });
        expect(ins.data).toStrictEqual([[{ key: '', value: '' }]]);
      });
    });

    describe('not ganged data', () => {
      it('not contain arrays', () => {
        const error = mockError();
        new QSelect({ data: [[], [], 123] });
        expect(error).toHaveBeenCalled();
      });

      it('object not has value', () => {
        const error = mockError();
        new QSelect({ data: [[{ test: '123' }]] });
        expect(error).toHaveBeenCalled();
      });

      it('wrong types', () => {
        const error = mockError();
        new QSelect({ data: [[() => {}]] });
        expect(error).toHaveBeenCalled();
      });
    });

    describe('ganged data', () => {
      it('first level not contain value', () => {
        const error = mockError();
        new QSelect({ data: [{ test: 123 }, { test: 456 }] });
        expect(error).toHaveBeenCalled();
      });

      it('object not has value', () => {
        const error = mockError();
        new QSelect({ data: [{ value: '123', children: [{ test: 123 }] }] });
        expect(error).toHaveBeenCalled();
      });

      it('wrong type', () => {
        const error = mockError();
        new QSelect({ data: [{ value: '123', children: [() => {}] }] });
        expect(error).toHaveBeenCalled();
      });

      it('correct', () => {
        const error = mockError();
        new QSelect({ data: [{ value: '123', children: ['123'] }] });
        expect(error).not.toHaveBeenCalled();
      });
    });
  });

  describe('validateIndex', () => {
    it('not an array', () => {
      const error = mockError();
      new QSelect({
        data: [[1]],
        index: () => {}
      });
      expect(error).toHaveBeenCalled();
    });

    it('wrong type', () => {
      const error = mockError();
      new QSelect({
        data: [[1]],
        index: ['1']
      });
      expect(error).toHaveBeenCalled();
    });

    it('correct', () => {
      const error = mockError();
      new QSelect({
        data: [[1, 2, 3]],
        index: [0]
      });
      expect(error).not.toHaveBeenCalled();
    });
  });

  describe('zIndex', () => {
    it('bkIndex', () => {
      document.body.removeChild(document.querySelector('.q-select-bk'));
      new QSelect({
        data: [[1]],
        bkIndex: 1000
      });
      const $bk = document.querySelector('.q-select-bk');
      expect($bk.style.zIndex).toBe('1000');
    });

    it('selectIndex', () => {
      const s = new QSelect({
        data: [[1]],
        selectIndex: 2000
      });
      const $select = document.querySelector(`.q-select--${s.id}`);
      expect($select.style.zIndex).toBe('2000');
    });
  });

  describe('normalizeIndex', () => {
    it('less than 0', () => {
      const s = new QSelect({
        data: [[1]],
        index: [-1]
      });
      expect(s.index).toStrictEqual([0]);
    });

    it('more than dataTrans', () => {
      const s = new QSelect({
        data: [[1, 2, 3]],
        index: [3]
      });
      expect(s.index).toStrictEqual([2]);
    });

    it('more column', () => {
      const s = new QSelect({
        data: [[1], [2]],
        index: [0, 0, 0]
      });
      expect(s.index).toStrictEqual([0, 0]);
    });

    it('less column', () => {
      const s = new QSelect({
        data: [[1], [2]],
        index: [0]
      });
      expect(s.index).toStrictEqual([0, 0]);
    });
  });

  describe('normalizeData', () => {
    it('gangedData', () => {
      const s = new QSelect({
        data: [{ value: 1, children: [1, 2] }]
      });
      expect(s.data).toStrictEqual([
        {
          value: 1,
          key: 1,
          children: [
            { value: 1, key: 1, children: [] },
            { value: 2, key: 2, children: [] }
          ]
        }
      ]);
    });

    it('notGangedData', () => {
      const s = new QSelect({
        data: [[0], [1]]
      });
      expect(s.data).toStrictEqual([
        [{ value: 0, key: 0 }],
        [{ value: 1, key: 1 }]
      ]);
    });

    it('notGangedDataWithObject', () => {
      const s = new QSelect({
        data: [[{ value: 0 }], [1]]
      });
      expect(s.data).toStrictEqual([
        [{ value: 0, key: 0 }],
        [{ value: 1, key: 1 }]
      ]);
    });
  });
});

describe('instance', () => {
  beforeAll(() => {
    env();
  });
  afterAll(() => {
    prod();
  });
  describe('setData', () => {
    describe('notGangedData', () => {
      it('set notGangedData', () => {
        const s = new QSelect({
          data: [[1], [2]]
        });
        s.setData([
          [1, 2],
          [2, 2],
          [3, 2]
        ]);
        expect(s.data).toStrictEqual([
          [
            { key: 1, value: 1 },
            { key: 2, value: 2 }
          ],
          [
            { key: 2, value: 2 },
            { key: 2, value: 2 }
          ],
          [
            { key: 3, value: 3 },
            { key: 2, value: 2 }
          ]
        ]);
        const index = s.getIndex();
        expect(index).toStrictEqual([0, 0, 0]);
        const data = s.getData();
        expect(data).toStrictEqual([
          [1, 2, 3],
          [1, 2, 3],
          [
            { key: 1, value: 1, index: 0 },
            { key: 2, value: 2, index: 0 },
            { key: 3, value: 3, index: 0 }
          ]
        ]);
      });
      it('set notGangedData and index', () => {
        const s = new QSelect({
          data: [[1], [2]]
        });
        s.setData(
          [
            [1, 2],
            [2, 2],
            [3, 2]
          ],
          [1, 0, 0]
        );
        expect(s.data).toStrictEqual([
          [
            { key: 1, value: 1 },
            { key: 2, value: 2 }
          ],
          [
            { key: 2, value: 2 },
            { key: 2, value: 2 }
          ],
          [
            { key: 3, value: 3 },
            { key: 2, value: 2 }
          ]
        ]);
        const index = s.getIndex();
        expect(index).toStrictEqual([1, 0, 0]);
        const data = s.getData();
        expect(data).toStrictEqual([
          [2, 2, 3],
          [2, 2, 3],
          [
            { key: 2, value: 2, index: 1 },
            { key: 2, value: 2, index: 0 },
            { key: 3, value: 3, index: 0 }
          ]
        ]);
      });
      it('set error notGangedData', () => {
        const s = new QSelect({
          data: [[1], [2]]
        });
        expect(s.setData([[{ f: 123 }]])).rejects.toBe('wrong data or index');
      });
    });

    describe('gangedData', () => {
      it('set GangedData', () => {
        const s = new QSelect({
          data: [{ value: 1, children: [1] }]
        });
        s.setData([{ value: 1, children: [{ value: 2, children: [3] }] }]);
        expect(s.data).toStrictEqual([
          {
            key: 1,
            value: 1,
            children: [
              {
                key: 2,
                value: 2,
                children: [{ key: 3, value: 3, children: [] }]
              }
            ]
          }
        ]);
        expect(s.getIndex()).toStrictEqual([0, 0, 0]);
        expect(s.getData()).toStrictEqual([
          [1, 2, 3],
          [1, 2, 3],
          [
            { key: 1, value: 1, index: 0 },
            { key: 2, value: 2, index: 0 },
            { key: 3, value: 3, index: 0 }
          ]
        ]);
      });
    });
  });

  describe('setIndex', () => {
    it('notGangedData', () => {
      const s = new QSelect({
        data: [
          [1, 2, 3, 4, 5],
          [1, 2, 3, 4, 5]
        ]
      });
      s.setIndex([1, 1]);
      expect(s.getIndex()).toStrictEqual([1, 1]);
      expect(s.getKey()).toStrictEqual([2, 2]);
      expect(s.getValue()).toStrictEqual([2, 2]);
      expect(s.getData()).toStrictEqual([
        [2, 2],
        [2, 2],
        [
          { key: 2, value: 2, index: 1 },
          { key: 2, value: 2, index: 1 }
        ]
      ]);
    });

    it('gangedData', () => {
      const s = new QSelect({
        data: [
          { value: 1, children: [1, 2] },
          { value: 2, children: [3, 4] }
        ]
      });
      s.setIndex([1, 1]);
      expect(s.getIndex()).toStrictEqual([1, 1]);
      expect(s.getKey()).toStrictEqual([2, 4]);
      expect(s.getValue()).toStrictEqual([2, 4]);
      expect(s.getData()).toStrictEqual([
        [2, 4],
        [2, 4],
        [
          { key: 2, value: 2, index: 1 },
          { key: 4, value: 4, index: 1 }
        ]
      ]);
    });

    it('error', () => {
      const s = new QSelect({
        data: [
          [1, 2, 3, 4, 5],
          [1, 2, 3, 4, 5]
        ]
      });
      expect(s.setIndex([null, null])).rejects.toBe(undefined);
    });

    it('no param', () => {
      const s = new QSelect({
        data: [
          [1, 2, 3, 4, 5],
          [1, 2, 3, 4, 5]
        ]
      });
      expect(s.setIndex()).rejects.toBe(undefined);
    });

    it('wrong index', () => {
      const s = new QSelect({
        data: [
          { value: 1, children: [1, 2, 3] },
          { value: 2, children: [4, 5, 6] }
        ]
      });
      s.setIndex([-1, -1]);
      expect(s.getIndex()).toStrictEqual([0, 0]);
      s.setIndex([10, 10]);
      expect(s.getIndex()).toStrictEqual([1, 2]);
    });
  });

  describe('setValue', () => {
    it('notGangedData', () => {
      const s = new QSelect({
        data: [
          [1, 2, 3, 4, 5],
          [1, 2, 3, 4, 5]
        ]
      });
      s.setValue([5, 3]);
      expect(s.getIndex()).toStrictEqual([4, 2]);
      expect(s.getKey()).toStrictEqual([5, 3]);
      expect(s.getValue()).toStrictEqual([5, 3]);
      expect(s.getData()).toStrictEqual([
        [5, 3],
        [5, 3],
        [
          { key: 5, value: 5, index: 4 },
          { key: 3, value: 3, index: 2 }
        ]
      ]);
    });

    it('gangedData', () => {
      const s = new QSelect({
        data: [
          { value: 1, children: [1, 2] },
          { value: 2, children: [3, 4] }
        ]
      });
      s.setValue([2, 3]);
      expect(s.getIndex()).toStrictEqual([1, 0]);
      expect(s.getKey()).toStrictEqual([2, 3]);
      expect(s.getValue()).toStrictEqual([2, 3]);
      expect(s.getData()).toStrictEqual([
        [2, 3],
        [2, 3],
        [
          { key: 2, value: 2, index: 1 },
          { key: 3, value: 3, index: 0 }
        ]
      ]);
    });

    it('no params', () => {
      const s = new QSelect({
        data: [
          { value: 1, children: [1, 2] },
          { value: 2, children: [3, 4] }
        ]
      });
      expect(s.setValue()).rejects.toBe(undefined);
    });
  });

  describe('setKey', () => {
    it('notGangedData', () => {
      const s = new QSelect({
        data: [
          [1, 2, 3, 4, { value: 5, key: '5k' }],
          [1, 2, { value: 3, key: '3k' }, 4, 5]
        ]
      });
      s.setKey(['5k', '3k']);
      expect(s.getIndex()).toStrictEqual([4, 2]);
      expect(s.getKey()).toStrictEqual(['5k', '3k']);
      expect(s.getValue()).toStrictEqual([5, 3]);
      expect(s.getData()).toStrictEqual([
        [5, 3],
        ['5k', '3k'],
        [
          { key: '5k', value: 5, index: 4 },
          { key: '3k', value: 3, index: 2 }
        ]
      ]);
    });

    it('gangedData', () => {
      const s = new QSelect({
        data: [
          { value: 1, children: [1, 2] },
          {
            value: 2,
            key: '2k',
            children: [{ value: 3, key: '3k' }, 4]
          }
        ]
      });
      s.setKey(['2k', '3k']);
      expect(s.getIndex()).toStrictEqual([1, 0]);
      expect(s.getKey()).toStrictEqual(['2k', '3k']);
      expect(s.getValue()).toStrictEqual([2, 3]);
      expect(s.getData()).toStrictEqual([
        [2, 3],
        ['2k', '3k'],
        [
          { key: '2k', value: 2, index: 1 },
          { key: '3k', value: 3, index: 0 }
        ]
      ]);
    });

    it('no params', () => {
      const s = new QSelect({
        data: [
          { value: 1, children: [1, 2] },
          { value: 2, children: [3, 4] }
        ]
      });
      expect(s.setKey()).rejects.toBe(undefined);
    });
  });

  it('show and close', () => {
    const s = new QSelect({
      data: [[1, 2, 3]]
    });
    s.show();
    setTimeout(() => {
      s.close();
    }, 300);
  });

  it('setLoading and cancelLoading ', () => {
    const s = new QSelect({
      data: [[1, 2, 3]]
    });
    s.setLoading();
    s.cancelLoading();
  });

  describe('scrollTo', () => {
    it('notGangedData', () => {
      const s = new QSelect({
        data: [[1, 2, 3]]
      });
      s.scrollTo(0, 2);
      expect(s.getIndex()).toStrictEqual([2]);
      expect(s.getKey()).toStrictEqual([3]);
      expect(s.getValue()).toStrictEqual([3]);
      expect(s.getData()).toStrictEqual([
        [3],
        [3],
        [{ index: 2, key: 3, value: 3 }]
      ]);
    });

    it('gangedData', () => {
      const s = new QSelect({
        data: [
          { value: 1, children: [1, 2, 3] },
          { value: 2, children: [4, 5, 6] }
        ]
      });
      s.scrollTo(1, 10);
      expect(s.getIndex()).toStrictEqual([0, 2]);
      expect(s.getKey()).toStrictEqual([1, 3]);
      expect(s.getValue()).toStrictEqual([1, 3]);
      expect(s.getData()).toStrictEqual([
        [1, 3],
        [1, 3],
        [
          { index: 0, key: 1, value: 1 },
          { index: 2, key: 3, value: 3 }
        ]
      ]);
    });

    it('no params', () => {
      const s = new QSelect({
        data: [
          { value: 1, children: [1, 2, 3] },
          { value: 2, children: [4, 5, 6] }
        ]
      });
      s.scrollTo();
      expect(s.getIndex()).toStrictEqual([0, 0]);
    });
  });

  describe('setColumnData', () => {
    it('one Data', () => {
      const s = new QSelect({
        data: [[1, 2, 3]]
      });
      s.setColumnData(1, [4, 5, 6]);

      expect(s.getIndex()).toStrictEqual([0, 0]);
      expect(s.getKey()).toStrictEqual([1, 4]);
      expect(s.getValue()).toStrictEqual([1, 4]);
      expect(s.getData()).toStrictEqual([
        [1, 4],
        [1, 4],
        [
          { index: 0, key: 1, value: 1 },
          { index: 0, key: 4, value: 4 }
        ]
      ]);
    });

    it('double Data', () => {
      const s = new QSelect({
        data: [[1, 2, 3]]
      });
      s.setColumnData(
        [1, 2],
        [
          [4, 5, 6],
          [7, 8, 9]
        ]
      );

      expect(s.getIndex()).toStrictEqual([0, 0, 0]);
      expect(s.getKey()).toStrictEqual([1, 4, 7]);
      expect(s.getValue()).toStrictEqual([1, 4, 7]);
      expect(s.getData()).toStrictEqual([
        [1, 4, 7],
        [1, 4, 7],
        [
          { index: 0, key: 1, value: 1 },
          { index: 0, key: 4, value: 4 },
          { index: 0, key: 7, value: 7 }
        ]
      ]);
    });

    it('wrong params', () => {
      const s = new QSelect({
        data: [[1, 2, 3]]
      });
      expect(s.setColumnData()).rejects.toBe('');
    });

    it('wrong data', () => {
      const s = new QSelect({
        data: [[1, 2, 3]]
      });
      s.setColumnData(1, [{ value: 1, children: [4, 5, 6] }]);
      expect(s.getIndex()).toStrictEqual([0]);
    });
  });

  describe('setTitle', () => {
    const s = new QSelect({
      data: [[1, 2, 3]],
      title: '测试'
    });
    expect(
      document.querySelector(`.q-select-header-title__value--${s.id}`).innerHTML
    ).toBe('测试');

    s.setTitle('测试另外');
    expect(
      document.querySelector(`.q-select-header-title__value--${s.id}`).innerHTML
    ).toBe('测试另外');
  });

  describe('destroy', () => {
    it('destroy', () => {
      const s = new QSelect({
        data: [[1, 2, 3]]
      });
      s.destroy();
      expect(document.querySelector(`.q-select--${s.id}`)).toBeNull();
    });
  });
});
