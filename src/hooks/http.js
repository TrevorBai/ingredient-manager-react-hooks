import { useReducer, useCallback } from 'react'

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null, data: null, extra: null, identifier: action.identifier }
    case 'RESPONSE':
      return { ...curHttpState, loading: false, data: action.resData, extra: action.extra }
    case 'ERROR':
      return { loading: false, error: action.error }
    case 'CLEAR':
      return initialState
    default:
      throw new Error('Should not be reached!')
  }
}

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)

  const clear = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' })
  }, [])
  
  const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier })
    fetch(
      // `https://react-hooks-update-bcfde.firebaseio.com/ingredients/${id}.json`,
      url,
      {
      method,
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(resData => {
      // setIsLoading(false)
      dispatchHttp({ type: 'RESPONSE', resData, extra: reqExtra })
      // setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id))
      // dispatch({ type: 'DELETE', id })
    }).catch(e => {
      // setError(`Something went wrong! ${e.message}`)
      // setIsLoading(false)
      dispatchHttp({ type: 'ERROR', error: `Something went wrong! ${e.message}` })
    })
  }, [])

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear
  }
}

export default useHttp