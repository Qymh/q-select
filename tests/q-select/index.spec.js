import QSelect from '../../packages/@qymh/q-select/src/index.ts';

describe('options', () => {
  it('works', () => {
    const ins = new QSelect({ data: [[]] });
    expect(ins).toBeDefined();
  });
});
