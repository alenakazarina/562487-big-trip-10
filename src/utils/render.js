const RenderPositions = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstElementChild;
};

const render = (container, element, place = RenderPositions.BEFOREEND) => {
  switch (place) {
    case RenderPositions.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPositions.BEFOREEND:
      container.append(element);
      break;
  }
};

const replace = (newComponent, oldComponent) => {
  if (!newComponent) {
    throw new Error(`Please, send new component as argument`);

  } else if (!oldComponent) {
    throw new Error(`Please, send old component as argument`);

  } else {
    const newElement = newComponent.getElement();
    const oldElement = oldComponent.getElement();
    const parentElement = oldElement.parentElement;

    if (parentElement) {
      parentElement.replaceChild(newElement, oldElement);
    }
  }
};

export {
  RenderPositions,
  createElement,
  render,
  replace
};
