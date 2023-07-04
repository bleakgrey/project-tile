import Assets from "../../Assets"
import { Tile } from "./Tile"

export const TileRegistry: { [id: string]: Tile } = {
    DEFAULT: new Tile({
        texture: Assets.GRASS,
        tint: 0xffffff,
    }),
    ALTERNATE: new Tile({
        texture: Assets.GRASS,
        tint: 0xF8F7F6,
    }),
}