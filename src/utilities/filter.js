import {FILTER_TYPE} from '../constants';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

export const filter = {
  [FILTER_TYPE.EVERYTHING]: (points) => points,

  [FILTER_TYPE.FUTURE]: (points) => points
    .filter((mockPoint) => dayjs().isSameOrBefore(dayjs(mockPoint.dateFrom), 'day')),

  [FILTER_TYPE.PAST]: (points) => points
    .filter((mockPoint) => dayjs().isAfter(dayjs(mockPoint.dateTo), 'day')),
};
