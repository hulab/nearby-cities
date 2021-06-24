const assert = require('assert')
const cities = require('all-the-cities')
const kdbush = require('kdbush')
const geokdbush = require('geokdbush')

const index = kdbush(cities, (p) => p.loc.coordinates[0], (p) => p.loc.coordinates[1])

module.exports = function ({longitude, latitude}, maxResults = 5, maxDistance) {
  const lon = +longitude;
  const lat = +latitude;

  assert(!isNaN(lon) && !isNaN(lat), 'function requires an object with `latitude` and `longitude` properties')

  return geokdbush.around(index, lon, lat, maxResults, maxDistance)
    .map((result) => Object.assign(result, {distance: geokdbush.distance(lon, lat, result.loc.coordinates[0], result.loc.coordinates[1])}));
}
