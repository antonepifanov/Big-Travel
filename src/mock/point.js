
import {TYPES_OF_POINT, DESTINATIONS} from './constants';
import {getRandomInteger} from '../util/get-random-integer';
import {generateOffers} from './generate-offers';
import {generateInformation} from './generate-information';

const generateTypeOfPoint = () => TYPES_OF_POINT[getRandomInteger(0, TYPES_OF_POINT.length - 1)];

const generateDestination = () => DESTINATIONS[getRandomInteger(0, DESTINATIONS.length - 1)];

export const generatePoint = () => {
  const type = generateTypeOfPoint();

  return {
    type,
    destination: generateDestination(),
    offers: generateOffers(type),
    information: generateInformation(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
