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

const get_city_state = (hq) => {

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
  const [revenue, setRevenue] = useState([])
  const [companyName, setCompanyName] = useState([])
  const [companyCeo, setCompanyCEO] = useState([])
  const [companyHq, setCompanyHQ] = useState([])
  const [city, setCity] = useState([])
  const [state, setState] = useState([])
  const [cityStat, setCityStat] = useState([])
  const [forecast, setForecast] = useState([])
  const [rank, setRank] = useState([])

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
      .get('http://localhost:8081/getIndustryFromCompany/' + company)
      .then((response) => {
        setIndustry(response.data)
      })
    axios
    .get('http://localhost:8081/getCompanyRevenue/' + company)
    .then((response) => {
      setRevenue(response.data)
    })
    axios
    .get('http://localhost:8081/getCompanyName/' + company)
    .then((response) => {
      setCompanyName(response.data)
    })
    axios
    .get('http://localhost:8081/getCompanyCEO/' + company)
    .then((response) => {
      setCompanyCEO(response.data)
    })
    axios
    .get('http://localhost:8081/getCompanyHQ/' + company)
    .then((response) => {
      setCompanyHQ(response.data)
      setCity(response.data[0].City)
      setState(response.data[0].StateAbbr)
    })
    axios
    .get('http://localhost:8081/getCityStat/' + city + '/' + state)
    .then((response) => {
      setCityStat(response.data)
    })
    axios
    .get('http://localhost:8081/getForecast/' + city + '/' + state)
    .then((response) => {
      setForecast(response.data)
    })
    axios
      .get('http://localhost:8081/getCityRanking/' + state)
      .then((response) => {
        setRank(response.data)
      })
  }, [company, currYear, city, state])

  return (
    <div>
      <NavBar />
      <Grid
        container
        direction={'row'}
        style={{ textAlign: 'left' }}
      >
        <Grid item xs={1} />
        <Grid item xs={10}>
          {companyName.map((name) => (
            <h2>{name.CompanyName} ({company})</h2>
          ))}
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
          )} {(<Card>
                <CardContent>
                  <h3> Company Information </h3>
                  {companyHq.map((hq) => (
                    <p>Headquarters: {hq.City}, {hq.StateAbbr}</p>
                  ))}
                  {companyCeo.map((ceo) => (
                    <p>CEO: {ceo.CEO}</p>
                  ))}
                  {industry.map((sector) => (
                  <p>Industry: {sector.Sector}</p>
                  ))}
                  {revenue.map((revenue) => (
                    <p>Revenue (in millions): ${Number(revenue.Revenue).toLocaleString()}</p>
                  ))}
                </CardContent>
              </Card>) }
              {(<Card>
                  <CardContent>
                  {companyHq.map((hq) => (
                    <h3> {company} is headquarted in {hq.City}, {hq.StateAbbr}. These are the housing statistics for {hq.City}, {hq.StateAbbr}.</h3>
                  ))}
                  {cityStat.map((city) => (
                    <div key={city}>
                    <p>
                      Average Home Value: $
                      {Number(
                        Number(city.mean).toFixed(2)
                      ).toLocaleString()}
                    </p>
                    <p>
                      Minimum Home Value: $
                      {Number(
                        Number(city.min).toFixed(2)
                      ).toLocaleString()}
                    </p>
                    <p>
                      Maximum Home Value: $
                      {Number(
                        Number(city.max).toFixed(2)
                      ).toLocaleString()}
                    </p>
                  </div>
                  ))}
                  {forecast.map((city) => (
                        <div key={city}>
                          <p>Forecasted Change: {city.Forecast.toFixed(3)}%</p>
                        </div>
                      ))}
                      {rank.map((row) => {
                        if (row.RegionName === city) {
                          if (row.HousingValueChange > 0) {
                            return (
                              <>
                                <p>
                                  Ranked <b>#{Number(row.row_num).toLocaleString()}</b> in housing value
                                  growth in {state}. Housing values have
                                  increased by $
                                  {Number(row.HousingValueChange.toFixed(2)).toLocaleString()} in the
                                  past 20 years.
                                </p>
                              </>
                            )
                          } else {
                            return (
                              <>
                                <p>
                                  Ranked <b>#{Number(row.row_num).toLocaleString()}</b> in housing value growth
                                  in {state}. Housing values have decreased by $
                                  {Number(row.HousingValueChange.toFixed(2)).toLocaleString()} in the
                                  past 20 years.
                                </p>
                              </>
                            )
                          }
                        } else {
                          return <></>
                        }
                      })}
                  </CardContent>
                </Card>
                )}
        </Grid>
      </Grid>
    </div>
  )
}

export default Company
