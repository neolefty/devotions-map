import React, {useContext, useRef, useState} from 'react'
import InteractiveMap from "react-map-gl"
import ReactMapGl, {ViewState} from "react-map-gl"
import {Config} from "./Config"
import {DevotionsMarkers} from "./DevotionsMarkers"
import {WithDevotions} from "./WithDevotions"

// const useStyles = makeStyles(createStyles({
//     parent: {
//         position: 'absolute',
//         top: 0,
//         right: 0,
//         left: 0,
//         bottom: 0,
//         // width: '100vw',
//         // height: '100vh',
//         backgroundColor: '#ff0',
//     }
// }))

// from the UP to Southern IN to Eastern OH
const regionSW = {lat: 37.75, lng: -90.45}
const regionNE = {lat: 47.5, lng: -80}
const mid = (a: number, b: number) => 0.5 * (a + b)

const paddingLat = 2 // degrees latitude
const paddingLng = 4 // degrees longitude

const mapSW = {lat: regionSW.lat - paddingLat, lng: regionSW.lng - paddingLng}
const mapNE = {lat: regionNE.lat + paddingLat, lng: regionNE.lng + paddingLng}

const INITIAL_VIEW: ViewState = { // could also be ViewportProps
    latitude: mid(regionSW.lat, regionNE.lat),
    longitude: mid(regionSW.lng, regionNE.lng),
    zoom: 5.5,
}

const MapContext = React.createContext<InteractiveMap | undefined>(undefined)
export const useMap = () => useContext(MapContext)

export const App = () => {
    // const classes = useStyles()
    const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW)
    const mapRef = useRef<InteractiveMap>(null)
    return (
        <WithDevotions>
            <ReactMapGl
                width='100vw'
                height='100vh'
                mapboxApiAccessToken={Config.mapboxToken}
                onViewportChange={viewState => setViewState(viewState)}
                viewState={viewState}
                mapStyle={Config.mapboxStyleUrl || 'mapbox://styles/mapbox/dark-v10'}
                ref={mapRef}
                maxZoom={10}
            >
                <MapContext.Provider value={mapRef.current ?? undefined}>
                    <DevotionsMarkers/>
                </MapContext.Provider>
            </ReactMapGl>
        </WithDevotions>
    )
}

// export const App = () => {
//     const classes = useStyles()
//     useEffect(() => console.log(Config.mapboxToken), [])
//     return (
//         <MapGL
//             mapboxApiAccessToken={Config.mapboxToken}
//             className={classes.parent}
//             width='100vw'
//             height='100vh'
//         >
//
//         </MapGL>
//     )
// }

// export const App = () => {
//     const classes = useStyles()
//     const [map, setMap] = useState<mapboxgl.Map>()
//     const parentRef = useRef<HTMLDivElement>(null)
//
//     useEffect(() => {
//         if (parentRef.current && !map) {
//             const map = new mapboxgl.Map({
//                 accessToken: Config.mapboxToken,
//                 container: parentRef.current,
//                 bounds: [mapLL, mapUR],
//             })
//             setMap(map)
//             console.dir(map)
//         }
//     }, [map])
//
//     return (
//         <div className={classes.parent} ref={parentRef}/>
//     )
// }
