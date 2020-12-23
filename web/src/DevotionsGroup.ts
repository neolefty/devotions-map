import {Coord, distance, point} from "@turf/turf"
import {AtLeastOne} from "./AtLeastOne"
import {DevotionsDescription} from "./DevotionsDescription"

const distinct = <T>(a: ReadonlyArray<T>): ReadonlyArray<T> =>
    Array.from(a.reduce(
        (set, x) => {set.add(x); return set},
        new Set<T>()
    )).sort()

const DEG_TO_RAD = Math.PI / 180

export class DevotionsGroup {
    constructor(readonly devotions: AtLeastOne<DevotionsDescription>) {}

    add(that: DevotionsGroup): DevotionsGroup {
        return new DevotionsGroup([...this.devotions, ...that.devotions])
    }

    get localityDescription() {
        const cities = this.cities
        const states = this.states
        if (states.length > 1)
            return `${cities.length} cities in ${states.length} states`
        else if (cities.length === 2)
            return `${cities[0]} & ${cities[1]}`
        else if (cities.length > 2)
            return `${cities.length} cities in ${this.first.state}`
        else
            return `${this.first.city}, ${this.first.state}`
    }

    zipDescription(max: number = 3) {
        const zips = this.zips
        return zips.length === 1 ? `Zip: ${zips[0]}`
            : zips.length <= max ? `Zips: ${zips.join(', ')}`
            : `${zips.length} Zip Codes`
    }

    // TODO replace all uses of first with aggregations
    get first(): DevotionsDescription {return this.devotions[0]}
    get lat(): number {return avg(this.devotions.map(d => d.lat))}
    get lng(): number {return avg(this.devotions.map(d => d.lng))}
    get latRad(): number {return this.lat * DEG_TO_RAD}
    get lngRad(): number {return this.lng * DEG_TO_RAD}
    get size(): number {return this.devotions.length}

    private _point?: Coord
    get point() {
        if (!this._point)
            this._point = point([this.lng, this.lat])
        return this._point
    }

    // approximate minimum of lat & lng distance, in meters — much cheaper than distance(), and guaranteed to be less than distance().
    minApproxDist(that: DevotionsGroup): number {
        const latDist = Math.abs(110000 * (this.lat - that.lat))
        const lngDist = Math.abs(110000 * Math.cos(this.latRad) * (this.lng - that.lng))
        return Math.min(latDist, lngDist)
    }

    // meters
    distance(that: DevotionsGroup): number {
        return distance(this.point, that.point, {units: 'meters'})
    }

    get cities(): ReadonlyArray<string> {return this.distinct(d => d.city)}
    get states(): ReadonlyArray<string> {return this.distinct(d => d.state)}
    get zips(): ReadonlyArray<string> {return this.distinct(d => d.zip)}

    distinct<T>(f: ((d: DevotionsDescription) => T)): ReadonlyArray<T> {return distinct(this.devotions.map(f))}
}

const avg = (a: ReadonlyArray<number>) =>
    a.reduce((sum, x) => sum + x, 0) / a.length
