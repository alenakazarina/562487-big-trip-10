import {render, replace} from '../utils/render';
import EventComponent from '../components/event';
import EditEventComponent from '../components/edit-event-form';
import {debounce} from '../components/debounce';
import {ERROR_CLASS, Mode} from '../const';
import {remove} from '../utils/render';
import PointModel from '../models/point';

const SHAKE_ANIMATION_TIMEOUT = 600;
const DEBOUNCE_TIMEOUT = 500;

const getDefaultEvent = () => {
  return {
    id: Date.now(),
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
  };
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
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  getContainer() {
    return this._container;
  }

  render(event, destinations, offers, mode) {
    this._mode = mode;
    if (this._mode === Mode.ADD) {
      this._event = getDefaultEvent();
      this._addEventFormComponent = new EditEventComponent(this._event, destinations, offers, Mode.ADD);
      this._setAddEventFormHandlers();
      document.addEventListener(`keydown`, this._onEscKeyDown);
      this._container.insertBefore(this._addEventFormComponent.getElement(), this._container.lastElementChild);
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

  setFavoriteButtonDisabled(isDisabled) {
    this._editEventComponent.getElement().querySelector(`.event__favorite-checkbox `).disabled = isDisabled;
  }

  removeEscListener() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceFormToEvent() {
    this._editEventComponent.reset();
    replace(this._eventComponent, this._editEventComponent);
    this.removeEscListener();
    this._mode = Mode.VIEW;
  }

  _replaceEventToForm() {
    this._onViewChange();
    replace(this._editEventComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._onEscKeyDown);
    this._mode = Mode.EDIT;
  }

  _setHandlers() {
    this._eventComponent.setClickHandler(() => this._replaceEventToForm());

    this._editEventComponent.setFavoriteButtonClickHandler(() => {
      debounce(() => {
        const data = this._editEventComponent.getFormData();
        const formData = parseFormData(data);
        this._onDataChange(this, this._event, formData, true);
      }, DEBOUNCE_TIMEOUT)();

    });

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
