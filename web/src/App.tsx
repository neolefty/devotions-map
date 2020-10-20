import {createStyles, makeStyles} from "@material-ui/styles"
import React, {useContext, useRef, useState} from 'react'
import InteractiveMap from "react-map-gl"
import ReactMapGl, {ViewState} from "react-map-gl"
import {Config} from "./Config"
import {DevotionsMarkers} from "./DevotionsMarkers"
import {FloatQuote} from "./FloatQuote"
import {LastUpdated} from "./LastUpdated"
import {WithDevotions} from "./WithDevotions"

const mid = (a: number, b: number) => 0.5 * (a + b)

// const paddingLat = 2 // degrees latitude
// const paddingLng = 4 // degrees longitude

const INITIAL_VIEW: ViewState = { // could also be ViewportProps
    latitude: mid(Config.region.sw.lat, Config.region.ne.lat),
    longitude: mid(Config.region.sw.lng, Config.region.ne.lng),
    zoom: 6,
}

const MapContext = React.createContext<InteractiveMap | undefined>(undefined)
export const useMap = () => useContext(MapContext)

const useStyles = makeStyles(createStyles({
    attribute: {
        paddingRight: '1vmax',
        fontStyle: 'normal',
        textAlign: 'right',
        marginTop: '0.3vmax',
    },
}))

export const App = () => {
    const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW)
    const mapRef = useRef<InteractiveMap>(null)
    const classes = useStyles()
    return (
        <>
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
            <FloatQuote>
                &ldquo;Let the flame of the love of God burn brightly within your radiant hearts.&rdquo;
                <div className={classes.attribute}>
                    <a href="https://www.bahai.org/r/413529355">Bahá&rsquo;u&rsquo;lláh</a>
                </div>
            </FloatQuote>
            <LastUpdated>
                Updated 10/4/2020 — <a href="https://midwestbahai.org/devotions-points-of-light/#form">add yours here</a>
            </LastUpdated>
        </>
    )
}
