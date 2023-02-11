import EditPointView from '../view/edit-point.js';
import PointView from '../view/point.js';
import {render, RENDER_POSITION, replace, remove} from '../utilities/render.js';

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointsListContainer, changeData, changeMode) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = MODE.DEFAULT;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._onRollupButtonCloseForm = this._onRollupButtonCloseForm.bind(this);
    this._onRollupButtonOpenForm = this._onRollupButtonOpenForm.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;
    const prevPointComponent = this._pointComponent;
    const prevEditPointComponent = this._editPointComponent;
    this._pointComponent = new PointView(point);
    this._editPointComponent = new EditPointView(point);
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

  _replaceFormToCard () {
    replace(this._pointComponent, this._editPointComponent);
    this._mode = MODE.DEFAULT;
  }

  _escKeyDownHandler (evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._editPointComponent.reset(this._point);
      this._replaceFormToCard();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleFormSubmit (point) {
    this._changeData(point);
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._editPointComponent.removeFormCloseHandler();
    this._editPointComponent.removeFormSubmitHandler();
  }

  _onRollupButtonCloseForm() {
    this._editPointComponent.reset(this._point);
    this._replaceFormToCard();
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._editPointComponent.removeFormCloseHandler();
    this._editPointComponent.removeFormSubmitHandler();
  }

  _onRollupButtonOpenForm () {
    this._replaceCardToForm();
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._editPointComponent.setFormCloseHandler(this._onRollupButtonCloseForm);
    this._editPointComponent.setFormSubmitHandler(this._handleFormSubmit);
  }

  _handleFavoriteClick() {
    this._changeData(
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
