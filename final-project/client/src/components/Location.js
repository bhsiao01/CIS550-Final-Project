import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import { Grid } from '@material-ui/core'

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

  return []
}

const Location = () => {
  // useLocation().pathname will return '/location/city/state'
  let url = useLocation().pathname
  const [city, setCity] = useState(parseURL(url)[0])
  const [state, setState] = useState(parseURL(url)[1])
  const [avgHome, setAvgHome] = useState([])
  const [cityStat, setCityStat] = useState([])
  const [forecast, setForecast] = useState([])
  const [companies, setCompanies] = useState([])
  const [top20, setTop20] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:8081/getForecast/' + city + '/' + state)
      .then((response) => {
        setForecast(response.data)
      })
    axios
      .get('http://localhost:8081/getCityStat/' + city + '/' + state)
      .then((response) => {
        setCityStat(response.data)
      })
    axios
      .get('http://localhost:8081/getCompStat/' + city + '/' + state)
      .then((response) => {
        setCompanies(response.data)
      })
      axios
      .get('http://localhost:8081/getTop20Cities/' + '/' + state)
      .then((response) => {
        setTop20(response.data)
      })
  }, [city, state])

  return (
    <>
      <NavBar />
      <Grid
        container
        direction={'row'}
        spacing={4}
        style={{ textAlign: 'left' }}
      >
        <Grid item xs={2} />
        <Grid item xs={8}>
          <h2>
            {city}, {state}
          </h2>
          <Grid container direction={'row'} spacing={4}>
            <Grid item xs={6}>
              <h3>Home Value Statistics</h3>
              {cityStat.map((city) => (
                <div>
                  <p>Average Home Value: ${city.mean}</p>
                  <p>Minimum Home Value: ${city.min}</p>
                  <p>Maximum Home Value: ${city.max}</p>
                </div>
              ))}
              {forecast.map((city) => (
                <div>
                  <p>Forecasted Change: {city.Forecast}%</p>
                </div>
              ))}
            </Grid>
            <Grid item xs={6}>
              <h3>
                Companies headquarted in {city}, {state}
              </h3>
              {companies.map((comp) => (
                <p>{comp.CompanyName}</p>
              ))}
            </Grid>
            <Grid item xs={6}>
              <h3>
                Other cities in {state} by housing value
              </h3>
              {top20.map((comp) => (
                <div>
                  <p>{comp.City}, {comp.StateAbbr}:</p>
                  <p>{comp.NumCompanies} companies</p>
                  <p>Average price: {comp.AvgPrice}, Forecasted change: {comp.ForecastYoYPctChange}</p>
                </div>
              ))}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </>
  )
}

export default Location
