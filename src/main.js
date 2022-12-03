import {getRandomInteger, render, RENDER_POSITION} from './utilities.js';
import TripInfoView from './view/trip-info.js';
import SiteMenuView from './view/menu.js';
import PointsListView from './view/points-list.js';
import TripCoastView from './view/trip-coast.js';
import FilterView from './view/trip-filters.js';
import SortingView from './view/sorting.js';
import EditPointView from './view/edit-point.js';
import PointView from './view/point.js';
import NoPointsView from './view/no-points.js';
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

const renderPointsList = (listContainer, points) => {
  const pointListComponent = new PointsListView();

  if (points.length === 0) {
    render(listContainer, new NoPointsView().getElement(), 'beforeend');
  } else {
    render(listContainer, new SortingView(sorting).getElement(), 'beforeend');
    render(listContainer, pointListComponent.getElement(), 'beforeend');

    points.forEach((point) => {
      renderPoint(pointListComponent.getElement(), point);
    });
  }
};

const tripInfoComponent = new TripInfoView();
render(tripMain, tripInfoComponent.getElement(), 'afterbegin');
render(tripInfoComponent.getElement(), new TripCoastView().getElement(), 'beforeend');
render(pageNav, new SiteMenuView().getElement(), RENDER_POSITION.BEFOREEND);
render(tripFilters, new FilterView(filters).getElement(), 'beforeend');
renderPointsList(mainContent, mockPoints);
