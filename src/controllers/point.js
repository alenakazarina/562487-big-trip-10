import {render, replace} from '../utils/render';
import EventComponent from '../components/event';
import EditEventComponent from '../components/edit-event-form';
import {Mode} from '../const';

class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._event = null;
    this._mode = Mode.DEFAULT;

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

  _onEscKeyPress(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      this._showEvent();
    }
  }

  _showEvent() {
    this._editEventComponent.reset();
    this._replaceFormToEvent();
    document.removeEventListener(`keydown`, this._onEscKeyPress);
    this._mode = Mode.DEFAULT;
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
