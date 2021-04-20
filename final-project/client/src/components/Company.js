import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'

// parses URL queries for company name.
const parseURL = (url) => {
  if (url.split('/').length > 2) {
    let company = url.slice(9)
    // standardize casing
    company = company.toUpperCase()
    return company
  }
  return ['TEST']
}

const Company = (props) => {
  // useLocation().pathname will return '/company/ticker'
  let url = useLocation().pathname
  const [company, setCompany] = useState(parseURL(url))
  const [prices, setPrices] = useState([''])

  useEffect(() => {
    axios.get('http://localhost:8081/company/' + company).then((response) => {
      setPrices(response.data)
    })
  }, [company])

  return (
    <div>
      <NavBar />
      <h2>Stock Prices for {company}</h2>
      {prices.map((price) => (
        <>
        <p>{price.High}</p>
        </>
      ))}
    </div>
  )
}

export default Company
