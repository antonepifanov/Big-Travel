import AbstractView from './abstract.js';
import {TIME_FORMATS} from '../mock/constants.js';
import {getDuration, getFormattedDate} from '../utilities/point.js';

const getSelectedOffers = (selectedOffers) => (
  selectedOffers.map(({title, price}) => (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`
  )).join(' ')
);

const getSelectedOffersTemplate = ({offers}) => {
  const selectedOffersArray = offers.filter((offerItem) => offerItem.isSelected);
  const selectedOffer = getSelectedOffers(selectedOffersArray);

  return selectedOffersArray.length > 0
    ? `<h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${selectedOffer}
      </ul>`
    : '';
};

const createPointTemplate = ({type, destination, dateFrom, dateTo, basePrice, offer, isFavorite}) => {
  const datetimeValueFrom = getFormattedDate(dateFrom, TIME_FORMATS.DATETIME);
  const datetimeValueTo = getFormattedDate(dateTo, TIME_FORMATS.DATETIME);
  const pointDateFrom = getFormattedDate(dateFrom, TIME_FORMATS.EVENT_DATE);
  const pointStartDate = getFormattedDate(dateFrom, TIME_FORMATS.START_TIME);
  const pointEndDate = getFormattedDate(dateTo, TIME_FORMATS.START_TIME);
  const pointDuration = getDuration(dateFrom, dateTo);
  const selectedOffersTemplate = getSelectedOffersTemplate(offer);
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${datetimeValueFrom}">${pointDateFrom}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event icon">
              </div>
              <h3 class="event__title">${type} ${destination}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${datetimeValueFrom}">${pointStartDate}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${datetimeValueTo}">${pointEndDate}</time>
                </p>
                <p class="event__duration">${pointDuration}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
              </p>
              ${selectedOffersTemplate}
              <button class="event__favorite-btn  ${favoriteClass}" type="button">
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

export default class Point extends AbstractView{
  constructor(point) {
    super();
    this._point = point;
    this._formOpenHandler = this._formOpenHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  _formOpenHandler() {
    this._callback.formOpen();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFormOpenHandler(callback) {
    this._callback.formOpen = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formOpenHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}
