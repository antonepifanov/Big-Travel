import {render, RENDER_POSITION} from './utilities/render.js';
import {getRandomInteger} from './utilities/common.js';
import NavView from './view/nav.js';
import FilterView from './view/trip-filters.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import {generateFilters} from './mock/generate-filters.js';
import {generateSorting} from './mock/generate-sorting.js';
import {MOCK_EVENTS} from './mock/constants.js';
import {generatePoint} from './mock/generate-point.js';

const tripMain = document.querySelector('.trip-main');
const mainContent = document.querySelector('.trip-events');
const pageNav = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');

const mockPoints = Array.from({length: getRandomInteger(MOCK_EVENTS.MIN, MOCK_EVENTS.MAX)}, generatePoint);
const filters = generateFilters(mockPoints);
const sorting = generateSorting(mockPoints);

const pointsModel = new PointsModel();
pointsModel.setPoints(mockPoints);
const tripPresenter = new TripPresenter(tripMain, mainContent, sorting, pointsModel);

render(pageNav, new NavView(), RENDER_POSITION.BEFOREEND);
render(tripFilters, new FilterView(filters), RENDER_POSITION.BEFOREEND);
tripPresenter.init();
