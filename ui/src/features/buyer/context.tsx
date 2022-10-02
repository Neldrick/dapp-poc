import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { BuyerContextValue, BuyerState, ISellItemWithType } from './interface'

export const BuyerContext = createContext<BuyerContextValue | null>(null)

const BuyerReducer = (state: BuyerState, payload: Partial<BuyerState>) => ({
  ...state,
  ...payload,
})

const initialState = {
  isHoldingExpand: true,
  isPriceListExpand: true,
  isRequestListExpand: true,

  isCreateFormOpen: false,
  selectedPriceItem: null,
}

export const BuyerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(BuyerReducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <BuyerContext.Provider value={value}>{children}</BuyerContext.Provider>
}
export const useBuyer = () => {
  const context = useContext(BuyerContext)
  if (!context) {
    throw new Error('useBuyerHolding must be used within a PublishRejectProvider')
  }
  const { state, dispatch } = context

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

  const setSelectedPriceItem = useCallback(
    (selectedPriceItem: ISellItemWithType) => {
      dispatch({
        selectedPriceItem,
      })
    },
    [dispatch]
  )
  const reset = useCallback(
    () =>
      dispatch({
        isCreateFormOpen: false,
        selectedPriceItem: null,
      }),
    [dispatch]
  )

  return {
    ...state,
    setIsHoldingExpand,
    setIsPriceListExpand,
    setIsRequestListExpand,
    setIsCreateFormOpen,
    setSelectedPriceItem,
    reset,
  }
}
