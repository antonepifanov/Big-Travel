import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const toSortingMap = {
  Day: (mockPoints) => mockPoints.sort((a, b) => (
    dayjs(a.dateFrom) - dayjs(b.dateFrom)
  )),
  Event: (mockPoints) => mockPoints.slice(0).splice(),
  Time: (mockPoints) => mockPoints.sort((a, b) => (
    dayjs.duration(dayjs(a.dateTo).diff(dayjs(a.dateFrom))) - dayjs.duration(dayjs(b.dateTo).diff(dayjs(b.dateFrom)))
  )),
  Price: (mockPoints) => mockPoints.sort((a, b) => (
    a.basePrice - b.basePrice
  )).reverse(),
  Offers: (mockPoints) => mockPoints.slice(0).splice(),
};

export const generateSorting = (mockPoints) => (
  Object.entries(toSortingMap).map(([sortingName, arrayOfPoints]) => ({
    name: sortingName,
    sortingPoints: arrayOfPoints(mockPoints),
  }))
);
