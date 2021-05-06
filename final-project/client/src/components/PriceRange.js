import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import { Grid, LinearProgress, Card, CardContent } from '@material-ui/core'
import PriceRangeMap from './PriceRangeMap'
import Geocode from 'react-geocode'
import config from '../config.json'
import MaterialTable from 'material-table'

Geocode.setApiKey(config['maps-api-key'])

// parses URL queries for price min and max.
const parseURL = (url) => {
  if (url.split('/').length > 3) {
    let index = url.indexOf('/', 7)
    let maxPrice = url.slice(index + 1)
    let minPrice = url.slice(7, index)
    // standardize casing
    return [minPrice, maxPrice]
  }

  return []
}

// use Geocode API to get latitude and longitude of city
const fetchCoords = (item) => {
  const coords = Geocode.fromAddress(
    item.RegionName + ', ' + item.StateName
  ).then(
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

const PriceRange = () => {
  // useLocation().pathname will return '/price/minPrice/maxPrice'
  let url = useLocation().pathname
  const [loading, setLoading] = useState(true)
  const [min] = useState(parseURL(url)[0])
  const [max] = useState(parseURL(url)[1])
  const [cities, setCities] = useState([])
  const [coords, setCoords] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:8081/getHousingRange/' + min + '/' + max)
      .then((response) => {
        let results = response.data
        setCities(results)

        if (results.length > 100) {
          results = results.slice(0, 100)
        }

        //add geo coordinates to each city for map
        geocodeAllCities(results).then((data) => {
          setCoords(data)
          console.log(data)
        })
        setLoading(false)
      })
  }, [min, max])

  return (
    <>
      <NavBar />
      <Grid
        container
        direction={'row'}
        spacing={3}
        style={{ textAlign: 'left', padding: '2rem' }}
      >
        {loading ? (
          <>
            <Grid item xs={12}>
              <p>Loading...</p>
              <LinearProgress />
            </Grid>
          </>
        ) : cities.length > 0 ? (
          <>
            <Grid item xs={12}>
              <b>{cities.length} cities</b> were found with housing prices in
              the range ${min} - ${max}
            </Grid>
            <Grid item xs={6}>
              <MaterialTable
                title={'Cities in Price Range'}
                columns={[
                  { title: 'City', field: 'city' },
                  {
                    title: 'Min Price',
                    field: 'min',
                    // type: 'numeric',
                    sortable: true,
                  },
                  {
                    title: 'Max Price',
                    field: 'max',
                    sortable: true,
                  },
                ]}
                data={cities.map((city) => ({
                  city: city.RegionName + ', ' + city.StateName,
                  min: '$' + Number(city.Min).toLocaleString(),
                  max: '$' + Number(city.Max).toLocaleString(),
                }))}
                options={{
                  pageSize: 10,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent>
                  <p>
                    The map below displays the top 100 cities with housing
                    prices in the range ${min} - ${max}, sorted by minimum
                    value. Click on the markers to learn more about each city.
                  </p>
                  <PriceRangeMap cities={cities} coords={coords} />
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <Card>
            <CardContent>
              <p>
                No results were found for the range ${min} - ${max}.
                <a href="/home">Try searching again</a>.
              </p>
            </CardContent>
          </Card>
        )}
      </Grid>
    </>
  )
}

export default PriceRange
