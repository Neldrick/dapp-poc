import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { IRequestItem } from '../common/models/interface'
import { FarmerContextValue, FarmerState, IFramerHolding } from './interface'

export const FarmerContext = createContext<FarmerContextValue | null>(null)

const farmerReducer = (state: FarmerState, payload: Partial<FarmerState>) => ({
  ...state,
  ...payload,
})

const initialState = {
  isUnHaverstListExpand: true,
  isHoldingExpand: true,
  isPriceListExpand: true,
  isRequestListExpand: true,

  isCreateFormOpen: false,
  isHarvestFormOpen: false,
  isApproveRequestFormOpen: false,
  selectedRequestItem: null,
  selectedBalance: null,
}

export const FarmerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(farmerReducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <FarmerContext.Provider value={value}>{children}</FarmerContext.Provider>
}
export const useFarmer = () => {
  const context = useContext(FarmerContext)
  if (!context) {
    throw new Error('useFarmerHolding must be used within a PublishRejectProvider')
  }
  const { state, dispatch } = context

  const setIsUnHaverstListExpand = useCallback(
    (isUnHaverstListExpand: boolean) => {
      dispatch({
        isUnHaverstListExpand,
      })
    },
    [dispatch]
  )
  const setIsHoldingExpand = useCallback(
    (isHoldingExpand: boolean) => {
      dispatch({
        isHoldingExpand,
      })
    },
    [dispatch]
  )
  const setIsPriceListExpand = useCallback(
    (isPriceListExpand: boolean) => {
      dispatch({
        isPriceListExpand,
      })
    },
    [dispatch]
  )
  const setIsRequestListExpand = useCallback(
    (isRequestListExpand: boolean) => {
      dispatch({
        isRequestListExpand,
      })
    },
    [dispatch]
  )
  const setIsCreateFormOpen = useCallback(
    (isCreateFormOpen: boolean) => {
      dispatch({
        isCreateFormOpen,
      })
    },
    [dispatch]
  )
  const setIsClaimFormOpen = useCallback(
    (isHarvestFormOpen: boolean) => {
      dispatch({ isHarvestFormOpen })
    },
    [dispatch]
  )
  const setSelectedBalance = useCallback(
    (selectedBalance: IFramerHolding) => {
      dispatch({
        selectedBalance,
      })
    },
    [dispatch]
  )
  const setSelectedRequestItem = useCallback(
    (selectedRequestItem: IRequestItem) => {
      dispatch({
        selectedRequestItem,
      })
    },
    [dispatch]
  )
  const setIsApproveRequestFormOpen = useCallback(
    (isApproveRequestFormOpen: boolean) => {
      dispatch({ isApproveRequestFormOpen })
    },
    [dispatch]
  )
  const reset = useCallback(() => dispatch(initialState), [dispatch])

  return {
    ...state,
    setIsUnHaverstListExpand,
    setIsHoldingExpand,
    setIsPriceListExpand,
    setIsRequestListExpand,
    setIsCreateFormOpen,
    setIsClaimFormOpen,
    setSelectedBalance,
    setSelectedRequestItem,
    setIsApproveRequestFormOpen,
    reset,
  }
}
