import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import StockChart from './StockChart'
import config from '../config.json'
import {
  Grid,
  Card,
  CardContent,
  LinearProgress,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core'

const API_KEY = config['news-api-key']



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
  const [revenue, setRevenue] = useState([])
  const [companyName, setCompanyName] = useState([])
  const [companyCeo, setCompanyCEO] = useState([])
  const [companyHq, setCompanyHQ] = useState([])
  const [city, setCity] = useState([])
  const [state, setState] = useState([])
  const [cityStat, setCityStat] = useState([])
  const [forecast, setForecast] = useState([])
  const [rank, setRank] = useState([])
  const [companyArticles, setArticles] = useState([])
  //const [imageUrl, setImageUrl] = useState([])
  //const [article_url, setArticleUrl] = useState([])
  //const [article_titl, setArticleTitle] = useState([])


  useEffect(() => {
    axios
      .get('http://localhost:8081/getStockByYear/' + company + '/' + currYear)
      .then((response) => {
        setPrices(response.data)
        setLoading(false)
      })
    axios
      .get('http://localhost:8081/getYearsFromTicker/' + company)
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

        if (response.data.length > 0) {
          setCity(response.data[0].City)
          setState(response.data[0].StateAbbr)

          const city = response.data[0].City
          const state = response.data[0].StateAbbr

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
        }
      })
    axios
    .get(`https://newsapi.org/v2/everything?q=Microsoft&from=2021-05-03&to=2021-05-03&sortBy=popularity&apiKey=${API_KEY}`)
    .then((response) => {
      setArticles(response.data.articles)
    })
  
  }, [company, currYear, city, state])

  return (
    <div>
      <NavBar />
      <Grid container direction={'row'} style={{ textAlign: 'left' }}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          {/* Logo and Company Name Header */}
          {companyName.map((name) => (
            <div style={{ margin: '2em 0' }}>
              <img
                src={
                  process.env.PUBLIC_URL + '/logos/logos/' + company + '.png'
                }
                alt="logo"
                height={40}
                style={{ verticalAlign: 'bottom', marginRight: '12px' }}
              />
              <h2 style={{ display: 'inline' }}>
                <a href={name.Website} style={{ color: '#333333' }}>
                  {name.CompanyName}
                </a>{' '}
                ({company})
              </h2>
            </div>
          ))}
          {loading ? (
            // data is still loading
            <LinearProgress />
          ) : prices.length > 0 ? (
            // data loaded and stock data available
            <>
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
              <Grid container direction={'row'} spacing={4}>
                <Grid item xs={6}>
                  <Card>
                    <CardContent>
                      <h3> Company Information </h3>
                      {companyHq.map((hq) => (
                        <p>
                          Headquarters: {hq.City}, {hq.StateAbbr}
                        </p>
                      ))}
                      {companyCeo.map((ceo) => (
                        <p>CEO: {ceo.CEO}</p>
                      ))}
                      {industry.map((sector) => (
                        <p>Industry: {sector.Sector}</p>
                      ))}
                      {revenue.map((revenue) => (
                        <p>
                          Revenue (in millions): $
                          {Number(revenue.Revenue).toLocaleString()}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  {!loading && cityStat.length > 0 && (
                    <Card>
                      <CardContent>
                        {companyHq.map((hq) => (
                          <h3>
                            {' '}
                            {company} is headquarted in {hq.City},{' '}
                            {hq.StateAbbr}. These are the housing statistics for{' '}
                            {hq.City}, {hq.StateAbbr}.
                          </h3>
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
                            <p>
                              Forecasted Change: {city.Forecast.toFixed(3)}%
                            </p>
                          </div>
                        ))}
                        {rank.map((row) => {
                          if (row.RegionName === city) {
                            if (row.HousingValueChange > 0) {
                              return (
                                <>
                                  <p>
                                    Ranked{' '}
                                    <b>
                                      #{Number(row.row_num).toLocaleString()}
                                    </b>{' '}
                                    in housing value growth in {state}. Housing
                                    values have increased by $
                                    {Number(
                                      row.HousingValueChange.toFixed(2)
                                    ).toLocaleString()}{' '}
                                    in the past 20 years.
                                  </p>
                                </>
                              )
                            } else {
                              return (
                                <>
                                  <p>
                                    Ranked{' '}
                                    <b>
                                      #{Number(row.row_num).toLocaleString()}
                                    </b>{' '}
                                    in housing value growth in {state}. Housing
                                    values have decreased by $
                                    {Number(
                                      row.HousingValueChange.toFixed(2)
                                    ).toLocaleString()}{' '}
                                    in the past 20 years.
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
                  {!loading && cityStat.length === 0 && (
                    <Card>
                      <CardContent>
                        <p>
                          No results were found for {city}, {state}. This may be
                          because {city}, {state} is not included in our
                          dataset.
                          <a href="/">Try searching for another city</a>.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </Grid>
              </Grid>
            </>
          ) : (
            // data loaded but stock data unavailable
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
              {(
              <Card>
                <CardContent>
                {companyArticles.map((ca) => (
                    <img src={ca.urlToImage} />
                  ))}
                </CardContent>
              </Card>)}
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default Company
