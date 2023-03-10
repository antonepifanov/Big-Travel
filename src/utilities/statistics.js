import {compareTwoDates} from './../utilities/point.js';

const FIRST_INDEX = 1;

const CHART_MODE = {
  MONEY: 'money',
  TYPE: 'type',
  TIME: 'time',
};

export const getUniqueTypes = (points) => new Set(points.map((point) => point.type));

const sortByDecreasing = (elementA, elementB) => elementB[FIRST_INDEX] - elementA[FIRST_INDEX];

export const getSortedData = (points, uniqueTypes, chartMode) => {
  const data = {};

  uniqueTypes.forEach((type) => data[type] = 0);
  switch (chartMode) {
    case CHART_MODE.MONEY:
      points.forEach((point) => data[point.type] += point.basePrice);
      break;
    case CHART_MODE.TYPE:
      points.forEach((point) => data[point.type]++);
      break;
    case CHART_MODE.TIME:
      points.forEach((point) => data[point.type] += compareTwoDates(point.dateTo, point.dateFrom));
      break;
  }
  const sortedData = Object.entries(data).slice().sort(sortByDecreasing);

  const transferToObject = (previousObject, [type, value]) => (
    Object.assign(
      previousObject,
      previousObject.types.push(type.toUpperCase()),
      previousObject.values.push(value),
    )
  );
  return sortedData.reduce(transferToObject, {types: [], values: []});
};
