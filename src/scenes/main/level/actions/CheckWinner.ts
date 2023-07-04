import { Action } from "./Action"
import { LevelState } from "../LevelState"
import { EntityIds } from "../entities"

export class CheckWinnerAction extends Action<LevelState, null> {

    public override canApply(state: LevelState): boolean {
        return state.winner != null
    }

    public override apply(state: LevelState): void {
        if (!state.entities[EntityIds.PLAYER]) {
            state.winner = EntityIds.ENEMY
        }
        if (!state.entities[EntityIds.ENEMY]) {
            state.winner = EntityIds.PLAYER
        }
    }

}