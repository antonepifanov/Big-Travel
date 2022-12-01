import {getRandomInteger, renderElement, RENDER_POSITION} from './utilities.js';
import TripInfoView from './view/trip-info.js';
import SiteMenuView from './view/menu.js';
import PointsListView from './view/points-list.js';
import TripCoastView from './view/trip-coast.js';
import FilterView from './view/trip-filters.js';
import SortingView from './view/sorting.js';
import EditPointView from './view/edit-point.js';
import PointView from './view/point.js';
import {generateFilters} from './mock/generate-filters.js';
import {generateSorting} from './mock/generate-sorting.js';
import {MOCK_EVENTS} from './mock/constants.js';
import {generatePoint} from './mock/generate-point.js';

const mockPoints = Array.from({length: getRandomInteger(MOCK_EVENTS.MIN, MOCK_EVENTS.MAX)}, generatePoint);
const filters = generateFilters(mockPoints);
const sorting = generateSorting(mockPoints);

const tripMain = document.querySelector('.trip-main');
renderElement(tripMain, new TripInfoView().getElement(), 'afterbegin');

const tripInfo = tripMain.querySelector('.trip-info');
renderElement(tripInfo, new TripCoastView().getElement(), 'beforeend');

const pageNav = tripMain.querySelector('.trip-controls__navigation');
renderElement(pageNav, new SiteMenuView().getElement(), RENDER_POSITION.BEFOREEND);

const tripFilters = tripMain.querySelector('.trip-controls__filters');
renderElement(tripFilters, new FilterView(filters).getElement(), 'beforeend');

const mainContent = document.querySelector('.trip-events');
renderElement(mainContent, new SortingView(sorting).getElement(), 'beforeend');

renderElement(mainContent, new PointsListView().getElement(), 'beforeend');

const pointsList = mainContent.querySelector('.trip-events__list');

renderElement(pointsList, new EditPointView(mockPoints[0]).getElement(), 'afterbegin');

mockPoints.slice(1).forEach((mockPoint) => {
  renderElement(pointsList, new PointView(mockPoint).getElement(), 'beforeend');
});
