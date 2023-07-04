import { State } from "@/engine"
import MainScene from "../Scene"

export class SceneState implements State {

    protected scene: MainScene
    protected get level() {
        return this.scene.level
    }

    constructor(scene: MainScene) {
        this.scene = scene
    }
    canEnter(): boolean {
        return false
    }
    onEnter(): void { }
    onLeave(): void { }

}