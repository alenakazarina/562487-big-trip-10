import SortingComponent from '../components/sorting';
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

class TripController {
  constructor(container) {
    this._container = container;
    this._sorting = new SortingComponent();
    this._tripDaysList = new TripDaysListComponent();
    this._noPoints = new NoPointsComponent();
  }

  render(events) {
    const eventsDates = events.map((event) => event.startDate)
      .filter((date, i, arr) => arr.slice(i + 1, arr.length).every((it) => it !== date));

    if (!events.length) {
      render(this._container, this._noPoints.getElement());

    } else {
      render(this._container, this._sorting.getElement());
      render(this._container, this._tripDaysList.getElement());

      eventsDates.forEach((day, i) => {
        const dayEvents = events.filter((event) => event.startDate === day);

        const tripDayComponent = new TripDayComponent(day, dayEvents, i);
        render(this._tripDaysList.getElement(), tripDayComponent.getElement());
        renderEvents(dayEvents, tripDayComponent.getElement().children[1]);
      });
    }
  }
}

export default TripController;
