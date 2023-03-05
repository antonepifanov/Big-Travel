import Observer from '../utilities/observer.js';

export default class Options extends Observer {
  constructor() {
    super();
    this._options = [];
  }

  setOptions(options) {
    this._points = options.slice();
  }

  getOptions() {
    return this._options;
  }

  updateOption(updateType, update) {
    const index = this._options.findIndex((option) => option.title === option.title);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._options = [
      ...this._options.slice(0, index),
      update,
      ...this._options.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
