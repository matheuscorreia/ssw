import * as mathUtils from './utils/math.js';

class CelestialBody {

  /**
   * @constructor
   * @param {object} props
   * @param {number} radius - Radius of the body in meters.
   * @param {number} density - Density of the body in kilograms per cubic meter.
   */
  constructor(props) {
    this.radius = props.radius;
    this.density = props.density;

    this.volume = mathUtils.getSphereVolume(this.radius);
    this.mass = mathUtils.getMass(this.density, this.volume)
  }
}

export default CelestialBody;