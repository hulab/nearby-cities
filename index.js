const assert = require('assert')
const cities = require('all-the-cities')
const kdbush = require('kdbush')
const geokdbush = require('geokdbush')

const allCities = kdbush(cities, (p) => p.loc.coordinates[0], (p) => p.loc.coordinates[1]);
const bigCities = kdbush(cities.filter((city) => city.population > 300000), (p) => p.loc.coordinates[0], (p) => p.loc.coordinates[1]);

const fixedArea = {
  2988507: [[2.261981964111328,48.85974578950385],[2.2580337524414062,48.85714817582527],[2.2540855407714844,48.85455042734359],[2.2518539428710938,48.85206549830757],[2.252540588378906,48.849354525964365],[2.2539138793945312,48.847660093710566],[2.2544288635253906,48.84460997116046],[2.2537422180175777,48.841672640526525],[2.2537422180175777,48.83850916871952],[2.256488800048828,48.83636241334644],[2.26043701171875,48.835232505144106],[2.2667884826660156,48.8350065204454],[2.2707366943359375,48.83534549711116],[2.2745132446289062,48.83489352771377],[2.2860145568847656,48.830147602851454],[2.293567657470703,48.827322434132746],[2.303695678710937,48.825175199374314],[2.321720123291015,48.820993478172554],[2.3328781127929688,48.81861991362668],[2.335796356201172,48.816924441564105],[2.3468685150146484,48.81658534027002],[2.350301742553711,48.817800442623465],[2.3524045944213867,48.818026504927936],[2.3543357849121094,48.817461347255175],[2.356395721435547,48.81638753012247],[2.3629188537597656,48.816048425196385],[2.365536689758301,48.81712224959302],[2.3784971237182613,48.821417317156744],[2.3842906951904297,48.82483615389669],[2.38802433013916,48.826277081335206],[2.3923158645629883,48.8274919487478],[2.398366928100586,48.82865028326984],[2.4005126953125,48.82941307430805],[2.4026155471801753,48.83076911859322],[2.405362129211426,48.83226637485846],[2.4078941345214844,48.83356584402702],[2.4109840393066406,48.835232505144106],[2.412357330322265,48.83658839192869],[2.412872314453125,48.83862215329593],[2.4137306213378906,48.842689428318415],[2.41424560546875,48.84562669931916],[2.415447235107422,48.851048900880166],[2.4139022827148438,48.8539856815748],[2.4137306213378906,48.85522811385678],[2.4137306213378906,48.85872934803138],[2.4133872985839844,48.863924276481605],[2.4132156372070312,48.86815887355065],[2.4129581451416016,48.87165920324638],[2.4111557006835938,48.87391735051675],[2.408580780029297,48.87724793170059],[2.4076366424560547,48.879167148960214],[2.4056625366210938,48.88063473600221],[2.402057647705078,48.881989393513585],[2.4005126953125,48.883118246745475],[2.3981094360351562,48.8848114788193],[2.396564483642578,48.88616602320194],[2.393817901611328,48.898016721521145],[2.392616271972656,48.899596602397885],[2.3888397216796875,48.90061221373512],[2.379226684570312,48.90049936905009],[2.3752784729003906,48.90061221373512],[2.3630905151367188,48.900950746261614],[2.358112335205078,48.90117643333875],[2.349014282226562,48.90128927649513],[2.3349380493164062,48.90106358992757],[2.324810028076172,48.900950746261614],[2.3172569274902344,48.899258060699516],[2.3083305358886714,48.89632393659644],[2.3026657104492188,48.89293819477081],[2.297687530517578,48.889890831072385],[2.2932243347167964,48.88910074349772],[2.2861862182617188,48.88526299769019],[2.2818946838378906,48.88221516619833],[2.280864715576172,48.87815110193676],[2.2776031494140625,48.87634474515705],[2.273483276367187,48.87239311228893],[2.268505096435547,48.866521538507754],[2.261981964111328,48.85974578950385]]
};

module.exports = function ({longitude, latitude}, maxResults = 5, maxDistance, onlyBigCities = false) {
  const lon = +longitude;
  const lat = +latitude;

  assert(!isNaN(lon) && !isNaN(lat), 'function requires an object with `latitude` and `longitude` properties')

  const fixedAreas = findFixedArea([lon, lat]);
  if (fixedAreas.length > 0) {
    return fixedAreas.map((result) => Object.assign(result, {distance: geokdbush.distance(lon, lat, result.loc.coordinates[0], result.loc.coordinates[1])}))
  }

  return geokdbush.around(onlyBigCities ? bigCities : allCities, lon, lat, maxResults, maxDistance)
    .map((result) => Object.assign(result, {distance: geokdbush.distance(lon, lat, result.loc.coordinates[0], result.loc.coordinates[1])}));
}

function findFixedArea(point) {
  const area = Object.entries(fixedArea).filter(([_, polygon]) => pointInPolygon(point, polygon)).map(([cityId]) => cities.find((city) => city.cityId == cityId));
  return area;
}

function pointInPolygon(point, polygon) {
  var x = point[0], y = point[1];
  var inside = false;
  var start = 0;
  var end = polygon.length;
  var len = end - start;
  for (var i = 0, j = len - 1; i < len; j = i++) {
      var xi = polygon[i+start][0], yi = polygon[i+start][1];
      var xj = polygon[j+start][0], yj = polygon[j+start][1];
      var intersect = ((yi > y) !== (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside;
}

// module.exports({longitude:2.385378830106562, latitude:48.87929429229127}, maxResults = 5, 50);
