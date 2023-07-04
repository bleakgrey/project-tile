import Assets from "../Assets"

export class Tile {

    public texture: string = ''
    public tint: number = 0x000000

    constructor(config: Partial<Tile>) {
        Object.assign(this, config)
    }

}

export const Tiles: { [id: string]: Tile } = {
    DEFAULT: new Tile({
        texture: Assets.GRASS,
        tint: 0xffffff,
    }),
    ALTERNATE: new Tile({
        texture: Assets.GRASS,
        tint: 0xF8F7F6,
    }),
}