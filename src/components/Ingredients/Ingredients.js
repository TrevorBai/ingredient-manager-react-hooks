import React, { useReducer, useEffect, useCallback, useMemo } from 'react'

import IngredientForm from './IngredientForm'
import ErrorModal from '../UI/ErrorModal'
import Search from './Search'
import IngredientList from './IngredientList'
import useHttp from '../../hooks/http'


// Decoupled with the actual component so that it will not being re-rendered
const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get there!')
  }
}

const Ingredients = () => {
  // const [ userIngredients, setUserIngredients ] = useState([])
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, [])
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifier, clear } = useHttp()
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState()
  

  useEffect(() => {
    // console.log('RENDERING INGREDIENTS', userIngredients)
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra})
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD', ingredient: {
          id: data.name,
          ...reqExtra
      }})
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error])

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients)
    dispatch({ type: 'SET', ingredients: filteredIngredients})
  }, []) // with that extra [], useEffect acts like componentDidMount, otherwise it acts like componentDidUpdate

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest('https://react-hooks-update-bcfde.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
    // setIsLoading(true)
    // dispatchHttp({ type: 'SEND' })
    // fetch('https://react-hooks-update-bcfde.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: { 'Content-Type': 'application/json' }
    // }).then(res => {
    //   // setIsLoading(false)
    //   dispatchHttp({ type: 'RESPONSE' })
    //   return res.json()
    // }
    // ).then(resData => {
    //   console.log(resData)
    //   // setUserIngredients(prevIngredients => [
    //   //   ...prevIngredients,
    //   //   { id: resData.name,
    //   //     ...ingredient
    //   //   }
    //   // ])
    //   dispatch({
    //     type: 'ADD', 
    //     ingredient: {
    //       id: resData.name,
    //        ...ingredient
    //     }
    //   })
    // })
  }, [sendRequest])

  const removeIngredientHandler = useCallback(id => {
    // setIsLoading(true)
    // dispatchHttp({ type: 'SEND' })
    sendRequest(`https://react-hooks-update-bcfde.firebaseio.com/ingredients/${id}.json`,
      'DELETE',
      null,
      id,
      'REMOVE_INGREDIENT'
    )
  }, [sendRequest])

  // const clearError = useCallback(() => {
  //   // setError(null)
  //   // dispatchHttp({ type: 'CLEAR' })
  //   clear()
  // }, [])

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler} />
    )
  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  )
}

export default Ingredients
