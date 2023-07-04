import { DisplayObject, Point } from "pixi.js"

type EntityRendererCreator = (entity: Entity) => DisplayObject

export enum EntityIds {
    PLAYER = 'player',
    ENEMY = 'enemy',
    PROJECTILE = 'projectile',
}

export class Entity {

    public id!: string
    public renderer!: DisplayObject

    public data: any = null
    public health: number = -1
    public coords: Point = new Point(0, 0)
    public createRenderer: EntityRendererCreator = () => { throw new Error(`Entity doesn't have a Renderer node!`) }

    constructor(config: Partial<Entity>) {
        Object.assign(this, config)
    }

}