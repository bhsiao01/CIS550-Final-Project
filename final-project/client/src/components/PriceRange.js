import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'

// parses URL queries for price min and max.
const parseURL = (url) => {
  if (url.split('/').length > 3) {
    let state = url.slice(-2)
    let index = url.indexOf('/', 10)
    let city = url.slice(10, index)
    // standardize casing
    city = city.substring(0, 1).toUpperCase() + city.substring(1).toLowerCase()
    return [city, state]
  }

  return []
}

const Location = () => {
  // useLocation().pathname will return '/location/city/state'
  let url = useLocation().pathname
  // const [] = useState(true)
  const [city, setCity] = useState(parseURL(url)[0])
  const [state, setState] = useState(parseURL(url)[1])
  const [avgHome, setAvgHome] = useState([''])
  const [cityStat, setCityStat] = useState([''])

  useEffect(() => {
    axios
      .get('http://localhost:8081/getAverageHome/' + city + '/' + state)
      .then((response) => {
        setAvgHome(response.data)
      })
    axios
      .get('http://localhost:8081/getCityStat/' + city + '/' + state)
      .then((response) => {
        setCityStat(response.data)
      })
  }, [city, state])

  return (
    <>
      <NavBar />
      {avgHome.length === 0 ? (
        <>🤔No results found.</>
      ) : (
        <>
          <h2>
            Companies in {city}, {state}
          </h2>
          {avgHome.map((comp) => (
            <p>{comp.CompanyName}</p>
          ))}
        </>
      )}
    </>
  )
}

export default PriceRange
