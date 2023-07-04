import { ChangeTurnAction, EntityIds } from "../level"
import { SceneState } from "./SceneStates"
import { gsap, Elastic, Linear, Cubic } from 'gsap'
import { DisplayObject, Point } from "pixi.js"
import * as Strings from '@/assets/strings/en_US.json'
import { PlaceEntityAction } from "../level/actions/PlaceEntity"
import { ProjectileView } from "../components/entities/ProjectileView"
import { EVENT_ENTITY_HURT } from "../level/actions/HurtEntity"
import { lerp } from "@/engine"

export class PlayerTurnState extends SceneState {
    btn: DisplayObject
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

    canEnter() {
        return this.level?.currentTurn == EntityIds.PLAYER
    }

    onEnter() {
        this.btn = this.scene.view.refs.shootButton
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
        this.btn.setText('')
        this.btn.removeAllListeners('pointerdown')
        this.btn.removeAllListeners('pointerover')
        this.btn.removeAllListeners('pointerout')

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
        const startPos = this.level.tileToPos(
            this.level.entities[EntityIds.PLAYER].coords,
        )

        const enemyCoords = this.level.entities[EntityIds.ENEMY].coords
        const endPos = this.level.tileToPos(
            new Point(
                enemyCoords.x,
                enemyCoords.y,
            )
        )

        console.warn(this.charger.power)
        this.level.commit(new PlaceEntityAction({
            id: EntityIds.PROJECTILE,
            coords: this.level.entities[EntityIds.PLAYER].coords,
            health: 1,
            data: {
                destination: new Point(
                    lerp(startPos.x, endPos.x, this.charger.power),
                    lerp(startPos.y, endPos.y, this.charger.power),
                )
            },
            createRenderer: entity => ProjectileView({ entity })
        }))
    }

    onDamaged() {
        setTimeout(() => {
            this.level.commit(new ChangeTurnAction(null))
        }, 2000)
    }

    onLeave() {

    }

}