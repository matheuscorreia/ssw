import SceneObject from './SceneObject';
import { Position } from './types';
import * as renderUtils from '../../utils/render';
import * as datesUtils from '../../utils/dates';

export enum SolarSystemScaleOptions {
    ACCURATE,
    LINEAR,
}

interface StageOptions {
    solarSystemScale?: SolarSystemScaleOptions;
    objectScale?: number;
}

class Stage {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private objects: SceneObject[];
    private requestedAnimationFrameID?: number;
    private isPaused: boolean = true;
    private stageCenter: Position = { x: 0, y: 0 };
    private opts: StageOptions;
    private julianDay: number;

    constructor(elementId: string, opts?: StageOptions, objects?: SceneObject[]) {
        this.canvas = document.getElementById(elementId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.opts = opts || {
            solarSystemScale: SolarSystemScaleOptions.LINEAR,
            objectScale: 1,
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

    add(...objects: SceneObject[]) {
        this.objects.push(...objects);
    }

    clear() {
        this.objects = [];
    }

    init() {
        if (this.requestedAnimationFrameID) {
            cancelAnimationFrame(this.requestedAnimationFrameID);
        }

        this.animate();
    }

    private animate() {
        requestAnimationFrame(this.animate.bind(this))
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        
        this.objects.forEach(object => {
            object.update(this.ctx, {
                stageCenter: this.stageCenter,
                solarSystemScale: this.opts.solarSystemScale,
                t: datesUtils.centuriesFromJ2000(this.julianDay),
            })
        })

        this.julianDay += 10
    }
}

export default Stage;