import { gameInstance } from '@'
import { getStore, jsx, NodeConstructor, KnownStores } from '@/engine'
import { Container, Label, Sprite } from '@/engine/Nodes'
import { Container2d } from 'pixi-projection'
import { DisplayObject } from 'pixi.js'
import { EVENT_PROP_CHANGED, LevelState } from '../level'
import Assets from '../Assets'

export const GridMap: NodeConstructor = (props, children, refs) => {
    const entityRenderers: DisplayObject[] = []
    const level: LevelState = getStore(KnownStores.LEVEL_STATE)

    const node = <Container refs={refs}>
        <Container ref={n => refs.tileLayer = n} alpha={0} />
        <Sprite ref={n => refs.vignetteLayer = n}
            texture={Assets.VIGNETTE}
            width={level.GRID_SIZE * level.CELL_SIZE}
            height={level.GRID_SIZE * level.CELL_SIZE}
            tint={gameInstance.config.backgroundColor}
        />
        <Container ref={n => refs.entityLayer = n} alpha={0} sortableChildren={true} />
    </Container>

    // Construct level gridmap
    for (const id of Object.keys(level.tiles)) {
        const coords = level.getTileCoordsFromId(id)
        const { x, y } = level.tileToPos(coords)
        const { texture, tint } = level.tiles[id]

        refs.tileLayer.addChild(
            <Sprite x={x} y={y} texture={texture} tint={tint}>
                {/* <Pivot /> */}
                {/* <Label text={level.getTileId(coords)} /> */}
            </Sprite>
        )
    }

    const onEntitiesChanged = () => {
        // If this entity is not yet placed on the gridmap, do it now
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
    level.on(`${EVENT_PROP_CHANGED}:entities`, onEntitiesChanged, this)
    onEntitiesChanged()

    // Sort entities by depth
    gameInstance.ticker.add(dt => {
        for (const c of refs.entityLayer.children) {
            c.zIndex = c.getGlobalPosition().y
        }
    })

    return node
}