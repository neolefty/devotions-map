// noinspection JSValidateTypes — since this is a build-time script, window doesn't otherwise exist
global['window'] = {}

const IMPORT_FILE = "../data/spreadsheet/import.csv"
const SAVED_ZIPS = "../data/spreadsheet/zips.csv"
const EXPORT_FILE = "../data/spreadsheet/devotions.csv"

const csv=require("csvtojson")
const geo=require("./mapbox-geocoding")

const config = require("../public/config.js")
const {loadCsv} = require("./geocodeUtil")
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
            // console.log('-----', err, geoData)
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
const lookupZips = async (json) => {
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
            place: geoData.place_name,
        })
    }
    console.log(Array.from(geoMap.values()))
}

// zips: Map<zip, {zip, lat, lng, place}>
// importData: [{zip, lat?, lng?, description}]
const fillInZips = async (zips, importData) => {
    let n = 0
    for (let i = 0; i < importData.length; ++i) {
        const record = importData[i]
        if (record.zip && record.zip.trim() && !zips.has(record.zip)) {
            ++n
            const geoData = await lookupZip(record.zip)
            zips.set(record.zip, {
                zip: record.zip,
                lng: geoData.center[0],
                lat: geoData.center[1],
                place: geoData.place_name,
            })
            // console.log('>>>', record, '<<<', zips.get(record.zip))
        }
    }
    return n
}

fs = require('fs')
let converter = require('json-2-csv')
// zips: Map<zip, {zip, lat, lng, place}>
const saveZips = async (zips) => {
    const zipArray = Array.from(zips.values())
    const csvString = await converter.json2csvAsync(zipArray)
    // console.log('save', '---', zipArray, '---', csvString)
    fs.writeFile(SAVED_ZIPS, csvString, console.error)
}

const saveExports = async (exportData) => {
    const csvString = await converter.json2csvAsync(exportData)
    fs.writeFile(EXPORT_FILE, csvString, console.error)
}

const cityStateFromPlace = (place, zip) => {
    const end = place.lastIndexOf(` ${zip}, United States`)
    return (end > 0)
        ? place.substring(0, end)
        : place
}

// zips: Map<zip, {zip, lat, lng, place}>
// importData: [{zip, lat?, lng?, description}]
const prepareExport = async (zips, importData) => {
    const result = []
    importData.forEach(importRecord => {
        if (importRecord.zip && importRecord.zip.trim()) {
            const zip = importRecord.zip.trim()
            // {zip, lat, lng, place}
            // place is like "East Lansing, Michigan 48823, United States"
            const zipLocation = zips.get(zip)
            result.push({
                ...importRecord,
                ...zipLocation,
                city: cityStateFromPlace(zipLocation.place, zip),
            })
        }
    })
    return result
}

const main = async () => {
    console.log('→ Geocoding devotions data ...')
    // 1. load zips that we've already looked up, imported data, and exported data
    const zips = new Map()
    const zipArray = await loadCsv(SAVED_ZIPS, [])
    zipArray.forEach(entry => {
        zips.set(entry.zip, entry)
    })
    // console.log(Array.from(zips.entries()))
    const importData = await loadCsv(IMPORT_FILE)
    console.log(`  Loaded ${zipArray.length} pre-located zip codes and ${importData.length} devotional gathering records.`)

    // 2. geolocate any zips we haven't done yet
    const newZips = await fillInZips(zips, importData)
    console.log(`  Retrieved ${newZips} new zip code locations.`)
    if (newZips > 0)
        await saveZips(zips)

    // 3. export records
    const exportData = await prepareExport(zips, importData)
    await saveExports(exportData)
    console.log(`→ Saved ${exportData.length} records to "${EXPORT_FILE}".`)
}

main().then(() => undefined).catch(console.error)

