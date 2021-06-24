const assert = require('assert')
const cities = require('all-the-cities')
const kdbush = require('kdbush')
const geokdbush = require('geokdbush')

const index = kdbush(cities, (p) => p.loc.coordinates[0], (p) => p.loc.coordinates[1])

module.exports = function (input, maxResults, maxDistance) {
  const lon = input.coords ? +input.coords.longitude : +input.longitude
  const lat = input.coords ? +input.coords.latitude : +input.latitude

  assert(!isNaN(lon) && !isNaN(lat), 'function requires an object with `latitude` and `longitude` properties')

  return geokdbush.around(index, lon, lat, maxResults, maxDistance)
}
