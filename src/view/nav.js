import AbstractView from './abstract.js';
import {MENU_ITEM} from '../constants.js';

const createNavTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">${MENU_ITEM.TABLE}</a>
      <a class="trip-tabs__btn" href="#">${MENU_ITEM.STATS}</a>
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
    const item = this.getElement().querySelector('.trip-tabs__btn').textContent = `${menuItem}`;

    if (item !== null) {
      item.classList.add('trip-tabs__btn--active');
    }
  }
}
