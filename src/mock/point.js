
import {TYPES_OF_POINT, DESTINATIONS, PRICE} from './constants';
import {getRandomInteger} from '../util/get-random-integer';
import {generateOffers} from './generate-offers';
import {generateInformation} from './generate-information';
import {getDates} from './get-dates';

const generateTypeOfPoint = () => TYPES_OF_POINT[getRandomInteger(0, TYPES_OF_POINT.length - 1)];

const generateDestination = () => DESTINATIONS[getRandomInteger(0, DESTINATIONS.length - 1)];

export const generatePoint = () => {
  const type = generateTypeOfPoint();
  const {dateFrom, dateTo} = getDates();

  return {
    type,
    destination: generateDestination(),
    dateFrom,
    dateTo,
    offers: generateOffers(type),
    information: generateInformation(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    basePrice: getRandomInteger(PRICE.MIN, PRICE.MAX),
  };
};
