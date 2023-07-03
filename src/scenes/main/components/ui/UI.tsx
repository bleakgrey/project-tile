import { gameInstance } from '@'
import { getTexture, jsx } from '@/engine'
import { Sprite, Container } from '@/engine/Nodes'
import { Texture } from 'pixi.js'
import Assets from '../../Assets'
import gsap from 'gsap'

function ShootButton() {
    const texture = getTexture(Assets.SHADOW)
    const view = <Container>
        <Sprite texture={texture} alpha={0.1} tint={0x000000} />
        <Sprite
            texture={Assets.DAGGER}
            anchor={{ x: 0.5, y: 0.5 }}
            x={texture.baseTexture.width / 2}
            y={texture.baseTexture.height / 2}
        />
    </Container>

    return view
}

function ItemButton() {
    let bg, sprite

    const texture = getTexture(Assets.SHADOW)
    const view = <Sprite>
        <Sprite ref={n => bg = n}
            texture={texture}
            alpha={0.1}
            tint={0x0e0e0e}
            anchor={{ x: 0.5, y: 0.5 }}
            scale={{ x: 0.5, y: 0.5 }}
            angle={-15}
        />
        <Sprite ref={n => sprite = n}
            texture={Assets.BOMB}
            anchor={{ x: 0.5, y: 0.5 }}
            angle={-15}
            width={90} height={90}
        />
    </Sprite>

    // const selectAnim = gsap.timeline({ paused: false })
    //     .to(bg, { alpha: 0.25, angle: 0 }, '<')
    //     .to(bg.scale, { x: 1, y: 1 }, '<')
    //     .to(sprite, { angle: 25 }, '<')
    //     .to(view.scale, { x: 1.25, y: 1.25 }, '<')

    return view
}

function ItemSelector() {
    const items = [1, 2, 3]

    const view = <Container>

    </Container>

    for (const i in items) {
        const schema = items[i]

        const item = <ItemButton x={i * 160} />

        view.addChild(item)
    }

    return view
}

export function UI() {
    const refs = {
        items: null,
    }

    const view = <Container>
        <Sprite alpha={0}
            texture={Texture.WHITE}
            width={gameInstance.config.baseWidth}
            height={gameInstance.config.baseHeight}
        />
        <ItemSelector ref={(n) => refs.items = n} />

        {/* <BitmapText ref={el => refs.heading = el}
			x={1920 / 2}
			y={125}
			anchor={{ x: 0.5, y: 0.5 }}
			style={{ fontName: 'lightFont' }}
		/> */}
    </Container>

    const resize = () => {
        refs.items.position.set(
            (gameInstance.config.baseWidth - 350) / 2,
            gameInstance.config.baseHeight - 100,
        )
    }

    gameInstance.ticker.add(resize)

    view.refs = refs
    return view
}