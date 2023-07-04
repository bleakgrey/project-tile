import { Point } from "pixi.js"
import Assets from "../../Assets"
import { Item } from "./Item"

export const ItemRegistry = {
    EXPLOSIVE_ITEM: new Item({
        name: 'explosive_item',
        texture: Assets.BOMB,
        damage: 3,
        range: [
            new Point(0, 0),
            new Point(1, 0),
            new Point(-1, 0),
            new Point(0, 1),
            new Point(0, -1),
        ]
    }),
    USELESS_ITEM: new Item({
        name: 'useless_item',
        texture: Assets.CARROT,
        damage: 1,
    }),
    HEAVY_ITEM: new Item({
        name: 'heavy_item',
        texture: Assets.WEIGHT,
        damage: 99,
        lightness: 0,
    }),
}