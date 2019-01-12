const mysql = require('mysql');
const exitWithError = require('./exitwitherror');

// GLOBAL Constants
const maxRadiusDistance = 10;
const radiusOfEarth = 3958.762079; // in Miles
const angularRadius = maxRadiusDistance/radiusOfEarth;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'radiusagent',
});

const connectToMysql = () => {
  connection.connect((error) => {
    if (!error) {
      console.log('Mysql connection successful');
    } else {
      exitWithError('Error connecting to mysql');
    }
  });
};

const setupPropertiesTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS properties (
    Id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Latitude varchar(255) NOT NULL,
    Longitude varchar(255) NOT NULL,
    Price FLOAT(20, 2) NOT NULL,
    Bedrooms TINYINT(3) NOT NULL,
    Bathrooms TINYINT(3) NOT NULL
  );`

  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Properties Table Ready");
  });
};

const fetchProperties = (
  lat,
  lon,
  minLat,
  maxLat,
  minLon,
  maxLon,
) => {
  return new Promise((resolve, reject) => {
    const fetchPropertiesWithinRadius = `
      SELECT * FROM properties WHERE
        (Latitude >= ${minLat} AND Latitude <= ${maxLat}) AND
        (Longitude >= ${minLon} AND Longitude <= ${maxLon})
      HAVING
        acos(
          sin(${lat}) * sin(Latitude) +
          cos(${lat}) * cos(Latitude) * cos(Longitude - ${lon})
        ) <= ${angularRadius}`;

    connection.query(fetchPropertiesWithinRadius, (error, results, fields) => {
      if (error) {
        reject(error);
      }
      resolve(results);
    });
  });
};

const setup = () => {
  connectToMysql();
  setupPropertiesTable();
};

module.exports = {
  setup,
  connection,
  maxRadiusDistance,
  fetchProperties,
};
