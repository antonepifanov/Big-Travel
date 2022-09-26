import {getRandomInteger} from './util/get-random-integer';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createTripCoastTemplate} from './view/trip-coast.js';
import {createFiltersTemplate} from './view/trip-filters.js';
import {createSortingTemplate} from './view/sorting.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createNewPointTemplate} from './view/new-point.js';
import {createPointTemplate} from './view/point.js';
import {MOCK_EVENTS} from './mock/constants';
import {generatePoint} from './mock/point';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMain = document.querySelector('.trip-main');
render(tripMain, createTripInfoTemplate(), 'afterbegin');

const tripInfo = tripMain.querySelector('.trip-info');
render(tripInfo, createTripCoastTemplate(), 'beforeend');

const pageNav = tripMain.querySelector('.trip-controls__navigation');
render(pageNav, createMenuTemplate(), 'beforeend');

const tripFilters = tripMain.querySelector('.trip-controls__filters');
render(tripFilters, createFiltersTemplate(), 'beforeend');

const mainContent = document.querySelector('.trip-events');
render(mainContent, createSortingTemplate(), 'beforeend');

render(mainContent, createPointsListTemplate(), 'beforeend');

const pointsList = mainContent.querySelector('.trip-events__list');
render(pointsList, createEditPointTemplate(), 'afterbegin');
render(pointsList, createNewPointTemplate(), 'beforeend');

const mockData = Array.from({length: getRandomInteger(MOCK_EVENTS.MIN, MOCK_EVENTS.MAX)}, () => generatePoint());
console.log(mockData);

mockData.forEach((mockEvent) => {
  render(pointsList, createPointTemplate(mockEvent), 'beforeend');
});
