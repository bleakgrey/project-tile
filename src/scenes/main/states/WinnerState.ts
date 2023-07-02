import { MatchResult, Player, ResetAction } from "../match"
import { SceneState } from "./SceneStates"
import * as Strings from '@/assets/strings/en_US.json'
import MainScene from "../Scene"
import gsap from 'gsap'

type HeadingStyle = { text: string, font: string }

const HEADINGS: { [key in MatchResult]: HeadingStyle } = {
    [Player.CROSS]: {
        text: Strings.cross_win,
        font: 'darkFont',
    },
    [Player.CIRCLE]: {
        text: Strings.circle_win,
        font: 'lightFont',
    },
    'draw': {
        text: Strings.tie,
        font: 'darkFont',
    },
}

export class WinnerState extends SceneState {

    glowingCells = []
    headingAnim: gsap.core.Timeline

    constructor(scene: MainScene) {
        super(scene)
        this.headingAnim = gsap.timeline({ paused: true })
            .set(this.scene.field, { interactiveChildren: false })
            .set(this.scene.heading, { x: this.scene.heading.x })
            .fromTo(this.scene.heading,
                { alpha: 0, x: '-=100' },
                { alpha: 1, x: '+=100' },
            )
            .call(this.resetMatch, undefined, 2)
            .to(this.scene.heading, {
                alpha: 0,
                x: '+=100',
                delay: 0.2,
            })
            .set(this.scene.field, { interactiveChildren: true })
    }

    canEnter() {
        return this.match?.winner != undefined
    }

    onEnter() {
        let { text, font } = HEADINGS[this.match.winner!]
        this.scene.heading.text = text
        this.scene.heading.fontName = font

        for (const i of this.match.winnerPattern!) {
            const cell = this.scene.field.getChildAt(i)
            cell.setGlow(true)
            cell.spine.state.setAnimation(0, 'win', false)
            this.glowingCells.push(cell)
        }

        this.headingAnim.play(0)
    }

    onLeave() {
        this.glowingCells.forEach(cell => cell.setGlow(false))
    }

    resetMatch = () => {
        this.match.commit(new ResetAction(null))
    }

}