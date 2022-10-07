export const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems.map((filter, index) => (
    `<div class="trip-filters__filter">
      <input id="filter-${filter.name.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.name.toLowerCase()}" ${index === 0 ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filter.name.toLowerCase()}">${filter.name}</label>
    </div>`
  )).join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};
