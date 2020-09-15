import {createStyles, makeStyles} from "@material-ui/styles"
import mapboxgl from "mapbox-gl"
import MapGL, {GeolocateControl, ViewportProps, ViewState} from "react-map-gl"
import React, {useEffect, useRef, useState} from 'react'
import {Config} from "./Config"
import ReactMapGl from 'react-map-gl'

const useStyles = makeStyles(createStyles({
    parent: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        // width: '100vw',
        // height: '100vh',
        backgroundColor: '#ff0',
    }
}))

// from the UP to Southern IN to Eastern OH
const mapLL = {lat: 37.75, lng: -90.45}
const mapUR = {lat: 47.5, lng: -80}
const mid = (a: number, b: number) => 0.5 * (a + b)

const INITIAL_VIEW: ViewState = { // could also be ViewportProps
    latitude: mid(mapLL.lat, mapUR.lat),
    longitude: mid(mapLL.lng, mapUR.lng),
    zoom: 6,
}

export const App = () => {
    const classes = useStyles()
    const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW)
    return (
        <ReactMapGl
            width='100vw'
            height='100vh'
            mapboxApiAccessToken={Config.mapboxKey}
            onViewportChange={viewState => setViewState(viewState)}
            viewState={viewState}
            mapStyle='mapbox://styles/mapbox/dark-v10'
        />
    )
}

// export const App = () => {
//     const classes = useStyles()
//     useEffect(() => console.log(Config.mapboxKey), [])
//     return (
//         <MapGL
//             mapboxApiAccessToken={Config.mapboxKey}
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
//                 accessToken: Config.mapboxKey,
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
