import {createStyles, makeStyles} from "@material-ui/styles"
import React, {useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react"
import {Popup} from "react-map-gl"
import {useMap} from "./App"
import {DevotionsDescription} from "./DevotionsDescription"
import {DevotionsGroup} from "./DevotionsGroup"
import {DevotionsMarker} from "./DevotionsMarker"
import {useDevotionsGrouped} from "./useDevotions"

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
export const DevotionsMarkers = () => {
    const classes = useStyles()

    const [selection, setSelection] = useState<DevotionsGroup | undefined>(undefined)
    const handleClearSelection = useCallback(() => setSelection(undefined), [])

    const map = useMap()
    const bounds = map?.getMap().getBounds()
    const zoom = map?.getMap().getZoom()

    // when zoom changes, un-select
    useLayoutEffect(() => setSelection(undefined), [zoom])

    const groups = useDevotionsGrouped(byZip, zoom ?? 6)
    const visibleGroups = useMemo<ReadonlyArray<DevotionsGroup>>(() => {
        if (!bounds) return []
        return groups?.filter(group => {
            const lat = group.lat, lng = group.lng
            return lat > bounds.getSouth() && lng > bounds.getWest()
                && lat < bounds.getNorth() && lng < bounds.getEast()
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
                    group={descriptions}
                    selection={selection}
                    setSelection={setSelection}
                />
            )}
            {selection &&
                <Popup
                    anchor="bottom"
                    latitude={selection.lat} longitude={selection.lng}
                    offsetTop={-15} offsetLeft={0}
                    closeButton={false}
                    onClose={handleClearSelection}
                    closeOnClick={true}
                    className={classes.popup}
                >
                    <div className='head'>
                        {selection.localityDescription}
                        {showParticipantCount && selection.size > 1 &&
                            ` — ${selection.size} households`
                        }
                    </div>
                    {!showParticipantCount &&
                        <div>{selection.size} household{selection.size === 1 ? '' : 's'}</div>
                    }
                    {showParticipantCount && selection.devotions.map((description, i) =>
                        <div key={i}>{description.description}</div>
                    )}
                    <div>{selection.zipDescription()}</div>
                </Popup>
            }
        </>
    )
}
