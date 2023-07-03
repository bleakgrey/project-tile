import { gameInstance } from '@'
import { getStore, jsx, KnownStores } from '@/engine'
import { Container, Sprite } from '@/engine/Nodes'
import { AFFINE } from 'pixi-projection'
import Assets from '../../Assets'
import { Entity, LevelState } from '../../level'
import { CameraState } from '../../level/CameraState'
import { Pivot } from '../Pivot'

export function CharacterView(props: any) {
    const entity = props.entity
    const level = getStore<LevelState>(KnownStores.LEVEL_STATE)
    const camera = getStore<CameraState>(KnownStores.CAMERA)

    let billboard, shadow

    const view = <Sprite name={'Character'}>
        <Pivot alpha={0.4} scale={{ x: 2, y: 2 }} />
        <Container x={level.CELL_SIZE / 2} y={level.CELL_SIZE / 2}>
            <Sprite ref={n => shadow = n}
                name={'Shadow'}
                texture={Assets.ENEMY_SPRITE}
                anchor={{ x: 0.5, y: 1.1 }}
                tint={0x000000}
                scale={{ x: 0.9, y: -0.9 }}
                angle={160}
                alpha={0.2}
            />
            <Sprite ref={n => billboard = n}
                name={'Sprite'}
                texture={Assets.ENEMY_SPRITE}
                affine={AFFINE.AXIS_X}
                anchor={{ x: 0.5, y: 1 }}
            >
            </Sprite>
        </Container>
    </Sprite>

    gameInstance.ticker.add(dt => {
        // Always face to the camera for a billboard rendering style
        billboard.angle = -camera.angle
        shadow.angle = -camera.angle + 160
    })

    return view
}