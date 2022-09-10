import React, { useContext, useEffect } from 'react'
import OLVectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { get } from 'ol/proj'

// note: both the VectorLayer styleOptions object
// and the 'source' from line 33 will need to be hoisted
//  to be able to make multiple different vector layers
// for different data sources.
import { Style, Icon } from 'ol/style'
import hydropin from './orcapin.png'

import MapContext from '../Map/MapContext'
import { vector } from '../Source'

const styleOptions = {
  MultiPointIcon: new Style({
    image: new Icon({
      src: hydropin,
      scale: [0.25, 0.25],
    }),
  }),
  SingleIcon: new Style({
    image: new Icon({
      src: hydropin,
      scale: [0.25, 0.25],
    }),
  }),
}
interface Sighting {
  latitude: number
  longitude: number
  type: string
  comment: string
}

interface Props {
  sightings: Sighting[]
  coordinates: number[][]
  zIndex: number
}

const VectorLayer: React.FC<Props> = ({
  coordinates,
  zIndex = 0,
  sightings,
}: Props) => {
  const { map } = useContext(MapContext)

  useEffect(() => {
    if (!map.addLayer) return
    for (let i = 0; i < sightings.length; i++) {
      const vectorLayer = new OLVectorLayer({
        source: vector({
          features: new GeoJSON().readFeatures(
            {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {
                    kind: sightings[i].type,
                    name: 'SRKW',
                    state: 'WA',
                  },
                  geometry: {
                    type: 'MultiPoint',
                    coordinates: [coordinates[i]],
                  },
                },
              ],
            },
            {
              featureProjection: get('EPSG:3857'),
            },
          ),
        }),
        style: styleOptions.SingleIcon,
      })
      map.addLayer(vectorLayer)
      vectorLayer.setZIndex(zIndex)
    }

    // eslint-disable-next-line
    return () => {
    }
  }, [map, coordinates, zIndex, sightings])

  return null
}

export default VectorLayer
