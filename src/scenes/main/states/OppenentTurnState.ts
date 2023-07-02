import { SceneState } from "./SceneStates"
import { Player, PlayerTurnAction } from "../match"
import OpponentWorker from '../match/OpponentWorker?worker'
import MainScene from "../Scene"

export class OpponentTurnState extends SceneState {

    worker: Worker
    symbol = Player.CIRCLE
    opponent = Player.CROSS
    delay = 0.5

    constructor(scene: MainScene) {
        super(scene)

        this.worker = new OpponentWorker()
        this.worker.onmessage = (ev) => {
            const action = new PlayerTurnAction({
                symbol: this.symbol,
                cellIndex: ev.data,
            })
            this.match.commit(action)
        }
    }

    canEnter() {
        return this.match?.currentTurn == this.symbol
    }

    onEnter() {
        setTimeout(() => {
            this.worker.postMessage({
                self: this.symbol,
                opponent: this.opponent,
                grid: this.match.grid,
            })
        }, this.delay * 1000)
    }

}