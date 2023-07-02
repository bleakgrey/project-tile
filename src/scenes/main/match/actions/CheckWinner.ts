import { Action } from "./Action"
import { Match } from "../Match"

export const WIN_PATTERNS = [
    // Horizontal lines
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Vertical lines
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonal lines
    [0, 4, 8],
    [2, 4, 6],
]

export class CheckWinnerAction extends Action<Match, null> {

    public override canApply(state: Match): boolean {
        return state.winner != null
    }

    public override apply(state: Match): void {
        for (const pattern of WIN_PATTERNS) {
            const symbols = pattern.map(i => {
                return state.grid[i]
            })

            const firstSymbol = symbols[0]
            if (firstSymbol != null && symbols.every(symbol => symbol == firstSymbol)) {
                state.winnerPattern = pattern
                state.winner = firstSymbol
                return
            }
        }

        const emptyCell = state.grid.find(symbol => symbol == null)
        if (emptyCell === undefined) {
            state.winnerPattern = []
            state.winner = 'draw'
        }
    }

}