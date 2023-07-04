export class Tile {

    public texture: string = ''
    public tint: number = 0x000000

    constructor(config: Partial<Tile>) {
        Object.assign(this, config)
    }

}