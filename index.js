import * as renderUtils from './src/utils/render.js';
import planets from './src/planets-info.js';
import CelestialBody from './src/CelestialBody.js';
import Canvas from './src/Canvas.js';

const WINDOW_HEIGHT = window.innerHeight;
const WINDOW_WIDTH = window.innerWidth;

const canvas = new Canvas('#main-stage')

const sun = new CelestialBody({
  radius: planets.sun.radius,
  density: planets.sun.density,
})

function resizeStage() {
  var container = document.querySelector('#stage-container');

  // now we need to fit stage into parent container
  var containerWidth = container.offsetWidth;

  // but we also make the full scene visible
  // so we need to scale all objects on canvas
  var scale = containerWidth / WINDOW_WIDTH;

  stage.width(WINDOW_WIDTH * scale);
  stage.height(WINDOW_HEIGHT * scale);
  stage.scale({ x: scale, y: scale });

  stage.clear()
}

resizeStage();
// adapt the stage on any window resize
window.addEventListener('resize', resizeStage);

