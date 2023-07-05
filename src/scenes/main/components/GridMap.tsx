import { DisplayObject, Point } from 'pixi.js'
import { gameInstance } from '@'
import { gsap } from 'gsap'
import { getStore, jsx, NodeConstructor, KnownStores, Container, Sprite } from '@/engine'
import { EVENT_PROP_CHANGED, LevelState } from '../level'
import { EVENT_SPAWN_EFFECT } from './Effect'
import Assets from '../Assets'

export const EVENT_HIGHLIGHT_TILE = 'highlightTile'

export const GridMap: NodeConstructor = (props, children, refs) => {
    const entityRenderers: DisplayObject[] = []
    const level: LevelState = getStore(KnownStores.LEVEL_STATE)

    const node = <Container refs={refs}>
        <Container ref={n => refs.tileLayer = n}
            alpha={0}
        />
        <Sprite ref={n => refs.vignetteLayer = n}
            texture={Assets.VIGNETTE}
            width={level.GRID_SIZE * level.CELL_SIZE}
            height={level.GRID_SIZE * level.CELL_SIZE}
            tint={gameInstance.config.backgroundColor}
        />
        <Container ref={n => refs.entityLayer = n}
            alpha={0}
            sortableChildren={true}
        />
        <Container ref={n => refs.effectLayer = n} />
    </Container>

    // Construct level gridmap
    for (const id of Object.keys(level.tiles)) {
        const coords = level.getTileCoordsFromId(id)
        const { x, y } = level.tileToPos(coords)
        const { texture, tint } = level.tiles[id]

        refs.tileLayer.addChild(
            <Sprite x={x} y={y} texture={texture} tint={tint}>
                {/* <Label text={level.getTileId(coords)} /> */}
            </Sprite>
        )
    }

    const onEntitiesChanged = () => {
        // If this entity is not yet placed on the gridmap, do it now...
        for (const entity of Object.values(level.entities)) {
            if (!entity.renderer) {
                const renderer = entity.createRenderer(entity)
                entityRenderers.push(renderer)
                renderer.entity = entity
                entity.renderer = renderer

                const pos = level.tileToPos(entity.coords)
                renderer.position.set(pos.x, pos.y)

                refs.entityLayer.addChild(renderer)
                // console.debug('Created an entity renderer:', renderer.proj)
            }
        }

        // ...and if it is and it's not supposed to be, remove it
        for (const i in entityRenderers) {
            const renderer = entityRenderers[i]
            if (level.entities[renderer.entity.id] == undefined) {
                // console.debug('Removed a dead entity renderer:', renderer.entity.id)
                renderer.parent.removeChild(renderer)

                delete entityRenderers[i]
            }
        }
    }
    onEntitiesChanged()
    level.on(`${EVENT_PROP_CHANGED}:entities`, onEntitiesChanged, this)

    // Perfrom Y-sorting for a complete pseudo-3D effect
    gameInstance.ticker.add(dt => {
        for (const c of refs.entityLayer.children) {
            c.zIndex = c.getGlobalPosition().y
        }
    })

    // Spawn effects
    level.on(EVENT_SPAWN_EFFECT, (effect: DisplayObject | null, pos: Point) => {
        if (!effect) return
        refs.effectLayer.addChild(effect)
        effect.position.set(pos.x, pos.y)
    })

    // Spawn tile highlights
    level.on(EVENT_HIGHLIGHT_TILE, (cells: Point[], color: number) => {
        const overlays = []
        cells.forEach(cell => {
            const { x, y } = level.tileToPos(cell)
            const overlay = <Sprite
                x={x}
                y={y}
                width={level.CELL_SIZE}
                height={level.CELL_SIZE}
                texture={Assets.TARGET_ICON}
                tint={color}
            />
            refs.tileLayer.addChild(overlay)
            overlays.push(overlay)
        })
        gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 0.5 })
            .fromTo(overlays, { alpha: 0 }, { alpha: 1 })
    })

    return node
}