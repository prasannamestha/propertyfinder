const GeoPoint = require('geopoint');
const percentageCalculator = require('./calculate-percentage');

const calculateDistance = (property, search) => {
  const searchLocation = new GeoPoint(search.lat, search.lon);
  const propertyLocation = new GeoPoint(property.lat, property.lon);
  return searchLocation.distanceTo(propertyLocation);
};

const filter = (properties, searchParams) => {
  const filteredProperties = [];
  const budget = searchParams.budget;
  const expectedBedrooms = searchParams.bedrooms; // Array of min and max rooms
  const expectedBathrooms = searchParams.bathrooms;

  // Filter individual property
  properties.forEach(property => {
    const lat = parseFloat(property.Latitude);
    const lon = parseFloat(property.Longitude);
    const price = parseFloat(property.Price);
    const bedrooms = property.Bedrooms;
    const bathrooms = property.Bathrooms;

    const distance = calculateDistance({lat, lon}, {lat: searchParams.lat, lon: searchParams.lon});
    if (distance >10) return;

    // Price Validation
    const minPrice = budget.min - (budget.min * 25 / 100);
    const maxPrice = budget.max + (budget.max * 25 / 100);
    if (price < minPrice || price > maxPrice) return;

    budget.minPrice = minPrice;
    budget.maxPrice = maxPrice;

    // Bedroom Validation
    const minBedrooms = expectedBedrooms.min - 2;
    const maxBedrooms = expectedBedrooms.max + 2;
    if (bedrooms < minBedrooms || bedrooms > maxBedrooms) return;

    // Bathroom validation
    const minBathrooms = expectedBathrooms.min - 2;
    const maxBathrooms = expectedBathrooms.max + 2;
    if (bathrooms < minBathrooms || bathrooms > maxBathrooms) return;

    // Calculate and add match Percentage HERE
    let matchPercentage = 0;
    matchPercentage += percentageCalculator.distance(distance);
    matchPercentage += percentageCalculator.budget(price, budget);
    matchPercentage += percentageCalculator.room(bedrooms, expectedBedrooms);
    matchPercentage += percentageCalculator.room(bathrooms, expectedBathrooms);

    if (matchPercentage < 40) return;

    property.matchPercentage = matchPercentage;
    filteredProperties.push(property);
  });

  return filteredProperties;
};

module.exports = {
  filter,
};
