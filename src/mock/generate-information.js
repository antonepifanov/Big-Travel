import {getRandomInteger} from '../util/get-random-integer';
import {DESCRIPTIONS, SENTENCES_COUNT, PHOTOS_COUNT, PHOTOS_RANGE} from './constants';

const getDescription = () => {
  const sentences = [];
  const getSentence = () => {
    let sentence = DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)];
    while (sentences.includes(sentence)) {
      sentence = DESCRIPTIONS[getRandomInteger(0, DESCRIPTIONS.length - 1)];
    }
    sentences.push(sentence);
    return sentence;
  };
  return Array.from({length: getRandomInteger(SENTENCES_COUNT.min, SENTENCES_COUNT.max)}, () => getSentence()).join(' ');
};

const getPhotos = () => {
  const photos = [];
  const getPhoto = () => {
    let photo = `http://placebeard.it/248/152?r=${getRandomInteger(PHOTOS_RANGE.MIN, PHOTOS_RANGE.MAX)}`;
    while (photos.includes(photo)) {
      photo = `http://placebeard.it/248/152?r=${getRandomInteger(PHOTOS_RANGE.MIN, PHOTOS_RANGE.MAX)}`;
    }
    photos.push(photo);
    return photo;
  };
  return Array.from({length: getRandomInteger(PHOTOS_COUNT.MIN, PHOTOS_COUNT.MAX)}, () => getPhoto());
};

export const generateInformation = () => ({
  description: getDescription(),
  photos: getPhotos(),
});
