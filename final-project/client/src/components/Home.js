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
        <Grid
          container
          direction={'row'}
          spacing={4}
          alignItems="center"
          style={{ height: '75vh' }}
        >
          <Grid item xs={3} />
          <Grid item xs={6}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '3.5rem', textAlign: 'left'}}>
              Search for a city or company...
            </h1>
            <FormControl style={{ width: '20%' }}>
              <InputLabel id="search-type">Search Type</InputLabel>
              <Select
                labelId="search-type"
                value={searchType}
                onChange={changeSearchType}
                style={{ minWidth: '120px' }}
              >
                <MenuItem value={'Location'}>Location</MenuItem>
                <MenuItem value={'Company'}>Company</MenuItem>
                <MenuItem value={'Industry'}>Industry</MenuItem>
              </Select>
            </FormControl>
            {searchType === 'Location' ? (
              <>
                <FormControl style={{ width: '65%' }}>
                  <InputLabel id="city">City</InputLabel>
                  <Input
                    labelId="city"
                    aria-describedby="my-helper-text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={'Seattle'}
                    style={{ minWidth: '50%' }}
                  />
                </FormControl>
                <FormControl style={{ width: '15%' }}>
                  <InputLabel id="state">State</InputLabel>
                  <Select
                    labelId="state"
                    value={state}
                    style={{ minWidth: '60px' }}
                    onChange={(e) => setState(e.target.value)}
                  >
                    <MenuItem value={'PA'}>PA</MenuItem>
                    <MenuItem value={'WA'}>WA</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
              <FormControl style={{ width: '80%'}}>
                <InputLabel id="company">Company</InputLabel>
                <Input
                  labelId="company"
                  aria-describedby="my-helper-text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                </FormControl>
              </>
            )}
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={redirect}
                style={{float: 'right'}}
                disableElevation
              >
                Search
              </Button>
            </Box>
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </Box>
    </>
  )
}

export default Home
