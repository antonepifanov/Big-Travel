import AbstractView from './abstract.js';

const createSortingItemsTemplate = (sorting, currentSortType) => (
  sorting.map(({name, pointsCount}) => {
    const isDisabled = pointsCount === 0
      ? 'disabled'
      : '';
    const isChecked = currentSortType === name.toLowerCase()
      ? 'checked'
      : '';

    return `<div class="trip-sort__item  trip-sort__item--${name.toLowerCase()}">
              <input id="sort-${name.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name.toLowerCase()}" ${isChecked} ${isDisabled}>
              <label class="trip-sort__btn" for="sort-${name.toLowerCase()}">${name}</label>
            </div>`;
  }).join('')
);

const createSortingTemplate = (sorting, currentSortType) => {
  const sortingItemsTemplate = createSortingItemsTemplate(sorting, currentSortType);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${sortingItemsTemplate}
          </form>`;
};

export default class Sorting extends AbstractView{
  constructor(sorting, currentSortType) {
    super();
    this._sorting = sorting;
    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortingTemplate(this._sorting, this._currentSortType);
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
