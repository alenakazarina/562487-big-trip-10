import {render, replace} from '../utils/render';
import EventComponent from '../components/event';
import EditEventComponent from '../components/edit-event-form';
import {Mode} from '../const';
import {remove} from '../utils/render';

class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._event = null;
    this._mode = Mode.VIEW;

    this._container = container;
    this._eventComponent = null;
    this._editEventComponent = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._onEscKeyPress = this._onEscKeyPress.bind(this);
  }

  render(event) {
    this._event = event;

    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EditEventComponent(event);

    this._eventComponent.setClickHandler(() => this._showEditForm());

    this._editEventComponent.setCloseButtonClickHandler(() => {
      this._editEventComponent.reset();
      this._showEvent();
    });

    this._editEventComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._event, this._editEventComponent._event);
      this.setDefaultView();
    });

    this._editEventComponent.setDeleteClickHandler(() => {
      this._onDataChange(this, this._event, null);
    });

    if (oldEventComponent && oldEditEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._editEventComponent, oldEditEventComponent);
    } else {
      render(this._container, this._eventComponent.getElement());
    }
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this._showEvent();
    }
  }

  disableOpenButton() {
    this._eventComponent.getElement().querySelector(`.event__rollup-btn`).disabled = true;
  }

  enableOpenButton() {
    this._container.querySelector(`.event__rollup-btn`).disabled = false;
  }

  getContainer() {
    return this._container;
  }

  destroy() {
    remove(this._editEventComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyPress(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._showEvent();
    }
  }

  _showEvent() {
    this._editEventComponent.reset();
    this._replaceFormToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyPress);
    this._mode = Mode.VIEW;
  }

  _showEditForm() {
    this._onViewChange();
    this._replaceEventToForm();
    document.addEventListener(`keydown`, this._onEscKeyPress);
    this._mode = Mode.EDIT;
  }

  _replaceFormToEvent() {
    replace(this._eventComponent, this._editEventComponent);
  }

  _replaceEventToForm() {
    replace(this._editEventComponent, this._eventComponent);
  }
}

export default PointController;
