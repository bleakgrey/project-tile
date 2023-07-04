import { AFFINE } from 'pixi-projection'
import { getStore, jsx, KnownStores, Container, Sprite } from '@/engine'
import { LevelState } from '../../level'
import Assets from '../../Assets'

export function ObstacleView(props: any) {
    const level: LevelState = getStore(KnownStores.LEVEL_STATE)

    const Plane = (props: any) => {
        return <Sprite
            texture={Assets.OBSTACLE}
            affine={props.affine ?? AFFINE.AXIS_X}
            scale={{ x: 1, y: 0.7 }}
            anchor={{ x: 0, y: 1 }}
        />
    }

    const view = <Sprite name={'Obstacle'}>
        <Container>
            <Plane />
            <Plane y={level.CELL_SIZE} />
            <Plane angle={90} />
            <Plane x={level.CELL_SIZE} angle={90} />
        </Container >
    </Sprite >

    return view
}