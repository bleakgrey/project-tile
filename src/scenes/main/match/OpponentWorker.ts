import { CheckWinnerAction, Grid, Match, Player, ResetAction } from '.'

/*
    Minimax algorithm implementation for Tic-tac-toe
    Based on this article: https://www.neverstopbuilding.com/blog/minimax
*/

const matchSimulation = new Match()
let self: Player
let opponent: Player
let grid: Grid = []

onmessage = (e) => {
    self = e.data.self
    opponent = e.data.opponent
    grid = e.data.grid

    const bestMove = minimax(grid, self)
    postMessage(bestMove.index)
}

interface Move {
    index: number | null,
    score: number,
}

function minimax(grid: Grid, player: Player): Move {
    const availableCells = getEmptyCells(grid)

    if (hasPlayerWon(grid, opponent)) {
        return {
            score: -1,
            index: null,
        }
    }
    else if (hasPlayerWon(grid, self)) {
        return {
            score: 1,
            index: null,
        }
    }
    else if (availableCells.length === 0) {
        return {
            score: 0,
            index: null,
        }
    }

    const moves: Move[] = []
    for (let i = 0; i < availableCells.length; i++) {
        let move: Move = {
            index: availableCells[i],
            score: 0,
        }

        grid[move.index!] = player

        if (player == self) {
            move.score = minimax(grid, opponent).score
        }
        else {
            move.score = minimax(grid, self).score
        }

        grid[move.index!] = null

        moves.push(move)
    }

    let bestMove: Move
    let bestScore: number
    switch (player) {
        case self:
            bestScore = -10000
            for (const move of moves) {
                if (move.score > bestScore) {
                    bestScore = move.score
                    bestMove = move
                }
            }
            break

        case opponent:
            bestScore = 10000
            for (const move of moves) {
                if (move.score < bestScore) {
                    bestScore = move.score
                    bestMove = move
                }
            }
            break
    }
    return bestMove!
}

function getEmptyCells(grid: Grid): number[] {
    let result: number[] = []
    for (const i in grid) {
        if (grid[i] === null)
            result.push(i)
    }
    return result
}

function hasPlayerWon(grid: Grid, player: Player) {
    matchSimulation.commit(new ResetAction(null))
    matchSimulation.grid = grid
    matchSimulation.commit(new CheckWinnerAction(null))

    return matchSimulation.winner == player
}