import { Action } from "./Action"
import { LevelState } from "../LevelState"
import { Character } from "../Character"

type Payload = {
    cellIndex: number,
    symbol: Character,
}

export class PlayerTurnAction extends Action<LevelState, Payload> {

    public override canApply(state: LevelState): boolean {
        // Is this our turn?
        if (state.currentTurn != this.data.symbol)
            return false

        // Does this match have a winner?
        if (state.winner != null)
            return false

        // Is this cell unoccupied?
        return state.grid[this.data.cellIndex] == undefined
    }

    public override apply(state: LevelState): void {
        state.grid[this.data.cellIndex] = this.data.symbol
    }

}