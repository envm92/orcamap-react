import React, { useState, useEffect } from 'react'
import { fromLonLat } from 'ol/proj'
import { GoogleSpreadsheet } from 'google-spreadsheet'

import axios from 'axios'
import Map from './Map'
import './contain.css'
import config from '../../config/config'
import { Layers, TileLayer, VectorLayer, GoogleSheetsLayer } from './Layers'
import { Controls, FullScreenControl } from './Controls'
import orca from './orcapin.png'

const doc = new GoogleSpreadsheet(config.spreadsheetId)
doc.useApiKey(config.apiKey)

const MapContainer: React.FC = () => {
  const [coordinates, setCoordinates] = useState([[0, 0]])
  // eslint-disable-next-line
  const [sightings, setSightings] = useState([{ latitude: 0, longitude: 0, type: '', comment: '' }])
  const [googleSheetcoordinates, setgoogleSheetcoordinates] = useState([[0, 0]])
  const [zoom, setZoom] = useState(0)
  const [center, setCenter] = useState([0, 0])
  const [showLayer, setShowLayer] = useState(true)

  useEffect(function effectFunction() {
    try {
      axios.get(`https://acartia.io/api/v1/sightings/current`).then((res) => {
        const setType = new Set()
        const test = []
        for (let i = 0; i < res.data.length; i++) {
          test.push([res.data[i].longitude, res.data[i].latitude])
          setType.add(res.data[i].type)
        }
        setCoordinates(test)
        setSightings(res.data)
        console.log(setType.size)
        console.log(setType)
      })
    } catch (error) {
      console.log(error)
    }
  }, [])

  return (
    <>
      <div id="cetacean_checkbox" style={{ margin: '0 40vw' }}>
        <img src={orca} width="25px" height="25px" alt="possible orca pin" />
        <input
          type="checkbox"
          checked={showLayer}
          onChange={(event) => setShowLayer(event.target.checked)}
        />{' '}
        Pod Sightings
      </div>

      <h3
        style={{
          display: 'flex',
          // alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Test map of test coordinates
      </h3>

      <div className="setsides">
        <Map center={fromLonLat(center)} zoom={zoom}>
          <Layers>
            <TileLayer zIndex={0} />
            {showLayer && (
              <VectorLayer
                coordinates={coordinates}
                zIndex={0}
                sightings={sightings}
              />
            )}
          </Layers>
          <Controls>
            <FullScreenControl />
          </Controls>
        </Map>
      </div>

      <h3
        style={{
          display: 'flex',
          // alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Google Sheets Coordinates
      </h3>
    </>
  )
}

export default MapContainer
