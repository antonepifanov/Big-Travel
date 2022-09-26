import dayjs from 'dayjs';
import {getRandomInteger} from '../util/get-random-integer';
import {DATE_GAPS} from './constants';

export const getDates = () => {
  const dateFrom = dayjs()
    .add(getRandomInteger(-DATE_GAPS.DAY_GAP, DATE_GAPS.DAY_GAP), 'day')
    .add(getRandomInteger(-DATE_GAPS.HOUR_GAP, DATE_GAPS.HOUR_GAP), 'hour')
    .add(getRandomInteger(-DATE_GAPS.MINUTE_GAP, DATE_GAPS.MINUTE_GAP), 'minute')
    .toDate();

  const dateTo = dayjs(dateFrom)
    .add(getRandomInteger(0, DATE_GAPS.DAY_GAP), 'day')
    .add(getRandomInteger(0, DATE_GAPS.HOUR_GAP), 'hour')
    .add(getRandomInteger(DATE_GAPS.MIN_MINUTE_GAP, DATE_GAPS.MINUTE_GAP), 'minute')
    .toDate();

  return {
    dateFrom,
    dateTo,
  };
};
