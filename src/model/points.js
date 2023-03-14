import Observer from '../utilities/observer.js';

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(point) {
    const {description, name, pictures} = point.destination;

    const adaptedpoint = Object.assign(
      {},
      point,
      {
        information: {
          description: description,
          photos: pictures,
        },
        destination: name,
        dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
        dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
        basePrice: point.base_price !== null ? point.base_price : 0,
        isFavorite: point.is_favorite,
        isNewPoint: false,
        offers: point.offers.map(({title, price, isSelected}) => (
          {
            title,
            price,
            isSelected: isSelected ? isSelected : false,
          }
        )),
      },
    );

    delete adaptedpoint.date_from;
    delete adaptedpoint.date_to;
    delete adaptedpoint.base_price;
    delete adaptedpoint.is_favorite;

    return adaptedpoint;
  }

  static adaptToServer(point) {
    const {description, photos} = point.information;
    const adaptedpoint = Object.assign(
      {},
      point,
      {
        'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
        'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
        'base_price': point.basePrice,
        'is_favorite': point.isFavorite,
        'destination': {
          'description': description,
          'pictures': photos,
          'name': point.destination,
        },
      },
    );

    delete adaptedpoint.dateFrom;
    delete adaptedpoint.dateTo;
    delete adaptedpoint.isFavorite;
    delete adaptedpoint.basePrice;
    delete adaptedpoint.isNewPoint;

    return adaptedpoint;
  }

  static adaptOffersToClient(offer) {
    const adaptedOffer = Object.assign(
      {},
      offer,
      {
        offers: offer.offers.map(({title, price, isSelected}) => (
          {
            title,
            price,
            isSelected: isSelected ? isSelected : false,
          }
        )),
      },
    );

    return adaptedOffer;
  }

  static adaptDestinationsSetToClient(destinationsSet) {
    const adaptedDestinationsSet = Object.assign(
      {},
      destinationsSet,
      {
        photos: destinationsSet.pictures,
      },
    );

    delete adaptedDestinationsSet.pictures;

    return adaptedDestinationsSet;
  }
}
