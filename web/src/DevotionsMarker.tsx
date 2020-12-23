import React, {useCallback, useLayoutEffect, useMemo} from "react"
import {isMobile} from "react-device-detect"
import {Marker} from "react-map-gl"
import {DevotionsGroup} from "./DevotionsGroup"
import {NineStar} from "./NineStar"
import {useHover} from "./useHover"

interface DevotionsMarkerProps {
    group: DevotionsGroup
    selection?: DevotionsGroup
    setSelection: (description?: DevotionsGroup) => void
}

const RADIUS_BASE = 20
// const WIDTH_BASE = 20
// const HEIGHT_BASE = 20

export const starRadiusPixels = (numGatherings: number) =>
    Math.log1p(numGatherings + 1.7) * RADIUS_BASE
// export const starRadiusPixels = (numGatherings: number) =>
//     Math.log1p(numGatherings + 1.7) * 0.5 * (WIDTH_BASE + HEIGHT_BASE)

// a reasonable upper bound
export const RADIUS_50 = starRadiusPixels(50)

export const DevotionsMarker = (
    {group, selection, setSelection}: DevotionsMarkerProps
) => {
    const {ref, hover} = useHover<SVGSVGElement>()

    const handleToggle = useCallback(() =>
        setSelection(group === selection ? undefined : group)
    , [group, selection, setSelection])

    const style = useMemo(() => {
        const r = starRadiusPixels(group.size)
        return {width: r, height: r}
        // const multiplier = Math.log1p(group.size + 1.7)
        // return {width: WIDTH_BASE * multiplier, height: HEIGHT_BASE * multiplier}
    }, [group])

    useLayoutEffect(() => {
        if (!isMobile) {
            if (hover && selection !== group)
                setSelection(group)
            if (!hover && selection === group)
                setSelection(undefined)
        }
    }, [hover, selection, setSelection, group])

    return (
        <Marker
            latitude={group.lat} longitude={group.lng}
            offsetLeft={style.width * -0.5} offsetTop={style.height * -0.5}
        >
            <NineStar
                {...style}
                forwardRef={ref}
                onClick={handleToggle}
                rings={[
                    // {valleyRadius: 0.1, pointRadius: 0.2, strokeWidth: 0.05, stroke: "rgba(250,220,30,0.4)"}, // width/height 120
                    {pointRadius: 1, valleyRadius: 0.7, fill: "rgba(250,220,30,0.7)"},
                    {pointRadius: 0.7, valleyRadius: 0.4, fill: "rgba(225, 122, 45,0.9)"},
                ]}
            />
            {/*<Flame style={style} className={className} ref={ref} onClick={handleSelect}/>*/}
        </Marker>
    )
}
