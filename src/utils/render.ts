export const adjustValueToPixelDensity = (value: number) => {
    return Math.round((value / devicePixelRatio) * devicePixelRatio);
}


interface IRenderEllipse {
    centerX: number;
    centerY: number;
    radiusX: number;
    radiusY: number;
    rotation: number;
}
export const drawOrbit = (ctx: CanvasRenderingContext2D, { centerX, centerY, radiusX, radiusY, rotation }: IRenderEllipse) => {
    ctx.beginPath();
    ctx.ellipse(
        centerX,
        centerY,
        radiusX,
        radiusY,
        rotation,
        0,
        2 * Math.PI,
    );
    ctx.stroke();
    ctx.closePath();
}

interface IDrawPlanet {
    x: number;
    y: number;
    radius: number;
}
export const drawPlanet = (ctx: CanvasRenderingContext2D, { x, y, radius }: IDrawPlanet) => {
    ctx.beginPath();
    ctx.arc(
        x,
        y,
        radius,
        0,
        2 * Math.PI,
    );
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}