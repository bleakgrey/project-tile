import { Viewport as PixiViewport } from 'pixi-viewport'
import { gameInstance } from '@'
import { NodeConstructor } from '@/engine'
import { Sprite, Texture } from 'pixi.js'

export const Viewport: NodeConstructor = (props, children, refs) => {
    const view = new PixiViewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: gameInstance.config.baseWidth,
        worldHeight: gameInstance.config.baseHeight,
        events: gameInstance.renderer.events,
    })

    gameInstance.ticker.add(dt => {
        view.screenWidth = window.innerWidth
        view.screenHeight = window.innerHeight
        view.fit()
        view.moveCenter(
            gameInstance.config.baseWidth / 2,
            gameInstance.config.baseHeight / 2,
        )
    })

    // const filler = new Sprite(Texture.WHITE)
    // filler.width = gameInstance.config.baseWidth
    // filler.height = gameInstance.config.baseHeight
    // filler.alpha = 0.1
    // view.addChild(filler)

    return view
}