
import {nanoid} from 'nanoid';
import {TYPES_OF_POINT, DESTINATIONS, PRICE} from './constants.js';
import {getRandomInteger, getRandomData} from '../utilities/common.js';
import {generateOffers} from './generate-offers.js';
import {generateInformation} from './generate-information.js';
import {getDates} from './get-dates.js';

export const generatePoint = () => {
  const type = getRandomData(TYPES_OF_POINT);
  const offers = generateOffers(type);
  const {dateFrom, dateTo} = getDates();

  return {
    id: nanoid(4),
    type,
    destination: getRandomData(DESTINATIONS),
    dateFrom,
    dateTo,
    offers,
    information: generateInformation(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    basePrice: getRandomInteger(PRICE.MIN, PRICE.MAX),
  };
};
