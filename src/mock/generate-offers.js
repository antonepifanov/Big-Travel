import {getRandomInteger} from '../util/get-random-integer';
import {OFFERS_COUNT, TITLES_OF_OFFERS, PRICE, TYPES_OF_POINT} from './constants';

const generateSetOfOffers = () => TYPES_OF_POINT.map((typeOfPoint) => {
  const titles = [];
  const getOffer = () => {
    let title = TITLES_OF_OFFERS[getRandomInteger(0, TITLES_OF_OFFERS.length - 1)];
    while (titles.includes(title)) {
      title = TITLES_OF_OFFERS[getRandomInteger(0, TITLES_OF_OFFERS.length - 1)];
    }
    titles.push(title);
    return {
      title,
      price: getRandomInteger(PRICE.min, PRICE.max),
    };
  };

  return {
    type: typeOfPoint,
    offers: Array.from({length: getRandomInteger(OFFERS_COUNT.min, OFFERS_COUNT.max)}, () => getOffer()),
  };
});

const setOfOffers = generateSetOfOffers();

export const generateOffers = (type) => setOfOffers.find((offers) => (
  offers.type === type
)).offers;
