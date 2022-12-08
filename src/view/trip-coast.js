import AbstractView from './abstract.js';

export const createTripCoastTemplate = () => (
  `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
   </p>`
);

export default class TripCoast extends AbstractView{
  getTemplate() {
    return createTripCoastTemplate();
  }
}
