import { saveStore, Scene, StateMachine, KnownStores } from '@/engine'
import { Point, Sprite } from "pixi.js"
import gsap from 'gsap'

import { EntityIds, EVENT_PROP_CHANGED, LevelState } from "./level"
import { OpponentTurnState, PlayerTurnState, WinnerState } from './states'

import View from "./View"
import Assets from './Assets'
import { PlaceTileAction } from './level/actions/PlaceTile'
import { Tiles } from './level/Tiles'
import { CameraState } from './level/CameraState'
import { PlaceEntityAction } from './level/actions/PlaceEntity'
import { CharacterView } from './components/entities/CharacterView'
import { CrateView } from './components/entities/CrateView'

export default class MainScene extends Scene {

    public field: Sprite

    public level: LevelState
    private sm: StateMachine

    constructor() {
        super(Assets, View)
        this.level = saveStore(KnownStores.LEVEL_STATE, this.createLevel())
        saveStore(KnownStores.CAMERA, new CameraState())
    }

    private createLevel(): LevelState {
        const level = new LevelState()

        /*
            Usually a tilemap is imported from a JSON file created in an
            external editor, e.g. Tiled. For the sake of simplicity,
            it's constructed dynamically here.
        */
        for (const x of [...Array(level.GRID_SIZE).keys()]) {
            for (const y of [...Array(level.GRID_SIZE).keys()]) {
                const tile = (x + y) % 2 == 0 ? Tiles.ALTERNATE : Tiles.DEFAULT
                level.commit(new PlaceTileAction({
                    cell: new Point(x, y),
                    tile,
                }))
            }
        }

        level.commit(new PlaceEntityAction({
            coords: new Point(6, 4),
            createRenderer: entity => CrateView({ entity })
        }))

        level.commit(new PlaceEntityAction({
            coords: new Point(6, 5),
            createRenderer: entity => CrateView({ entity })
        }))

        level.commit(new PlaceEntityAction({
            id: EntityIds.PLAYER,
            health: 20,
            coords: new Point(2, 6),
            createRenderer: entity => CharacterView({ entity })
        }))
        level.commit(new PlaceEntityAction({
            id: EntityIds.ENEMY,
            health: 20,
            coords: new Point(10, 6),
            createRenderer: entity => CharacterView({ entity })
        }))

        return level
    }

    override onStart() {
        super.onStart()

        // Create a state machine to handle the gameplay logic
        this.sm = new StateMachine([
            // new PlayerTurnState(this),
            // new OpponentTurnState(this),
            // new WinnerState(this),
        ])

        this.level.on(`${EVENT_PROP_CHANGED}`, this.onMatchChanged, this)
        this.onMatchChanged()

        // Present the game field to the player
        // gsap.timeline().to(this.field, { alpha: 1, duration: 1, delay: 0.5 })
    }

    private onMatchChanged() {
        this.sm.update()
    }

}