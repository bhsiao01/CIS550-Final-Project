import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import { Grid, Card, CardContent } from '@material-ui/core'
import LocationMap from './LocationMap'
import Geocode from 'react-geocode'
import config from '../config.json'

Geocode.setApiKey(config['maps-api-key'])

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

// use Geocode API to get latitude and longitude of city
const fetchCoords = (item) => {
  const coords = Geocode.fromAddress(item.City + ', ' + item.StateAbbr).then(
    (response) => {
      const coords = response.results[0].geometry.location
      return coords
    },
    (error) => {
      console.log(error)
    }
  )
  return Promise.resolve(coords)
}

const geocodeAllCities = async (cityList) => {
  return Promise.all(
    cityList.map((city) => {
      fetchCoords(city).then((val) => (city.loc = val))
      return city
    })
  )
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
  const [cityCoords, setCityCoords] = useState()
  const [defaultCenter, setDefaultCenter] = useState()

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
      .get('http://localhost:8081/getTop20Cities/' + state)
      .then((response) => {
        setTop20(response.data)

        //add geo coordinates to each city for map
        geocodeAllCities(response.data).then((data) => {
          setCityCoords(data)
        })
      })

    // set default center of map to state's coordinates
    Geocode.fromAddress(city + ',' + state).then(
      (response) => {
        const coords = response.results[0].geometry.location
        setDefaultCenter(coords)
        return coords
      },
      (error) => {
        console.log(error)
      }
    )
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
        <Grid item xs={1} />
        <Grid item xs={10}>
          <h2>
            {city}, {state}
          </h2>
          {cityCoords && (
            <>
            {console.log(cityCoords)}
            <LocationMap cities={cityCoords} center={defaultCenter} />
            </>
          )}
          <Grid container direction={'row'} spacing={4}>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <h3>Home Value Statistics</h3>
                  {cityStat.map((city) => (
                    <div key={city}>
                      <p>
                        Average Home Value: $
                        {Number(Number(city.mean).toFixed(2)).toLocaleString()}
                      </p>
                      <p>
                        Minimum Home Value: $
                        {Number(Number(city.min).toFixed(2)).toLocaleString()}
                      </p>
                      <p>
                        Maximum Home Value: $
                        {Number(Number(city.max).toFixed(2)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {forecast.map((city) => (
                    <div key={city}>
                      <p>Forecasted Change: {city.Forecast.toFixed(3)}%</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <h3>Other cities in {state} by housing value</h3>
                  {/* {top20.map((comp) => (
                    <div>
                      <p>
                        {comp.City}, {comp.StateAbbr}:
                      </p>
                      <p>{comp.NumCompanies} companies</p>
                      <p>
                        Average price:{' '}
                        {Number(
                          Number(comp.AvgPrice).toFixed(2)
                        ).toLocaleString()}
                        , Forecasted change:{' '}
                        {comp.ForecastYoYPctChange.toFixed(3)}%
                      </p>
                    </div>
                  ))} */}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <h3>
                    Companies headquarted in {city}, {state}
                  </h3>
                  {companies.map((comp) => (
                    <p key={comp.StockSymbol}>
                      {comp.CompanyName} ({comp.StockSymbol})
                    </p>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2} />
      </Grid>
    </>
  )
}

export default Location
