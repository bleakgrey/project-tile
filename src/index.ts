import { Game } from "@/engine"
import MainScene from "@/scenes/main/Scene"

const container = document.getElementById('app')!

export const gameInstance = new Game({
    baseWidth: 1920,
    baseHeight: 1080,
    resizeTo: window,
    antialias: true,
    autoDensity: true,
    backgroundColor: 0xEBF8FA,
    startScene: new MainScene(),
})

container.appendChild(gameInstance.view)