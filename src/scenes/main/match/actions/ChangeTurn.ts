import { Action } from "./Action"
import { Match } from "../Match"
import { Player } from "../Player"

export class ChangeTurnAction extends Action<Match, null> {

    public override canApply(state: Match): boolean {
        return state.winner != null
    }

    public override apply(state: Match): void {
        switch (state.currentTurn) {
            case Player.CIRCLE:
                state.currentTurn = Player.CROSS
                break
            case Player.CROSS:
                state.currentTurn = Player.CIRCLE
                break
            default:
                console.warn('Unknown player:', state.currentTurn)
        }
    }

}