import TripInfoView from '../view/trip-info.js';
import PointsListView from '../view/points-list.js';
import LoadingView from '../view/loading.js';
import SortingView from '../view/sorting.js';
import TripCoastView from '../view/trip-coast.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import NoPointsView from '../view/no-points.js';
import {render, RENDER_POSITION, remove} from '../utilities/render.js';
import {sortByDay, sortByTime, sortByPrice} from '../utilities/point.js';
import {SORT_TYPE, USER_ACTION, UPDATE_TYPE} from '../constants.js';
import {filter} from '../utilities/filter.js';

export default class Trip {
  constructor(tripContainer, pointsListContainer, pointsModel, filterModel, offers, destinationsSet, api) {
    this._tripContainer = tripContainer;
    this._pointsListContainer = pointsListContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenter = {};
    this._currentSortType = SORT_TYPE.DAY;
    this._offers = offers;
    this._destinationsSet = destinationsSet;
    this._isLoading = true;
    this._api = api;

    this._sortComponent = null;
    this._tripInfoComponent = new TripInfoView();
    this._pointsListComponent = new PointsListView();
    this._tripCoastComponent = new TripCoastView();
    this._noPointsComponent = new NoPointsView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointsListComponent, this._handleViewAction, offers, destinationsSet);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._renderTrip();
  }

  destroy() {
    this._clearPoints({resetSortType: true});

    remove(this._pointsListComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._pointNewPresenter.init(callback);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filtredPoints = filter[filterType](points);
    switch (this._currentSortType) {
      case SORT_TYPE.DAY:
        return filtredPoints.sort(sortByDay);
      case SORT_TYPE.TIME:
        return filtredPoints.sort(sortByTime);
      case SORT_TYPE.PRICE:
        return filtredPoints.sort(sortByPrice);
    }

    return filtredPoints;
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case USER_ACTION.UPDATE_OFFER:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case USER_ACTION.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case USER_ACTION.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case USER_ACTION.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UPDATE_TYPE.MINOR:
        this._clearPoints();
        this._renderPoints();
        break;
      case UPDATE_TYPE.MAJOR:
        this._clearPoints({resetSortType: true});
        this._renderPoints();
        break;
      case UPDATE_TYPE.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object.values(this._pointPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearPoints();
    this._renderPoints();
  }

  _renderTripInfo() {
    render(this._tripContainer, this._tripInfoComponent, RENDER_POSITION.AFTERBEGIN);
  }

  _renderTripCoast() {
    render(this._tripInfoComponent, this._tripCoastComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderSorting(points) {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingView(points, this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._pointsListComponent, this._sortComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleViewAction, this._handleModeChange, this._offers, this._destinationsSet);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _clearPoints({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noPointsComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.DEFAULT;
    }
  }

  _renderPoints() {
    const points = this._getPoints().slice();
    this._renderSorting(points);
    render(this._pointsListContainer, this._pointsListComponent, RENDER_POSITION.BEFOREEND);
    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderLoading() {
    render(this._pointsListContainer, this._loadingComponent, RENDER_POSITION.AFTERBEGIN);
  }

  _renderNoPoints() {
    render(this._pointsListContainer, this._noPointsComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (this._getPoints().length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderTripInfo();
    this._renderTripCoast();
    this._renderPoints();
  }
}
