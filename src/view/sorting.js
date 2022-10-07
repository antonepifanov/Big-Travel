export const createSortingTemplate = (sorting) => {

  const sortingItemsTemplate = sorting.map((sortItem, index) => {
    const sortingPoint = sortItem.sortingPoints;
    return `<div class="trip-sort__item  trip-sort__item--${sortItem.name.toLowerCase()}">
      <input id="sort-${sortItem.name.toLowerCase()}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortItem.name.toLowerCase()}" ${index === 0 ? 'checked' : ''} ${sortingPoint.length === 0 ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sortItem.name.toLowerCase()}">${sortItem.name}</label>
    </div>`;
  }).join('');

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${sortingItemsTemplate}
          </form>`;
};
