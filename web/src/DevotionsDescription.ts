interface DevotionsDescriptionJson {
    zip: string
    lat: string
    lng: string
    description: string
    city: string
    place: string // "Ann Arbor, Michigan 48101,
}

export class DevotionsDescription {
    constructor(readonly json: DevotionsDescriptionJson) {}

    get zip(): string {return this.json.zip}
    get city(): string {return this.json.city}

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
    new DevotionsDescription({
        zip: '12345',
        lat: '30',
        lng: '30',
        description: 'Fake Devotions Description',
        city: 'City, State',
        place: 'City, State 12345, United States',
    })
