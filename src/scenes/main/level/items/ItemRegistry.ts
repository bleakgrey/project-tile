import Assets from "../../Assets"
import { Item } from "./Item"

export const ItemRegistry = {
    USELESS_ITEM: new Item({
        name: 'useless_item',
        texture: Assets.CARROT,
        damage: 0,
        lightness: 1,
        timeScale: 1,
    }),
    HEAVY_ITEM: new Item({
        name: 'heavy_item',
        texture: Assets.WEIGHT,
        damage: 99,
        lightness: 0.2,
        timeScale: 0.5,
    }),
    EXPLOSIVE_ITEM: new Item({
        name: 'explosive_item',
        texture: Assets.BOMB,
        damage: 10,
        lightness: 1,
        timeScale: 0.25,
    }),
}