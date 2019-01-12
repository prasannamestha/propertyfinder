# RadiusAgent Assignment

Write the most efficient algorithm that helps us determine a list of matches with match percentages for each match between a huge set of properties (sale and rental) and buyer/renter search criteria as and when a new property or a new search criteria is added to our network by an agent.

## Installation

```bash
$ npm install
```

## Setup
1. Update mysql credentials and property table name in util/mysql.js

## Usage

```bash
$ npm start
```

## Algorithm
* ### Searching
    The searching algorithm retrieves only the properties that lie within a radius of 10 miles from the search co-ordinates.

    The algorithm calculates the bounding co-ordinates (latitudes and longitudes) for a given search co-ordinates. The bounding co-ordinates ensure that all the properties listed within are under the radius of 10 miles from the search co-ordinates.
```
  1. Input the search parameters.
       'latitude', 'longitude'

  2. Calculate the "angular radius" 'R' based on the maximum radius 'distance' (10 miles)
       R = 'distance' / radius of Earth

  3. Calculate the bounding latitude values (latMin & latMax)
       latMin = 'latitude' - 'R'
       latMax = 'latitude' + 'R'

  4. Calculate the bounding longitude values (lonMin & lonMax)
       deltaLon = arcSin(sin('R') / cos('latitude'))

       lonMin = 'longitude' - 'deltaLon'
       lonMax = 'longitude' + 'deltaLon'

  5. Populate the SQL Query
       SELECT * FROM properties WHERE
         (Latitude >= 'latMin' AND Latitude <= 'latMax') AND (Longitude >= 'lonMin' AND Longitude <= 'lonMax')
       HAVING
         acos(sin('latitude') * sin(Latitude) + cos('latitude') + cos(Latitude) * cos(Longitude - 'longitude')) <= 'R'

```

* ### Property Filter
    This algorithm filters the properties based on the search preferences.
```
  1. Input the search parameters
     'latitude', 'longitude', 'budget', 'bedrooms', 'bathrooms'

  2. Initialize array 'filteredProperties' = []

  3. For Every Property, Do
     i. Filter radius distance 'D' from search location to Property by using 'Haversine Formula'.
        If 'D' > 10 break the loop.

    ii. Filter 'minimumPrice' and 'maximumPrice' from 'budget' [+-25%]
        'minimumPrice' = 'budget.min' - ('budget.min' * 25 / 100)
        'maximumPrice' = 'budget.max' - ('budget.max' * 25 / 100)
        If 'Property.Price' < 'minimumPrice' OR 'Property.Price' > 'maximumPrice' Then break the loop.

   iii. Filter 'minBedrooms' and 'maxBedrooms' [+-2 rooms].
        'minBedrooms' = 'bedrooms' - 2
        'maxBedrooms' = 'bedrooms' + 2
        If 'Property.bedrooms' < 'minBedrooms' OR 'Property.bedrooms' > 'maxBedrooms' Then break the loop.

    iv. Filter 'minBathrooms' and 'maxBathrooms' [+-2 rooms].
        'minBathrooms' = 'bathrooms' - 2
        'maxBathrooms' = 'bathrooms' + 2
        If 'Property.bathrooms' < 'minBathrooms' OR 'Property.bathrooms' > 'maxBathrooms' Then break the loop.

     v. Push the 'Property' to 'filteredProperties'
        'filteredProperties'.push('Property')

  4. Return 'filteredProperties'.

```

* ### Match Percentage calculator
    This algorithm is responsible for calculating the match percentage of the property.
```
  1. Initialize 'matchPercentage' = 0

  2. Calculate 'DistanceMatchPercentage' and add it to 'matchPercentage'.
     matchPercentage += 'DistanceMatchPercentage'

  3. Calculate 'PriceMatchPercentage' and add it to 'matchPercentage'
     matchPercentage += 'PriceMatchPercentage'

  4. Calculate 'BedroomMatchPercentage' and add it to 'matchPercentage'
     matchPercentage += 'BedroomMatchPercentage'

  5. Calculate 'BathroomsMatchPercentage' and add it to 'matchPercentage'
     matchPercentage += 'BathroomsMatchPercentage'
```

* ### Properties Sort [Optional]
    This algorithm sorts the properties in order to be presented to the user. This can be helpful for showing the best matched properties first and the least matched properties last to the end-user.


## Improvement Scope
1. Data segregation of properties based on landmark. This prevents querying of entire dataset.
2. Add Automated tests. This ensures that nothing breaks with the next release.
3. Improvement to the percentage calculation algorithm.
4. Store credentials in the Environment Variables.
5.

## Author
* Prasanna Mestha

## References
```
http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
https://en.wikipedia.org/wiki/Haversine_formula
```
