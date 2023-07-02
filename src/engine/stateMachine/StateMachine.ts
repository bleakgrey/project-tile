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

        if (newState != this.currentState) {
            if (this.currentState) {
                // console.log(`Leaving state: ${this.currentState.constructor.name}`)
                this.currentState.onLeave()
            }

            if (newState != undefined) {
                // console.log(`Entering state: ${newState.constructor.name}`)
                newState.onEnter()
                this.currentState = newState
            }
        }
    }

}