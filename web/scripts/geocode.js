// noinspection JSValidateTypes — since this is a build-time script, window doesn't otherwise exist
global['window'] = {}

const csv=require("csvtojson")
const geo=require("./mapbox-geocoding")

const config = require("../public/config.js")
const sw = window.config.region.sw
const ne = window.config.region.ne
const bbox = [sw.lng, sw.lat, ne.lng, ne.lat]

console.log(window.config.mapboxToken)
geo.setAccessToken(window.config.mapboxToken)
// geo.geocode('mapbox.places', '44406', bbox, (err, geoData) => {
//     if (err) console.log('Error', err)
//     if (geoData) console.log('Geolocation Data', geoData)
// })


const lookupZip = async (zip) => {
    return new Promise((resolve, reject) => {
        geo.geocode('mapbox.places', zip, bbox, (err, geoData) => {
            console.log('-----', err, geoData)
            if (Array.isArray(geoData.features) && geoData.features.length > 0)
                resolve(geoData.features[0])
            else {
                if (err) reject(err)
                else reject(`No results for ${zip}`)
            }
        })
    })
}

const limit = 3
const handleJson = async (json) => {
    const filtered = json.filter(json => json.zip)
    const zipSet = new Set()
    filtered.forEach((record, n) => {
        if (n < limit)
            zipSet.add(record.zip)
    })
    const geoMap = new Map()
    const zipArray = Array.from(zipSet.values())
    for (let i = 0; i < zipArray.length; ++i) {
        const zip = zipArray[i]
        const geoData = await lookupZip(zip)
        geoMap.set(zip, {
            zip,
            lng: geoData.center[0],
            lat: geoData.center[1],
            city: geoData.place_name,
        })
    }
    console.log(Array.from(geoMap.values()))
}

// TODO
// 1. extract city, state name — maybe remove '<zip>, United States')' from the end?
// 2. save results and don't re-geocode the same zip again?
// 3. save resulting CSV for use in the map

console.log('load devotions ...')
csv().fromFile("../data/spreadsheet/devotions.csv")
    .then(handleJson)
