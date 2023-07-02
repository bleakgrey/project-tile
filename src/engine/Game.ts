import * as PIXI from 'pixi.js'
import { Scene, SceneManager } from './sceneManager'

interface IGameOptions {
    baseWidth: number,
    baseHeight: number,
    startScene?: Scene,
}

export type GameConfig = PIXI.IApplicationOptions & IGameOptions

export class Game extends PIXI.Application {

    public config: GameConfig
    public sceneManager: SceneManager

    constructor(config: GameConfig) {
        super(config)
        this.config = config
        this.sceneManager = this.stage.addChild(new SceneManager(config))
    }

}