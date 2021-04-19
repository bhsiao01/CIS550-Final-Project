import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Box,
  Grid,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Input,
  Button,
} from '@material-ui/core'

const Home = () => {
  const history = useHistory()
  const [searchType, setSearchType] = useState('Location')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [company, setCompany] = useState('')
  const [industry, setIndustry] = useState('')

  const changeSearchType = (e) => {
    setSearchType(e.target.value)
  }

  const redirect = () => {
    if (searchType === 'Location') {
      history.push('/city/' + city)
    } else if (searchType == 'Company') {
      history.push('/company/' + company)
    } else {
      history.push('/industry/' + industry)
    }
  }

  return (
    <>
      <Box>
        <Grid container direction={'row'} spacing={4}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <h1>Search for a city or company...</h1>
            <FormControl>
              <InputLabel id="search-type">Search Type</InputLabel>
              <Select
                labelId="search-type"
                value={searchType}
                onChange={changeSearchType}
                style={{ minWidth: 120 }}
              >
                <MenuItem value={'Location'}>Location</MenuItem>
                <MenuItem value={'Company'}>Company</MenuItem>
                <MenuItem value={'Industry'}>Industry</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              {searchType === 'Location' ? (
                <>
                  <InputLabel htmlFor="my-input">City</InputLabel>
                  <Input
                    id="my-input"
                    aria-describedby="my-helper-text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </>
              ) : searchType === 'Company' ? (
                <>
                  <InputLabel htmlFor="my-input">Company</InputLabel>
                  <Input
                    id="my-input"
                    aria-describedby="my-helper-text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <InputLabel htmlFor="my-input">Industry</InputLabel>
                  <Input
                    id="my-input"
                    aria-describedby="my-helper-text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  />
                </>
              )}
            </FormControl>
            <Button type="submit" color="primary" onClick={redirect}>
              Search
            </Button>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Home
