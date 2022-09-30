import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { FarmerHoldingContextValue, FarmerHoldingState } from '../interface'
import { IFramerHolding } from './interface'

export const FarmerHoldingContext = createContext<FarmerHoldingContextValue | null>(null)

const farmerHoldingReducer = (state: FarmerHoldingState, payload: Partial<FarmerHoldingState>) => ({
  ...state,
  ...payload,
})

const initialState = {
  isCreateFormOpen: false,
  selectedBalance: null,
}

export const FarmerHoldingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(farmerHoldingReducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])

  return <FarmerHoldingContext.Provider value={value}>{children}</FarmerHoldingContext.Provider>
}
export const useFarmerHolding = () => {
  const context = useContext(FarmerHoldingContext)
  if (!context) {
    throw new Error('useFarmerHolding must be used within a PublishRejectProvider')
  }
  const { state, dispatch } = context

  const setIsCreateFormOpen = useCallback(
    (isCreateFormOpen: boolean) => {
      dispatch({
        isCreateFormOpen,
      })
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
  const reset = useCallback(() => dispatch(initialState), [dispatch])

  return {
    ...state,
    setIsCreateFormOpen,
    setSelectedBalance,
    reset,
  }
}
