import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import { Grid } from '@material-ui/core'

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
  const [topMean, setTopMean] = useState([])    // TODO : May need to remove this query (kind of redundant)
  const [topRev, setTopRev] = useState([])
  const [homes, setHomes] = useState([])
  const [highPrice, setHighPrice] = useState([])

  useEffect(() => {
    axios.get('http://localhost:8081/getMeanPriceIndustry/' + industry).then((response) => {
      setTopMean(response.data)
    })
    axios
      .get('http://localhost:8081/getTop10Rev/' + industry)
      .then((response) => {
        setTopRev(response.data)
      })
    axios
      .get('http://localhost:8081/getHighPriceIndustry/' + industry)
      .then((response) => {
        setHighPrice(response.data)
      })
    axios
      .get('http://localhost:8081/getSectorHome/' + industry)
      .then((response) => {
        setHomes(response.data)
      })
  }, [industry])

  console.log("HI" + highPrice)
  return (
    <div>
      <NavBar />
      <Grid
        container
        direction={'row'}
        spacing={4}
        style={{ textAlign: 'left' }}
      >
        <Grid item xs={2} />
        <Grid item xs={8}>
        <h2>Stocks in the {industry} Industry</h2>
          <Grid container direction={'row'} spacing={4}>
            <Grid item xs={6}>
              <h3>City with the most expensive housing in the {industry} Industry </h3>
                {topMean.map((region) => (
                    <p>{region.RegionName}, {region.StateAbbr}: Mean price of ${region.mean}</p>
                ))}
                <h3>Cities with companies in the {industry} Industry </h3>
                {homes.map((region) => (
                    <p>{region.RegionName}, {region.StateAbbr}: Mean price of ${region.mean}</p>
                ))}
                
            </Grid>
            <Grid item xs={6}>
                <h3>
                Companies with the highest revenues in the {industry} Industry
                </h3>
                {topRev.map((comp) => (
                    <div>
                        <p>{comp.StockSymbol}</p>
                        <p>{comp.CompanyName}</p>
                        <p>Revenue: ${comp.Revenue}</p>
                        <p>Location: {comp.City}, {comp.StateAbbr}</p>
                        <p>Housing value change: ${comp.HousingValueChange} </p>
                    </div>
                ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2} />
      </Grid>

      <Grid
        container
        direction={'row'}
        spacing={4}
        style={{ textAlign: 'left' }}
      >
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Grid container direction={'row'} spacing={4}>
            <Grid item xs={6}>
              <h3>Companies in {industry} Industry and Their High Prices </h3>
                {highPrice.map((price) => (
                    <p>{price.StockSymbol}: High price of ${price.MaxPrice}</p>
                ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2} />
      </Grid>


      {/* <div>
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
      </div> */}
    </div>
  )
}

export default Industry
