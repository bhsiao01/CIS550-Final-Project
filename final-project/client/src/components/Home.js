import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import SearchIcon from '@material-ui/icons/Search'
import state_abrev from '../states.js'
import NavBar from './NavBar'
import {
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Input,
  Button,
  Card,
  CardContent,
} from '@material-ui/core'

const Home = () => {
  const history = useHistory()
  const [searchType, setSearchType] = useState('Location')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('')
  const [industryList, setIndustryList] = useState([])
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [highestHomes, setHighestHomes] = useState([])
  const [highestNumComps, setHighestNumComps] = useState([])

  const redirect = () => {
    if (searchType === 'Location' && city.length !== 0 && state.length !== 0) {
      history.push('/location/' + city + '/' + state)
    }
    if (searchType === 'Price') {
      if (parseInt(maxPrice) > parseInt(minPrice)) {
        history.push('/price/' + minPrice + '/' + maxPrice)
      }
    }
    if (searchType === 'Company' && company.length !== 0) {
      history.push('/company/' + company)
    }
    if (searchType === 'Industry' && industry.length !== 0) {
      history.push('/industry/' + industry)
    }
  }

  useEffect(() => {
    axios.get('http://localhost:8081/getAllIndustries/').then((response) => {
      setIndustryList(response.data)
    })

    axios.get('http://localhost:8081/getTop10HomeValue/').then((response) => {
      setHighestHomes(response.data)
    })

    axios
      .get('http://localhost:8081/getTop10NumCompanies/')
      .then((response) => {
        setHighestNumComps(response.data)
      })
  }, [])

  return (
    <>
      <div
        onMouseMove={(e) => {
          setMouseX((e.pageX / window.innerWidth) * 100)
          setMouseY((e.pageY / window.innerHeight) * 100)
        }}
        style={{
          height: '100vh',
          background:
            'radial-gradient(at ' +
            mouseX +
            '% ' +
            mouseY +
            '%, #e3def1, #def1e7)',
        }}
      >
        <Box>
          <NavBar home={true} />
          <Grid
            container
            direction={'row'}
            alignItems="center"
            style={{ height: '75vh' }}
          >
            <Grid item xs={3} />
            <Grid item xs={6}>
              <h1
                style={{
                  marginBottom: '3.5rem',
                  textAlign: 'left',
                }}
              >
                Search for a city, company, or industry...
              </h1>
              <FormControl style={{ width: '20%' }}>
                <InputLabel id="search-type">Search Type</InputLabel>
                <Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  style={{ minWidth: '120px', align: 'left' }}
                >
                  <MenuItem value={'Location'}>Location</MenuItem>
                  <MenuItem value={'Company'}>Company</MenuItem>
                  <MenuItem value={'Industry'}>Industry</MenuItem>
                  <MenuItem value={'Price'}>Price Range</MenuItem>
                </Select>
              </FormControl>
              {searchType === 'Location' ? (
                <>
                  <FormControl style={{ width: '65%' }}>
                    <InputLabel id="city">City</InputLabel>
                    <Input
                      aria-describedby="city-text-input"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={'Seattle'}
                      style={{ minWidth: '50%' }}
                    />
                  </FormControl>
                  <FormControl style={{ width: '15%' }}>
                    <InputLabel id="state">State</InputLabel>
                    <Select
                      value={state}
                      style={{ minWidth: '60px' }}
                      onChange={(e) => setState(e.target.value)}
                    >
                      {state_abrev.map((state) => (
                        <MenuItem value={state} key={state}>
                          {state}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              ) : searchType === 'Company' ? (
                <>
                  <FormControl style={{ width: '80%' }}>
                    <InputLabel id="company">Company Ticker Symbol</InputLabel>
                    <Input
                      aria-describedby="company-text-input"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder={'AAPL'}
                    />
                  </FormControl>
                </>
              ) : searchType === 'Price' ? (
                <>
                  <FormControl style={{ width: '40%' }}>
                    <InputLabel id="price">Minimum Price</InputLabel>
                    <Input
                      aria-describedby="price-text-input"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      style={{ minWidth: '50%' }}
                      type="number"
                    />
                  </FormControl>
                  <FormControl style={{ width: '40%' }}>
                    <InputLabel id="state">Maximum Price</InputLabel>
                    <Input
                      aria-describedby="price-text-input"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      style={{ minWidth: '50%' }}
                      type="number"
                    />
                  </FormControl>
                </>
              ) : (
                <>
                  <FormControl style={{ width: '80%' }}>
                    <InputLabel id="industry">Industry</InputLabel>
                    <Select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      style={{ minWidth: '120px', textAlign: 'left' }}
                    >
                      {industryList.map((val) => (
                        <MenuItem value={val.Sector}>{val.Sector}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={redirect}
                  style={{ float: 'right' }}
                  disableElevation
                >
                  <SearchIcon />
                  Search
                </Button>
              </Box>
            </Grid>
            <Grid item xs={3} />
          </Grid>
        </Box>
      </div>
      <div style={{ backgroundColor: 'white' }}>
        <Grid
          container
          direction={'row'}
          spacing={4}
          style={{ textAlign: 'left' }}
        >
          <Grid item xs={1} />
          <Grid item xs={10}>
            <Grid spacing={4} container direction={'row'}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <h3>[add description here?]</h3>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <h3>Start searching...</h3>
                    <h4>Cities with Highest Average Home Values</h4>
                    <ol>
                      {highestHomes.map((city) => (
                        <li>
                          <a
                            href={
                              '/location/' +
                              city.RegionName +
                              '/' +
                              city.StateName
                            }
                          >
                            {city.RegionName}, {city.StateName}
                          </a>
                          : $
                          {Number(
                            Number(city.avg_home_value).toFixed(2)
                          ).toLocaleString()}
                        </li>
                      ))}
                    </ol>

                    <h4>Cities with the Most Companies Headquartered</h4>
                    <ol>
                      {highestNumComps.map((city) => (
                        <li>
                          <a
                            href={
                              '/location/' + city.City + '/' + city.StateAbbr
                            }
                          >
                            {city.City}, {city.StateAbbr}
                          </a>
                          : {city.num_companies}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </div>
    </>
  )
}

export default Home
