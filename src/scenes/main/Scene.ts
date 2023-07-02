import { Scene, StateMachine } from '@/engine'
import { BitmapText, Sprite } from "pixi.js"
import gsap from 'gsap'

import { Match } from "./match"
import { OpponentTurnState, PlayerTurnState, WinnerState } from './states'

import View from "./View"
import Assets from './Assets'

export default class MainScene extends Scene {

    public field: Sprite
    public heading: BitmapText

    public match: Match
    private sm: StateMachine

    constructor() {
        super(Assets, View)
    }

    override onStart() {
        super.onStart()

        // Create a state machine to handle the gameplay logic
        this.sm = new StateMachine([
            new PlayerTurnState(this),
            new OpponentTurnState(this),
            new WinnerState(this),
        ])

        // Watch for changes in the game state
        this.match = this.watch(new Match(), {
            '*': () => this.onMatchChanged(),
        })
        this.onMatchChanged()

        // Present the game field to the player
        gsap.timeline().to(this.field, { alpha: 1, duration: 1, delay: 0.5 })
    }

    private onMatchChanged() {
        this.sm.update()
        this.field.setCells(this.match.grid)
    }

}