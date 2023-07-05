import { DisplayObject, Point } from "pixi.js"
import Assets from "../../Assets"

type EffectConstructor = () => DisplayObject | null

export class Item {

    name: string = 'Unknown Item'
    texture: string = Assets.BOMB

    // How much damage will this item deal to the target?
    damage: number = 1

    // How easy is it to throw this item?
    lightness: number = 1

    // What tiles will this item affect?
    range: Point[] = []

    // What effect should be shown on impact?
    getImpactEffect: EffectConstructor = () => null

    constructor(config: Partial<Item>) {
        Object.assign(this, config)
    }

}