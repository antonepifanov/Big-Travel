const createFilterItemsTemplate = (filters) => (
  filters.map(({name}, index) => (
    `<div class="trip-filters__filter">
      <input id="filter-${name.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name.toLowerCase()}" ${index === 0 ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-${name.toLowerCase()}">${name}</label>
    </div>`
  )).join('')
);

export const createFilterTemplate = (filters) => {
  const filterItemsTemplate = createFilterItemsTemplate(filters);

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};
