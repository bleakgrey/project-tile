import { SceneState } from "./SceneStates"
import MainScene from "../Scene"
import { ChangeTurnAction, EntityIds } from "../level"

export class OpponentTurnState extends SceneState {

    constructor(scene: MainScene) {
        super(scene)
    }

    canEnter() {
        return this.level?.currentTurn == EntityIds.ENEMY
    }

    onEnter() {
        this.level.commit(new ChangeTurnAction(null))
    }

}