import { Action } from "./Action"
import { LevelState } from "../LevelState"
import { Point } from "pixi.js"
import { Tile } from "../tiles"

type Payload = {
    cell: Point,
    tile: Tile,
}

export class PlaceTileAction extends Action<LevelState, Payload> {

    public override apply(state: LevelState): void {
        const id = state.getTileId(this.data.cell)
        state.tiles[id] = this.data.tile
    }

}