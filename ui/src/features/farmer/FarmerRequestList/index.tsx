/** @jsx jsx */
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { jsx } from '@emotion/react'
import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { Column, Table } from 'react-virtualized'
import { Provider } from 'src/core/network/web3/provider'
import { getEnumKeyByEnumValue } from 'src/core/utils'
import { AppContext } from 'src/features/common/contexts/appContext'
import { getRequestItemFromChain } from 'src/features/common/models/dataGetter'
import { RiceType } from 'src/features/common/models/enum'
import { IRequestItem } from 'src/features/common/models/interface'
import { generalStyles } from '../constants'
import { useFarmer } from '../context'
import ApproveRequestForm from './ApproveRequestForm'

const FarmerRequestList = () => {
  const styling = generalStyles()

  const [isJasminExpand, setIsJasminExpand] = useState(true)
  const [isRedExpand, setIsRedExpand] = useState(true)
  const [isSushiExpand, setIsSushiExpand] = useState(true)

  const [riceSetData, setRiceSetData] = useState<{
    jasmine: IRequestItem[]
    red: IRequestItem[]
    sushi: IRequestItem[]
  }>({
    jasmine: [],
    red: [],
    sushi: [],
  })

  const { account } = useWeb3React<Provider>()
  const { tradeContract } = useContext(AppContext)
  const {
    isRequestListExpand,
    setIsRequestListExpand,
    setSelectedRequestItem,
    setIsApproveRequestFormOpen,
  } = useFarmer()
  const handleApproveClick = useCallback(
    (rowData: IRequestItem) => {
      setSelectedRequestItem(rowData)
      setIsApproveRequestFormOpen(true)
    },
    [setIsApproveRequestFormOpen, setSelectedRequestItem]
  )
  useEffect(() => {
    if (tradeContract) {
      Promise.all([
        tradeContract.getSellerRequestListByType(account, RiceType.Jasmine),
        tradeContract.getSellerRequestListByType(account, RiceType.Red),
        tradeContract.getSellerRequestListByType(account, RiceType.Sushi),
      ]).then((resultArr) => {
        setRiceSetData({
          jasmine: getRequestItemFromChain(resultArr[0]),
          red: getRequestItemFromChain(resultArr[1]),
          sushi: getRequestItemFromChain(resultArr[2]),
        })
      })
    }
  }, [account, tradeContract])

  const RiceTable = useCallback(
    (riceType: RiceType, ricePriceData: IRequestItem[], isExpand: boolean, setIsExpand: any) => {
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
              <Column
                width={100}
                label=""
                dataKey="approve"
                cellRenderer={({ rowData }) => (
                  <Button variant="contained" onClick={() => handleApproveClick(rowData)}>
                    Approve
                  </Button>
                )}
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
      <h4 css={styling.tableTitle}> Request List</h4>
      <Button
        css={styling.tableCollapse}
        onClick={() => setIsRequestListExpand(!isRequestListExpand)}
      >
        {isRequestListExpand ? 'Collapse' : 'Expand'}
      </Button>
      <hr />
      {isRequestListExpand && (
        <React.Fragment>
          {RiceTable(RiceType.Jasmine, riceSetData.jasmine, isJasminExpand, setIsJasminExpand)}
          {RiceTable(RiceType.Red, riceSetData.red, isRedExpand, setIsRedExpand)}
          {RiceTable(RiceType.Sushi, riceSetData.sushi, isSushiExpand, setIsSushiExpand)}
        </React.Fragment>
      )}
      <ApproveRequestForm />
    </div>
  )
}
export default FarmerRequestList
