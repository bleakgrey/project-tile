import { Container } from 'pixi.js'
import { GameConfig } from '../Game'
import { Scene } from './Scene'

export class SceneManager extends Container {

    static CHANGE_EVENT = 'changeScene'

    private currentScene?: Scene

    constructor(config: GameConfig) {
        super()
        this.on(SceneManager.CHANGE_EVENT, this.onSceneChange, this)

        config.startScene && this.emit(SceneManager.CHANGE_EVENT, config.startScene)
    }

    private onSceneChange(scene: Scene) {
        if (this.currentScene) {
            console.log(`Stopping scene ${this.currentScene.constructor.name}`)
            this.currentScene.onStop()
            this.currentScene.parent.removeChild(this.currentScene)
        }

        console.log(`Loading assets for ${scene.constructor.name}...`)
        scene.loadAssets().then(() => {
            console.log(`Switching to scene ${scene.constructor.name}`)
            this.currentScene = scene
            this.addChild(scene)
            scene.onStart()
        })
    }

}