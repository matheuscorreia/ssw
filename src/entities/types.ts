export interface Position {
    x: number;
    y: number;
}

export enum EDistanceScale {
    LINEAR,
}

export interface RenderProperties {
    t: number;
    stageCenter: Position;
    distanceScale: EDistanceScale;
    delta: number;
}

