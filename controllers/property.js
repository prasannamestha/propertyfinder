const GeoPoint = require('geopoint');
const filterProperties = require('../util/filter-matches');
const mysql = require('../util/mysql');
const connection = mysql.connection;

// Search properties based on user request
exports.search = (req, res) => {
  // Request parameters
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  const minBudget = parseFloat(req.query.minBudget);
  const maxBudget = parseFloat(req.query.maxBudget);
  const minBedrooms = parseInt(req.query.minBedrooms);
  const maxBedrooms = parseInt(req.query.maxBedrooms);
  const minBathrooms = parseInt(req.query.minBathrooms);
  const maxBathrooms = parseInt(req.query.maxBathrooms);

  const budget = {
    min: Math.min(minBudget, maxBudget),
    max: Math.max(minBudget, maxBudget),
  };
  const bedrooms = {
    min: Math.min(minBedrooms, maxBedrooms),
    max: Math.max(minBedrooms, maxBedrooms),
  };
  const bathrooms = {
    min: Math.min(minBathrooms, maxBathrooms),
    max: Math.max(minBathrooms, maxBathrooms),
  };

  // Calculate Bounding Co-ordinates
  const maxRadiusDistance = mysql.maxRadiusDistance; // 10 miles
  const searchLocation = new GeoPoint(lat, lon);
  const searchBoundary = searchLocation.boundingCoordinates(maxRadiusDistance);

  // Bounding Co-ordinates
  const minLat = searchBoundary[0].latitude();
  const minLon = searchBoundary[0].longitude();
  const maxLat = searchBoundary[1].latitude();
  const maxLon = searchBoundary[1].longitude();

  // Property search parameters - required for mysql query
  const searchParams = {
    lat,
    lon,
    budget,
    bedrooms,
    bathrooms,
  };

  // Fetch data from mysql db
  mysql.fetchProperties(lat, lon, minLat, maxLat, minLon, maxLon)
      .then((properties) => {
        // Filter the properties based on search criteria
        const validProperties = filterProperties.filter(properties, searchParams);
        res.status(200).json({properties: validProperties});
      })
      .catch((error) => {
        // TODO: Logn & Handle errors
        res.status(400).json(error);
      });
};


// Insert a property
exports.create = (req, res) => {
  const {
    lat,
    lon,
    price,
    bedrooms,
    bathrooms,
  } = req.body;

  mysql.addProperty(lat, lon, price, bedrooms, bathrooms)
      .then(() => {
        console.log('here');
        res.status(200).json({message: 'Property added successfully'});
      })
      .catch((error) => {
        // TODO: Handle errors
        res.status(400).json(error);
      });
};
