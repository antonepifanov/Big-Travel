const toSortingMap = {
  Day: (mockPoints) => mockPoints.slice(),

  Event: (mockPoints) => mockPoints.slice().splice(),

  Time: (mockPoints) => mockPoints.slice(),

  Price: (mockPoints) => mockPoints.slice(),

  Offers: (mockPoints) => mockPoints.slice().splice(),
};

export const generateSorting = (points) => (
  Object.entries(toSortingMap).map(([sortingName, arrayOfPoints]) => ({
    name: sortingName,
    pointsCount: arrayOfPoints(points).length,
  }))
);
