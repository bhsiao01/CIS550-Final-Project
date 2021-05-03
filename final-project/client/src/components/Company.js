import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import StockChart from './StockChart'
import {
  Grid,
  Card,
  CardContent,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Input,
} from '@material-ui/core'

// parses URL queries for company name.
const parseURL = (url) => {
  if (url.split('/').length > 2) {
    let company = url.slice(9)
    // standardize casing
    company = company.toUpperCase()
    return company
  }
}

const Company = (props) => {
  // useLocation().pathname will return '/company/ticker'
  let url = useLocation().pathname
  const [loading, setLoading] = useState(true)
  const [company, setCompany] = useState(parseURL(url))
  const [prices, setPrices] = useState([])
  const [industry, setIndustry] = useState([])
  const [currYear, setCurrYear] = useState(2020)
  const [allYears, setAllYears] = useState([])

  //want to add in where company is headquartered + some simple housing stats (maybe)

  useEffect(() => {
    axios
      .get('http://localhost:8081/getStockByYear/' + company + '/' + currYear)
      .then((response) => {
        setPrices(response.data)
        setLoading(false)
      })
    axios
      .get('http://localhost:8081/getYearsFromTicker/' + company )
      .then((response) => {
        setAllYears(response.data)
      })
    axios
      .get('http://localhost:8081/getCompanyIndustry/' + company)
      .then((response) => {
        setIndustry(response.data)
      })
  }, [company, currYear])

  return (
    <div>
      <NavBar />
      <Grid
        container
        direction={'row'}
        spacing={4}
        style={{ textAlign: 'left' }}
      >
        <Grid item xs={1} />
        <Grid item xs={10}>
          <h2>{company}</h2>
          {loading ? (
            <LinearProgress />
          ) : prices.length > 0 ? (
            <Card>
              <CardContent>
                <div style={{ display: 'inline-flex' }}>
                  <h3>Stock Prices in </h3>
                  <FormControl style={{ width: '80px', marginLeft: '12px' }}>
                    <InputLabel id="search-type">Year</InputLabel>
                    <Select
                      value={currYear}
                      onChange={(e) => setCurrYear(e.target.value)}
                      style={{ minWidth: '80px', align: 'left' }}
                    >
                      {allYears.map((year) => (
                        <MenuItem value={year.Year}>{year.Year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <StockChart prices={prices} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <p>
                  No results were found for {company}. This may be because{' '}
                  {company} is not included in our dataset.
                  <a href="/">Try searching for another company</a>.
                </p>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default Company
