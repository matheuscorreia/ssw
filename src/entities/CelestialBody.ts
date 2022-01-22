import SceneObject, { RenderProps } from './render/SceneObject';
import { calculateOrbitElementsInTime, getHeliocentricCoordinates } from '../utils/celestial-mechanics';
import { SolarSystemScaleOptions } from './render/Stage';
import { toRadians } from '../utils/math'

type KeplerianElements = {
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    meanLongitude: number;
    perihelionLongitude: number;
    ascendingNodeLongitude: number;
}

interface OrbitalElements extends KeplerianElements { };
interface OrbitalElementsRates extends KeplerianElements { };

interface CelestialBodyConstructorArgs {
    name: string;
    radius: number;
    density: number;
    placement: number;
    orbitalElements?: OrbitalElements;
    orbitalElementsRates?: OrbitalElementsRates;
}

class CelestialBody extends SceneObject {
    private name: string;
    private radius: number;
    private density: number;
    private placement: number;
    private orbitalElements?: OrbitalElements;
    private orbitalElementsRates?: OrbitalElementsRates;

    constructor({ name, radius, density, placement, orbitalElements, orbitalElementsRates }: CelestialBodyConstructorArgs) {
        super({
            posX: 0,
            posY: 0,
        });

        this.name = name;
        this.radius = radius;
        this.density = density;
        this.placement = placement;
        this.orbitalElements = orbitalElements;
        this.orbitalElementsRates = orbitalElementsRates;
    }

    getOrbitElementsInTime(julianCenturiesFromEpoch: number) {
        // If no orbit information, then it's a static body (The Sun)
        if (!this.orbitalElements || !this.orbitalElementsRates) {
            return null;
        }

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

        return calculateOrbitElementsInTime(t, a, ar, e, er, i, ir, l, lr, w, wr, o, or);
    }

    draw(ctx: CanvasRenderingContext2D, { stageCenter, t , solarSystemScale, planetsScale }: RenderProps) {
        const elements = this.getOrbitElementsInTime(t);

        let hCoords;
        if (elements) {
            hCoords = getHeliocentricCoordinates(
                elements.a,
                elements.e,
                elements.i,
                elements.w,
                elements.o,
                elements.ea,
                elements.ta,
            );
        } else {
            hCoords = [0, 0];
        }
        let newX
        let newY
        if (solarSystemScale === SolarSystemScaleOptions.LINEAR) {
            const orbitPosition = elements ? elements.l : 0;

            newX = stageCenter.x + Math.cos(toRadians(orbitPosition)) * this.placement * 40;
            newY = stageCenter.y + Math.sin(toRadians(orbitPosition)) * this.placement * 40;
        } else {
            newX = stageCenter.x + hCoords[0] * 100;
            newY = stageCenter.y + hCoords[1] * 100;
        }
        

        let radius = 5;

        this.pos.x = newX;
        this.pos.y = newY;

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.closePath();
    }
}

export default CelestialBody;