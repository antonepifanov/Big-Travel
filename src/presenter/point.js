import EditPointView from '../view/edit-point.js';
import PointView from '../view/point.js';
import {render, RENDER_POSITION, replace, remove} from '../utilities/render.js';
import {USER_ACTION, UPDATE_TYPE} from '../constants.js';
import {isPriceChange, isDatesFromEqual, isDurationChange} from '../utilities/point.js';

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointsListContainer, changeData, changeMode, offers, destinationsSet) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = MODE.DEFAULT;
    this._offers = offers;
    this._destinationsSet = destinationsSet;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._onRollupButtonCloseForm = this._onRollupButtonCloseForm.bind(this);
    this._onRollupButtonOpenForm = this._onRollupButtonOpenForm.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;
    this._pointComponent = new PointView(point);
    this._editPointComponent = new EditPointView(point, this._offers, this._destinationsSet);
    this._editPointComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointComponent.setFormOpenHandler(this._onRollupButtonOpenForm);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this._pointsListContainer, this._pointComponent, RENDER_POSITION.BEFOREEND);
      return;
    }

    if (this._mode === MODE.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === MODE.EDITING) {
      replace(this._editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._editPointComponent);
  }

  resetView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceFormToCard();
    }
  }

  _replaceCardToForm () {
    replace(this._editPointComponent, this._pointComponent);
    this._changeMode();
    this._mode = MODE.EDITING;
  }

  _replaceFormToCard() {
    replace(this._pointComponent, this._editPointComponent);
    this._mode = MODE.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
      this._replaceFormToCard();
    }
  }

  _handleFormSubmit(update) {
    const isMinorUpdate =
      !isDatesFromEqual(this._point.dateFrom, update.dateFrom) ||
      isPriceChange(this._point.basePrice, update.basePrice) ||
      isDurationChange(this._point.dateFrom, this._point.dateTo, update.dateFrom, update.dateTo);
    this._changeData(
      USER_ACTION.UPDATE_POINT,
      isMinorUpdate ? UPDATE_TYPE.MINOR : UPDATE_TYPE.PATCH,
      update);
    this._replaceFormToCard();
  }

  _handleDeleteClick(point) {
    this._changeData(
      USER_ACTION.DELETE_POINT,
      UPDATE_TYPE.MINOR,
      point,
    );
  }

  _onRollupButtonCloseForm() {
    this._editPointComponent.reset(this._point);
    this._replaceFormToCard();
  }

  _onRollupButtonOpenForm() {
    this._replaceCardToForm();
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._editPointComponent.setFormCloseHandler(this._onRollupButtonCloseForm);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
  }

  _handleFavoriteClick() {
    this._changeData(
      USER_ACTION.UPDATE_POINT,
      UPDATE_TYPE.MINOR,
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }
}
