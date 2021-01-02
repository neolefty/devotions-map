import {createStyles, makeStyles} from "@material-ui/styles"
import {format} from "date-fns"
import React, {useContext, useEffect, useRef, useState} from 'react'
import InteractiveMap from "react-map-gl"
import ReactMapGl, {ViewState as MapViewState} from "react-map-gl"
import {Config} from "./Config"
import {DevotionsMarkers} from "./DevotionsMarkers"
import {FloatQuote} from "./FloatQuote"
import {FloatKey} from "./FloatKey"
import {useDevotions} from "./useDevotions"
import {useWindowSize, WidthHeight} from "./useWindowSize"
import {WithDevotions} from "./WithDevotions"

const mid = (a: number, b: number) => 0.5 * (a + b)

// const paddingLat = 2 // degrees latitude
// const paddingLng = 4 // degrees longitude

const INITIAL_VIEW: MapViewState = { // could also be ViewportProps
    latitude: mid(Config.region.sw.lat, Config.region.ne.lat),
    longitude: mid(Config.region.sw.lng, Config.region.ne.lng),
    zoom: 6,
}

const MapContext = React.createContext<InteractiveMap | undefined>(undefined)
export const useMap = () => useContext(MapContext)

const useStyles = makeStyles(createStyles({
    attribute: {
        paddingRight: '1vmin',
        fontStyle: 'normal',
        textAlign: 'right',
        marginTop: '0.3vmin',
    },
}))

const computeZoom = (windowSize: WidthHeight): number => {
    // Initial Zoom — subtracting 4 shows all three states; 3.7 cuts off edges a little
    // Overall states shape is 1.37 taller than it is wide, so require more map height when figuring out fit.
    return Math.log2(Math.min(windowSize.width, windowSize.height / 1.37)) - 3.85
}

// TODO -- see https://trello.com/b/5Rcw3uQv/devotions-map
// 1. chevron on Quote box to show / hide explanation
// 2. try out https://www.dafont.com/linux-libertine.font for quote

export const App = () => {
    const windowSize = useWindowSize()
    const [viewState, setViewState] = useState<MapViewState>({
        ...INITIAL_VIEW,
        zoom: computeZoom(windowSize)
    })
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
            <p>
                Stars represent {devotions?.length} households<br/>
                with <a href="https://www.bahai.org/action/devotional-life/">devotional gatherings</a>.
                {props.latest &&
                    <>
                        <br/>
                        Most recent: {format(props.latest, 'M/d/yyyy')}.
                    </>
                }
            </p>
            <p>
                Official statistics report 237<br/>
                — <a href="https://midwestbahai.org/devotions-points-of-light/#form">add yours to the map</a>
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
