import {render, RENDER_POSITION, remove} from './utilities/render.js';
import {getRandomInteger} from './utilities/common.js';
import StatisticsView from './view/statistics.js';
import NavView from './view/nav.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import {generateSorting} from './mock/generate-sorting.js';
import {MOCK_EVENTS} from './mock/constants.js';
import {generatePoint} from './mock/generate-point.js';
import {MENU_ITEM, UPDATE_TYPE, FILTER_TYPE} from './constants.js';

const tripMain = document.querySelector('.trip-main');
const mainContent = document.querySelector('.trip-events');
const pageNav = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const siteMenuComponent = new NavView();

const mockPoints = Array.from({length: getRandomInteger(MOCK_EVENTS.MIN, MOCK_EVENTS.MAX)}, generatePoint);
const sorting = generateSorting(mockPoints);
const pointsModel = new PointsModel();
pointsModel.setPoints(mockPoints);

const filterModel = new FilterModel();

render(pageNav, siteMenuComponent, RENDER_POSITION.BEFOREEND);
const tripPresenter = new TripPresenter(tripMain, mainContent, sorting, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(tripFilters, filterModel, pointsModel);

const handlePointNewFormClose = () => {
  document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MENU_ITEM.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MENU_ITEM.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(mainContent, statisticsComponent, RENDER_POSITION.BEFOREEND);
      break;
  }
  siteMenuComponent.setMenuItem(menuItem);
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  filterModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
  evt.target.setAttribute('disabled', '');
});
