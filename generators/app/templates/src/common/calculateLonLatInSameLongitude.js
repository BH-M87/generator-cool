const {
  sqrt, PI, tan, asin,
} = Math;

// (mean) radius of Earth (meters)
const R = 6378137;

function squared(x) {
  return x * x;
}

function toAngle(radian) {
  return radian * 180 / PI; /* eslint no-mixed-operators:0 */
}

// fomular refers to https://en.wikipedia.org/wiki/Haversine_formula
module.exports = function calculateLonLatInSameLongitude(longitude, latitude, distance) {
  const x = tan(distance / R / 2);
  const y = squared(x) / (1 + squared(x));
  const z = asin(sqrt(y)) * 2;
  const latitudeDiff = toAngle(z);
  const newLatitude = latitude + latitudeDiff;
  return {
    longitude,
    latitude: newLatitude,
  };
};
