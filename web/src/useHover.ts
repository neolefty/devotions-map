import {MutableRefObject, useCallback, useEffect, useRef, useState} from "react"

// export const useHover = () => [1, 2]

interface HoverResult<E> {
    ref: MutableRefObject<E | null>
    hover: boolean
}

export const useHover = <E extends (HTMLElement | SVGGraphicsElement)>(): HoverResult<E> => {
// can't return a tuple until CRA catches up with TypeScript 4 — https://stackoverflow.com/questions/62079477/line-0-parsing-error-cannot-read-property-map-of-undefined
// export const useHover = <E extends (HTMLElement | SVGGraphicsElement)>(): [MutableRefObject<E | null>, boolean] => {
    const ref = useRef<E>(null)
    const [hover, setHover] = useState(false)
    const enter = useCallback(() => setHover(true), [])
    const leave = useCallback(() => setHover(false), [])
    useEffect(() => {
        const cur = ref.current
        if (cur) {
            cur.addEventListener('mouseenter', enter)
            cur.addEventListener('mouseleave', leave)
            return () => {
                cur.removeEventListener('mouseenter', enter)
                cur.removeEventListener('mouseleave', enter)
            }
        }
    }, [ref, enter, leave])
    // return [ref, hover]
    return {ref, hover}
}
