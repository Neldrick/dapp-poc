export const getHoldingItemList = (arr: any[]) => {
  return arr.map((x: any) => {
    return {
      balance: parseInt(x.balance._hex ?? '0', 16),
      startDate: parseInt(x.startDate._hex ?? '0', 16),
      endDate: parseInt(x.endDate._hex ?? '0', 16),
      riceType: x.riceType,
    }
  })
}
