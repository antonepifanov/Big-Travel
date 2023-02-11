import TripInfoView from '../view/trip-info.js';
import PointsListView from '../view/points-list.js';
import SortingView from '../view/sorting.js';
import TripCoastView from '../view/trip-coast.js';
import PointPresenter from './point.js';
import NoPointsView from '../view/no-points.js';
import {render, RENDER_POSITION} from '../utilities/render.js';
import {updateItem} from '../utilities/common.js';
import {sortByDay, sortByTime, sortByPrice} from '../utilities/point.js';
import {SORT_TYPE} from '../constants.js';

export default class Trip {
  constructor(tripContainer, pointsListContainer, sorting) {
    this._tripContainer = tripContainer;
    this._pointsListContainer = pointsListContainer;
    this._pointPresenter = {};
    this._currentSortType = SORT_TYPE.DEFAULT;

    this._tripInfoComponent = new TripInfoView();
    this._pointsListComponent = new PointsListView();
    this._sortingComponent = new SortingView(sorting);
    this._tripCoastComponent = new TripCoastView();
    this._noPointsComponent = new NoPointsView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(tripPoints) {
    this._tripPoints = tripPoints.slice().sort(sortByDay);
    this._sourcedTripPoints = tripPoints.slice();

    this._renderTrip();
  }

  _handlePointChange(updatedPoint) {
    this._tripPoints = updateItem(this._tripPoints, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint);
    this._sourcedTripPoints = updateItem(this._sourcedTripPoints, updatedPoint);
  }

  _handleModeChange() {
    Object.values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SORT_TYPE.DAY:
        this._tripPoints.sort(sortByDay);
        break;
      case SORT_TYPE.TIME:
        this._tripPoints.sort(sortByTime).reverse();
        break;
      case SORT_TYPE.PRICE:
        this._tripPoints.sort(sortByPrice).reverse();
        break;
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointsList();
    this._renderPoints();
  }

  _renderTripInfo() {
    render(this._tripContainer, this._tripInfoComponent, RENDER_POSITION.AFTERBEGIN);
  }

  _renderTripCoast() {
    render(this._tripInfoComponent, this._tripCoastComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderSorting() {
    render(this._pointsListComponent, this._sortingComponent, RENDER_POSITION.BEFOREEND);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handlePointChange, this._handleModeChange);
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
