/** @jsx jsx */
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { jsx } from '@emotion/react'
import { Button } from '@mui/material'
import { getTimeOfStartOfToday } from 'src/core/utils'
import { AppContext } from 'src/features/common/contexts/appContext'
import { RiceType } from 'src/features/common/models/enum'
import AddressTypeAmountInputFields from '../AddressTypeAmountInputFields'
import { addTypeAmountRowPrefix } from '../AddressTypeAmountInputFields/constant'
import { IAddressTypeAmountDate } from '../AddressTypeAmountInputFields/interface'
import AmountCompareBox from '../AmountCompareBox'
import { contentStyles } from './constant'

const IssuerForm = ({
  totalValue,
}: {
  totalValue: {
    supply: number
    farmer: number
    buyer: number
  }
}) => {
  const styling = contentStyles()
  const { tradeContract } = useContext(AppContext)
  const [issueRows, setIssueRows] = useState<IAddressTypeAmountDate[]>([
    {
      address: '',
      amount: 1,
      riceType: RiceType.Jasmine,
      startDate: getTimeOfStartOfToday(),
      endDate: getTimeOfStartOfToday(),
    },
  ])
  const totalAmountGoingToIssue = useMemo(() => {
    return issueRows.reduce((orig, ref) => orig + ref.amount, 0)
  }, [issueRows])
  const onRowChange = useCallback(
    (value: IAddressTypeAmountDate, index: number) => {
      const newArray = [...issueRows]
      newArray[index] = value
      setIssueRows(newArray)
    },
    [issueRows]
  )
  const onAddButtonClick = useCallback(() => {
    setIssueRows([
      ...issueRows,
      {
        address: '',
        amount: 1,
        riceType: RiceType.Jasmine,
        startDate: getTimeOfStartOfToday(),
        endDate: getTimeOfStartOfToday(),
      },
    ])
  }, [issueRows])
  const onRemoveBtnClick = useCallback(
    (index: number) => {
      const newIssueRow = [...issueRows]
      newIssueRow.splice(index, 1)
      setIssueRows(newIssueRow)
    },
    [issueRows]
  )
  const onSubmitClick = useCallback(() => {
    if (tradeContract) {
      tradeContract
        .setUnHarvestBalance(
          issueRows.map((x) => {
            return {
              ...x,
              seller: x.address,
              balance: x.amount,
            }
          })
        )
        .then(() => {
          alert('Finished')
        })
    }
  }, [issueRows, tradeContract])

  return (
    <div>
      <div css={styling.cmpBox}>
        <AmountCompareBox
          firstLabel="Total"
          secondLabel="To be Issued"
          value={{ firstValue: totalValue.supply, secondValue: totalAmountGoingToIssue }}
        />
        <AmountCompareBox
          firstLabel="Farmer balance"
          secondLabel="Buyer Balance"
          value={{ firstValue: totalValue.farmer, secondValue: totalValue.buyer }}
        />
      </div>
      <div css={styling.form}>
        {issueRows.map((issueRow, index) => (
          <div key={`${addTypeAmountRowPrefix}${index}`} css={styling.row}>
            <AddressTypeAmountInputFields
              value={issueRow}
              onChange={(value) => {
                onRowChange(value, index)
              }}
            />
            <Button
              variant="contained"
              css={styling.rmBtn}
              onClick={() => {
                onRemoveBtnClick(index)
              }}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <div css={styling.btnContainer}>
        <Button variant="contained" onClick={onAddButtonClick}>
          Add row
        </Button>
        <Button css={styling.submitBtn} variant="contained" onClick={onSubmitClick}>
          Submit
        </Button>
      </div>
    </div>
  )
}
export default IssuerForm
