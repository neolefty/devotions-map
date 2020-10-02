import {useContext, useMemo} from "react"
import {AtLeastOne} from "./AtLeastOne"
import {DevotionsDescription} from "./DevotionsDescription"
import {DevotionsContext} from "./WithDevotions"

export const useDevotions = () => useContext(DevotionsContext)

export const useDevotionsAggregate = (
    aggregate: (description: DevotionsDescription) => string
): AtLeastOne<DevotionsDescription>[] => {
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
        return Array.from(map.values())
    }, [descriptions, aggregate])
}
