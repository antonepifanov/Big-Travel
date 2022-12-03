import {getRandomInteger, render, RENDER_POSITION} from './utilities.js';
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
render(tripMain, new TripInfoView().getElement(), 'afterbegin');

const tripInfo = tripMain.querySelector('.trip-info');
render(tripInfo, new TripCoastView().getElement(), 'beforeend');

const pageNav = tripMain.querySelector('.trip-controls__navigation');
render(pageNav, new SiteMenuView().getElement(), RENDER_POSITION.BEFOREEND);

const tripFilters = tripMain.querySelector('.trip-controls__filters');
render(tripFilters, new FilterView(filters).getElement(), 'beforeend');

const mainContent = document.querySelector('.trip-events');
render(mainContent, new SortingView(sorting).getElement(), 'beforeend');

render(mainContent, new PointsListView().getElement(), 'beforeend');

const pointsList = mainContent.querySelector('.trip-events__list');

const renderPoint = (pointListElement, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new EditPointView(point);

  const replaceCardToForm = () => {
    pointListElement.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToCard = () => {
    pointListElement.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const onRollupButtonClick = () => {
    replaceFormToCard();
    pointEditComponent.getElement().querySelector('.event__rollup-btn').removeEventListener('click', onRollupButtonClick);
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
    pointEditComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', onRollupButtonClick);
  });

  pointEditComponent.getElement().querySelector('form').addEventListener('submit', (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
    pointEditComponent.getElement().querySelector('.event__rollup-btn').removeEventListener('click', onRollupButtonClick);
  });

  render(pointListElement, pointComponent.getElement(), RENDER_POSITION.BEFOREEND);
};

mockPoints.forEach((mockPoint) => {
  renderPoint(pointsList, mockPoint);
});
