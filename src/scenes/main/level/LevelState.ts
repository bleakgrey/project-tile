import { Point } from "pixi.js"
import { EventEmitter } from 'eventemitter3'
import { Action, ChangeTurnAction, CheckWinnerAction, PlayerTurnAction } from './actions'
import { Tile } from "./Tiles"
import { Entity, EntityIds } from "./entities"

const CHANGE_TURN = new ChangeTurnAction(null)
const CHECK_WINNER = new CheckWinnerAction(null)

export const EVENT_PROP_CHANGED = 'propChanged'

export class LevelState extends EventEmitter {

    public currentTurn = EntityIds.PLAYER
    public winner?: EntityIds

    private watch<T extends EventEmitter>(
        obj: T,
    ): T {
        const proxy = new Proxy(obj as object, {
            set(target: EventEmitter, prop, newValue, receiver) {
                const result = Reflect.set(...arguments)

                target.emit(`${EVENT_PROP_CHANGED}:${String(prop)}`, newValue)
                target.emit(EVENT_PROP_CHANGED, prop)

                return result
            },
        })

        // Trigger to immediately sync the state
        for (const [key, value] of Object.entries(obj)) {
            obj.emit(EVENT_PROP_CHANGED, key, value)
        }

        return proxy as T
    }

    constructor() {
        super()
        return this.watch(this)
    }

    get CELL_SIZE() {
        return 128
    }
    get GRID_SIZE() {
        return 13
    }
    public tiles: { [cellId: string]: Tile } = {}
    public entities: { [id: string]: Entity } = {}

    public commit(action: Action<this, any>) {
        action.apply(this)
        this.onActionApplied(action)
    }

    public onActionApplied(action: Action<this, any>) {
        if (action instanceof PlayerTurnAction) {
            this.commit(CHECK_WINNER)
            this.commit(CHANGE_TURN)
        }
    }

    public posToTile(pos: Point) {
        const { x, y } = pos
        return new Point(x / this.CELL_SIZE, y / this.CELL_SIZE)
    }
    public tileToPos(coords: Point) {
        const { x, y } = coords
        return new Point(x * this.CELL_SIZE, y * this.CELL_SIZE)
    }
    public getTileId(coords: Point): string {
        const { x, y } = coords
        return `${x},${y}`
    }
    public getTileCoordsFromId(id: string) {
        const parts = id.split(',')
        return new Point(
            parseInt(parts[0]),
            parseInt(parts[1]),
        )
    }

}