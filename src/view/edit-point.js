import {nanoid} from 'nanoid';
import SmartView from './smart.js';
import Api from './../api.js';
import {generateInformation} from '../mock/generate-information.js';
import {getFormattedDate} from '../utilities/point.js';
import {TYPES_OF_POINT, DESTINATIONS, TIME_FORMATS} from '../mock/constants.js';
import {AUTHORIZATION, END_POINT} from './../constants.js';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const api = new Api(END_POINT, AUTHORIZATION);

const BLANK_POINT = {
  id: nanoid(4),
  type: '',
  destination: '',
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  offers: null,
  information: null,
  isNewPoint: true,
};

const createEventTypeGroupTemplate = (id, type) => (
  TYPES_OF_POINT.map((typeOfPoint) => {
    const isChecked = typeOfPoint.toLowerCase() === type
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

const createOfferTemplate = (type, offers) => (
  offers.map(({title, price, isSelected}, index) => (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type.toLowerCase()}-${index + 1}" type="checkbox" name="event-offer-${type.toLowerCase()}" ${isSelected ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${type.toLowerCase()}-${index + 1}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  )).join(' ')
);

const createOffersTemplate = (type, offers) => {
  const offerTemplate = createOfferTemplate(type, offers);

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
  photos.map(({src, description}) => (
    `<img class="event__photo" src="${src}" alt="${description}">`
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

const createDestinationDetailsTemplate = (information, type, offers) => {
  const offersTemplate = offers !== null
    ? createOffersTemplate(type, offers)
    : '';
  const informationTemplate = information !== null
    ? createInformationTemplate(information)
    : '';

  return information !== null || offers !== null
    ? `<section class="event__details">
        ${offersTemplate}
        ${informationTemplate}      
      </section>`
    : '';
};

const createEditPointTemplate = (point) => {
  const {id, type, destination, dateFrom, dateTo, basePrice, offers, information, isNewPoint} = point;

  const eventTypeGroupTemplate = createEventTypeGroupTemplate(id, type);
  const destinationOptionsTemplate = createDestinationOptionsTemplate(type);
  const destinationDetailsTemplate = createDestinationDetailsTemplate(information, type, offers);
  const isType = type !== null ? type : '';
  const isNeedIcon = type !== ''
    ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">`
    : '';
  const isDateFrom = dateFrom !== null
    ? getFormattedDate(dateFrom, TIME_FORMATS.FORM_TIME)
    : '';
  const isDateTo = dateTo !== null
    ? getFormattedDate(dateTo, TIME_FORMATS.FORM_TIME)
    : '';
  const buttonName = isNewPoint
    ? 'Cancel'
    : 'Delete';
  const isNeedRollupButton = !isNewPoint
    ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`
    : '';
  const price = basePrice !== null
    ? basePrice
    : 0;


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
                  <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">${buttonName}</button>
                ${isNeedRollupButton}
              </header>
              ${destinationDetailsTemplate}    
            </form>
          </li>`;
};

export default class EditPoint extends SmartView {
  constructor(point = BLANK_POINT) {
    super();
    this._data = EditPoint.parsePointToData(point);
    this._offers = this._data.offers;
    this._toggleOffersHandler = this._toggleOffersHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formCloseHandler = this._formCloseHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._pointDestinationChangeHandler = this._pointDestinationChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._datepickerTo = null;
    this._datepickerFrom = null;
    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }
  }

  _setDatepickerFrom() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    this._datepickerFrom = flatpickr(
      this.getElement().querySelector('[name="event-start-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        onChange: this._dateFromChangeHandler,
      },
    );
  }

  _setDatepickerTo() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr(
      this.getElement().querySelector('[name="event-end-time"]'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        onChange: this._dateToChangeHandler,
      },
    );
  }

  reset(point) {
    this.updateData(EditPoint.parsePointToData(point), true);
  }

  getTemplate() {
    return createEditPointTemplate(this._data);
  }

  restoreHandlers() {
    this._setDatepickerFrom();
    this._setDatepickerTo();
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCloseHandler(this._callback.formClose);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-list').addEventListener('click', this._pointTypeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._pointDestinationChangeHandler);
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._priceInputHandler);
    if (this.getElement().querySelector('.event__available-offers')) {
      this.getElement().querySelector('.event__available-offers').addEventListener('click', this._toggleOffersHandler);
    }
  }

  _pointTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    api.getOffers().then((offers) => {
      this._offers = offers.find((offer) => (
        offer.type === evt.target.textContent.toLowerCase()
      )).offers;
    });
    console.log(evt.target.textContent)
    console.log(this._data)

    this.updateData({
      type: evt.target.textContent.toLowerCase(),
      offers: this._offers,
    });
  }

  _pointDestinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value,
      information: generateInformation(),
    });
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EditPoint.parseDataToPoint(this._data));
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(EditPoint.parseDataToPoint(this._data));
  }

  _formCloseHandler() {
    this._callback.formClose();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setFormCloseHandler(callback) {
    this._callback.formClose = callback;
    if (this.getElement().querySelector('.event__reset-btn')) {
      this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formCloseHandler);
    }

    if (this.getElement().querySelector('.event__rollup-btn')) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formCloseHandler);
    }
  }

  _toggleOffersHandler(evt) {
    if (!evt.target.closest('.event__offer-label')) {
      return;
    }
    const targetOffer = evt.target.closest('.event__offer-label');
    console.log(this._offers)
    const index = this._offers.findIndex((offer) => (
      offer.title === targetOffer.querySelector('.event__offer-title').textContent
    ));
    console.log(index)
    this._offers = [
      ...this._offers.slice(0, index),
      Object.assign(
        {},
        this._offers[index],
        {
          isSelected: !this._offers[index].isSelected,
        },
      ),
      ...this._offers.slice(index + 1),
    ];
    this.updateData({
      offers: this._offers,
    }, true );
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    }, true);
  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    }, true);
  }

  static parsePointToData(point) {
    return Object.assign({}, point);
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);
    return data;
  }
}
