import {createStyles, makeStyles} from "@material-ui/styles"
import React, {useMemo} from "react"
import {Marker} from "react-map-gl"
import {useMap} from "./App"
import {ReactComponent as Flame} from "./flame.svg"
import {useDevotions} from "./WithDevotions"

const useStyles = makeStyles(createStyles({
    flame: {
        height: 50,
        width: 35,
    }
}))

interface DevotionsMarkersProps {
}

export const DevotionsMarkers = (props: DevotionsMarkersProps) => {
    const descriptions = useDevotions()
    const classes = useStyles()
    const map = useMap()
    const bounds = map?.getMap().getBounds()
    const visibleDescriptions = useMemo(() => descriptions?.filter(description =>
        bounds && description.lat > bounds.getSouth() && description.lng > bounds.getWest()
            && description.lat < bounds.getNorth() && description.lng < bounds.getEast()
    ), [bounds, descriptions])
    return (
        <>
            {visibleDescriptions?.map((description, i) =>
                <Marker key={i} latitude={description.lat} longitude={description.lng} offsetLeft={-25}
                        offsetTop={-17.5}>
                    <Flame className={classes.flame}/>
                </Marker>
            )}
        </>
    )
}
