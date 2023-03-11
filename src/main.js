import {render, RENDER_POSITION, remove} from './utilities/render.js';
import StatisticsView from './view/statistics.js';
import NavView from './view/nav.js';
import TripPresenter from './presenter/trip.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import FilterPresenter from './presenter/filter.js';
import Api from './api.js';
import {generateSorting} from './mock/generate-sorting.js';
import {MENU_ITEM, UPDATE_TYPE, FILTER_TYPE} from './constants.js';

const AUTHORIZATION = 'Basic shumilovo3671';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const tripMain = document.querySelector('.trip-main');
const mainContent = document.querySelector('.trip-events');
const pageNav = tripMain.querySelector('.trip-controls__navigation');
const tripFilters = tripMain.querySelector('.trip-controls__filters');
const siteMenuComponent = new NavView();

const api = new Api(END_POINT, AUTHORIZATION);

api.getDestinations().then((points) => {
  console.log(points);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

api.getOffers().then((points) => {
  console.log(points);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

render(pageNav, siteMenuComponent, RENDER_POSITION.BEFOREEND);

const handlePointNewFormClose = () => {
  document.querySelector('.trip-main__event-add-btn').removeAttribute('disabled');
};

let statisticsComponent = null;

api.getPoints().then((points) => {
  console.log(points);
  const sorting = generateSorting(points);
  const tripPresenter = new TripPresenter(tripMain, mainContent, sorting, pointsModel, filterModel);
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
