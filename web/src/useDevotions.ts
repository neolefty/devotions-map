import {useContext, useMemo} from "react"
import {AtLeastOne} from "./AtLeastOne"
import {DevotionsDescription} from "./DevotionsDescription"
import {DevotionsGroup} from "./DevotionsGroup"
import {RADIUS_50, starRadiusPixels} from "./DevotionsMarker"
import {DevotionsContext} from "./WithDevotions"

export const useDevotions = () => useContext(DevotionsContext)

export const useDevotionsAggregate = (
    aggregate: (description: DevotionsDescription) => string
): ReadonlyArray<DevotionsGroup> => {
    const descriptions = useDevotions()
    return useMemo(() => {
        const map = new Map<string, AtLeastOne<DevotionsDescription>>()
        descriptions?.forEach(description => {
            const tag = aggregate(description)
            const group = map.get(tag)
            if (group)
                group.push(description)
            else
                map.set(tag, [description])
        })
        return Array.from(map.values()).map(value => new DevotionsGroup(value))
    }, [descriptions, aggregate])
}

// Farthest north is Marquette at 46, and south is Bloomington at 39.16
// Most are around 41-43 North. 60,000 meters per pixel is for about 40 degrees.
// See https://docs.mapbox.com/help/glossary/zoom-level/
export const pixelsPerMeter = (zoom: number) =>
    Math.pow(2, zoom) / 60_000

export const useDevotionsGrouped = (
    aggregate: (description: DevotionsDescription) => string,
    zoomLevel: number,
): ReadonlyArray<DevotionsGroup> => {
    performance.mark('grouping')
    const aggregated = useDevotionsAggregate(aggregate)
    return useMemo<ReadonlyArray<DevotionsGroup>>(() => {
        const pxPerM = pixelsPerMeter(zoomLevel)
        const result: DevotionsGroup[] = []
        aggregated.forEach(group => {
            const groupRadius = starRadiusPixels(group.size)
            const joinIndex = result.findIndex(toJoin => {
                const minPixels = toJoin.minApproxDist(group) * pxPerM
                // console.log(`— distance from ${group.localityDescription} to ${toJoin.localityDescription} is greater than ${minPixels} px`)
                if (minPixels < RADIUS_50 + groupRadius) {
                    const pixelDistance = toJoin.distance(group) * pxPerM
                    // console.log(`—→ exactly ${pixelDistance} px`)

                    // the real test — slightly more expensive than everything leading up to it
                    if (pixelDistance < RADIUS_50 + groupRadius) {
                        const joinRadius = starRadiusPixels(toJoin.size)
                        // if the stars will overlap — that is, the distance between them is less than 0.4 * their added radius
                        // if (pixelDistance < (groupRadius + joinRadius) * 0.4)
                        //     console.log(`—→ ${pixelDistance}px — joining ${group.localityDescription} into ${toJoin.localityDescription} ←—`)
                        if (pixelDistance < (groupRadius + joinRadius) * 0.4)
                            // then group them
                            return true
                    }
                }
                return false
            })

            // if it overlaps, group it
            if (joinIndex >= 0)
                result[joinIndex] = result[joinIndex].add(group)
            // otherwise add it to the list
            else
                result.push(group)
        })
        console.debug(`Group ${aggregated.length} groups at zoom ${zoomLevel} → ${result.length} bunches`)
        performance.measure('from start of grouping', 'grouping')
        console.debug(performance.getEntriesByType('measure'))
        performance.clearMarks()
        performance.clearMeasures()
        return result
    }, [aggregated, zoomLevel])
}
