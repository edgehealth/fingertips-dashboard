// Some rows are still published under pre-2023 ONS ICB codes, while the
// boundary file uses the 2023 codes; unmapped, those ICBs show "no data".
export const ICB_CODE_ALIASES: Record<string, string> = {
  E54000052: 'E54000063', // NHS Surrey Heartlands ICB
  E54000053: 'E54000064', // NHS Sussex ICB
};

/**
 * Copy values published under a legacy ICB code onto the current (2023) code.
 * Fill-only: a value already present under the current code is never overwritten.
 */
export const applyIcbCodeAliases = <T>(lookup: { [areaCode: string]: T }): { [areaCode: string]: T } => {
  Object.entries(ICB_CODE_ALIASES).forEach(([legacyCode, currentCode]) => {
    if (lookup[legacyCode] !== undefined && lookup[currentCode] === undefined) {
      lookup[currentCode] = lookup[legacyCode];
    }
  });
  return lookup;
};
