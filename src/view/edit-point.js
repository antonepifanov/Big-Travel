import {nanoid} from 'nanoid';
import AbstractView from './abstract.js';
import {getFormattedDate} from '../utilities/point.js';
import {TYPES_OF_POINT, DESTINATIONS, TIME_FORMATS} from '../mock/constants.js';

const BLANK_POINT = {
  id: nanoid(4),
  type: null,
  destination: '',
  dateFrom: null,
  dateTo: null,
  basePrice: '',
  offer: null,
  information: null,
};

const createEventTypeGroupTemplate = (id, type) => (
  TYPES_OF_POINT.map((typeOfPoint) => {
    const isChecked = typeOfPoint === type
      ? 'checked'
      : '';

    return `<div class="event__type-item">
      <input id="event-type-${typeOfPoint.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeOfPoint.toLowerCase()}" ${isChecked}>
      <label class="event__type-label  event__type-label--${typeOfPoint.toLowerCase()}" for="event-type-${typeOfPoint.toLowerCase()}-${id}">${typeOfPoint}</label>
    </div>`;
  }).join(' ')
);

const createDestinationOptionsTemplate = () => (
  DESTINATIONS.map((destination) => (
    `<option value="${destination}"></option>`
  )).join(' ')
);

const createOfferTemplate = ({offers, type}) => (
  offers.map(({title, price}, index) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type.toLowerCase()}-${index + 1}" type="checkbox" name="event-offer-${type.toLowerCase()}">
      <label class="event__offer-label" for="event-offer-${type.toLowerCase()}-${index + 1}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  )).join(' ')
);

const createOffersTemplate = ({offers, type}) => {
  const offerTemplate = createOfferTemplate({offers, type});

  return offers.length > 0
    ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers"> 
          ${offerTemplate}
        </div>
      </section>`
    : '';
};

const createImagesTemplate = (photos) => (
  photos.map((photo) => (
    `<img class="event__photo" src="${photo}" alt="Event photo">`
  )).join(' ')
);

const createImagesContainerTemplate = (photos) => {
  const imagesTemplate = createImagesTemplate(photos);

  return `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${imagesTemplate}
            </div>
          </div>`;
};

const createInformationTemplate = ({photos, description}) => {
  const imagesTemplate = createImagesContainerTemplate(photos);

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>          
            ${imagesTemplate}
          </section>`;
};

const createDestinationDetailsTemplate = (information, offer) => {
  const offersTemplate = offer !== null
    ? createOffersTemplate(offer)
    : '';
  const informationTemplate = information !== null
    ? createInformationTemplate(information)
    : '';

  return information !== null || offer !== null
    ? `<section class="event__details">
        ${offersTemplate}
        ${informationTemplate}      
      </section>`
    : '';
};

const createEditPointTemplate = (point) => {
  const {id, type, destination, dateFrom, dateTo, basePrice, offer, information} = point;

  const eventTypeGroupTemplate = createEventTypeGroupTemplate(id, type);
  const destinationOptionsTemplate = createDestinationOptionsTemplate();
  const destinationDetailsTemplate = createDestinationDetailsTemplate(information, offer);
  const isType = type !== null ? type : '';
  const isNeedIcon = type !== null
    ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">`
    : '';
  const isDateFrom = dateFrom !== null
    ? getFormattedDate(dateFrom, TIME_FORMATS.FORM_TIME)
    : '';
  const isDateTo = dateTo !== null
    ? getFormattedDate(dateTo, TIME_FORMATS.FORM_TIME)
    : '';
  const buttonName = destination === ''
    ? 'Cancel'
    : 'Delete';
  const isNeedRollupButton = destination !== ''
    ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    : '';

  return  `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                    <span class="visually-hidden">Choose event type</span>
                    ${isNeedIcon}
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${eventTypeGroupTemplate}            
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-${id}">
                    ${isType}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}">
                  <datalist id="destination-list-${id}">
                    ${destinationOptionsTemplate}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-${id}">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${isDateFrom}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-${id}">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${isDateTo}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-${id}">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">${buttonName}</button>
                ${isNeedRollupButton}
              </header>
              ${destinationDetailsTemplate}    
            </form>
          </li>`;
};

export default class EditPoint extends AbstractView {
  constructor(point = BLANK_POINT) {
    super();
    this._point = point;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
  }

  getTemplate() {
    return createEditPointTemplate(this._point);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._point);
  }

  _formCloseHandler() {
    this._callback.formClose();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  removeFormSubmitHandler() {
    this.getElement().querySelector('form').removeEventListener('submit', this._formSubmitHandler);
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formCloseHandler);
  }

  removeFormCloseHandler() {
    this.getElement().querySelector('.event__rollup-btn').removeEventListener('click', this._formCloseHandler);
  }
}
