import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import axios from 'axios'
import NavBar from './NavBar'
import { Grid, Card, CardContent, LinearProgress, Button } from '@material-ui/core'
import LocationMap from './LocationMap'
import Geocode from 'react-geocode'
import config from '../config.json'
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
const db = firebase.firestore();

Geocode.setApiKey(config['maps-api-key'])

// parses URL queries for city and state. returns list of city, state.
const parseURL = (url) => {
  if (url.split('/').length > 3) {
    let state = url.slice(-2)
    let index = url.indexOf('/', 10)
    let city = url.slice(10, index)
    // standardize casing
    let words = city.split(' ')
    for (let i = 0; i < words.length; i++) {
      words[i] =
        words[i].substring(0, 1).toUpperCase() +
        words[i].substring(1).toLowerCase()
    }
    city = words.join(' ')
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
      return fetchCoords(city).then((val) => val)
    })
  )
}

async function sendData(city) {
  // if read user id gives empty then add otherwise update
  console.log(city)
  let currEmail = ''
  let currName = ''
  let hasLocations = false
  let uniqueArray = []
  await firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      currEmail = firebase.auth().currentUser.email
      currName = firebase.auth().currentUser.displayName
      // User is signed in.
    } else {
      currEmail = ''
      currName = ''
      // No user is signed in.
    }
  });
  
  await db.collection("test").where("email", "==", currEmail)
  .onSnapshot((querySnapshot) => {
    var locations = []
    querySnapshot.forEach((doc) => {
      locations.push(doc.data().savedLocs);
  });
  uniqueArray = locations.filter((v, index) => {
      return locations.indexOf(v) === index;
  });
  console.log(uniqueArray.flat())
  //console.log("I have read: Current cities in CA: ", locations.join(", "));
  if (locations.length === 0) {
    hasLocations = false; 
   // console.log(locations.length)
  } else {
   // console.log(locations.length)
    hasLocations = true; 
  }
  });
  if (hasLocations) {
    //console.log('doning the right thing')
    db.collection('test').update({
      locations: firebase.firestore.FieldValue.arrayUnion(city)
    });
  } else {
    db.collection("test").add({
      name: currName,
      email: currEmail,
      savedLocs: [city]
  })
  .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });
  }
  return uniqueArray;
}

const Location = () => {
  // useLocation().pathname will return '/location/city/state'
  let url = useLocation().pathname
  const [city] = useState(parseURL(url)[0])
  const [state] = useState(parseURL(url)[1])
  const [cityStat, setCityStat] = useState([])
  const [forecast, setForecast] = useState([])
  const [companies, setCompanies] = useState([])
  const [top20, setTop20] = useState([])
  const [cityCoords, setCityCoords] = useState()
  const [defaultCenter, setDefaultCenter] = useState()
  const [loading, setLoading] = useState(true)
  const [rank, setRank] = useState([])
  const [locations, setLocations] = useState([])

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
        setLoading(false)
      })

    axios
      .get('http://localhost:8081/getCityRanking/' + state)
      .then((response) => {
        setRank(response.data)
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
      {state ? (
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
              {loading && <LinearProgress />}
            </h2>
            <Button onClick={() => setLocations(sendData(city))}>
            Save Search 
            </Button>
            <Grid container direction={'row'} spacing={4}>
              <Grid item xs={4}>
                {!loading && cityStat.length === 0 && companies.length === 0 && (
                  <Card>
                    <CardContent>
                      <p>
                        No results were found for {city}, {state}. This may be
                        because {city}, {state} is not included in our dataset.
                        <a href="/">Try searching for another city</a>.
                      </p>
                    </CardContent>
                  </Card>
                )}
                {cityStat.length > 0 && (
                  <Card>
                    <CardContent>
                      <h3>Home Value Statistics</h3>
                      {cityStat.map((city) => (
                        <div key={city}>
                          <p>
                            Average Home Value: $
                            {Number(
                              Number(city.mean).toFixed(2)
                            ).toLocaleString()}
                          </p>
                          <p>
                            Minimum Home Value: $
                            {Number(
                              Number(city.min).toFixed(2)
                            ).toLocaleString()}
                          </p>
                          <p>
                            Maximum Home Value: $
                            {Number(
                              Number(city.max).toFixed(2)
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))}
                      {forecast.map((city) => (
                        <div key={city}>
                          <p>Forecasted Change: {city.Forecast.toFixed(3)}%</p>
                        </div>
                      ))}
                      {rank.map((row) => {
                        if (row.RegionName === city) {
                          if (row.HousingValueChange > 0) {
                            return (
                              <>
                                <p>
                                  Ranked <b>#{Number(row.row_num).toLocaleString()}</b> in housing value
                                  growth in {state}. Housing values have
                                  increased by $
                                  {Number(row.HousingValueChange.toFixed(2)).toLocaleString()} in the
                                  past 20 years.
                                </p>
                              </>
                            )
                          } else {
                            return (
                              <>
                                <p>
                                  Ranked <b>#{Number(row.row_num).toLocaleString()}</b> in housing value growth
                                  in {state}. Housing values have decreased by $
                                  {Number(row.HousingValueChange.toFixed(2)).toLocaleString()} in the
                                  past 20 years.
                                </p>
                              </>
                            )
                          }
                        } else {
                          return <></>
                        }
                      })}
                    </CardContent>
                  </Card>
                )}
                {companies.length > 0 && (
                  <Card>
                    <CardContent>
                      <h3>
                        Companies headquarted in {city}, {state}
                      </h3>
                      {companies.map((comp) => (
                        <p key={comp.StockSymbol}>
                          <a href={'../../company/' + comp.StockSymbol}>
                            {comp.CompanyName} ({comp.StockSymbol})
                          </a>
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </Grid>
              <Grid item xs={8}>
                <Card>
                  <CardContent>
                    <h3>Cities with the most housing growth in {state}</h3>
                    <p>
                      The map below displays cities with the highest forecasted
                      housing value growth, based on Zillow's Home Value Index.
                      Click on the markers to learn more about each city.
                    </p>
                    {cityCoords && (
                      <LocationMap
                        cities={top20}
                        coords={cityCoords}
                        center={defaultCenter}
                        inputCity={city}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2} />
        </Grid>
      ) : (
        <h2>Location</h2>
      )}
    </>
  )
}

export default Location
