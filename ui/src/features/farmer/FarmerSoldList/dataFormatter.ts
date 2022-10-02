export const getSoldItemList = (arr: any[]) => {
  return arr.map((x) => {
    console.log(x)
    return {
      buyer: x.buyer,
      riceType: x.riceType,
      amount: parseInt(x.amount._hex ?? 0, 16),
      price: parseInt(x.price._hex ?? '0', 16),
      startDate: parseInt(x.startDate._hex ?? '0', 16),
      endDate: parseInt(x.endDate._hex ?? '0', 16),
      soldTime: parseInt(x.soldTime._hex ?? '0', 16),
    }
  })
}
