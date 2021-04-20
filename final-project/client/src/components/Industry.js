import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'

// parses URL queries for industry.
const parseURL = (url) => {
  if (url.split('/').length > 2) {
    let industry = url.slice(10)
    // standardize casing
    industry =
      industry.substring(0, 1).toUpperCase() +
      industry.substring(1).toLowerCase()
    return industry
  }
  return ['TEST']
}

const Industry = () => {
  // useLocation().pathname will return '/industry/sector'
  let url = useLocation().pathname
  const [industry, setIndustry] = useState(parseURL(url))
  const [topStocks, setTopStocks] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8081/industry/' + industry).then((response) => {
      setTopStocks(response.data)
    })
  }, [industry])

  return (
    <div>
      <NavBar />
      <h2>Stocks in Industry {industry}</h2>
      {topStocks.map((comp) => (
        <p>{comp.StockSymbol}</p>
      ))}
    </div>
  )
}

export default Industry
