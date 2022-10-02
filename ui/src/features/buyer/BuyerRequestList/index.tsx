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
import { getBuyerRequestItemFromChain, IBuyerRequestItem } from './interface'

const BuyerRequestList = () => {
  const styling = generalStyles()
  const { tradeContract } = useContext(AppContext)
  const { account } = useWeb3React<Provider>()
  const [requestList, setRequestList] = useState<IBuyerRequestItem[]>([])
  const { isRequestListExpand, setIsRequestListExpand } = useBuyer()
  useEffect(() => {
    if (tradeContract) {
      Promise.all([
        tradeContract.getBuyerRequestListByType(account, RiceType.Jasmine),
        tradeContract.getBuyerRequestListByType(account, RiceType.Red),
        tradeContract.getBuyerRequestListByType(account, RiceType.Sushi),
      ]).then((resultArr: any[]) => {
        console.log(resultArr)
        setRequestList([
          ...getBuyerRequestItemFromChain(resultArr[0], RiceType.Jasmine),
          ...getBuyerRequestItemFromChain(resultArr[1], RiceType.Red),
          ...getBuyerRequestItemFromChain(resultArr[2], RiceType.Sushi),
        ])
      })
    }
  }, [account, tradeContract])
  return (
    <div css={styling.container}>
      <h4 css={styling.tableTitle}> Request List</h4>
      <Button
        css={styling.tableCollapse}
        onClick={() => setIsRequestListExpand(!isRequestListExpand)}
      >
        {isRequestListExpand ? 'Collapse' : 'Expand'}
      </Button>
      <hr />
      {isRequestListExpand && (
        <Table
          width={800}
          height={250}
          headerHeight={20}
          rowHeight={40}
          rowCount={requestList.length}
          rowGetter={({ index }) => requestList[index]}
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
          <Column width={80} label="Size" dataKey="size" />
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
export default BuyerRequestList
