import {parse} from 'date-fns'

interface DevotionsDescriptionJson {
    zip: string
    lat: string
    lng: string
    description: string
    city: string
    state: string
    place: string
    timestamp: string
}

const JSON_PLACEHOLDER: DevotionsDescriptionJson = {
    zip: '12345',
    lat: '45',
    lng: '-85',
    description: 'Fake Devotions Description',
    city: 'City',
    state: 'State',
    place: 'City, State 12345, United States',
    timestamp: '6/14/2020 22:42:10',
}

export class DevotionsDescription {
    constructor(readonly json: DevotionsDescriptionJson) {}

    get zip(): string {return this.json.zip}
    get city(): string {return this.json.city}
    get state(): string {return this.json.state}

    get description(): string {
        return this.json.description
    }

    private _lat?: number
    get lat(): number {
        if (this._lat === undefined)
            this._lat = Number.parseFloat(this.json.lat)
        return this._lat
    }

    private _lng?: number
    get lng(): number {
        if (this._lng === undefined)
            this._lng = Number.parseFloat(this.json.lng)
        return this._lng
    }

    private _timestamp?: Date
    get timestamp(): Date {
        if (this._timestamp === undefined)
            this._timestamp = parse(this.json.timestamp, 'M/d/yyyy H:mm:ss', new Date())
        return this._timestamp
    }

    get isBlank(): boolean {
        return this.json.zip.length === 0
            && this.json.lat.length === 0
            && this.json.lng.length === 0
            && this.json.description.length === 0
    }

    get isValid(): boolean {
        try {
            Number.parseFloat(this.json.lat)
            Number.parseFloat(this.json.lng)
            const zip = Number.parseInt(this.json.zip)
            if (zip < 0 || zip >= 100_000) {
                console.log(`zip out of range: "${this.json.zip}"`)
                return false
            }
            return true
        } catch (e) {
            console.log(e.message)
            return false
        }
    }
}

export const DEVOTIONS_DESCRIPTION_PLACEHOLDER: DevotionsDescription =
    new DevotionsDescription(JSON_PLACEHOLDER)
