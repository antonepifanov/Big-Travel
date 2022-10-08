import dayjs from 'dayjs';

const toSortingMap = {
  Day: (mockPoints) => mockPoints
    .slice()
    .sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom))
    .reverse(),

  Event: (mockPoints) => mockPoints
    .slice()
    .splice(),

  Time: (mockPoints) => mockPoints
    .slice()
    .sort((a, b) => dayjs(a.dateTo).diff(dayjs(a.dateFrom)) - dayjs(b.dateTo).diff(dayjs(b.dateFrom)))
    .reverse(),

  Price: (mockPoints) => mockPoints
    .slice()
    .sort((a, b) => a.basePrice - b.basePrice)
    .reverse(),

  Offers: (mockPoints) => mockPoints
    .slice()
    .splice(),
};

export const generateSorting = (mockPoints) => (
  Object.entries(toSortingMap).map(([sortingName, arrayOfPoints]) => ({
    name: sortingName,
    sortingPoints: arrayOfPoints(mockPoints),
  }))
);
