import {useEffect, useState} from "react"

export interface WidthHeight {
    width: number
    height: number
}

export const useWindowSize = (): WidthHeight => {
    const [size, setSize] = useState<WidthHeight>({width: window.innerWidth, height: window.innerHeight})

    useEffect(() => {
        const handleSize = () => setSize({
            width: window.innerWidth,
            height: window.innerHeight,
        })
        handleSize()
        window.addEventListener('resize', handleSize)
        return () => window.removeEventListener('resize', handleSize)
    }, [])

    return size
}
