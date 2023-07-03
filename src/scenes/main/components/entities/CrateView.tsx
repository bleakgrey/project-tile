import { gameInstance } from '@'
import { getStore, jsx, KnownStores } from '@/engine'
import { Container, Sprite } from '@/engine/Nodes'
import { AFFINE } from 'pixi-projection'
import Assets from '../../Assets'
import { LevelState } from '../../level'

export function CrateView(props: any) {
    const level = getStore<LevelState>(KnownStores.LEVEL_STATE)

    const Plane = function (props) {
        return <Sprite texture={Assets.OBSTACLE} affine={props.affine ?? AFFINE.AXIS_X} scale={{ x: 1, y: 0.8 }}
            anchor={{ x: 0, y: 1 }}
        />
    }

    const view = <Sprite name={'Character'}>
        {/* <Pivot alpha={0.4} scale={{ x: 2, y: 2 }} /> */}
        <Container xx={level.CELL_SIZE / 2} xy={level.CELL_SIZE / 2} scale={{ x: 1, y: 1 }}>
            <Plane />
            <Plane angle={90} />
            <Plane y={level.CELL_SIZE} />
            <Plane x={level.CELL_SIZE} angle={90} />
        </Container >
    </Sprite >

    return view
}