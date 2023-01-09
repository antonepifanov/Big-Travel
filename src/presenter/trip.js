import TripInfoView from '../view/trip-info.js';
import PointsListView from '../view/points-list.js';
import SortingView from '../view/sorting.js';
import TripCoastView from '../view/trip-coast.js';
import EditPointView from '../view/edit-point.js';
import PointView from '../view/point.js';
import NoPointsView from '../view/no-points.js';
import {render, RENDER_POSITION, replace} from '../utilities/render.js';

export default class Trip {
  constructor(tripContainer, pointsListContainer, sorting) {
    this._tripContainer = tripContainer;
    this._pointsListContainer = pointsListContainer;
    this._tripInfoComponent = new TripInfoView();
    this._pointsListComponent = new PointsListView();
    this._sortingComponent = new SortingView(sorting);
    this._tripCoastComponent = new TripCoastView();
    this._noPointsComponent = new NoPointsView();
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();

    this._renderTrip();
  }

  _renderTripInfo() {
    render(this._tripContainer, this._tripInfoComponent, RENDER_POSITION.AFTERBEGIN);
  }

  _renderTripCoast() {
    render(this._tripInfoComponent, this._tripCoastComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderSorting() {
    render(this._pointsListComponent, this._sortingComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderPoint(point) {
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

    render(this._pointsListComponent, pointComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderPoints() {
    render(this._pointsListContainer, this._pointsListComponent, RENDER_POSITION.BEFOREEND);
    this._tripPoints.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderNoPoints() {
    render(this._pointsListContainer, this._noPointsComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderTrip() {
    if (this._tripPoints.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderTripInfo();
    this._renderTripCoast();
    this._renderSorting();
    this._renderPoints();
  }
}
