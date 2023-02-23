import FilterView from '../view/trip-filters.js';
import {render, RENDER_POSITION, replace, remove} from '../utilities/render.js';
import {filter} from '../utilities/filter.js';
import {FILTER_TYPE, UPDATE_TYPE} from '../constants.js';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RENDER_POSITION.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UPDATE_TYPE.MAJOR, filterType);
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();

    return [
      {
        type: FILTER_TYPE.EVERYTHING,
        name: 'Everything',
        count: filter[FILTER_TYPE.EVERYTHING](points).length,
      },
      {
        type: FILTER_TYPE.FUTURE,
        name: 'Future',
        count: filter[FILTER_TYPE.FUTURE](points).length,
      },
      {
        type: FILTER_TYPE.PAST,
        name: 'Past',
        count: filter[FILTER_TYPE.PAST](points).length,
      },
    ];
  }
}
