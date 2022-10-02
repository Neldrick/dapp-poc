import React, { useCallback, useContext } from 'react'
import { Button } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import PopUpDialogs from 'src/components/PopUpDialogs'
import { Provider } from 'src/core/network/web3/provider'
import { AppContext } from 'src/features/common/contexts/appContext'
import { useFarmer } from '../../context'

const ApproveRequestForm = () => {
  const { isApproveRequestFormOpen, selectedRequestItem, reset } = useFarmer()
  const { account } = useWeb3React<Provider>()
  const { tradeContract } = useContext(AppContext)
  const onCloseForm = useCallback(() => {
    reset()
  }, [reset])
  const onSubmitClick = useCallback(() => {
    if (tradeContract && selectedRequestItem) {
      tradeContract.sendItemToBuyer(account, [selectedRequestItem]).then(() => {
        onCloseForm()
      })
    }
  }, [account, onCloseForm, selectedRequestItem, tradeContract])
  return (
    <PopUpDialogs isOpen={isApproveRequestFormOpen} onClose={onCloseForm}>
      <div>Confirm to Approve?</div>
      <Button onClick={onSubmitClick}>Submit</Button>
    </PopUpDialogs>
  )
}
export default ApproveRequestForm
