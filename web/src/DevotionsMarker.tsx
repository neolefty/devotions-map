import React, {useCallback, useEffect, useMemo} from "react"
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

const WIDTH_BASE = 21
const HEIGHT_BASE = 30

export const DevotionsMarker = (
    {className, descriptions, selection, setSelection}: DevotionsMarkerProps
) => {
    const {ref, hover} = useHover<SVGSVGElement>()
    const handleSelect = useCallback(() => setSelection(descriptions), [descriptions, setSelection])
    const style = useMemo(() => {
        const multiplier = Math.log1p(descriptions.length + 1.7)
        return {width: WIDTH_BASE * multiplier, height: HEIGHT_BASE * multiplier}
    }, [descriptions])
    useEffect(() => {
        if (hover && selection !== descriptions)
            setSelection(descriptions)
    }, [hover, selection, setSelection, descriptions])
    return (
        <Marker
            latitude={descriptions[0].lat} longitude={descriptions[0].lng}
            offsetLeft={-17.5} offsetTop={-30}
        >
            <Flame style={style} className={className} ref={ref} onClick={handleSelect}/>
        </Marker>
    )
}
