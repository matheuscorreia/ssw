import { calculateOrbitElementsInTime } from '../utils/celestial-mechanics';
import { toRadians } from '../utils/math';
import * as renderUtils from '../utils/render';
import { Position, RenderProperties } from './types';

const ORBIT_SIZE_SCALE = 40;
// [0 -> 1] Defines how "warped" the ellipses will be shaped up until it becomes a perfect cicle while maintaing the ellipsis focal point offset
const ORBIT_ECCENTRICITY_SCALE = 0;

type KeplerianElements = {
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    meanLongitude: number;
    perihelionLongitude: number;
    ascendingNodeLongitude: number;
}

type CalculatedElements = {
    meanAnomaly: number;
    eccentricAnomaly: number;
    trueAnomaly: number;
}

interface OrbitalElements extends KeplerianElements { };
interface OrbitalElementsRates extends KeplerianElements { };
interface OrbitalElementsInTime extends KeplerianElements, CalculatedElements { };

interface OrbitCoordinates {
    centerX: number;
    centerY: number;
    focusX: number;
    focusY: number;
    radiusX: number;
    radiusY: number;
    orbiterX: number;
    orbiterY: number;
    rotation: number;
}

interface CelestialBodyConstructorArgs {
    name: string;
    radius: number;
    density: number;
    placement: number;
    orbitalElements?: OrbitalElements;
    orbitalElementsRates?: OrbitalElementsRates;
}

class CelestialBody {
    private pos: Position;
    private name: string;
    private radius: number;
    private density: number;
    private placement: number;
    private orbitalElements?: OrbitalElements;
    private orbitalElementsRates?: OrbitalElementsRates;

    private frameDelta: number;
    private orbitalElementsInTime?: OrbitalElementsInTime;
    private orbitCoordinates?: OrbitCoordinates;

    constructor({ name, radius, density, placement, orbitalElements, orbitalElementsRates }: CelestialBodyConstructorArgs) {
        this.pos = { x: 0, y: 0 };

        this.name = name;
        this.radius = radius;
        this.density = density;
        this.placement = placement;
        this.orbitalElements = orbitalElements;
        this.orbitalElementsRates = orbitalElementsRates;
    }

    clearCalculations() {
        this.orbitalElementsInTime = undefined;
        this.orbitCoordinates = undefined;
    }

    getOrbitElementsInTime(julianCenturiesFromEpoch: number): OrbitalElementsInTime {
        // If no orbit information, then it's a static body (The Sun)
        if (!this.orbitalElements || !this.orbitalElementsRates) {
            return;
        }

        if (this.orbitalElementsInTime) return this.orbitalElementsInTime;

        const t = julianCenturiesFromEpoch;

        const a = this.orbitalElements.semiMajorAxis;
        const ar = this.orbitalElementsRates.semiMajorAxis;

        const e = this.orbitalElements.eccentricity;
        const er = this.orbitalElementsRates.eccentricity;

        const i = this.orbitalElements.inclination;
        const ir = this.orbitalElementsRates.inclination;

        const l = this.orbitalElements.meanLongitude;
        const lr = this.orbitalElementsRates.meanLongitude;

        const w = this.orbitalElements.perihelionLongitude;
        const wr = this.orbitalElementsRates.perihelionLongitude;

        const o = this.orbitalElements.ascendingNodeLongitude;
        const or = this.orbitalElementsRates.ascendingNodeLongitude;

        const calculatedElements = calculateOrbitElementsInTime(t, a, ar, e, er, i, ir, l, lr, w, wr, o, or);

        this.orbitalElementsInTime = {
            semiMajorAxis: calculatedElements.a,
            eccentricity: calculatedElements.e,
            inclination: calculatedElements.i,
            meanLongitude: calculatedElements.l,
            perihelionLongitude: calculatedElements.w,
            ascendingNodeLongitude: calculatedElements.o,
            meanAnomaly: calculatedElements.m,
            eccentricAnomaly: calculatedElements.ea,
            trueAnomaly: calculatedElements.ta,
        }

        return this.orbitalElementsInTime;
    }

    getCoordinates(props: RenderProperties) {
        if (this.orbitCoordinates) return this.orbitCoordinates;

        const elements = this.getOrbitElementsInTime(props.t);
        if (!elements) return;

        let centerX;
        let centerY;
        let radiusX;
        let radiusY;
        let focusX;
        let focusY;
        let orbiterX;
        let orbiterY;
        let rotation;

        const { semiMajorAxis, eccentricity, perihelionLongitude, meanLongitude } = elements;
        const semiMinorAxis = semiMajorAxis * (1 - eccentricity);

        const radiusDiff = semiMajorAxis - semiMinorAxis;
        radiusX = this.placement * ORBIT_SIZE_SCALE;
        radiusY = (this.placement * ORBIT_SIZE_SCALE) - (radiusDiff * ORBIT_SIZE_SCALE);

        // adjust eccentricity
        radiusY = radiusY + (radiusX - radiusY) * Math.abs(ORBIT_ECCENTRICITY_SCALE - 1)

        const centerFociDistance = radiusX * eccentricity

        rotation = toRadians(perihelionLongitude);

        // place center of the elipsse so that it rotates around the focal point;
        centerX = props.stageCenter.x + (Math.cos(rotation) * centerFociDistance);
        centerY = props.stageCenter.y + (Math.sin(rotation) * centerFociDistance);
        
        const radianMeanLongitude = toRadians(meanLongitude);
        orbiterX = centerX + (Math.cos(radianMeanLongitude) * radiusX);
        orbiterY = centerY + (Math.sin(radianMeanLongitude) * radiusY);

        this.orbitCoordinates = {
            centerX,
            centerY,
            focusX,
            focusY,
            radiusX,
            radiusY,
            orbiterX,
            orbiterY,
            rotation,
        }

        return this.orbitCoordinates;
    }

    drawOrbit(ctx: CanvasRenderingContext2D, props: RenderProperties) {
        const coordinates = this.getCoordinates(props);
        if (!coordinates) return;

        const { centerX, centerY, radiusX, radiusY, rotation } = coordinates;

        renderUtils.drawOrbit(ctx, {
            centerX,
            centerY,
            radiusX,
            radiusY,
            rotation,
        })
    }

    drawBody(ctx: CanvasRenderingContext2D, props: RenderProperties) {
        const coordinates = this.getCoordinates(props);
        if (!coordinates) {
            return renderUtils.drawPlanet(ctx, {
                x: props.stageCenter.x,
                y: props.stageCenter.y,
                radius: 10,
            });
        };

        const { orbiterX, orbiterY } = coordinates;

        renderUtils.drawPlanet(ctx, {
            x: orbiterX,
            y: orbiterY,
            radius: 10,
        });
    }

    draw(ctx: CanvasRenderingContext2D, props: RenderProperties) {
        if (this.frameDelta !== props.delta) {
            this.clearCalculations();
            this.frameDelta = props.delta;
        }

        this.drawOrbit(ctx, props);
        this.drawBody(ctx, props);
    }

    update(ctx: CanvasRenderingContext2D, props: RenderProperties) {
        return this.draw(ctx, props);
    }
}

export default CelestialBody;