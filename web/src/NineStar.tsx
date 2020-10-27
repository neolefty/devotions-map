import React, {Ref} from "react"

interface StarRing {
    pointRadius: number // 0 to 1
    valleyRadius: number // 0 to 1
    fill?: string
    strokeWidth?: number
    stroke?: string
}

interface NineStarProps {
    width: number
    height: number
    rings: ReadonlyArray<StarRing>
    forwardRef?: Ref<SVGSVGElement>
    onClick?: () => void
}

export const NumArray = (start: number, end: number): number[] =>
    Array.from(Array(end - start), (_, i) => i + start)

// adapted from https://github.com/sindresorhus/round-to/blob/master/index.js
export const roundTo = (n: number, precision: number): number => {
    const [mantissa, exponent] = `${n}e`.split('e').map(Number)
    // shift and round
    let result = Math.round(Number(`${mantissa}e${exponent + precision}`))
    // unshift
    result = Number(`${result}e${Number(exponent) - precision}`)
    return result
}

const NINE = NumArray(0, 9)
const ARC = Math.PI * 2 / 9

const vertexPoint = (i: number, radius: number): [number, number] =>
    [Math.cos(i * ARC) * radius, Math.sin(i * ARC) * radius]

const vertex = (i: number, radius: number, precision: number = 3) => {
    const v = vertexPoint(i, radius)
    return `${roundTo(v[0], precision)},${roundTo(v[1], precision)}`
}

export const NineStar = (props: NineStarProps) => {
    return (
        <svg height={props.height} width={props.width} viewBox="-1 -1 2 2" ref={props.forwardRef}>
            {props.rings.map((ring, i) =>
                <path key={i} fill={ring.fill} stroke={ring.stroke} strokeWidth={ring.strokeWidth} d={`M${
                    NINE.map(j => `${vertex(j, ring.pointRadius)} ${vertex(j + 0.5, ring.valleyRadius)}`).join(' ')
                }Z`}/>
            )}
        </svg>
    )
}
