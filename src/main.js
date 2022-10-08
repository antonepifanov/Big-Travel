import {getRandomInteger} from './utilities.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createMenuTemplate} from './view/menu.js';
import {createTripCoastTemplate} from './view/trip-coast.js';
import {createFilterTemplate} from './view/trip-filters.js';
import {createSortingTemplate} from './view/sorting.js';
import {createPointsListTemplate} from './view/points-list.js';
import {createEditPointTemplate} from './view/edit-point.js';
import {createPointTemplate} from './view/point.js';
import {generateFilters} from './mock/generate-filters.js';
import {generateSorting} from './mock/generate-sorting.js';
import {MOCK_EVENTS} from './mock/constants.js';
import {generatePoint} from './mock/generate-point.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mockPoints = Array.from({length: getRandomInteger(MOCK_EVENTS.MIN, MOCK_EVENTS.MAX)}, generatePoint);
const filters = generateFilters(mockPoints);
const sorting = generateSorting(mockPoints);

const tripMain = document.querySelector('.trip-main');
render(tripMain, createTripInfoTemplate(), 'afterbegin');

const tripInfo = tripMain.querySelector('.trip-info');
render(tripInfo, createTripCoastTemplate(), 'beforeend');

const pageNav = tripMain.querySelector('.trip-controls__navigation');
render(pageNav, createMenuTemplate(), 'beforeend');

const tripFilters = tripMain.querySelector('.trip-controls__filters');
render(tripFilters, createFilterTemplate(filters), 'beforeend');

const mainContent = document.querySelector('.trip-events');
render(mainContent, createSortingTemplate(sorting), 'beforeend');

render(mainContent, createPointsListTemplate(), 'beforeend');

const pointsList = mainContent.querySelector('.trip-events__list');

render(pointsList, createEditPointTemplate(mockPoints[0]), 'afterbegin');

mockPoints.slice(1).forEach((mockPoint) => {
  render(pointsList, createPointTemplate(mockPoint), 'beforeend');
});
