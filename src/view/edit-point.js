import {getFormattedDate} from '../utilities.js';
import {TYPES_OF_POINT, DESTINATIONS, TIME_FORMATS} from '../mock/constants.js';
import {getId} from '../mock/generate-id.js';

const createEventTypeGroupTemplate = (id, type) => (
  TYPES_OF_POINT.map((typeOfPoint) => (
    `<div class="event__type-item">
      <input id="event-type-${typeOfPoint.toLowerCase()}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeOfPoint.toLowerCase()}" ${typeOfPoint === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${typeOfPoint.toLowerCase()}" for="event-type-${typeOfPoint.toLowerCase()}-${id}">${typeOfPoint}</label>
    </div>`
  )).join(' ')
);

const createDestinationOptionsTemplate = () => (
  DESTINATIONS.map((destination) => (
    `<option value="${destination}"></option>`
  )).join(' ')
);

const createOffersTemplate = (offer) => {
  const offers = offer.offers;

  const createOfferTemplate = () => (
    offers.map((offerItem, index) => (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type.toLowerCase()}-${index + 1}" type="checkbox" name="event-offer-${offer.type.toLowerCase()}">
        <label class="event__offer-label" for="event-offer-${offer.type.toLowerCase()}-${index + 1}">
          <span class="event__offer-title">${offerItem.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offerItem.price}</span>
        </label>
      </div>`
    )).join(' ')
  );

  return offers.length > 0
    ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers"> 
          ${createOfferTemplate()}
        </div>
      </section>`
    : '';
};

const createInformationTemplate = (information) => {
  const photos = information.photos;
  const createImagesTemplate = () => (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(' ')}
      </div>
    </div>`
  );

  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${information.description}</p>          
            ${createImagesTemplate()}
          </section>`;
};

const createDestinationDetailsTemplate = (information, offer) => (
  information !== null || offer !== null
    ? `<section class="event__details">
        ${offer !== null ? createOffersTemplate(offer) : ''}
        ${information !== null ? createInformationTemplate(information) : ''}      
      </section>`
    : ''
);

export const createEditPointTemplate = (point = {}) => {
  const {
    id = getId(),
    type = null,
    destination = '',
    dateFrom = null,
    dateTo = null,
    basePrice = '',
    offer = null,
    information = null,
  } = point;

  return  `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
                    <span class="visually-hidden">Choose event type</span>
                    ${type !== null ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">` : ''}
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${createEventTypeGroupTemplate(id, type)}            
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  ${type !== null ? `<label class="event__label  event__type-output" for="event-destination-${id}">
                    ${type}
                  </label>` : ''}
                  <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destination}" list="destination-list-${id}">
                  <datalist id="destination-list-${id}">
                    ${createDestinationOptionsTemplate()}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-${id}">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${dateFrom !== null ? getFormattedDate(dateFrom, TIME_FORMATS.FORM_TIME) : ''}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-${id}">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${dateTo !== null ? getFormattedDate(dateTo, TIME_FORMATS.FORM_TIME) : ''}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-${id}">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">${destination === '' ? 'Cancel' : 'Delete'}</button>
                ${destination !== '' ? `<button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>` : ''}
              </header>
              ${createDestinationDetailsTemplate(information, offer)}    
            </form>
          </li>`;
};
