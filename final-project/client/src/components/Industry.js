import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import { Grid, Card, CardContent, LinearProgress } from '@material-ui/core'
import IndustryMap from './IndustryMap'
import IndustryChart from './IndustryChart'
import Geocode from 'react-geocode'
import config from '../config.json'

Geocode.setApiKey(config['maps-api-key'])

// parses URL queries for industry.
const parseURL = (url) => {
  if (url.split('/').length > 2) {
    let industry = url.slice(10)
    // standardize casing
    let words = industry.split(' ')
    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i].substring(0, 1).toUpperCase() +
        words[i].substring(1).toLowerCase()
    }
    industry = words.join(' ')
    return industry
  }
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
      return fetchCoords(city).then((val) => val)
    })
  )
}

const Industry = () => {
  // useLocation().pathname will return '/industry/sector'
  let url = useLocation().pathname
  const [industry, setIndustry] = useState(parseURL(url))
  const [topMean, setTopMean] = useState([]) // TODO : May need to remove this query (kind of redundant)
  const [topRev, setTopRev] = useState([])
  const [homes, setHomes] = useState([])
  const [highPrice, setHighPrice] = useState([])
  const [loading, setLoading] = useState(true)
  const [cityCoords, setCityCoords] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:8081/getMeanPriceIndustry/' + industry)
      .then((response) => {
        setTopMean(response.data)
      })
    axios
      .get('http://localhost:8081/getTop10Rev/' + industry)
      .then((response) => {
        setTopRev(response.data)
        setLoading(false)
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

        geocodeAllCities(response.data).then((data) => {
          setCityCoords(data)
        })
      })
  }, [industry])

  return (
    <>
      <NavBar />
      <Grid
        container
        direction={'row'}
        spacing={3}
        style={{ textAlign: 'left' }}
      >
        <Grid item xs={1} />
        <Grid item xs={10}>
          <h2>{industry} Industry</h2>
          <Grid container direction={'row'} spacing={4}>
            {loading ? (
              <>
                <Grid item xs={12}>
                  <LinearProgress />
                </Grid>
              </>
            ) : topRev.length > 0 ? (
              <>
                <Grid item xs={4}>
                  <Card>
                    <CardContent>
                      <h3>
                        Companies with the highest revenues in the {industry}{' '}
                        Industry
                      </h3>
                      {topRev.map((comp) => (
                        <div>
                          <p>
                            <b>{comp.CompanyName}</b> ({comp.StockSymbol})
                          </p>
                          <p>Revenue: ${comp.Revenue}</p>
                          <p>
                            Location: {comp.City}, {comp.StateAbbr}
                          </p>
                          <p>
                            Housing value change: ${comp.HousingValueChange}{' '}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={8}>
                  <Card>
                    <CardContent>
                      <h3>Cities with companies in the {industry} Industry </h3>
                      <p>
                        The map below displays cities with companies in the
                        Technology industry and the average home value in those
                        cities, based on Zillow's Home Value Index. Click on the
                        markers to learn more about each city.
                      </p>
                      <IndustryMap coords={cityCoords} cities={homes} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <h3>
                        City with the most expensive housing in the {industry}{' '}
                        Industry{' '}
                      </h3>
                      <ol>
                        {topMean.map((region) => (
                          <li>
                            <a
                              href={
                                '/location/' +
                                region.RegionName +
                                '/' +
                                region.StateAbbr
                              }
                            >
                              {region.RegionName}, {region.StateAbbr}
                            </a>
                            : Avg. Price of $
                            {Number(
                              Number(region.mean).toFixed(0)
                            ).toLocaleString()}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <h3>
                        Companies in {industry} Industry and Their High Prices{' '}
                      </h3>
                      <IndustryChart prices={highPrice} />
                    </CardContent>
                  </Card>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <p>
                      No results were found for {industry}. This may be because{' '}
                      {industry} is not included in our dataset.
                      <a href="/">Try searching for another industry</a>.
                    </p>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default Industry
