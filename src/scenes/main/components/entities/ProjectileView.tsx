import { getStore, jsx, KnownStores } from '@/engine'
import { Container, Sprite } from '@/engine/Nodes'
import { AFFINE } from 'pixi-projection'
import Assets from '../../Assets'
import { LevelState } from '../../level'
import { gsap, Linear, Power1 } from 'gsap'
import { Point } from 'pixi.js'
import { Pivot } from '../Pivot'
import { HurtEntityAction } from '../../level/actions/HurtEntity'

export function ProjectileView(props: any) {
    let billboard, shadow

    const level: LevelState = getStore(KnownStores.LEVEL_STATE)
    const destination: Point = props.entity.data.destination

    const view = <Sprite name={'Projectile'}>
        {/* <Pivot /> */}
        <Container x={level.CELL_SIZE / 2} y={level.CELL_SIZE / 2} scale={{ x: 1, y: 1 }}>
            <Sprite ref={n => shadow = n}
                texture={Assets.SHADOW}
                anchor={{ x: 0.5, y: 0.5 }}
                alpha={0.1}
                tint={0x000000}
                scale={{ x: 0.5, y: 0.5 }}
            />
            <Container affine={AFFINE.AXIS_X}>
                <Sprite ref={n => billboard = n}
                    y={-25}
                    texture={Assets.BOMB}
                    anchor={{ x: 0.5, y: 0.5 }}
                    scale={{ x: 0.2, y: 0.2 }}
                    affine={AFFINE.POINT}
                    angle={45}
                />
            </Container>
        </Container >
    </Sprite >

    const onImpact = () => {
        const coords = level.posToTile(view.position)

        // Damage all entities in this tile...
        level.getEntitiesAtCoords(coords).forEach(entity => level.commit(
            new HurtEntityAction({
                entityId: entity.id,
                damage: 1,
            }))
        )

        // ...and then the projectile itself
        level.commit(new HurtEntityAction({
            entityId: props.entity.id,
            damage: 1,
        }))
    }

    gsap.timeline().timeScale(2)
        .to(view, { x: destination.x, y: destination.y, duration: 2, ease: Linear.easeNone })
        .to(billboard, { y: -400, duration: 1, ease: Power1.easeOut }, '<')
        .to(shadow.scale, { x: 0, y: 0, duration: 1, ease: Power1.easeOut }, '<')
        .to(billboard, { y: -25, duration: 1, ease: Power1.easeIn }, 1)
        .to(shadow.scale, { x: 0.5, y: 0.5, duration: 1, ease: Power1.easeOut }, '<')
        .call(onImpact)

    return view
}