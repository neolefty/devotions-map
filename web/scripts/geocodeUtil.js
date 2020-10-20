const csv=require("csvtojson")

const loadCsv = async(filename, defaultResult) => {
    return new Promise((resolve, reject) => {
        const handleReject = err => {
            if (defaultResult !== undefined)
                resolve(defaultResult)
            else
                reject(err)
        }
        try {
            csv().fromFile(filename).then(json => resolve(json), handleReject)
        }
        catch(err) {handleReject(err)}
    })
}

module.exports = {
    loadCsv
}
