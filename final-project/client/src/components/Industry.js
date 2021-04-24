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
  const [topMean, setTopMean] = useState([])
  const [topRev, setTopRev] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8081/getMeanPriceIndustry/' + industry).then((response) => {
      setTopMean(response.data)
    })
    axios
      .get('http://localhost:8081/getTop10Rev/' + industry)
      .then((response) => {
        setTopRev(response.data)
      })
  }, [industry])

  console.log("HI" + topRev)
  return (
    <div>
      <NavBar />
      <div>
        <h2>Stocks in the {industry} Industry</h2>
        {topMean.map((region) => (
            <p>{region.RegionName}: Mean price of ${region.mean}</p>
        ))}
      </div>
      <div>
          {topRev.map((comp) => (
              <div>
                <p>{comp.StockSymbol}</p>
                <p>{comp.CompanyName}</p>
                <p>Revenue: ${comp.Revenue}</p>
                <p>Location: {comp.City}, {comp.StateAbbr}</p>
                <p>Housing value change: ${comp.HousingValueChange} </p>
              </div>
          ))}
      </div>
    </div>
  )
}

export default Industry
