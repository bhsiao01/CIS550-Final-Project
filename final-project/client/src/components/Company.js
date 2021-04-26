import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import { Grid } from '@material-ui/core'

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


  //want to add in where company is headquartered + some simple housing stats (maybe)

  useEffect(() => {
    axios.get('http://localhost:8081/get30day/' + company).then((response) => {
      setPrices(response.data)
    })
  }, [company])

  console.log(prices)

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
          <h2>Stock Prices for {company}</h2>
          <Grid container direction={'row'} spacing={4}>
            <Grid item xs={6}>
              <h3>Price Statistics</h3>
              {prices.map((price) => (
                <div>
                  <p>Date: {price.Date}</p>
                  <p>Open price: ${price.Open}</p>
                  <p>Close price: ${price.Close}</p>
                </div>
              ))}
            </Grid>
          </Grid>
        </Grid>
        </Grid>
    </div>
  )
}

export default Company
