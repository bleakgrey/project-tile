import { Action } from "./Action"
import { Match } from "../Match"
import { Player } from "../Player"

export class ResetAction extends Action<Match, null> {

    public override apply(state: Match): void {
        state.grid = [
            null, null, null,
            null, null, null,
            null, null, null,
        ]
        state.currentTurn = Player.CROSS
        state.winnerPattern = null
        state.winner = undefined
    }

}