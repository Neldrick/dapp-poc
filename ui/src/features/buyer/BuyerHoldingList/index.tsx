/** @jsx jsx */
import { useContext, useEffect, useState } from 'react'
import { jsx } from '@emotion/react'
import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { Column, Table } from 'react-virtualized'
import { Provider } from 'src/core/network/web3/provider'
import { getEnumKeyByEnumValue } from 'src/core/utils'
import { AppContext } from 'src/features/common/contexts/appContext'
import { RiceType } from 'src/features/common/models/enum'
import { generalStyles } from '../constants'
import { useBuyer } from '../context'
import { getBuyerHoldingFromChain } from './dataGetter'
import { IBuyerHoldingItem } from './interface'

const BuyerHoldingList = () => {
  const styling = generalStyles()
  const { tradeContract } = useContext(AppContext)
  const { account } = useWeb3React<Provider>()
  const [holdingList, setHoldingList] = useState<IBuyerHoldingItem[]>([])
  const { isHoldingExpand, setIsHoldingExpand } = useBuyer()
  useEffect(() => {
    if (tradeContract) {
      tradeContract.getBuyerBalance(account).then((resultArr: any[]) => {
        setHoldingList(getBuyerHoldingFromChain(resultArr))
      })
    }
  }, [account, tradeContract])
  return (
    <div css={styling.container}>
      <h4 css={styling.tableTitle}> Holding List</h4>
      <Button css={styling.tableCollapse} onClick={() => setIsHoldingExpand(!isHoldingExpand)}>
        {isHoldingExpand ? 'Collapse' : 'Expand'}
      </Button>
      <hr />
      {isHoldingExpand && (
        <Table
          width={800}
          height={250}
          headerHeight={20}
          rowHeight={40}
          rowCount={holdingList.length}
          rowGetter={({ index }) => holdingList[index]}
          style={{ padding: '5px' }}
          rowStyle={{ borderBottom: '1px solid black' }}
        >
          <Column
            width={80}
            label="Type"
            dataKey="riceType"
            cellRenderer={({ cellData }) => getEnumKeyByEnumValue(RiceType, cellData)}
          />
          <Column width={120} label="Seller" dataKey="seller" />
          <Column width={80} label="Amount" dataKey="amount" />
          <Column width={80} label="Price" dataKey="price" />
          <Column
            width={180}
            label="Start Date"
            dataKey="startDate"
            cellRenderer={({ cellData }) => new Date(cellData).toDateString()}
          />
          <Column
            width={180}
            label="End Date"
            dataKey="endDate"
            cellRenderer={({ cellData }) => new Date(cellData).toDateString()}
          />
        </Table>
      )}
    </div>
  )
}
export default BuyerHoldingList
