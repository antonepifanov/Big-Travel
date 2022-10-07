
import {TYPES_OF_POINT, DESTINATIONS, PRICE} from './constants.js';
import {getRandomInteger, getRandomData} from '../utilities.js';
import {getId} from './generate-id.js';
import {generateOffers} from './generate-offers.js';
import {generateInformation} from './generate-information.js';
import {getDates} from './get-dates.js';

export const generatePoint = () => {
  const type = getRandomData(TYPES_OF_POINT);
  const {dateFrom, dateTo} = getDates();

  return {
    id: getId(),
    type,
    destination: getRandomData(DESTINATIONS),
    dateFrom,
    dateTo,
    offer: generateOffers(type),
    information: generateInformation(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    basePrice: getRandomInteger(PRICE.MIN, PRICE.MAX),
  };
};
