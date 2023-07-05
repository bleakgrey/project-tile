import { AFFINE, Sprite2d } from 'pixi-projection'
import { gsap, Linear, Power1 } from 'gsap'
import { Point } from 'pixi.js'
import { getStore, jsx, KnownStores, Sprite, Container } from '@/engine'
import { LevelState, HurtEntityAction, Item } from '../../level'
import { EVENT_SPAWN_EFFECT } from '../Effect'
import Assets from '../../Assets'
import { EVENT_HIGHLIGHT_TILE } from '../GridMap'

export function ProjectileView(props: any) {
    let billboard!: Sprite2d, shadow!: Sprite2d

    const level: LevelState = getStore(KnownStores.LEVEL_STATE)
    const { destination, item, sender } = props.entity.data

    const view = <Sprite name={'Projectile'}>
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
                    texture={item.texture}
                    anchor={{ x: 0.5, y: 0.5 }}
                    scale={{ x: 0.2, y: 0.2 }}
                    affine={AFFINE.POINT}
                />
            </Container>
        </Container >
    </Sprite >

    // Calc rounded epicenter positions
    const epicenterTile = level.posToTile(destination)
    const epicenterPos = level.tileToPos(epicenterTile)

    // Get all tiles that should be affected by this projectile
    const impactTiles = item.range.map(offset => {
        return new Point(
            epicenterTile.x + offset.x,
            epicenterTile.y + offset.y,
        )
    })

    // Spawn indicators to prompt the affected range
    level.emit(EVENT_HIGHLIGHT_TILE, impactTiles, sender.data.color)

    const onImpact = () => {
        // Damage all entities in range...
        impactTiles.forEach(tile => {
            const entities = level.getEntitiesAtCoords(tile)
            entities.forEach(entity => level.commit(
                new HurtEntityAction({
                    entityId: entity.id,
                    damage: item.damage,
                }))
            )
        })

        // ...then the projectile itself
        level.commit(new HurtEntityAction({
            entityId: props.entity.id,
            damage: 1,
        }))

        // Finally, spawn an impact effect
        level.emit(EVENT_SPAWN_EFFECT, item.getImpactEffect(), new Point(
            epicenterPos.x + (level.CELL_SIZE / 2),
            epicenterPos.y + (level.CELL_SIZE / 2),
        ))
    }

    gsap.timeline().timeScale(2)
        .to(view, { x: epicenterPos.x, y: epicenterPos.y, duration: 2, ease: Linear.easeNone })
        .to(billboard, { y: -400, duration: 1, ease: Power1.easeOut }, '<')
        .to(shadow.scale, { x: 0, y: 0, duration: 1, ease: Power1.easeOut }, '<')
        .to(billboard, { y: -25, duration: 1, ease: Power1.easeIn }, 1)
        .to(shadow.scale, { x: 0.5, y: 0.5, duration: 1, ease: Power1.easeOut }, '<')
        .call(onImpact)

    return view
}