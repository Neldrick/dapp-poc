/** @jsx jsx */
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { jsx } from '@emotion/react'
import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { Column, Table } from 'react-virtualized'
import { Provider } from 'src/core/network/web3/provider'
import { getEnumKeyByEnumValue } from 'src/core/utils'
import { AppContext } from 'src/features/common/contexts/appContext'
import { getPriceItemFromChain } from 'src/features/common/models/dataGetter'
import { RiceType } from 'src/features/common/models/enum'
import { IPriceItem } from 'src/features/common/models/interface'
import { generalStyles } from '../constants'
import { useFarmer } from '../context'

const FarmerPriceList = () => {
  const styling = generalStyles()
  const [isJasminExpand, setIsJasminExpand] = useState(true)
  const [isRedExpand, setIsRedExpand] = useState(true)
  const [isSushiExpand, setIsSushiExpand] = useState(true)

  const [riceSetData, setRiceSetData] = useState<{
    jasmine: IPriceItem[]
    red: IPriceItem[]
    sushi: IPriceItem[]
  }>({
    jasmine: [],
    red: [],
    sushi: [],
  })

  const { account } = useWeb3React<Provider>()
  const { tradeContract } = useContext(AppContext)
  const { isPriceListExpand, setIsPriceListExpand } = useFarmer()
  useEffect(() => {
    if (tradeContract) {
      Promise.all([
        tradeContract.getPriceListBySellerType(account, RiceType.Jasmine),
        tradeContract.getPriceListBySellerType(account, RiceType.Red),
        tradeContract.getPriceListBySellerType(account, RiceType.Sushi),
      ]).then((resultArr) => {
        setRiceSetData({
          jasmine: getPriceItemFromChain(resultArr[0]),
          red: getPriceItemFromChain(resultArr[1]),
          sushi: getPriceItemFromChain(resultArr[2]),
        })
      })
    }
  }, [account, tradeContract])

  const RiceTable = useCallback(
    (riceType: RiceType, ricePriceData: IPriceItem[], isExpand: boolean, setIsExpand: any) => {
      return (
        <div>
          <div>
            <h4 css={styling.tableTitle}>{getEnumKeyByEnumValue(RiceType, riceType)}</h4>
            <Button css={styling.tableCollapse} onClick={() => setIsExpand(!isExpand)}>
              {isExpand ? 'Collapse' : 'Expand'}
            </Button>
          </div>
          {isExpand && (
            <Table
              width={800}
              height={250}
              headerHeight={20}
              rowHeight={40}
              rowCount={ricePriceData.length}
              rowGetter={({ index }) => ricePriceData[index]}
              style={{ padding: '5px' }}
              rowStyle={{ borderBottom: '1px solid black' }}
            >
              <Column width={100} label="Size" dataKey="size" />
              <Column width={150} label="Amount" dataKey="amount" />
              <Column width={150} label="Price" dataKey="price" />
              <Column
                width={200}
                label="Start Date"
                dataKey="startDate"
                cellRenderer={({ cellData }) => new Date(cellData).toDateString()}
              />
              <Column
                width={200}
                label="End Date"
                dataKey="endDate"
                cellRenderer={({ cellData }) => new Date(cellData).toDateString()}
              />
            </Table>
          )}
        </div>
      )
    },
    [styling.tableCollapse, styling.tableTitle]
  )
  return (
    <div css={styling.container}>
      <h4 css={styling.tableTitle}> Price List</h4>
      <Button css={styling.tableCollapse} onClick={() => setIsPriceListExpand(!isPriceListExpand)}>
        {isPriceListExpand ? 'Collapse' : 'Expand'}
      </Button>
      <hr />
      {isPriceListExpand && (
        <React.Fragment>
          {RiceTable(RiceType.Jasmine, riceSetData.jasmine, isJasminExpand, setIsJasminExpand)}
          {RiceTable(RiceType.Red, riceSetData.red, isRedExpand, setIsRedExpand)}
          {RiceTable(RiceType.Sushi, riceSetData.sushi, isSushiExpand, setIsSushiExpand)}
        </React.Fragment>
      )}
    </div>
  )
}
export default FarmerPriceList
