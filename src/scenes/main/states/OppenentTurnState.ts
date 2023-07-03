import { SceneState } from "./SceneStates"
import { Character } from "../level"
import MainScene from "../Scene"

export class OpponentTurnState extends SceneState {

    symbol = Character.ENEMY
    opponent = Character.PLAYER

    constructor(scene: MainScene) {
        super(scene)
    }

    canEnter() {
        return this.match?.currentTurn == this.symbol
    }

    onEnter() {

    }

}