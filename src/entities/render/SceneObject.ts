import { Position } from './types';
import { SolarSystemScaleOptions } from './Stage';

interface SceneObjectConstructorArgs {
  posX: number;
  posY: number;
}

export interface RenderProps {
  stageCenter: Position;
  solarSystemScale?: SolarSystemScaleOptions;
  planetsScale?: number;
  t: number;
}

abstract class SceneObject {
  protected pos: Position;

  abstract draw(ctx: CanvasRenderingContext2D, props: RenderProps): void;

  constructor({ posX, posY }: SceneObjectConstructorArgs) {
    this.pos = { x: 0, y: 0 };
    this.pos.x = posX;
    this.pos.y = posY;
  }

  update (ctx: CanvasRenderingContext2D, props: RenderProps) {
    this.draw(ctx, props);
  }
}

export default SceneObject;