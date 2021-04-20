import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'

// parses URL queries for city and state. returns list of city, state.
const parseURL = (url) => {
  if (url.split('/').length > 3) {
    let state = url.slice(-2)
    let index = url.indexOf('/', 10)
    let city = url.slice(10, index)
    // standardize casing
    city = city.substring(0, 1).toUpperCase() + city.substring(1).toLowerCase()
    return [city, state]
  }
  return ['', '']
}

const Location = () => {
  // useLocation().pathname will return '/location/city/state'
  let url = useLocation().pathname
  const [city, setCity] = useState(parseURL(url)[0])
  const [state, setState] = useState(parseURL(url)[1])
  const [companies, setCompanies] = useState([''])

  useEffect(() => {
    axios
      .get('http://localhost:8081/location/' + city + '/' + state)
      .then((response) => {
        setCompanies(response.data)
      })
  }, [city, state])

  return (
    <>
      <NavBar />
      {companies.length === 0 ? (
        <>
          🤔No results found.
        </>
      ) : (
        <>
          <h2>
            Companies in {city}, {state}
          </h2>
          {companies.map((comp) => (
            <p>{comp.CompanyName}</p>
          ))}
        </>
      )}
    </>
  )
}

export default Location
