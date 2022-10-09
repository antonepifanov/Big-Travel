import {getRandomInteger, getRandomData} from '../utilities.js';
import {DESCRIPTIONS, SENTENCES_COUNT, PHOTOS_COUNT, PHOTOS_RANGE, PHOTO_URL} from './constants.js';

const getDescription = () => {
  const arrayOfSentences = DESCRIPTIONS.split('.')
    .slice(0, -1)
    .map((sentence) => sentence = `${sentence.trimStart()}.`);
  const sentences = [];
  const getSentence = () => {
    let sentence = getRandomData(arrayOfSentences);
    while (sentences.includes(sentence)) {
      sentence = getRandomData(arrayOfSentences);
    }
    sentences.push(sentence);
    return sentence;
  };
  return Array.from({length: getRandomInteger(SENTENCES_COUNT.MIN, SENTENCES_COUNT.MAX)}, getSentence).join(' ');
};

const getPhotos = () => {
  const photos = [];
  const getPhoto = () => {
    let photo = `${PHOTO_URL}${getRandomInteger(PHOTOS_RANGE.MIN, PHOTOS_RANGE.MAX)}`;
    while (photos.includes(photo)) {
      photo = `${PHOTO_URL}${getRandomInteger(PHOTOS_RANGE.MIN, PHOTOS_RANGE.MAX)}`;
    }
    photos.push(photo);
    return photo;
  };
  return Array.from({length: getRandomInteger(PHOTOS_COUNT.MIN, PHOTOS_COUNT.MAX)}, getPhoto);
};

export const generateInformation = () => ({
  description: getDescription(),
  photos: getPhotos(),
});
