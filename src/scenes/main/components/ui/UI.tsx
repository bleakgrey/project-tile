import { gameInstance } from '@'
import { jsx, Container, Label, Sprite } from '@/engine'
import { ItemRegistry } from '../../level/items/ItemRegistry'
import { ShootButton } from './ShootButton'
import { Selector } from './Selector'
import { RotateButton } from './RotateButton'

export function UI() {
    const refs = {
        selector: null,
        shoot: null,
        heading: null,
    }

    const view = <Container refs={refs}>
        {/* <Sprite
            texture={Texture.WHITE}
            width={gameInstance.config.baseWidth}
            height={gameInstance.config.baseHeight}
        /> */}

        <RotateButton x={140} y={180} />
        <Selector ref={n => refs.selector = n} items={Object.values(ItemRegistry)} />
        <ShootButton ref={n => refs.shoot = n} />

        <Sprite x={1920 / 2} y={125}>
            <Label ref={n => refs.heading = n}
                anchor={{ x: 0.5, y: 0.5 }}
                text={''}
                style={{ fontSize: 80 }}
            />
        </Sprite>
    </Container>

    refs.selector.pivot.set(
        refs.selector.width / 2,
        refs.selector.height / 2,
    )
    const resize = () => {
        refs.selector.position.set(
            (gameInstance.config.baseWidth - 100),
            (gameInstance.config.baseHeight / 2) - 125,
        )
        refs.shoot.position.set(
            (gameInstance.config.baseWidth - 200),
            (gameInstance.config.baseHeight - 200),
        )
    }

    gameInstance.ticker.add(resize)
    return view
}