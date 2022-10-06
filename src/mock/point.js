
import {TYPES_OF_POINT, DESTINATIONS, PRICE} from './constants.js';
import {getRandomInteger} from '../util/get-random-integer.js';
import {generateIdOfPoint} from './generate-id.js';
import {generateOffers} from './generate-offers.js';
import {generateInformation} from './generate-information.js';
import {getDates} from './get-dates.js';

const generateTypeOfPoint = () => TYPES_OF_POINT[getRandomInteger(0, TYPES_OF_POINT.length - 1)];

const generateDestination = () => DESTINATIONS[getRandomInteger(0, DESTINATIONS.length - 1)];

export const generatePoint = () => {
  const getId = generateIdOfPoint();
  const type = generateTypeOfPoint();
  const {dateFrom, dateTo} = getDates();

  return {
    id: getId(),
    type,
    destination: generateDestination(),
    dateFrom,
    dateTo,
    offer: generateOffers(type),
    information: generateInformation(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    basePrice: getRandomInteger(PRICE.MIN, PRICE.MAX),
  };
};
