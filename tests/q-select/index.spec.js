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

describe('instanceFunction', () => {
  describe('setData', () => {
    it('notGangedData', () => {
      const s = new QSelect({
        data: [[1], [2]]
      });
      s.setData([[1], [2], [3]]);
      expect(s.data).toStrictEqual([
        [{ key: 1, value: 1 }],
        [{ key: 2, value: 2 }],
        [{ key: 3, value: 3 }]
      ]);
      const index = s.getIndex();
      expect(index).toStrictEqual([0, 0, 0]);
    });
  });
});

describe('actions', () => {});
