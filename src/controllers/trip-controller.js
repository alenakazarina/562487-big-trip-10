import SortComponent, {SortTypes} from '../components/sort';
import TripDaysListComponent from '../components/trip-days-list';
import TripDayComponent from '../components/trip-day';
import EventComponent from '../components/event';
import EditEventFormComponent from '../components/edit-event-form';
import NoPointsComponent from '../components/no-points';
import {render, replace} from '../utils/render';

const renderEvent = (event, container) => {
  const eventComponent = new EventComponent(event);
  const editEventComponent = new EditEventFormComponent(event);

  const replaceFormToEvent = () => {
    replace(eventComponent, editEventComponent);
    document.removeEventListener(`keydown`, onEscKeyPress);
  };

  const onEscKeyPress = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      replace(eventComponent, editEventComponent);
    }
  };

  const replaceEventToForm = () => {
    replace(editEventComponent, eventComponent);
    document.addEventListener(`keydown`, onEscKeyPress);
  };

  eventComponent.setClickListener(replaceEventToForm);

  editEventComponent.setClickListener(replaceFormToEvent);
  editEventComponent.setSubmitListener((evt) => {
    evt.preventDefault();
    replaceFormToEvent();
  });

  render(container, eventComponent.getElement());
};

const renderEvents = (events, container) => {
  events.forEach((event) => {
    renderEvent(event, container);
  });
};

const renderTripDays = (container, eventsDates, events) => {
  eventsDates.forEach((day, i) => {
    const dayEvents = events.filter((event) => event.startDate === day);
    const tripDayComponent = new TripDayComponent(day, dayEvents, i);

    render(container, tripDayComponent.getElement());
    renderEvents(dayEvents, tripDayComponent.getElement().children[1]);
  });
};

class TripController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
    this._tripDaysListComponent = new TripDaysListComponent();
    this._noPointsComponent = new NoPointsComponent();
    this._tripDayComponent = new TripDayComponent();
  }

  render(events) {
    const eventsDates = events.map((event) => event.startDate)
      .filter((date, i, arr) => arr.slice(i + 1, arr.length).every((it) => it !== date));

    if (!events.length) {
      render(this._container, this._noPointsComponent.getElement());

    } else {
      const tripDaysListElement = this._tripDaysListComponent.getElement();

      this._sortComponent.setChangeSortOrderClickListener((sortType) => {
        const sortedEvents = Object.values(SortTypes).filter((it) => it.id === sortType)[0].sortFn(events);
        tripDaysListElement.innerHTML = ``;

        if (sortType !== `event`) {
          this._sortComponent.getElement().children[0].innerHTML = ``;
          for (let child of this._tripDayComponent.getElement().children) {
            child.innerHTML = ``;
          }
          render(tripDaysListElement, this._tripDayComponent.getElement());
          renderEvents(sortedEvents, this._tripDayComponent.getElement().children[1]);

        } else {
          this._sortComponent.getElement().children[0].innerHTML = `Day`;
          renderTripDays(tripDaysListElement, eventsDates, sortedEvents);
        }
      });

      render(this._container, this._sortComponent.getElement());
      render(this._container, tripDaysListElement);
      renderTripDays(tripDaysListElement, eventsDates, events);
    }
  }
}

export default TripController;
