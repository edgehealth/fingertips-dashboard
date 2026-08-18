import { applyIcbCodeAliases } from './icbCodeAliases';

describe('applyIcbCodeAliases', () => {
  it('copies a legacy-coded value onto the 2023 code used by the map', () => {
    const lookup = applyIcbCodeAliases({ E54000052: 10, E54000053: 20 });
    expect(lookup.E54000063).toBe(10); // Surrey Heartlands
    expect(lookup.E54000064).toBe(20); // Sussex
  });

  it('never overwrites a value already published under the 2023 code', () => {
    const lookup = applyIcbCodeAliases({ E54000052: 10, E54000063: 99 });
    expect(lookup.E54000063).toBe(99);
  });

  it('leaves unrelated codes untouched and handles empty input', () => {
    expect(applyIcbCodeAliases({ E54000008: 5 })).toEqual({ E54000008: 5 });
    expect(applyIcbCodeAliases({})).toEqual({});
  });
});
