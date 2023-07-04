import { gameInstance } from '@'
import { getStore, jsx, KnownStores, lerpColor } from '@/engine'
import { Container, Drawable, Sprite } from '@/engine/Nodes'
import { AFFINE } from 'pixi-projection'
import { LevelState } from '../../level'
import { EVENT_ENTITY_HURT } from '../../level/actions/HurtEntity'
import { CameraState } from '../../level/CameraState'
import { Pivot } from '../Pivot'
import { gsap } from 'gsap'
import { utils } from 'pixi.js'

export function CharacterView(props: any) {
    const entity = props.entity
    const level: LevelState = getStore(KnownStores.LEVEL_STATE)
    const camera: CameraState = getStore(KnownStores.CAMERA)

    let billboard, shadow

    const view = <Sprite name={'Character'}>
        {/* <Pivot alpha={0.4} scale={{ x: 2, y: 2 }} /> */}
        <Container x={level.CELL_SIZE / 2} y={level.CELL_SIZE / 2}>
            <Sprite ref={n => shadow = n}
                name={'Shadow'}
                texture={entity.data.texture}
                anchor={{ x: 0.5, y: 1.1 }}
                tint={0x000000}
                scale={{ x: 0.9, y: -0.9 }}
                angle={160}
                alpha={0.2}
            />
            <Sprite ref={n => billboard = n}
                name={'Sprite'}
                texture={entity.data.texture}
                affine={AFFINE.AXIS_X}
                anchor={{ x: 0.5, y: 1 }}
            >
                <HealthBar y={-200} entity={entity} />
            </Sprite>
        </Container>
    </Sprite>

    level.on(`${EVENT_ENTITY_HURT}:${entity.id}`, () => {
        let tint = { alpha: 1 }
        gsap.timeline().to(tint, {
            alpha: 0,
            duration: 0.25,
            onUpdate: () => {
                billboard.tint = utils.string2hex(
                    lerpColor('#ffffff', '#ff0000', tint.alpha)
                )
            }
        })


    })

    gameInstance.ticker.add(dt => {
        // Always face to the camera for a billboard rendering style
        billboard.angle = -camera.angle
        shadow.angle = -camera.angle + 160
    })

    return view
}

function HealthBar(props: any) {
    const view = <Drawable affine={AFFINE.AXIS_X} />
    const maxHealth = props.entity.health
    const radius = 20
    const height = 20
    const width = 100
    const padding = 4

    const invalidate = () => {
        const hpPercent = (props.entity.health / maxHealth)

        view.clear()
            .beginFill(0x000000, 0.2)
            .drawRoundedRect(0, 0, width, height, radius)
            .beginFill(props.entity.data.color)
            .drawRoundedRect(
                padding / 2,
                padding / 2,
                (width - padding) * hpPercent,
                height - padding, radius
            )

        view.pivot.set(
            view.width / 2,
            view.height / 2,
        )
    }

    gameInstance.ticker.add(() => invalidate())

    return view
}