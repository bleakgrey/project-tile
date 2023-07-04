import { EntityIds } from "../level"
import { SceneState } from "./SceneStates"
import * as Strings from '@/assets/strings/en_US.json'
import MainScene from "../Scene"
import gsap from 'gsap'
import { BitmapText } from "pixi.js"
import { gameInstance } from "@"
import { SceneManager } from "@/engine"


export class WinnerState extends SceneState {

    heading: BitmapText
    headingAnim: gsap.core.Timeline

    constructor(scene: MainScene) {
        super(scene)
        this.heading = this.scene.view.refs.heading
    }

    canEnter() {
        return this.level?.winner != undefined
    }

    onEnter() {
        gsap.timeline()
            .set(this.heading, {
                x: this.heading.x,
                text: (this.level?.winner == EntityIds.PLAYER) ? Strings.win : Strings.lost,
            })
            .fromTo(this.heading,
                { alpha: 0, x: '-=100' },
                { alpha: 1, x: '+=100' },
            )
            .to(this.heading, {
                alpha: 0,
                x: '+=100',
                delay: 0.2,
            }, '+=2')
            .call(() => {
                gameInstance.sceneManager.emit(SceneManager.CHANGE_EVENT, new MainScene())
            })
    }

    onLeave() {
        this.glowingCells.forEach(cell => cell.setGlow(false))
    }

}