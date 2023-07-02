import { Player } from "./"
import { Action, ChangeTurnAction, CheckWinnerAction, PlayerTurnAction } from './actions'

const CHANGE_TURN = new ChangeTurnAction(null)
const CHECK_WINNER = new CheckWinnerAction(null)

export type Grid = (Player | null)[]
export type MatchResult = Player | 'draw'

export class Match {

    public grid: Grid = [
        null, null, null,
        null, null, null,
        null, null, null,
    ]

    public currentTurn = Player.CROSS

    public winner?: MatchResult
    public winnerPattern: (number[] | null) = null

    public clone(): Match {
        const state = new Match()
        state.grid = [...this.grid]
        state.currentTurn = this.currentTurn
        state.winner = this.winner
        state.winnerPattern = this.winnerPattern == null ? null : [...this.winnerPattern]
        return state
    }

    public commit(action: Action<this, any>) {
        action.apply(this)
        this.onActionApplied(action)
    }

    public onActionApplied(action: Action<this, any>): void {
        if (action instanceof PlayerTurnAction) {
            this.commit(CHECK_WINNER)
            this.commit(CHANGE_TURN)
        }
    }

    public isEmpty(): boolean {
        for (const cell of this.grid) {
            if (cell != null)
                return false
        }

        return true
    }

}