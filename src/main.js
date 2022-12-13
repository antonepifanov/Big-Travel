import {render, RENDER_POSITION, replace} from './utilities/render.js';
import {getRandomInteger} from './utilities/common.js';
import AbstractView from './view/abstract.js';
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

const pointListComponent = new PointsListView();
const tripInfoComponent = new TripInfoView();

const renderPoint = (pointListElement, point) => {
  if (pointListElement instanceof AbstractView) {
    pointListElement = pointListElement.getElement();
  }

  const pointComponent = new PointView(point);
  const pointEditComponent = new EditPointView(point);

  const replaceCardToForm = () => {
    replace(pointEditComponent, pointComponent);
  };

  const replaceFormToCard = () => {
    replace(pointComponent, pointEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const onSubmitButtonClick = () => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
    pointEditComponent.removeFormCloseHandler();
    pointEditComponent.removeFormSubmitHandler();
  };

  function onRollupButtonCloseForm() {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
    pointEditComponent.removeFormCloseHandler();
    pointEditComponent.removeFormSubmitHandler();
  }

  const onRollupButtonOpenForm = () => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
    pointEditComponent.setFormCloseHandler(onRollupButtonCloseForm);
    pointEditComponent.setFormSubmitHandler(onSubmitButtonClick);
  };

  pointComponent.setFormOpenHandler(onRollupButtonOpenForm);

  render(pointListElement, pointComponent, RENDER_POSITION.BEFOREEND);
};

const renderPointsList = (listContainer, points) => {
  if (points.length === 0) {
    render(listContainer, new NoPointsView(), RENDER_POSITION.BEFOREEND);
  } else {
    render(listContainer, new SortingView(sorting), RENDER_POSITION.BEFOREEND);
    render(listContainer, pointListComponent, RENDER_POSITION.BEFOREEND);

    points.forEach((point) => {
      renderPoint(pointListComponent, point);
    });
  }
};

render(tripMain, tripInfoComponent, RENDER_POSITION.AFTERBEGIN );
render(tripInfoComponent, new TripCoastView(), RENDER_POSITION.BEFOREEND);
render(pageNav, new SiteMenuView(), RENDER_POSITION.BEFOREEND);
render(tripFilters, new FilterView(filters), RENDER_POSITION.BEFOREEND);
renderPointsList(mainContent, mockPoints);
