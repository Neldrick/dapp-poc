export const getPriceItemFromChain = (objArray: any[]) => {
  return objArray.map((x) => {
    return {
      seller: x.seller,
      size: parseInt(x.size._hex ?? '0', 16),
      amount: parseInt(x.amount._hex ?? '0', 16),
      price: parseInt(x.price._hex ?? '0', 16),
      startDate: parseInt(x.startDate._hex ?? '0', 16),
      endDate: parseInt(x.endDate._hex ?? '0', 16),
    }
  })
}
