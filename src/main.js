import {render, RENDER_POSITION, remove} from './utilities/render.js';
import StatisticsView from './view/statistics.js';
import NavView from './view/nav.js';
import LoadingView from './view/loading.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api.js';
import {MENU_ITEM, UPDATE_TYPE, FILTER_TYPE, AUTHORIZATION, END_POINT} from './constants.js';

const mainContent = document.querySelector('.trip-events');
const loadingComponent = new LoadingView();

render(mainContent, loadingComponent, RENDER_POSITION.BEFOREEND);

const siteMenuComponent = new NavView();
const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const api = new Api(END_POINT, AUTHORIZATION);
const tripMain = document.querySelector('.trip-main');
const pageNav = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const getOffers = api.getOffers();
const getDestinationsSet = api.getDestinationsSet();
let statisticsComponent = null;

Promise.all([getOffers, getDestinationsSet])
  .then(([offers, destinationsSet]) => {
    const tripPresenter = new TripPresenter(tripMain, mainContent, pointsModel, filterModel, offers, destinationsSet, api);
    remove(loadingComponent);
    tripPresenter.init();
    const filterPresenter = new FilterPresenter(tripFilters, filterModel, pointsModel);
    filterPresenter.init();
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
      remove(statisticsComponent);
      filterModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createPoint(handlePointNewFormClose);
      evt.target.setAttribute('disabled', '');
    });
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .then(() => api.getPoints())
  .then((points) => {
    pointsModel.setPoints(UPDATE_TYPE.INIT, points);
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
    render(pageNav, siteMenuComponent, RENDER_POSITION.BEFOREEND);
  })
  .catch(() => {
    pointsModel.setPoints(UPDATE_TYPE.INIT, []);
    document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
    render(pageNav, siteMenuComponent, RENDER_POSITION.BEFOREEND);
  });
