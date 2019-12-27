import Point from './models/point';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw Error(`${response.status}: ${response.statusText}`);
};

class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorizatioin = authorization;
  }

  getTasks() {
    return this._load({url: `points`})
              .then((response) => response.json())
              .then(Point.parsePoints);
  }

  createTask() {

  }

  updateTask() {

  }

  deleteTask() {

  }

  _load(url, method = Method.GET, body = null, headers = new Headers()) {
    headers.append(`Authorization`, this._authorizatioin);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}

export default API;
