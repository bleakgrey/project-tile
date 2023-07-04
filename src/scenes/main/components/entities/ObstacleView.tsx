import { getStore, jsx, KnownStores } from '@/engine'
import { Container, Sprite } from '@/engine/Nodes'
import { AFFINE } from 'pixi-projection'
import Assets from '../../Assets'
import { LevelState } from '../../level'

export function ObstacleView(props: any) {
    const level: LevelState = getStore(KnownStores.LEVEL_STATE)

    const Plane = (props: any) => {
        return <Sprite texture={Assets.OBSTACLE} affine={props.affine ?? AFFINE.AXIS_X} scale={{ x: 1, y: 0.6 }}
            anchor={{ x: 0, y: 1 }}
        />
    }

    const view = <Sprite name={'Obstacle'}>
        <Container scale={{ x: 1, y: 1 }}>
            <Plane />
            <Plane angle={90} />
            <Plane y={level.CELL_SIZE} />
            <Plane x={level.CELL_SIZE} angle={90} />
        </Container >
    </Sprite >

    return view
}