import * as mathUtils from './math';

// Glossary:
// t = number of centures since J2000 Epoch
//
// "_c" means the element's value at J2000 Epoch
// "_r" means the element's rate of change per century
//
// a = semi major axis
// e = eccentricity
// i = inclination
// l = mean longitude
// w = perihelion longitude
// o = ascending node longitude
// m = mean anomaly
// ea = eccentric anomaly
// ta = true anomaly
// r = radius vector

const getEccentricAnomaly = (e: number, m: number, dp: number): number => {
    // arguments:
    // dp = number of decimal places

    const pi = Math.PI
    const K = pi / 180.0;
    const maxIterations = 30;
    const delta = Math.pow(10, -dp);
    let E, F;
    let i = 0;

    m = m / 360.0;
    m = 2.0 * pi * (m - Math.floor(m));

    if (e < 0.8) {
        E = m;
    } else {
        E = pi
    };

    F = E - e * Math.sin(m) - m;

    while ((Math.abs(F) > delta) && (i < maxIterations)) {
        E = E - F / (1.0 - e * Math.cos(E));
        F = E - e * Math.sin(E) - m;
        i = i + 1;
    }

    E = E / K;

    return Math.round(E * Math.pow(10, dp)) / Math.pow(10, dp);
}

// https://ssd.jpl.nasa.gov/planets/approx_pos.html#tables
export const calculateOrbitElementsInTime = (
    t: number,
    ac: number,
    ar: number,
    ec: number,
    er: number,
    ic: number,
    ir: number,
    lc: number,
    lr: number,
    wc: number,
    wr: number,
    oc: number,
    or: number
) => {
    const a = ac + (ar * t);

    const e = ec + (er * t);

    const i = (ic + (ir * t)) % 360;

    const o = (oc + (or * t)) % 360;

    let w = (wc + (wr * t)) % 360;
    w = w < 0 ? w + 360 : w;

    let l = (lc + (lr * t)) % 360;
    w = w < 0 ? w + 360 : w;

    let m = l - w;
    m = m < 0 ? m + 360 : m;

    const ea = getEccentricAnomaly(e, m, 6);

    const taArg = Math.sqrt((1 + e) / (1 - e)) * Math.tan(mathUtils.toRadians(ea) / 2);

    let K = Math.PI / 180.0; // Radian converter variable
    let ta;
    if (ta < 0) {
        ta = 2 * Math.atan(taArg) / K + 180; // ATAN = ARCTAN = INVERSE TAN
    }
    else {
        ta = 2 * Math.atan(taArg) / K
    }

    return {
        a,
        e,
        i,
        l,
        w,
        o,
        m,
        ea,
        ta,
    };
}

export const getHeliocentricCoordinates = (
    a: number,
    e: number,
    i: number,
    w: number,
    o: number,
    ea: number,
    ta: number
) => {
    // calculate radius vector
    const r = a * (1 - (e * (Math.cos(mathUtils.toRadians(ea)))));

    const x = r * (Math.cos(mathUtils.toRadians(o)) * Math.cos(mathUtils.toRadians(ta + w - o)) - Math.sin(mathUtils.toRadians(o)) * Math.sin(mathUtils.toRadians(ta + w - o)) * Math.cos(mathUtils.toRadians(i)));
    const y = r * (Math.sin(mathUtils.toRadians(o)) * Math.cos(mathUtils.toRadians(ta + w - o)) + Math.cos(mathUtils.toRadians(o)) * Math.sin(mathUtils.toRadians(ta + w - o)) * Math.cos(mathUtils.toRadians(i)));
    const z = r * Math.sin(mathUtils.toRadians(ta + w - o)) * Math.sin(mathUtils.toRadians(i));

    return [x, y, z]
}
