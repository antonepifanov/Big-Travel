import {getRandomInteger} from '../utilities.js';
import {ID_COUNT} from './constants.js';

const generateIdOfPoint = () => {
  const previousValues = [];

  return () => {
    let currentValue = getRandomInteger(ID_COUNT.MIN, ID_COUNT.MAX);
    while (previousValues.includes(currentValue)) {
      currentValue = getRandomInteger(ID_COUNT.MIN, ID_COUNT.MAX);
    }
    previousValues.push(currentValue);
    return currentValue;
  };
};

export const getId = generateIdOfPoint();
