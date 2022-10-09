import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

const toFilterMap = {
  Everything: (mockPoints) => mockPoints,

  Future: (mockPoints) => mockPoints
    .filter((mockPoint) => dayjs().isSameOrBefore(dayjs(mockPoint.dateFrom), 'day')),

  Past: (mockPoints) => mockPoints
    .filter((mockPoint) => dayjs().isAfter(dayjs(mockPoint.dateTo), 'day')),
};

export const generateFilters = (mockPoints) => (
  Object.entries(toFilterMap).map(([filterName, arrayOfPoints]) => ({
    name: filterName,
    filteredPoints: arrayOfPoints(mockPoints),
  }))
);
