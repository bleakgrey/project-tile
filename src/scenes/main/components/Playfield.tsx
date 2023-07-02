import { Sprite } from 'pixi.js'
import { Cell } from './Cell'
import Assets from '../Assets'

const CELL_SIZE = 202
const CELL_MARGIN = 17
const GRID_SIZE = 3

export function Playfield() {
    const view = <Sprite texture={Assets.GRID} />

    view.cells = []
    for (const i of [...Array(9).keys()]) {
        const cell = <Cell
            x={i % GRID_SIZE * (CELL_SIZE + CELL_MARGIN)}
            y={Math.floor(i / GRID_SIZE) * (CELL_SIZE + CELL_MARGIN)}
        />
        view.addChild(cell)
        view.cells.push(cell)
    }

    view.setCells = (grid: any[]) => {
        for (const i in grid) {
            const symbol = grid[i]

            const cell = view.getChildAt(i)
            cell.draw(symbol)
        }
    }

    return view
}