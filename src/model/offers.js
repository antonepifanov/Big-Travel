import Observer from '../utilities/observer.js';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers.slice();
  }

  getOffers() {
    return this._offers;
  }

  updateOffer(updateType, update) {
    const index = this._offers.findIndex((offer) => offer.title === offer.title);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._offers = [
      ...this._offers.slice(0, index),
      update,
      ...this._offers.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
