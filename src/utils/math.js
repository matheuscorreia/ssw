/**
 * 
 * @param {number} radius - Radius in meters
 * @returns {number} Volume in cubic meters
 */
export const getSphereVolume = (radius) => {
  return (4 * Math.PI * radius^3) / 3;
}

/**
 * 
 * @param {number} density - density in kg/m³
 * @param {number} volume - volume in m³
 * @returns {number} mass in kg
 */
export const getMass = (density, volume) => {
  return volume * density;
}