import { State } from "@/engine"
import { BitmapText, DisplayObject } from "pixi.js"
import { gsap } from 'gsap'
import MainScene from "../Scene"

export class SceneState implements State {

    protected scene: MainScene
    protected heading: BitmapText
    protected btn: DisplayObject
    protected selector: any

    protected headingAnim: GSAPAnimation

    protected get level() {
        return this.scene.level
    }

    constructor(scene: MainScene) {
        this.scene = scene
        this.heading = this.scene.view!.refs.ui.refs.heading
        this.btn = this.scene.view!.refs.ui.refs.shoot
        this.selector = this.scene.view!.refs.ui.refs.selector

        this.headingAnim = gsap.timeline({ paused: true, delay: 0.25 })
            .set(this.heading, { x: -100 })
            .fromTo(this.heading, { alpha: 0 }, { alpha: 1, x: 0 })
            .to(this.heading, { alpha: 0, x: 100, delay: 1 })
    }
    canEnter(): boolean {
        return false
    }
    onEnter(): void { }
    onLeave(): void { }

}