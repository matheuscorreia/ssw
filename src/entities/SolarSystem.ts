import CelestialBody from './CelestialBody';
import { Position, RenderProperties, EDistanceScale } from './types';
import * as renderUtils from '../utils/render';
import * as datesUtils from '../utils/dates';

interface SolarSystemOptions {
    distanceScale?: EDistanceScale;
}

class SolarSystem {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private start?: number;
    private objects: CelestialBody[];
    private requestedAnimationFrameID?: number;
    private isPaused: boolean = true;
    private stageCenter: Position = { x: 0, y: 0 };

    private opts: SolarSystemOptions;
    private julianDay: number;

    constructor(elementId: string, opts?: SolarSystemOptions, objects?: CelestialBody[]) {
        this.canvas = document.getElementById(elementId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.opts = opts || {
            distanceScale: EDistanceScale.LINEAR,
        };

        this.resizeCanvas();

        addEventListener('resize', () => {
            this.resizeCanvas()

            if (!this.isPaused) {
                this.init();
            }
        })
        
        this.objects = objects || [];

        this.julianDay = datesUtils.dateToJ2000(new Date());
    }

    private resizeCanvas() {
        const height = renderUtils.adjustValueToPixelDensity(innerHeight);
        const width = renderUtils.adjustValueToPixelDensity(innerWidth)

        this.canvas.height = height;
        this.canvas.width = width;

        this.stageCenter.y = this.canvas.height / 2;
        this.stageCenter.x = this.canvas.width / 2;
    }

    add(...objects: CelestialBody[]) {
        this.objects.push(...objects);
    }

    clear() {
        this.objects = [];
    }

    init() {
        if (this.requestedAnimationFrameID) {
            cancelAnimationFrame(this.requestedAnimationFrameID);
        }

        this.animate(0);
    }

    private animate(frameTime: DOMHighResTimeStamp) {
        requestAnimationFrame(this.animate.bind(this))
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        
        if (!this.start) {
            this.start = frameTime;
        }

        const delta = frameTime - this.start;

        this.objects.forEach(object => {
            object.update(this.ctx, {
                t: datesUtils.centuriesFromJ2000(this.julianDay),
                stageCenter: this.stageCenter,
                distanceScale: this.opts.distanceScale,
                delta,
            })
        })

        this.julianDay += 0.1;
    }
}

export default SolarSystem;