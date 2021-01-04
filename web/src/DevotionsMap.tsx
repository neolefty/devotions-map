import React, {useContext, useRef, useState} from "react"
import ReactMapGl from "react-map-gl"
import InteractiveMap, {ViewState as MapViewState} from "react-map-gl"
import {Config} from "./Config"
import {DevotionsMarkers} from "./DevotionsMarkers"
import {useWindowSize, WidthHeight} from "./useWindowSize"

const mid = (a: number, b: number) => 0.5 * (a + b)

const INITIAL_VIEW: MapViewState = { // could also be ViewportProps
    latitude: mid(Config.region.sw.lat, Config.region.ne.lat),
    longitude: mid(Config.region.sw.lng, Config.region.ne.lng),
    zoom: 6,
}

const MapContext = React.createContext<InteractiveMap | undefined>(undefined)
export const useMap = () => useContext(MapContext)

const computeZoom = (windowSize: WidthHeight): number => {
    // Initial Zoom — subtracting 4 shows all three states; 3.7 cuts off edges a little
    // Overall states shape is 1.37 taller than it is wide, so require more map height when figuring out fit.
    return Math.log2(Math.min(windowSize.width, windowSize.height / 1.37)) - 3.85
}

export const DevotionsMap = () => {
    const windowSize = useWindowSize()
    const [viewState, setViewState] = useState<MapViewState>({
        ...INITIAL_VIEW,
        zoom: computeZoom(windowSize)
    })
    const mapRef = useRef<InteractiveMap>(null)
    return (
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
    )
}

