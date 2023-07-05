import { gameInstance } from "@"
import { jsx, NodeConstructor } from "@/engine"
import { Emitter, upgradeConfig } from "@pixi/particle-emitter"
import { Container2d } from "pixi-projection"
import { TickerCallback } from "pixi.js"

export const EVENT_SPAWN_EFFECT = 'spawnEffect'

export const Effect: NodeConstructor = (props) => {
    if (!props.config) {
        throw new Error('No config was provided for an Effect')
    }
    if (!props.textures) {
        throw new Error('No textures was provided for an Effect')
    }

    const wrapper = new Container2d()
    if (props.affine) wrapper.proj.affine = props.affine
    const emitter = new Emitter(wrapper, upgradeConfig(props.config, props.textures))

    let elapsed = Date.now()
    const updateCallback: TickerCallback<any> = dt => {
        const now = Date.now()
        emitter.update((now - elapsed) * 0.001)
        elapsed = now
    }
    gameInstance.ticker.add(updateCallback)

    emitter.emit = true
    return wrapper
}