import { Action } from "./Action"
import { Match } from "../Match"
import { Player } from "../Player"

type Payload = {
    cellIndex: number,
    symbol: Player,
}

export class PlayerTurnAction extends Action<Match, Payload> {

    public override canApply(state: Match): boolean {
        // Is this our turn?
        if (state.currentTurn != this.data.symbol)
            return false

        // Does this match have a winner?
        if (state.winner != null)
            return false

        // Is this cell unoccupied?
        return state.grid[this.data.cellIndex] == undefined
    }

    public override apply(state: Match): void {
        state.grid[this.data.cellIndex] = this.data.symbol
    }

}