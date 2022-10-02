import React, { useCallback, useContext } from 'react'
import { Button } from '@mui/material'
import PopUpDialogs from 'src/components/PopUpDialogs'
import { AppContext } from 'src/features/common/contexts/appContext'
import { useFarmer } from '../../context'
import { getRequestItemWithoutType } from './dataFormatter'

const ApproveRequestForm = () => {
  const { isApproveRequestFormOpen, selectedRequestItem, reset } = useFarmer()
  const { tradeContract } = useContext(AppContext)
  const onCloseForm = useCallback(() => {
    reset()
  }, [reset])
  const onSubmitClick = useCallback(() => {
    if (tradeContract && selectedRequestItem) {
      const dto = getRequestItemWithoutType(selectedRequestItem)
      tradeContract.sendItemToBuyer(selectedRequestItem.riceType, dto).then(() => {
        onCloseForm()
      })
    }
  }, [onCloseForm, selectedRequestItem, tradeContract])
  return (
    <PopUpDialogs isOpen={isApproveRequestFormOpen} onClose={onCloseForm}>
      <div>Confirm to Approve?</div>
      <Button onClick={onSubmitClick}>Submit</Button>
    </PopUpDialogs>
  )
}
export default ApproveRequestForm
