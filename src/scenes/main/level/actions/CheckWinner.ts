import { Action } from "./Action"
import { LevelState } from "../LevelState"

export class CheckWinnerAction extends Action<LevelState, null> {

    public override canApply(state: LevelState): boolean {
        return state.winner != null
    }

    public override apply(state: LevelState): void {

    }

}