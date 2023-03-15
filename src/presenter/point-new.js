import EditPointView from '../view/edit-point.js';
import {remove, render, RENDER_POSITION} from '../utilities/render.js';
import {USER_ACTION, UPDATE_TYPE} from '../constants.js';

const BLANK_POINT = {
  type: '',
  destination: '',
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  offers: [],
  information: {
    description: '',
    photos: [],
  },
  isNewPoint: true,
  isFavorite: false,
};

export default class PointNew {
  constructor(pointsListContainer, pointListComponent, changeData, offers, destinationsSet) {
    this._pointsListContainer = pointsListContainer;
    this._pointListComponent = pointListComponent;
    this._changeData = changeData;
    this._offers = offers;
    this._destinationsSet = destinationsSet;

    this._pointEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new EditPointView(BLANK_POINT, this._offers, this._destinationsSet);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditComponent.setFormCloseHandler(this._handleDeleteClick);
    render(this._pointsListContainer, this._pointListComponent, RENDER_POSITION.AFTERBEGIN);
    render(this._pointListComponent, this._pointEditComponent, RENDER_POSITION.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._pointEditComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  }

  _handleFormSubmit(point) {
    this._changeData(
      USER_ACTION.ADD_POINT,
      UPDATE_TYPE.MINOR,
      point,
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
