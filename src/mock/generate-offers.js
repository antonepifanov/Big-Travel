import {getRandomInteger} from '../util/get-random-integer';
import {getRandomData} from '../util/get-random-data';
import {OFFERS_COUNT, TITLES_OF_OFFERS, PRICE, TYPES_OF_POINT} from './constants';

const generateSetOfOffers = () => TYPES_OF_POINT.map((typeOfPoint) => {
  const titles = [];
  const getOffer = () => {
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

  return {
    type: typeOfPoint,
    offers: Array.from({length: getRandomInteger(OFFERS_COUNT.MIN, OFFERS_COUNT.MAX)}, () => getOffer()),
  };
});

const setOfOffers = generateSetOfOffers();

export const generateOffers = (type) => setOfOffers.find((offer) => (
  offer.type === type
));
