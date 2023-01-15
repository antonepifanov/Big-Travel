import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getDuration = (dateFrom, dateTo) => {
  const tripDuration = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));

  const wholeDays = dayjs(dateTo).diff(dayjs(dateFrom), 'day');
  const wholeHours = dayjs(dateTo).diff(dayjs(dateFrom), 'hour');

  if (wholeDays > 0) {
    return tripDuration.format('DD[D] HH[H] mm[M]');
  } else if (wholeHours > 0) {
    return tripDuration.format('HH[H] mm[M]');
  } else {
    return tripDuration.format('mm[M]');
  }
};

export const getFormattedDate = (date, format) => dayjs(date).format(format);

export const sortByDay = (pointA, PointB) => dayjs(pointA.dateFrom) - dayjs(PointB.dateFrom);

export const sortByTime = (pointA, PointB) => dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom)) - dayjs(PointB.dateTo).diff(dayjs(PointB.dateFrom));

export const sortByPrice = (pointA, PointB) => pointA.basePrice - PointB.basePrice;
