import AbstractView from './abstract.js';

const createNavTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
   </nav>`
);

export default class Nav extends AbstractView {
  getTemplate() {
    return createNavTemplate();
  }
}
