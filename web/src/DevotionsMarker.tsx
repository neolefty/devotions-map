import React, {useCallback, useEffect} from "react"
import {Marker} from "react-map-gl"
import {AtLeastOne} from "./AtLeastOne"
import {DevotionsDescription} from "./DevotionsDescription"
import {ReactComponent as Flame} from "./flame.svg"
import {useHover} from "./useHover"

interface DevotionsMarkerProps {
    className?: string
    descriptions: AtLeastOne<DevotionsDescription>
    selection?: AtLeastOne<DevotionsDescription>
    setSelection: (description?: AtLeastOne<DevotionsDescription>) => void
}

export const DevotionsMarker = (
    {className, descriptions, selection, setSelection}: DevotionsMarkerProps
) => {
    const {ref, hover} = useHover<SVGSVGElement>()
    const handleSelect = useCallback(() => setSelection(descriptions), [descriptions, setSelection])
    useEffect(() => {
        if (hover && selection !== descriptions)
            setSelection(descriptions)
    }, [hover, selection, setSelection, descriptions])
    return (
        <Marker
            latitude={descriptions[0].lat} longitude={descriptions[0].lng}
            offsetLeft={-17.5} offsetTop={-30}
        >
            <Flame className={className} ref={ref} onClick={handleSelect}/>
        </Marker>
    )
}
