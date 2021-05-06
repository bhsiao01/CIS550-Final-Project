import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import {
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import IndustryMap from './IndustryMap'
import IndustryChart from './IndustryChart'
import Geocode from 'react-geocode'
import config from '../config.json'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
const db = firebase.firestore()

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

const companyExists = (companyName, compArray) => {
  return compArray.some(function (el) {
    return el.CompanyName === companyName
  })
}

const Industry = () => {
  // useLocation().pathname will return '/industry/sector'
  let url = useLocation().pathname
  const [industry, setIndustry] = useState(parseURL(url))
  const [topMean, setTopMean] = useState([]) // TODO : May need to remove this query (kind of redundant)
  const [topRev, setTopRev] = useState([])
  const [top10Rev, setTop10Rev] = useState([])
  const [homes, setHomes] = useState([])
  const [highPrice, setHighPrice] = useState([])
  const [loading, setLoading] = useState(true)
  const [cityCoords, setCityCoords] = useState([])
  const [indSaved, setIndSaved] = useState([])

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
      .get('http://localhost:8081/getTopRevenue/' + industry)
      .then((response) => {
        setTop10Rev(response.data)
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

  async function sendData(industry) {
    // if read user id gives empty then add otherwise update
    //console.log(city)
    let currEmail = ''
    let currName = ''
    let hasLocations = false
    let uniqueArray = []
    await firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        currEmail = firebase.auth().currentUser.email
        currName = firebase.auth().currentUser.displayName
        // User is signed in.
      } else {
        currEmail = ''
        currName = ''
        // No user is signed in.
      }
    })

    await db
      .collection('industries')
      .where('email', '==', currEmail)
      .onSnapshot((querySnapshot) => {
        var locations = []
        querySnapshot.forEach((doc) => {
          locations.push(doc.data().savedInds)
        })
        uniqueArray = locations.filter((v, index) => {
          return locations.indexOf(v) === index
        })
        console.log(uniqueArray.flat())
        if (locations.length === 0) {
          hasLocations = false
        } else {
          hasLocations = true
        }
        db.collection('industries')
          .doc(currEmail)
          .get()
          .then((doc) => {
            if (doc.exists) {
              //console.log("Document data:", doc.data());
              db.collection('industries')
                .doc(currEmail)
                .update({
                  savedInds: firebase.firestore.FieldValue.arrayUnion(industry),
                })
            } else {
              console.log('No such document')
              var data = {
                name: currName,
                email: currEmail,
                savedInds: [industry],
              }
              db.collection('industries')
                .doc(currEmail)
                .set(data)
                .then(() => {
                  console.log('Document successfully written!')
                })
            }
          })
          .catch((error) => {
            console.log('Error getting document:', error)
          })
        setIndSaved(uniqueArray.flat())
        //console.log(locations)
        return uniqueArray.flat()
      })
    return indSaved.flat()
  }

  return (
    <>
      <NavBar />
      <Grid
        container
        direction={'row'}
        spacing={2}
        style={{ textAlign: 'left' }}
      >
        <Grid item xs={1} />
        <Grid item xs={10}>
          <h2>{industry} Industry</h2>
          <Box m={2} ml={0}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => sendData(industry)}
            >
              Save Search
            </Button>
          </Box>
          {indSaved.length > 0 && (
            <Accordion style={{ marginBottom: '12px' }} defaultExpanded={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <h3 style={{ margin: '0px' }}> Saved Industries </h3>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: 'column' }}>
                {indSaved.map((result) => (
                  <p style={{ marginBottom: '3px' }}>
                    <a href={'/industry/' + result}>{result}</a>
                  </p>
                ))}
              </AccordionDetails>
            </Accordion>
          )}
          <Grid container direction={'row'} spacing={4}>
            {loading ? (
              <>
                <Grid item xs={12}>
                  <LinearProgress />
                </Grid>
              </>
            ) : topRev.length > 0 ? (
              <>
                <Grid item xs={5}>
                  <Card>
                    <CardContent>
                      <h3>
                        Companies with the highest revenues in the {industry}{' '}
                        Industry
                      </h3>

                      {top10Rev.map((comp) => {
                        if (companyExists(comp.CompanyName, topRev)) {
                          console.log('true')
                          return (
                            <div>
                              <p>
                                <a
                                  href={'../../company/' + comp.StockSymbol}
                                  style={{ color: 'black' }}
                                >
                                  <b>{comp.CompanyName}</b>
                                </a>{' '}
                                ({comp.StockSymbol})<br></br>
                                Revenue (in millions): ${Number(comp.Revenue).toLocaleString()}
                                <br></br>
                                Location:{' '}
                                <a
                                  href={
                                    '/location/' +
                                    comp.City +
                                    '/' +
                                    comp.StateAbbr
                                  }
                                  style={{ color: 'black' }}
                                >
                                  {comp.City}, {comp.StateAbbr}
                                </a>
                                <br></br>
                                Housing value change in the last 5 years: $
                                {topRev
                                  .filter(
                                    (company) =>
                                      company.CompanyName === comp.CompanyName
                                  )
                                  .map((e) => e.HousingValueChange)}{' '}
                              </p>
                            </div>
                          )
                        } else {
                          return (
                            <div>
                              <p>
                                <a
                                  href={'../../company/' + comp.StockSymbol}
                                  style={{ color: 'black' }}
                                >
                                  <b>{comp.CompanyName}</b>
                                </a>{' '}
                                ({comp.StockSymbol})<br></br>
                                Revenue (in millions): ${comp.Revenue}
                                <br></br>
                                Location:{' '}
                                <a
                                  href={
                                    '/location/' +
                                    comp.City +
                                    '/' +
                                    comp.StateAbbr
                                  }
                                  style={{ color: 'black' }}
                                >
                                  {comp.City}, {comp.StateAbbr}
                                </a>
                              </p>
                            </div>
                          )
                        }
                      })}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={7}>
                  <Card>
                    <CardContent>
                      <h3>Cities with companies in the {industry} Industry </h3>
                      <p>
                        The map below displays cities with companies in the{' '}
                        {industry} industry and the average home value in those
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
                            : Average value of $
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
                      <a href="/home"> Try searching for another industry</a>.
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
