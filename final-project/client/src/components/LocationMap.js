import React, { useState, useEffect } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import config from '../config.json'

const key = config['maps-api-key']

const mapStyles = {
  width: '100%',
  height: '90vh',
}

const google=window.google;

const LocationMap = ({ cities, coords, center, inputCity }) => {
  const [selected, setSelected] = useState({})

  return (
    <>
      {coords && coords[0] && (
        <div className="map">
          <LoadScript googleMapsApiKey={key}>
            <GoogleMap mapContainerStyle={mapStyles} zoom={7} center={center}>
              {coords.map((item, i) => {
                cities[i].loc = item
                if (cities[i].City === inputCity) {
                  return (
                    <Marker
                      icon={{url: 'http://maps.google.com/mapfiles/kml/pal4/icon47.png'}}
                      key={cities[i].City}
                      position={item}
                      onClick={() => setSelected(cities[i])}
                    />
                  )
                } else {
                  return (
                    <Marker
                      key={cities[i].City}
                      position={item}
                      onClick={() => setSelected(cities[i])}
                    />
                  )
                }
              })}
              {selected.loc && (
                <InfoWindow
                  position={selected.loc}
                  clickable={true}
                  onCloseClick={() => setSelected({})}
                >
                  <div className="info">
                    <a
                      href={
                        '/location/' + selected.City + '/' + selected.StateAbbr
                      }
                    >
                      <b>
                        {selected.City}, {selected.StateAbbr}
                      </b>
                    </a>
                    <p>{selected.NumCompanies} companies headquartered</p>
                    <p>
                      Avg Stock Price:{' $'}
                      {Number(
                        Number(selected.AvgPrice).toFixed(2)
                      ).toLocaleString()}
                    </p>
                    <p>
                      Forecasted Housing Value Change:{' '}
                      {selected.ForecastYoYPctChange.toFixed(3)}%
                    </p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      )}
    </>
  )
}

export default LocationMap
