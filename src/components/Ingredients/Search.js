import React, { useState, useEffect, useRef } from 'react'

import Card from '../UI/Card'

import './Search.css'
import useHttp from '../../hooks/http'
import ErrorModal from '../UI/ErrorModal'

const Search = React.memo(props => {
  const { onLoadIngredients } = props
  const [enteredFilter, setEnteredFilter] = useState('')
  const inputRef = useRef()
  const { isLoading, error, data, sendRequest, clear } = useHttp()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length ? `?orderBy="title"&equalTo="${enteredFilter}"`: ''
        sendRequest(`https://react-hooks-update-bcfde.firebaseio.com/ingredients.json${query}`,
          'GET'
        )
        // fetch(`https://react-hooks-update-bcfde.firebaseio.com/ingredients.json${query}`)
        //   .then(res => res.json())
        //   .then(resData => {
        //   })
      }
    }, 500)
    return () => {
      clearTimeout(timer)
    }  // clean up function
  }, [enteredFilter, inputRef, sendRequest])

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = []
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })
      }
      onLoadIngredients(loadedIngredients)
    }
  }, [data, isLoading, error, onLoadIngredients])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
          <input 
            ref={inputRef}
            type="text" 
            value={enteredFilter} 
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  )
})

export default Search
