import React, { useState, useEffect } from 'react'
import axios from 'axios'
import SearchIcon from '@material-ui/icons/Search'
import state_abrev from '../states.js'
import { Link } from 'react-router-dom'
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  Input,
  Button,
  IconButton,
} from '@material-ui/core'

const NavBar = ( { home }) => {
  const [searchType, setSearchType] = useState('Location')
  const [city, setCity] = useState('')
  const [state, setState] = useState('State')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('Industry')
  const [industryList, setIndustryList] = useState([])
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const redirect = () => {
    if (searchType === 'Location' && city.length !== 0 && state.length !== 0) {
      if (state !== 'State') {
        window.location = '/location/' + city + '/' + state
      }
    }
    if (searchType === 'Price') {
      if (parseInt(maxPrice) > parseInt(minPrice)) {
        window.location = '/price/' + minPrice + '/' + maxPrice
      }
    }
    if (searchType === 'Company' && company.length !== 0) {
      window.location = '/company/' + company
    }
    if (searchType === 'Industry' && industry.length !== 0) {
      if (industry !== 'Industry') {
        window.location = '/industry/' + industry
      }
    }
  }

  useEffect(() => {
    axios.get('http://localhost:8081/getAllIndustries/').then((response) => {
      setIndustryList(response.data)
    })
  }, [])

  return (
    <>
      <Grid
        container
        direction={'row'}
        spacing={1}
        style={{
          padding: '24px 24px 12px 24px',
          marginBottom: '12px',
          boxShadow:
            '0px 1px 2px rgb(0 0 0 / 8%), 0px 4px 12px rgb(0 0 0 / 5%)',
          backgroundColor: 'white',
        }}
        justify={'space-between'}
      >
        <Grid item xs={2} style={{ textAlign: 'left' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button size="large">🦉Home</Button>
          </Link>
        </Grid>
        {!home && (
          <Grid
          item
          style={{
            display: 'inline-flex',
            borderRadius: '40px',
            boxShadow:
              '0px 1px 2px rgb(0 0 0 / 8%), 0px 4px 12px rgb(0 0 0 / 5%)',
            alignItems: 'center'
          }}
        >
          <FormControl>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{ minWidth: '120px', marginLeft: '12px' }}
              disableUnderline 
            >
              <MenuItem value={'Location'}>Location</MenuItem>
              <MenuItem value={'Company'}>Company</MenuItem>
              <MenuItem value={'Industry'}>Industry</MenuItem>
              <MenuItem value={'Price'}>Price Range</MenuItem>
            </Select>
          </FormControl>
          {searchType === 'Location' ? (
            <>
              <FormControl>
                <Input
                  aria-describedby="city-text-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={'Philadelphia'}
                  style={{ minWidth: '35%' }}
                  disableUnderline
                />
              </FormControl>
              <FormControl>
                <Select
                  value={state}
                  style={{ minWidth: '60px' }}
                  onChange={(e) => setState(e.target.value)}
                  disableUnderline
                >
                  <MenuItem value="State" disabled>
                    State
                  </MenuItem>
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
              <FormControl>
                <Input
                  aria-describedby="company-text-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder={'AAPL'}
                  disableUnderline
                />
              </FormControl>
            </>
          ) : searchType === 'Price' ? (
            <>
              <FormControl>
                <Input
                  aria-describedby="price-text-input"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  type="number"
                  placeholder={'Min Price'}
                  style={{ maxWidth: '125px' }}
                  disableUnderline
                />
              </FormControl>
              <FormControl>
                <Input
                  aria-describedby="price-text-input"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  type="number"
                  placeholder={'Max Price'}
                  style={{ maxWidth: '125px' }}
                  disableUnderline
                />
              </FormControl>
            </>
          ) : (
            <>
              <FormControl>
                <Select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{ minWidth: '240px', textAlign: 'left' }}
                  disableUnderline
                >
                  <MenuItem value="Industry" disabled>
                    Select Industry
                  </MenuItem>
                  {industryList.map((val) => (
                    <MenuItem value={val.Sector}>{val.Sector}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          <IconButton
            color="primary"
            onClick={redirect}
            style={{ float: 'right', padding: '0 12px' }}
            disableelevation="true"
          >
            <SearchIcon />
          </IconButton>
        </Grid>
        )}
        <Grid item xs={3}></Grid>
      </Grid>
    </>
  )
}

export default NavBar
