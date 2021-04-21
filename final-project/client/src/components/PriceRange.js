import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import { Grid } from '@material-ui/core'

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

const PriceRange = () => {
  // useLocation().pathname will return '/price/minPrice/maxPrice'
  let url = useLocation().pathname
  const [min, setMin] = useState(parseURL(url)[0])
  const [max, setMax] = useState(parseURL(url)[1])
  const [cities, setCities] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:8081/getHousingRange/' + min + '/' + max)
      .then((response) => {
        setCities(response.data)
      })
  }, [min, max])

  return (
    <>
      <NavBar />
      <Grid
        container
        direction={'row'}
        spacing={4}
        alignItems="center"
        style={{ height: '75vh' }}
      >
        <Grid item xs={3} />
        <Grid item xs={6}>
          {cities.length} cities were found with housing prices in the range $
          {min} - ${max}
          <div style={{ textAlign: 'left' }}>
            {cities.map((city) => (
              <div>
                <p style={{ fontWeight: 600 }}>
                  {city.RegionName}, {city.StateName}
                </p>
                <p>
                  {' '}
                  ${city.Min} - ${city.Max}
                </p>
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={3} />
      </Grid>
    </>
  )
}

export default PriceRange
