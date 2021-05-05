import React, { useState } from 'react'
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

const PriceRangeMap = ({ cities, coords }) => {
  const [selected, setSelected] = useState({})

  return (
    <>
      {coords && coords[0] && (
        <div className="map">
          <LoadScript googleMapsApiKey={key}>
            <GoogleMap
              mapContainerStyle={mapStyles}
              zoom={4}
              center={{ lat: 39.134772, lng: -98.398871 }}
            >
              {coords.map((item, i) => {
                cities[i].loc = item
                return (
                  <Marker
                    key={cities[i].RegionName}
                    position={item}
                    onClick={() => setSelected(cities[i])}
                  />
                )
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
                        '/location/' +
                        selected.RegionName +
                        '/' +
                        selected.StateName
                      }
                    >
                      <b>
                        {selected.RegionName}, {selected.StateName}
                      </b>
                    </a>
                    <p>
                      ${Number(selected.Min).toLocaleString()} - $
                      {Number(selected.Max).toLocaleString()}
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

export default PriceRangeMap
