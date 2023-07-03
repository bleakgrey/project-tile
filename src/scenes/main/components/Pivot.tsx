import { jsx } from '@/engine'
import { Sprite } from '@/engine/Nodes'
import { Texture } from 'pixi.js'

export function Pivot(props) {
    return <Sprite name={'Pivot'}
        texture={Texture.WHITE}
        width={12}
        height={12}
        tint={0xff0000}
        anchor={{ x: 0.5, y: 0.5 }}
    />
}