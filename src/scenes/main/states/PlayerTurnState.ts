import { Player, PlayerTurnAction } from "../match"
import { SceneState } from "./SceneStates"

export class PlayerTurnState extends SceneState {

    symbol = Player.CROSS
    affectedCells = []

    canEnter() {
        return this.match?.currentTurn == this.symbol
    }

    onEnter() {
        for (const i in this.match.grid) {
            const symbol = this.match.grid[i]
            const cell = this.scene.field.getChildAt(i)

            if (!symbol) {
                this.affectedCells.push(cell)
                cell.interactive = true
                cell.buttonMode = true

                cell.on('pointerdown', () => this.onCellClicked(cell))
                cell.on('pointerover', () => this.onCellOver(cell))
                cell.on('pointerout', () => this.onCellLeave(cell))
            }
        }
    }

    onCellClicked(cell) {
        cell.setGlow(false)
        const action = new PlayerTurnAction({
            symbol: this.symbol,
            cellIndex: cell.parent.getChildIndex(cell),
        })
        this.match.commit(action)
    }
    onCellOver(cell) {
        cell.setGlow(true)
    }
    onCellLeave(cell) {
        cell.setGlow(false)
    }

    onLeave() {
        for (const cell of this.affectedCells) {
            cell.removeAllListeners('pointerdown')
            cell.removeAllListeners('pointerover')
            cell.removeAllListeners('pointerout')
            cell.buttonMode = false
            this.onCellLeave(cell)
        }
    }

}