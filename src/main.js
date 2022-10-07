import {getRandomInteger} from './utilities.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createTripCoastTemplate} from './view/trip-coast.js';
import {createFiltersTemplate} from './view/trip-filters.js';
import {createSortingTemplate} from './view/sorting.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointTemplate} from './view/point.js';
import {MOCK_EVENTS} from './mock/constants.js';
import {generatePoint} from './mock/generate-point.js';

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

const mockData = Array.from({length: getRandomInteger(MOCK_EVENTS.MIN, MOCK_EVENTS.MAX)}, () => generatePoint());

render(pointsList, createEditPointTemplate(), 'afterbegin');

mockData.slice(1).forEach((mockEvent) => {
  render(pointsList, createPointTemplate(mockEvent), 'beforeend');
});
