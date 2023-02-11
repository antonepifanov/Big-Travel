import AbstractView from './abstract.js';

const createSortingItemsTemplate = (sorting) => (
  sorting.map(({name, pointsCount}, index) => {
    const isDisabled = pointsCount === 0
      ? 'disabled'
      : '';
    const isChecked = index === 0
      ? 'checked'
      : '';

    return `<div class="trip-sort__item  trip-sort__item--${name.toLowerCase()}">
              <input id="sort-${name.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name.toLowerCase()}" ${isChecked} ${isDisabled}>
              <label class="trip-sort__btn" for="sort-${name.toLowerCase()}">${name}</label>
            </div>`;
  }).join('')
);

const createSortingTemplate = (sorting) => {
  const sortingItemsTemplate = createSortingItemsTemplate(sorting);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${sortingItemsTemplate}
          </form>`;
};

export default class Sorting extends AbstractView{
  constructor(sorting = []) {
    super();
    this._sorting = sorting;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._sorting);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.textContent.toLowerCase());
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
