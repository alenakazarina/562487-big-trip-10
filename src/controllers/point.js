import {render, replace, RenderPositions} from '../utils/render';
import EventComponent from '../components/event';
import EditEventComponent from '../components/edit-event-form';
import {debounce} from '../components/debounce';
import {ERROR_CLASS, Mode} from '../const';
import {remove} from '../utils/render';
import PointModel from '../models/point';

const Timeout = {
  SHAKE_ANIMATION: 600,
  DEBOUNCE: 500
};

const parseFormData = (formData) => {
  return new PointModel({
    'id': formData.id,
    'type': formData.type,
    'date_from': formData.startDate,
    'date_to': formData.endDate,
    'destination': formData.destination,
    'base_price': formData.price,
    'offers': formData.offers,
    'is_favorite': formData.isFavorite
  });
};

class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._event = null;
    this._mode = Mode.VIEW;
    this._container = container;
    this._eventComponent = null;
    this._editEventComponent = null;
    this._addEventFormComponent = null;
    this._formComponent = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  getContainer() {
    return this._container;
  }

  render(event, destinations, offers, mode) {
    this._mode = mode;
    this._event = event;

    if (this._mode === Mode.ADD) {
      this._addEventFormComponent = new EditEventComponent(this._event, destinations, offers, Mode.ADD);
      this._formComponent = this._addEventFormComponent;
      this._setAddEventFormHandlers();
      document.addEventListener(`keydown`, this._onEscKeyDown);
      render(this._container, this._addEventFormComponent.getElement(), RenderPositions.BEFORELASTCHILD);
      this._addEventFormComponent.applyFlatpickr();
      return;
    }

    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EditEventComponent(event, destinations, offers, Mode.EDIT);
    this._formComponent = this._editEventComponent;

    this._setHandlers();

    if (oldEventComponent && oldEditEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._editEventComponent, oldEditEventComponent);
    } else {
      render(this._container, this._eventComponent.getElement());
    }
  }

  setDefaultView() {
    if (this._mode === Mode.EDIT) {
      this._replaceFormToEvent();
    }
  }

  destroy() {
    this.removeEscListener();
    if (this._mode === Mode.ADD) {
      this._addEventFormComponent.removeFlatpickr();
      remove(this._addEventFormComponent);
      return;
    }
    this._editEventComponent.removeFlatpickr();
    remove(this._editEventComponent);
    remove(this._eventComponent);
  }

  shake() {
    this._formComponent.getElement().style.animation = `shake ${Timeout.SHAKE_ANIMATION / 1000}s`;

    setTimeout(() => {
      this._formComponent.getElement().style.animation = ``;
      this._formComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
      this._formComponent.getElement().classList.add(ERROR_CLASS);
      this._formComponent.setDisabled(false);
    }, Timeout.SHAKE_ANIMATION);
  }

  removeEscListener() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceFormToEvent() {
    this._editEventComponent.reset();
    replace(this._eventComponent, this._editEventComponent);
    this.removeEscListener();
    this._mode = Mode.VIEW;
    this._editEventComponent.removeFlatpickr();
  }

  _replaceEventToForm() {
    this._onViewChange();
    replace(this._editEventComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.EDIT;
    this._editEventComponent.applyFlatpickr();
  }

  _setHandlers() {
    this._eventComponent.setClickHandler(() => this._replaceEventToForm());

    this._editEventComponent.setFavoriteButtonClickHandler(() => {
      debounce(() => {
        const formData = this._editEventComponent.getFormData();
        const updatedEvent = Object.assign({}, this._event, {isFavorite: formData.isFavorite});
        this._onDataChange(this, this._event, parseFormData(updatedEvent), true);
        this._editEventComponent.rerender();
      }, Timeout.DEBOUNCE)();
    });

    this._editEventComponent.setCloseButtonClickHandler(() => {
      this._replaceFormToEvent();
    });

    this._editEventComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._editEventComponent.getFormData();
      const formData = parseFormData(data);
      this._editEventComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._onDataChange(this, this._event, formData);
    });

    this._editEventComponent.setDeleteClickHandler(() => {
      this._editEventComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this.removeEscListener();
      this._onDataChange(this, this._event, null);
    });
  }

  _setAddEventFormHandlers() {
    this._addEventFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._addEventFormComponent.getFormData();
      const formData = parseFormData(data);
      this._addEventFormComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._onDataChange(this, null, formData);
    });

    this._addEventFormComponent.setDeleteClickHandler(() => {
      this._onViewChange();
    });
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (this._mode === Mode.ADD) {
        this._onViewChange();
        return;
      }
      this._replaceFormToEvent();
    }
  }
}

export default PointController;
