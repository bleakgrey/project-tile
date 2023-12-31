import { jsx } from "@/engine"
import { Point } from "pixi.js"
import { Item } from "./Item"
import { Effect } from "../../components/Effect"
import { AFFINE } from "pixi-projection"
import Assets from "../../Assets"

const RANGE_1x1 = [
    new Point(0, 0),
]
const RANGE_3x3 = [
    new Point(0, 0),
    new Point(1, 0),
    new Point(-1, 0),
    new Point(0, 1),
    new Point(0, -1),
    new Point(1, 1),
    new Point(-1, -1),
    new Point(1, -1),
    new Point(-1, 1),
]

export const ItemRegistry = {
    EXPLOSIVE_ITEM: new Item({
        name: 'explosive_item',
        texture: Assets.BOMB,
        damage: 3,
        range: RANGE_3x3,
        getImpactEffect() {
            return <Effect config={Assets.EXPLOSION_EFFECT} textures={[Assets.SWIRL]} affine={AFFINE.POINT} />
        },
    }),
    USELESS_ITEM: new Item({
        name: 'useless_item',
        texture: Assets.CARROT,
        damage: 1,
        range: RANGE_1x1,
        getImpactEffect() {
            return <Effect config={Assets.SLAP_EFFECT} textures={[Assets.SHADOW]} affine={AFFINE.POINT} />
        },
    }),
    HEAVY_ITEM: new Item({
        name: 'heavy_item',
        texture: Assets.WEIGHT,
        damage: 99,
        range: RANGE_1x1,
        lightness: 0,
        getImpactEffect() {
            return <Effect config={Assets.IMPACT_EFFECT} textures={[Assets.SHADOW]} />
        },
    }),
}