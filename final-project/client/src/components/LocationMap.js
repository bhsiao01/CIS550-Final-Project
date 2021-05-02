import React, { useState, useEffect } from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import config from '../config.json'
import Geocode from 'react-geocode'

const mapStyles = {
  width: '100%',
  height: '90vh',
}

const LocationMap = ({ cities, center }) => {
  const [selected, setSelected] = useState({})
  const [markers, setMarkers] = useState()

  const key = config['maps-api-key']
  // const onLoad = React.useCallback(funct)

  useEffect(() => {
    setMarkers(
      cities.map((item) => (
        <Marker
          key={item.City}
          position={item.loc}
          onClick={() => setSelected(item)}
        />
      ))
    )
  }, [cities])

  return (
    <>
      <div className="map">
        <LoadScript googleMapsApiKey={key}>
          <GoogleMap mapContainerStyle={mapStyles} zoom={7} center={center}>
            {cities.map((item) => {
              return (
                <Marker
                  key={item.City}
                  position={item.loc}
                  onClick={() => setSelected(item)}
                />
              )
            })}
            {console.log('MARKER', cities)}
            {/* <Marker key={'test'} position={{ lat: 40.7929, lng: -77.8604 }} /> */}
            {selected.loc && (
              <InfoWindow
                position={selected.loc}
                clickable={true}
                onCloseClick={() => setSelected({})}
              >
                <div className="info">
                  {/* <NameStyle><a target="_blank" rel="noopener noreferrer" href={selected.link}>{selected.name}</a></NameStyle> */}
                  {/* <AddressStyle>{selected.address}</AddressStyle> */}
                  {/* <RoundTag col={"#F5F5F5"}><PriceStyle>{selected.rating}<span role="img">⭐</span></PriceStyle></RoundTag> */}
                  {/* <RoundTag col={"#F5F5F5"}><PriceStyle>{selected.price}</PriceStyle></RoundTag> */}
                  <p>
                    {selected.City}, {selected.StateAbbr}:
                  </p>
                  <p>{selected.NumCompanies} companies</p>
                  <p>
                    Average price:{' '}
                    {Number(
                      Number(selected.AvgPrice).toFixed(2)
                    ).toLocaleString()}
                    , Forecasted change:{' '}
                    {selected.ForecastYoYPctChange.toFixed(3)}%
                  </p>{' '}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </>
  )
}

export default LocationMap
