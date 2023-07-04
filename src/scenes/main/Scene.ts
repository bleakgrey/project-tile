import { saveStore, Scene, StateMachine, KnownStores } from '@/engine'
import { Point } from "pixi.js"
import { TileRegistry, PlaceTileAction, CameraState, EntityIds, EVENT_PROP_CHANGED, LevelState, PlaceEntityAction } from "./level"
import { OpponentTurnState, PlayerTurnState, WinnerState } from './states'
import { CharacterView } from './components/entities/CharacterView'
import { ObstacleView } from './components/entities/ObstacleView'
import View from "./View"
import Assets from './Assets'

export default class MainScene extends Scene {

    private level: LevelState
    private sm: StateMachine

    constructor() {
        super(Assets, View)
        this.level = saveStore(KnownStores.LEVEL_STATE, this.createLevel())
        saveStore(KnownStores.CAMERA, new CameraState())
    }

    override onStart() {
        super.onStart()

        // Create a state machine to handle the gameplay logic
        this.sm = new StateMachine([
            new PlayerTurnState(this),
            new OpponentTurnState(this),
            new WinnerState(this),
        ])

        this.level.on(`${EVENT_PROP_CHANGED}`, this.onMatchChanged, this)
        this.onMatchChanged()

        // Present the game field to the player
        // gsap.timeline().to(this.field, { alpha: 1, duration: 1, delay: 0.5 })
    }

    private onMatchChanged() {
        this.sm.update()
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
                const tile = (x + y) % 2 == 0 ? TileRegistry.ALTERNATE : TileRegistry.DEFAULT
                level.commit(new PlaceTileAction({
                    cell: new Point(x, y),
                    tile,
                }))
            }
        }

        level.commit(new PlaceEntityAction({
            id: EntityIds.ENEMY,
            health: 9,
            coords: new Point(2, 6),
            data: {
                color: 0xf19cb7,
                texture: Assets.ENEMY_SPRITE,
            },
            createRenderer: entity => CharacterView({ entity })
        }))
        level.commit(new PlaceEntityAction({
            id: EntityIds.PLAYER,
            health: 9,
            coords: new Point(10, 6),
            data: {
                color: 0xffcc00,
                texture: Assets.PLAYER_SPRITE,
            },
            createRenderer: entity => CharacterView({ entity })
        }))

        for (const offset of [...Array(3).keys()]) {
            level.commit(new PlaceEntityAction({
                coords: new Point(3, 5 + offset),
                createRenderer: entity => ObstacleView({ entity })
            }))
            level.commit(new PlaceEntityAction({
                coords: new Point(9, 5 + offset),
                createRenderer: entity => ObstacleView({ entity })
            }))
        }

        return level
    }

}