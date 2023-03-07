import AbstractView from './abstract.js';
import {MENU_ITEM} from '../constants.js';

const createNavTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-item="${MENU_ITEM.TABLE}">${MENU_ITEM.TABLE}</a>
      <a class="trip-tabs__btn" href="#" data-item="${MENU_ITEM.STATS}">${MENU_ITEM.STATS}</a>
   </nav>`
);

export default class Nav extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createNavTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.textContent);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-item="${menuItem}"]`);
    const currentItem = this.getElement().querySelector('.trip-tabs__btn--active');

    if (item !== null) {
      currentItem.classList.remove('trip-tabs__btn--active');
      item.classList.add('trip-tabs__btn--active');
    }
  }
}
