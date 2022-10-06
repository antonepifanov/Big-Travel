import dayjs from 'dayjs';
import {TIME_FORMATS} from '../mock/constants';
import {getDuration} from '../util/get-duration';

const getSelectedOffersTemplate = (offer) => {
  const offers = offer.offers;
  const selectedOffers = offers.filter((offerItem) => offerItem.isSelected);

  const getSelectedOffers = () => selectedOffers.map(({title, price}) => (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`
  )).join(' ');

  return selectedOffers.length > 0
    ? `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getSelectedOffers()}
      </ul>`
    : '';
};

export const createPointTemplate = (point) => {
  const {type, destination, dateFrom, dateTo, basePrice, offer, isFavorite} = point;
  const tripDuration = getDuration(dateFrom, dateTo);
  const selectedOffersTemplate = getSelectedOffersTemplate(offer);

  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${dayjs(dateFrom).format(TIME_FORMATS.DATETIME)}">${dayjs(dateFrom).format(TIME_FORMATS.EVENT_DATE)}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event icon">
              </div>
              <h3 class="event__title">${type} ${destination}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${dayjs(dateFrom).format(TIME_FORMATS.DATETIME)}">${dayjs(dateFrom).format(TIME_FORMATS.START_TIME)}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${dayjs(dateTo).format(TIME_FORMATS.DATETIME)}">${dayjs(dateTo).format(TIME_FORMATS.START_TIME)}</time>
                </p>
                <p class="event__duration">${tripDuration}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
              </p>
              ${selectedOffersTemplate}
              <button class="event__favorite-btn  ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
};
