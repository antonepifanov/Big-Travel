import {getRandomInteger} from '../util/get-random-integer';
import {generateOffers} from './generate-offers';
import {TYPES_OF_POINT, DESTINATIONS} from './constants';

const generateTypeOfPoint = () => TYPES_OF_POINT[getRandomInteger(0, TYPES_OF_POINT.length - 1)];

const generateDestination = () => DESTINATIONS[getRandomInteger(0, DESTINATIONS.length - 1)];

export const generatePoint = () => {
  const type = generateTypeOfPoint();

  return {
    type,
    destination: generateDestination(),
    offers: generateOffers(type),
  };
};
