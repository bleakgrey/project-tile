import { lerp } from "@/engine"
import { DisplayObject, Point } from "pixi.js"
import { gsap, Elastic, Linear, Cubic } from 'gsap'
import { ChangeTurnAction, EntityIds, PlaceEntityAction, EVENT_ENTITY_HURT } from "../level"
import { SceneState } from "./SceneStates"
import { ProjectileView } from "../components/entities/ProjectileView"
import MainScene from "../Scene"
import * as Strings from '@/assets/strings/en_US.json'

export class PlayerTurnState extends SceneState {
    btn: DisplayObject
    selector: any
    bounceAnim: GSAPAnimation
    chargeAnim: GSAPAnimation
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
        gsap.timeline()
            .call(() => {
                this.btn.setText(Strings.press_to_charge)
                this.btn.setFill(0)
            })
            .fromTo(this.btn.scale, { x: 0, y: 0 }, { x: 1, y: 1 })
            .set(this.btn, {
                interactive: true,
                buttonMode: true,
            })
            .call(() => {
                this.btn.once('pointerdown', this.onPointerDown, this)
                this.btn.once('pointerup', this.onPointerUp, this)
            })

        this.level.once(EVENT_ENTITY_HURT, this.onDamaged, this)
    }

    onPointerDown() {
        // console.debug('pointer down')

        this.bounceAnim = gsap.timeline({ repeat: -1 })
            .to(this.btn.scale, { x: 1.05, y: 1.05, ease: Elastic.easeIn })
            .to(this.btn.scale, { x: 1, y: 1, ease: Elastic.easeIn })

        this.chargeAnim = gsap
            .timeline({ delay: 0.1 })
            .timeScale(this.charger.timeScale)
            .call(() => this.btn.setText(Strings.hold_it))
            .to(this.charger, {
                power: 1,
                ease: Linear.easeNone,
                onUpdate: () => this.btn.setFill(this.charger.power)
            })
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
        // console.debug('pointer up')

        this.btn.buttonMode = false
        this.btn.removeAllListeners('pointerdown')
        this.btn.removeAllListeners('pointerover')
        this.btn.removeAllListeners('pointerout')

        this.chargeAnim.pause()
        this.bounceAnim.kill()
        gsap.timeline()
            .to(this.btn.scale, { x: 0, y: 0, duration: 0.5, ease: Elastic.easeInOut })
            .call(() => {
                this.charger.reset()
                this.chargeAnim.kill()
            })

        this.launch()
    }

    launch() {
        const enemyCoords = this.level.entities[EntityIds.ENEMY].coords
        const startPos = this.level.tileToPos(
            this.level.entities[EntityIds.PLAYER].coords,
        )
        const endPos = this.level.tileToPos(
            new Point(
                enemyCoords.x,
                enemyCoords.y,
            )
        )

        const item = this.selector.getActive()
        const power = this.charger.power * item.lightness
        const destination = new Point(
            lerp(startPos.x, endPos.x, power),
            lerp(startPos.y, endPos.y, power),
        )
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