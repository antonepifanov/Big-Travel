import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
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

export const getFormattedDate = (date, format) => dayjs(date).format(format);

export const getRandomData = (array) => array[getRandomInteger(0, array.length - 1)];
