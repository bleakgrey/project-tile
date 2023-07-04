import { State } from './State'

export class StateMachine {

    public currentState?: State
    protected states: State[]

    constructor(states: State[]) {
        this.states = states
    }

    public update() {
        let newState = this.currentState

        for (const state of this.states) {
            if (state.canEnter()) {
                newState = state
            }
        }

        if (newState != this.currentState && newState != undefined) {
            if (this.currentState) {
                console.debug(`Leaving state: ${this.currentState.constructor.name}`)
                this.currentState.onLeave()
            }

            if (newState != undefined) {
                console.debug(`Entering state: ${newState.constructor.name}`)
                this.currentState = newState
                newState.onEnter()
            }
        }
    }

}