import EditPointView from '../view/edit-point.js';
import {nanoid} from 'nanoid';
import {remove, render, RENDER_POSITION} from '../utilities/render.js';
import {USER_ACTION, UPDATE_TYPE} from '../constants.js';

const BLANK_POINT = {
  id: nanoid(4),
  type: '',
  destination: '',
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  offers: null,
  information: null,
  isNewPoint: true,
};

export default class PointNew {
  constructor(pointListContainer, changeData, offers, destinationsSet) {
    this._pointListContainer = pointListContainer;
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
    render(this._pointListContainer, this._pointEditComponent, RENDER_POSITION.AFTERBEGIN);

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

  _handleFormSubmit(point) {
    this._changeData(
      USER_ACTION.ADD_POINT,
      UPDATE_TYPE.MINOR,
      Object.assign(
        {},
        point,
        {
          id: nanoid(4),
          isNewPoint: false,
        },
      ),
    );
    this.destroy();
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
