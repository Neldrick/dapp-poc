import React, { useContext, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Provider } from 'src/core/network/web3/provider'
import { AppContext } from 'src/features/common/contexts/appContext'
import { RiceType } from 'src/features/common/models/enum'
// import { IPriceItem } from './interface'
const BuyerPriceList = ({ isFarmer }: { isFarmer: boolean }) => {
  // const [riceSetData, setRiceSetData] = useState<{
  //   jasmine: IPriceItem[]
  //   red: IPriceItem[]
  //   sushi: IPriceItem[]
  // }>({
  //   jasmine: [],
  //   red: [],
  //   sushi: [],
  // })

  // const { account } = useWeb3React<Provider>()
  // const { tradeContract } = useContext(AppContext)
  // useEffect(() => {
  //   if (tradeContract) {
  //     if (isFarmer) {
  //       Promise.all([
  //         tradeContract.getPriceListBySellerType(account, RiceType.Jasmine),
  //         tradeContract.getPriceListBySellerType(account, RiceType.Red),
  //         tradeContract.getPriceListBySellerType(account, RiceType.Sushi),
  //       ]).then((resultArr) => {
  //         setRiceSetData({ jasmine: resultArr[0], red: resultArr[1], sushi: resultArr[2] })
  //       })
  //     } else {
  //       Promise.all([
  //         tradeContract.getPriceListByType(RiceType.Jasmine),
  //         tradeContract.getPriceListByType(RiceType.Red),
  //         tradeContract.getPriceListByType(RiceType.Sushi),
  //       ]).then((resultArr) => {
  //         setRiceSetData({ jasmine: resultArr[0], red: resultArr[1], sushi: resultArr[2] })
  //       })
  //     }
  //   }
  // }, [account, isFarmer, tradeContract])
  return <div></div>
}
export default BuyerPriceList
