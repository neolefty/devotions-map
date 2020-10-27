import {createStyles, makeStyles} from "@material-ui/styles"
import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Popup} from "react-map-gl"
import {useMap} from "./App"
import {AtLeastOne} from "./AtLeastOne"
import {DevotionsDescription} from "./DevotionsDescription"
import {DevotionsMarker} from "./DevotionsMarker"
import {useDevotionsAggregate} from "./useDevotions"

const showParticipantCount = false

const useStyles = makeStyles(createStyles({
    popup: {
        color: 'black',
        '& .head': {
            margin: '0.2rem 0.5rem 0 0.5rem',
            fontWeight: 'bold',
            fontSize: '110%'
        },
        '& div': {
            maxWidth: '50vw',
            textAlign: 'center',
            lineHeight: '160%',
        },
    },
}))

const byZip = (description: DevotionsDescription) => description.zip

// TODO aggregate when zoomed out
// TODO when zoomed in enough, show popup anyway
export const DevotionsMarkers = () => {
    const classes = useStyles()

    const [selection, setSelection] = useState<AtLeastOne<DevotionsDescription> | undefined>(undefined)
    const handleClearSelection = useCallback(() => setSelection(undefined), [])

    const map = useMap()
    const bounds = map?.getMap().getBounds()

    const groups = useDevotionsAggregate(byZip)
    const visibleGroups = useMemo<AtLeastOne<DevotionsDescription>[]>(() => {
        if (!bounds) return []
        return groups?.filter(group => {
            const first = group[0]
            return first.lat > bounds.getSouth() && first.lng > bounds.getWest()
                && first.lat < bounds.getNorth() && first.lng < bounds.getEast()
        })
    }, [bounds, groups])

    useEffect(() => {
        if (visibleGroups.length === 1)
            setSelection(visibleGroups[0])
    }, [visibleGroups, setSelection])

    return (
        <>
            {visibleGroups?.map((descriptions, i) =>
                <DevotionsMarker
                    key={i}
                    descriptions={descriptions}
                    selection={selection}
                    setSelection={setSelection}
                />
            )}
            {selection &&
                <Popup
                    anchor="bottom"
                    latitude={selection[0].lat} longitude={selection[0].lng}
                    offsetTop={0} offsetLeft={0}
                    closeButton={false}
                    onClose={handleClearSelection}
                    closeOnClick={true}
                    className={classes.popup}
                >
                    <div className='head'>
                        {selection[0].city}
                        {showParticipantCount && selection.length > 1 &&
                            ` — ${selection.length} households`
                        }
                    </div>
                    {!showParticipantCount &&
                        <div>{selection.length} household{selection.length === 1 ? '' : 's'}</div>
                    }
                    {showParticipantCount && selection.map((description, i) =>
                        <div key={i}>{description.description}</div>
                    )}
                    <div>Zip: {selection[0].zip}</div>
                </Popup>
            }
        </>
    )
}
