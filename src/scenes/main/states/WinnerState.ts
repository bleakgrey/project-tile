import MainScene from "../Scene"
import { EntityIds } from "../level"
import { SceneState } from "./SceneStates"
import { gameInstance } from "@"
import { SceneManager } from "@/engine"
import * as Strings from '@/assets/strings/en_US.json'

export class WinnerState extends SceneState {

    constructor(scene: MainScene) {
        super(scene)
    }

    canEnter() {
        return this.level?.winner != undefined
    }

    onEnter() {
        this.heading.text = (this.level?.winner == EntityIds.PLAYER) ? Strings.win : Strings.lost
        this.headingAnim
            .add(this.scene.view.refs.showAnim.reverse(), '+=0.25')
            .delay(10000)
            .call(() => {
                gameInstance.sceneManager.emit(SceneManager.CHANGE_EVENT, new MainScene())
            })
            .play()
    }

}