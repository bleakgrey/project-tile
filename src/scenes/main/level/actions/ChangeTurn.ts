import { Action } from "./Action"
import { LevelState } from "../LevelState"
import { EntityIds } from "../entities"

export class ChangeTurnAction extends Action<LevelState, null> {

    public override canApply(state: LevelState): boolean {
        return state.winner != null
    }

    public override apply(state: LevelState): void {
        switch (state.currentTurn) {
            case EntityIds.ENEMY:
                state.currentTurn = EntityIds.PLAYER
                break
            case EntityIds.PLAYER:
                state.currentTurn = EntityIds.ENEMY
                break
            default:
                console.warn('Unknown entity:', state.currentTurn)
        }
    }

}