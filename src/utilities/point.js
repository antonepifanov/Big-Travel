import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const DAYS_COUNT = 10;

const TimeFormat = {
  HOUR_PER_DAY: 1440,
  MINUTE_PER_HOUR: 60,
  MILLISECOND_PER_MINUTE: 60000,
};

export const compareTwoDates = (dateA, dateB) => {
  if (dateA === null || dateB === null) {
    return null;
  }
  return dayjs(dateA).diff(dateB);
};

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

export const humanizeDateDuration = (tripTime) => {
  const durationDate = dayjs.duration(tripTime).$d;

  const day = durationDate.days < DAYS_COUNT ? `0${durationDate.days}D` : `${durationDate.days}D`;
  const hour = durationDate.hours < DAYS_COUNT ? `0${durationDate.hours}H` : `${durationDate.hours}H`;
  const minute = durationDate.minutes < DAYS_COUNT ? `0${durationDate.minutes}M` : `${durationDate.minutes}M`;
  // eslint-disable-next-line no-nested-ternary
  const total = ((tripTime / TimeFormat.MILLISECOND_PER_MINUTE) > (TimeFormat.HOUR_PER_DAY))
    ? `${day} ${hour} ${minute}` : (tripTime / TimeFormat.MILLISECOND_PER_MINUTE) > TimeFormat.MINUTE_PER_HOUR
      ? `${hour} ${minute}`
      : minute;
  return total;
};

export const getFormattedDate = (date, format) => dayjs(date).format(format);

export const sortByDay = (pointA, PointB) => dayjs(pointA.dateFrom) - dayjs(PointB.dateFrom);

export const sortByTime = (pointA, PointB) => dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom)) - dayjs(PointB.dateTo).diff(dayjs(PointB.dateFrom));

export const sortByPrice = (pointA, PointB) => pointA.basePrice - PointB.basePrice;

export const isDatesFromEqual = (dateA, dateB) => (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');

export const isPriceChange = (priceA, priceB) => priceA !== priceB;

export const isDurationChange = (dateFromA, dateToA, dateFromB, dateToB) => {
  const tripDurationA = dayjs.duration(dayjs(dateToA).diff(dayjs(dateFromA)));
  const tripDurationB = dayjs.duration(dayjs(dateToB).diff(dayjs(dateFromB)));
  return tripDurationA !== tripDurationB;
};
