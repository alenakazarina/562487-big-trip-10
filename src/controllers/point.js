import {render, replace} from '../utils/render';
import EventComponent from '../components/event';
import EditEventComponent from '../components/edit-event-form';
import {ERROR_CLASS, Mode} from '../const';
import {remove} from '../utils/render';
import PointModel from '../models/point';

const SHAKE_ANIMATION_TIMEOUT = 600;

const getDefaultEvent = (newEventId) => {
  return ({
    id: newEventId,
    type: `sightseeing`,
    startDate: new Date(),
    endDate: new Date(),
    destination: {
      name: ``,
      description: ``,
      offers: []
    },
    price: 0,
    offers: [],
    isFavorite: false
  });
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

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._onEscKeyPress = this._onEscKeyPress.bind(this);
  }

  render(id, event, destinations, offers, mode) {
    this._mode = mode;
    if (this._mode === Mode.ADD) {
      this._event = getDefaultEvent(id);
      this._addEventFormComponent = new EditEventComponent(this._event, destinations, offers, Mode.ADD);

      this._setAddEventFormHandlers();

      this._container.insertBefore(this._addEventFormComponent.getElement(this._event), this._container.lastElementChild);
      return;
    }

    this._event = event;
    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EditEventComponent(event, destinations, offers, Mode.EDIT);

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

  setOpenButton(value) {
    this._eventComponent.getElement().querySelector(`.event__rollup-btn`).disabled = value;
  }

  getContainer() {
    return this._container;
  }

  destroy() {
    if (this._mode === Mode.EDIT) {
      remove(this._editEventComponent);
      remove(this._eventComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }

    if (this._mode === Mode.ADD) {
      remove(this._addEventFormComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  shake() {
    const form = this._mode === Mode.ADD ? this._addEventFormComponent : this._editEventComponent;
    form.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      form.getElement().style.animation = ``;
      form.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
      form.getElement().classList.add(ERROR_CLASS);
      form.setDisabled(false);
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  removeDisabledState() {
    const form = this._mode === Mode.ADD ? this._addEventFormComponent : this._editEventComponent;
    form.setDisabled(false);
  }

  _onEscKeyPress(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      if (this._mode === Mode.ADD) {
        this._onViewChange();
        remove(this._addEventFormComponent);
        document.removeEventListener(`keydown`, this._onEscKeyPress);
        return;
      }
      this._replaceFormToEvent();
    }
  }

  _replaceFormToEvent() {
    this._editEventComponent.reset();
    replace(this._eventComponent, this._editEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyPress);
    this._mode = Mode.VIEW;
  }

  _replaceEventToForm() {
    this._onViewChange();
    replace(this._editEventComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyPress);
    this._mode = Mode.EDIT;
  }

  _setHandlers() {
    this._eventComponent.setClickHandler(() => this._replaceEventToForm());

    this._editEventComponent.setCloseButtonClickHandler(() => {
      this._editEventComponent.reset();
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
      document.removeEventListener(`keydown`, this._onEscKeyPress);
      this._onDataChange(this, this._event, null);
    });
  }

  _setAddEventFormHandlers() {
    this._addEventFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._addEventFormComponent.getFormData();
      const formData = parseFormData(data);
      document.removeEventListener(`keydown`, this._onEscKeyPress);
      this._addEventFormComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._onDataChange(this, null, formData);
    });
    this._addEventFormComponent.setDeleteClickHandler(() => {
      document.removeEventListener(`keydown`, this._onEscKeyPress);
      this._onViewChange();
    });
    document.addEventListener(`keydown`, this._onEscKeyPress);
  }
}

export default PointController;
