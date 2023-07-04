import { lerp } from "@/engine"
import { DisplayObject, Point } from "pixi.js"
import { gsap, Elastic, Linear } from 'gsap'
import { ChangeTurnAction, EntityIds, PlaceEntityAction, EVENT_ENTITY_HURT } from "../level"
import { SceneState } from "./SceneStates"
import { ProjectileView } from "../components/entities/ProjectileView"
import MainScene from "../Scene"
import * as Strings from '@/assets/strings/en_US.json'

export class PlayerTurnState extends SceneState {
    bounceAnim!: GSAPAnimation
    chargeAnim!: GSAPAnimation
    hideSelectorAnim!: GSAPAnimation

    btn: DisplayObject
    selector: any

    charger = {
        power: 0,
        timeScale: 0.5,
        misses: 0,

        reset() {
            this.power = 0
        },
    }

    constructor(scene: MainScene) {
        super(scene)
        this.btn = this.scene.view!.refs.ui.refs.shoot
        this.selector = this.scene.view!.refs.ui.refs.selector
    }

    canEnter() {
        return this.level?.currentTurn == EntityIds.PLAYER
    }

    onEnter() {
        this.level.once(EVENT_ENTITY_HURT, this.onDamaged, this)
        gsap.timeline()
            .call(() => {
                this.selector.interactiveChildren = true
                this.btn.setText(Strings.press_to_charge)
                this.btn.setFill(0)
            })
            .fromTo(this.selector, { alpha: 0 }, { alpha: 1 })
            .fromTo(this.selector.scale, { x: 0.8, y: 0.8 }, { x: 1, y: 1 }, '<')
            .fromTo(this.btn.scale, { x: 0, y: 0 }, { x: 1, y: 1 }, '=<+0.5')
            .set(this.btn, {
                interactive: true,
                buttonMode: true,
            })
            .call(() => { this.btn.once('pointerdown', this.onPointerDown, this) })
    }

    onPointerDown() {
        this.btn.once('pointerup', this.onPointerUp, this)
        this.btn.once('pointerout', this.onPointerUp, this)

        // Bounce the button slightly for feedback
        this.bounceAnim = gsap.timeline({ repeat: -1 })
            .to(this.btn.scale, { x: 1.05, y: 1.05, ease: Elastic.easeIn })
            .to(this.btn.scale, { x: 1, y: 1, ease: Elastic.easeIn })

        // Prevent item selection during charging
        this.hideSelectorAnim = gsap.timeline().timeScale(2)
            .to(this.selector, { alpha: 0 }, '<')
            .to(this.selector.scale, { x: 0.8, y: 0.8 }, '<')

        // Finally, play the charging animation
        this.chargeAnim = gsap.timeline()
            .timeScale(this.charger.timeScale)
            .call(() => this.btn.setText(Strings.hold_it))
            .to(this.charger, {
                delay: 0.1,
                power: 1,
                ease: Linear.easeNone,
                onUpdate: () => this.btn.setFill(this.charger.power)
            }, '<')
            .call(() => this.btn.setText(Strings.now))

            // Overshoot for holding the button for too long
            .set(this.charger, { misses: '+=1' }, '+=0.3')
            .call(() => this.btn.setText(Strings.too_late))
            .to(this.charger, {
                power: 1.25,
                onUpdate: () => this.btn.setFill(this.charger.power)
            })
    }

    onPointerUp() {
        // Hide the charge button
        gsap.timeline()
            .call(() => {
                this.btn.buttonMode = false
                this.btn.removeAllListeners('pointerdown')
                this.btn.removeAllListeners('pointerover')
                this.btn.removeAllListeners('pointerout')
                this.selector.interactiveChildren = false
                this.chargeAnim.pause()
                this.bounceAnim.kill()
            })
            .to(this.btn.scale, { x: 0, y: 0, duration: 0.5, ease: Elastic.easeInOut })
            .call(() => {
                this.charger.reset()
                this.chargeAnim.kill()
            })

        // And then shoot!
        this.launch()
    }

    launch() {
        const item = this.selector.getActive()
        const power = this.charger.power * item.lightness

        // Calculate the trajectory
        const startPos = this.level.tileToPos(this.level.entities[EntityIds.PLAYER].coords)
        const endPos = this.level.tileToPos(this.level.entities[EntityIds.ENEMY].coords)
        const destination = new Point(
            lerp(startPos.x, endPos.x, power),
            lerp(startPos.y, endPos.y, power),
        )

        // Spawn the projectile entity
        this.level.commit(new PlaceEntityAction({
            id: EntityIds.PROJECTILE,
            coords: this.level.entities[EntityIds.PLAYER].coords,
            health: 1,
            data: { item, destination },
            createRenderer: entity => ProjectileView({ entity })
        }))
    }

    onDamaged() {
        setTimeout(() => {
            this.level.commit(new ChangeTurnAction(null))
        }, 1000)
    }

    onLeave() {
        this.bounceAnim.kill()
        this.chargeAnim.kill()
    }

}