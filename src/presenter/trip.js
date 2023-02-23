import TripInfoView from '../view/trip-info.js';
import PointsListView from '../view/points-list.js';
import SortingView from '../view/sorting.js';
import TripCoastView from '../view/trip-coast.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import NoPointsView from '../view/no-points.js';
import {render, RENDER_POSITION, remove} from '../utilities/render.js';
import {sortByDay, sortByTime, sortByPrice} from '../utilities/point.js';
import {SORT_TYPE, USER_ACTION, UPDATE_TYPE, FILTER_TYPE} from '../constants.js';
import {filter} from '../utilities/filter.js';

export default class Trip {
  constructor(tripContainer, pointsListContainer, sorting, pointsModel, filterModel) {
    this._tripContainer = tripContainer;
    this._pointsListContainer = pointsListContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._pointPresenter = {};
    this._sorting = sorting;
    this._currentSortType = SORT_TYPE.DAY;

    this._sortComponent = null;
    this._tripInfoComponent = new TripInfoView();
    this._pointsListComponent = new PointsListView();
    this._tripCoastComponent = new TripCoastView();
    this._noPointsComponent = new NoPointsView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._pointNewPresenter = new PointNewPresenter(this._pointsListComponent, this._handleViewAction);
  }

  init() {
    this._renderTrip();
  }

  createTask() {
    this._currentSortType = SORT_TYPE.DEFAULT;
    this._filterModel.setFilter(UPDATE_TYPE.MAJOR, FILTER_TYPE.EVERYTHING);
    this._pointNewPresenter.init();
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
      case USER_ACTION.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
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

  _renderSorting() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortingView(this._sorting, this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._pointsListComponent, this._sortComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleViewAction, this._handleModeChange);
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

    if (resetSortType) {
      this._currentSortType = SORT_TYPE.DEFAULT;
    }
  }

  _renderPoints() {
    this._renderSorting();
    render(this._pointsListContainer, this._pointsListComponent, RENDER_POSITION.BEFOREEND);
    const points = this._getPoints().slice();
    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderNoPoints() {
    render(this._pointsListContainer, this._noPointsComponent, RENDER_POSITION.BEFOREEND);
  }

  _renderTrip() {
    if (this._getPoints().length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderTripInfo();
    this._renderTripCoast();
    this._renderPoints();
  }
}
