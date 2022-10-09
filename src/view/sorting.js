const createSortingItemsTemplate = (sorting) => (
  sorting.map(({name, sortingPoints}, index) => {
    const isDisabled = sortingPoints.length === 0
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

export const createSortingTemplate = (sorting) => {
  const sortingItemsTemplate = createSortingItemsTemplate(sorting);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${sortingItemsTemplate}
          </form>`;
};
