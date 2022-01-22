import CelestialBody from "./entities/CelestialBody";
import Stage, { SolarSystemScaleOptions } from "./entities/render/Stage";
import solarSystem from './utils/solar-system.json';

const stage = new Stage('main-stage', {
    solarSystemScale: SolarSystemScaleOptions.LINEAR,
});

stage.add(new CelestialBody(solarSystem.sun));
stage.add(new CelestialBody(solarSystem.mercury));
stage.add(new CelestialBody(solarSystem.venus));
stage.add(new CelestialBody(solarSystem.earth));
stage.add(new CelestialBody(solarSystem.mars));
stage.add(new CelestialBody(solarSystem.jupiter));
stage.add(new CelestialBody(solarSystem.saturn));
stage.add(new CelestialBody(solarSystem.uranus));
stage.add(new CelestialBody(solarSystem.neptune));

stage.init();

