import QSelect from '../../packages/@qymh/q-select/src/index.ts';

function mockError() {
  return jest.spyOn(console, 'error').mockImplementation(() => {});
}

// function env() {
//   process.env.NODE_ENV = 'development';
// }

// function prod() {
//   process.env.NODE_ENV = 'production';
// }

describe('options', () => {
  it('works', () => {
    const ins = new QSelect();
    expect(ins).toBeDefined();
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

      describe('not ganged data', () => {
        it('not contain arrays', () => {
          const error = mockError();
          new QSelect({ data: [[], [], 123] });
          expect(error).toHaveBeenCalled();
        });
      });
    });
  });

  // it('NotGangedData', () => {

  // })
});
