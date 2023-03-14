import {render, RENDER_POSITION, remove} from './utilities/render.js';
import StatisticsView from './view/statistics.js';
import NavView from './view/nav.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api.js';
import {generateSorting} from './utilities/generate-sorting.js';
import {MENU_ITEM, UPDATE_TYPE, FILTER_TYPE, AUTHORIZATION, END_POINT} from './constants.js';

const tripMain = document.querySelector('.trip-main');
const mainContent = document.querySelector('.trip-events');
const pageNav = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const siteMenuComponent = new NavView();

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

render(pageNav, siteMenuComponent, RENDER_POSITION.BEFOREEND);

let statisticsComponent = null;

const getPoints = api.getPoints();
const getOffers = api.getOffers();
const getDestinationsSet = api.getDestinationsSet();

Promise.all([getPoints, getOffers, getDestinationsSet]).then(([points, offers, destinationsSet]) => {
  const sorting = generateSorting(points);
  const tripPresenter = new TripPresenter(tripMain, mainContent, sorting, pointsModel, filterModel, offers, destinationsSet);
  const filterPresenter = new FilterPresenter(tripFilters, filterModel, pointsModel);
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
  const handlePointNewFormClose = () => {
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
  };
  document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    tripPresenter.destroy();
    filterModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);
    tripPresenter.init();
    tripPresenter.createPoint(handlePointNewFormClose);
    evt.target.setAttribute('disabled', '');
  });
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  pointsModel.setPoints(points);
  filterPresenter.init();
  tripPresenter.init();
});
