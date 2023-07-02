import { State } from "@/engine"
import MainScene from "../Scene"

export class SceneState implements State {

    protected scene: MainScene
    protected get match() {
        return this.scene.match
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