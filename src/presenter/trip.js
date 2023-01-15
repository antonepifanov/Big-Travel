import TripInfoView from '../view/trip-info.js';
import PointsListView from '../view/points-list.js';
import SortingView from '../view/sorting.js';
import TripCoastView from '../view/trip-coast.js';
import PointPresenter from './point.js';
import NoPointsView from '../view/no-points.js';
import {render, RENDER_POSITION} from '../utilities/render.js';
import {updateItem} from '../utilities/common.js';

export default class Trip {
  constructor(tripContainer, pointsListContainer, sorting) {
    this._tripContainer = tripContainer;
    this._pointsListContainer = pointsListContainer;
    this._pointPresenter = {};
    this._tripInfoComponent = new TripInfoView();
    this._pointsListComponent = new PointsListView();
    this._sortingComponent = new SortingView(sorting);
    this._tripCoastComponent = new TripCoastView();
    this._noPointsComponent = new NoPointsView();

    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice();

    this._renderTrip();
  }

  _handleTaskChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
  }

  _handleModeChange() {
    Object.values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
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
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleTaskChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _clearPointsList() {
    Object.values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
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
