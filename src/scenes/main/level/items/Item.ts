import { Point } from "pixi.js"
import Assets from "../../Assets"

export class Item {

    name: string = 'Unknown Item'
    texture: string = Assets.BOMB

    // How much damage will this item deal to the target?
    damage: number = 1

    // How easy is it to throw this item?
    lightness: number = 1

    // What tiles will this item affect?
    range: Point[] = [new Point(0, 0)]

    // How long should the player hold the throw button for?
    timeScale: number = 1

    constructor(config: Partial<Item>) {
        Object.assign(this, config)
    }

}