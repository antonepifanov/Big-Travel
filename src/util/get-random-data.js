import {getRandomInteger} from './get-random-integer.js';

export const getRandomData = (array) => array[getRandomInteger(0, array.length - 1)];
