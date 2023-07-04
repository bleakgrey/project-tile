import { Viewport as PixiViewport } from 'pixi-viewport'
import { gameInstance } from '@'
import { NodeConstructor } from '@/engine'

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

    return view
}