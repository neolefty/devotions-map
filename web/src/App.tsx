import {createStyles, makeStyles} from "@material-ui/styles"
import {format} from "date-fns"
import React, {useContext, useEffect, useRef, useState} from 'react'
import InteractiveMap from "react-map-gl"
import ReactMapGl, {ViewState} from "react-map-gl"
import {Config} from "./Config"
import {DevotionsMarkers} from "./DevotionsMarkers"
import {FloatQuote} from "./FloatQuote"
import {FloatKey} from "./FloatKey"
import {useDevotions} from "./useDevotions"
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

// TODO
// 1. set initial zoom based on window size
// 2. update date each time

export const App = () => {
    const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW)
    const mapRef = useRef<InteractiveMap>(null)
    const classes = useStyles()
    const [latest, setLatest] = useState<Date | undefined>()
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
                    maxZoom={11}
                >
                    <MapContext.Provider value={mapRef.current ?? undefined}>
                        <DevotionsMarkers/>
                    </MapContext.Provider>
                </ReactMapGl>
                <GetLatest setLatest={setLatest}/>
                <FloatKey>
                    <LastUpdated latest={latest}/>
                </FloatKey>
            </WithDevotions>
            <FloatQuote>
                &ldquo;Let the flame of the love of God burn brightly within your radiant hearts.&rdquo;
                <div className={classes.attribute}>
                    <a href="https://www.bahai.org/r/413529355">Bahá&rsquo;u&rsquo;lláh</a>
                </div>
            </FloatQuote>
        </>
    )
}

interface LastUpdatedProps {
    latest?: Date
}

const LastUpdated = (props: LastUpdatedProps) => {
    const devotions = useDevotions()
    return (
        <>
            <p>Stars represent {devotions?.length} households<br/>with <a href="https://www.bahai.org/action/devotional-life/">devotional gatherings</a></p>
            <p>
                {props.latest &&
                    <>
                        <span>Most recent: {format(props.latest, 'M/d/yyyy')}</span>
                        <br/>
                    </>
                }
                <a href="https://midwestbahai.org/devotions-points-of-light/#form">Add yours here</a>
            </p>
        </>
    )
}

interface GetLatestProps {
    setLatest: (latest: Date) => void
}
const GetLatest = ({setLatest}: GetLatestProps) => {
    const descriptions = useDevotions()
    useEffect(() => {
        if (descriptions) {
            const latest = descriptions.reduce((soFar, description) =>
                    description.timestamp.getTime() > soFar.getTime() ? description.timestamp : soFar,
                new Date(0)
            )
            if (latest)
                setLatest(latest)
        }
    }, [setLatest, descriptions])
    return <></>
}
