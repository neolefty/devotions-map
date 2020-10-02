import React, {PropsWithChildren, useEffect, useState} from "react"
import {DEVOTIONS_DESCRIPTION_PLACEHOLDER, DevotionsDescription} from "./DevotionsDescription"

// undefined if not loaded; empty array if load failed
type DevotionsState = ReadonlyArray<DevotionsDescription> | undefined

export const DevotionsContext = React.createContext<DevotionsState>([DEVOTIONS_DESCRIPTION_PLACEHOLDER])

// Loads right away when app loads — so should still be online?
// TODO retry on failure?
export const loadDevotions = async (): Promise<DevotionsState> => {
    const response = await fetch('/devotions.json')
    const json = await response.json()
    if (Array.isArray(json)) {
        const result: DevotionsDescription[] = []
        json.forEach(j => {
            const description = new DevotionsDescription(j)
            if (!description.isBlank && description.isValid)
                result.push(description)
        })
        return result
    }
    else {
        const s = JSON.stringify(json)
        const short = s.length < 40 ? s : `${s.substring(0, 20)}...${s.substring(s.length - 20)}`
        throw new Error(`Expected an array. Received "${short}"`)
    }
}

export const WithDevotions = (props: PropsWithChildren<{}>) => {
    const [devotions, setDevotions] = useState<DevotionsState>(undefined)
    useEffect(() => {
        if (devotions === undefined)
            loadDevotions()
                .then(setDevotions)
                .catch(error => {
                    console.error(error)
                    setDevotions([])
                })
    }, [devotions])
    return (
        <DevotionsContext.Provider value={devotions}>
            {props.children}
        </DevotionsContext.Provider>
    )
}
