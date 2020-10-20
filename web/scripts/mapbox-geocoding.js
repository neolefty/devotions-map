// copied from https://github.com/dinostheo/mapbox-geocoding/blob/master/index.js
// with country & bounding box support added
/**
 * @module mapbox-geocoding
 */
var request = require('request');

var BASE_URL = 'https://api.tiles.mapbox.com/v4/geocode/';
var ACCESS_TOKEN = null;

/**
 * Constracts the geocode/reverse geocode url for the query to mapbox.
 *
 * @param  {string}   dataset - The mapbox dataset ('mapbox.places' or 'mapbox.places-permanent')
 * @param  {string}   query - The address to geocode
 * @param  {number[]}   bbox - The address to geocode
 * @param  {Function} done    - Callback function with an error and the returned data as parameter
 */
var __geocodeQuery = function (dataset, query, done, bbox) {
    if (!ACCESS_TOKEN) {
        return done('You have to set your mapbox public access token first.');
    }

    if (!dataset) {
        return done('A mapbox dataset is required.');
    }

    if (!query) {
        return done('You have to specify the location to geocode.');
    }

    var url = BASE_URL + dataset + '/' + query + '.json?access_token=' + ACCESS_TOKEN + (
        bbox ? `&bbox=${bbox.join(',')}` : ''
    );

    request(url , function (err, response, body) {
        if (err || response.statusCode !== 200) {
            return done(err || JSON.parse(body));
        }

        done(null, JSON.parse(body));
    });
};

module.exports = {
    /**
     * Sets the mapbox access token with the given one.
     *
     * @param {string} accessToken - The mapbox public access token
     */
    setAccessToken: function (accessToken) {
        ACCESS_TOKEN = accessToken;
    },

    /**
     * Geocodes the given address.
     *
     * @param  {string}   dataset - The mapbox dataset ('mapbox.places' or 'mapbox.places-permanent')
     * @param  {string}   address - The address to geocode
     * @param  {number[]}   bbox - The address to geocode
     * @param  {Function} done    - Callback function with an error and the returned data as parameter
     */
    geocode: function (dataset, address, bbox, done) {
        __geocodeQuery(dataset, address, done, bbox);
    },

    /**
     * Reverse geocodes the given longitude and latitude.
     *
     * @param  {string}   dataset - The mapbox dataset ('mapbox.places' or 'mapbox.places-permanent')
     * @param  {number}   lng - The longitude to reverse geocode
     * @param  {number}   lat - The latitude to reverse geocode
     * @param  {Function} done    - Callback function with an error and the returned data as parameter
     */
    reverseGeocode: function (dataset, lng, lat, done) {
        var query = lng + ',' + lat;

        __geocodeQuery(dataset, query, done);
    }
};
