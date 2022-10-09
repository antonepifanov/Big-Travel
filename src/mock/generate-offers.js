import {getRandomInteger, getRandomData} from '../utilities.js';
import {OFFERS_COUNT, TITLES_OF_OFFERS, PRICE, TYPES_OF_POINT} from './constants.js';

const getOffer = () => {
  const titles = [];

  return () => {
    let title = getRandomData(TITLES_OF_OFFERS);
    while (titles.includes(title)) {
      title = getRandomData(TITLES_OF_OFFERS);
    }
    titles.push(title);

    return {
      title,
      price: getRandomInteger(PRICE.MIN, PRICE.MAX),
      isSelected: Boolean(getRandomInteger(0, 1)),
    };
  };
};

const generateSetOfOffers = () => TYPES_OF_POINT.map((typeOfPoint) => {
  const getUniqueOffer = getOffer();

  return {
    type: typeOfPoint,
    offers: Array.from({length: getRandomInteger(OFFERS_COUNT.MIN, OFFERS_COUNT.MAX)}, getUniqueOffer),
  };
});

export const generateOffers = (type) => {
  const setOfOffers = generateSetOfOffers();

  return setOfOffers.find((offer) => (
    offer.type === type
  ));
};
