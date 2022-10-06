import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const getDuration = (dateFrom, dateTo) => {
  const tripDuration = dayjs.duration(dayjs(dateTo).diff(dayjs(dateFrom)));

  const wholeDays = dayjs(dateTo).diff(dayjs(dateFrom), 'day');
  const wholeHours = dayjs(dateTo).diff(dayjs(dateFrom), 'hour');

  // eslint-disable-next-line no-nested-ternary
  wholeDays > 0
    ? tripDuration.format('DD[D] HH[H] mm[M]')
    : wholeHours > 0
      ? tripDuration.format('HH[H] mm[M]')
      : tripDuration.format('mm[M]');
};
