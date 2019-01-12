// Calculate matchPercentage for distance
const distance = (radius) => {
  if (radius <= 2) return 30;
  else return (30 - (3 * (radius - 2))); // Greater distance, lesser percentage
};


// Calculate matchPercentage for budget
const budget = (price, budget) => {
  budget.min = budget.min || 0;
  budget.max = budget.max || 999999999999999999999999999999999999999999999999;

  if (price >= budget.min && price <= budget.max) return 30;

  const minPrice = budget.min - (budget.min * 0.1);
  const maxPrice = budget.max + (budget.max * 0.1);

  if (budget.min === budget.max) {
    if (price >= minPrice && price <= maxPrice) return 30;
  }

  // Decrease the percentage based on price
  let minPercentDiff = 0;
  let maxPercentDiff = 0;
  if (price < budget.min) {
    minPercentDiff = 100 - (price / budget.min * 100);
  }
  if (price > budget.max) {
    maxPercentDiff = 100 - (budget.max / price * 100);
  }

  return 30 - minPercentDiff - maxPercentDiff;
};


// Calculate matchPercentage for Number fo Rooms
const room = (rooms, expectedRooms) => {
  expectedRooms.min = expectedRooms.min || 0;
  expectedRooms.max = expectedRooms.max || 100000;

  if (rooms >= expectedRooms.min && rooms <= expectedRooms.max) return 20;
  if (rooms >= expectedRooms.min - 1 || rooms <= expectedRooms.max + 1) return 10;
  return 0;
};


// Export modules
module.exports = {
  distance,
  budget,
  room,
};
