import { Action } from "./Action"
import { EVENT_PROP_CHANGED, LevelState } from "../LevelState"

type Payload = {
    entityId: string,
    damage: number,
}

export const EVENT_ENTITY_HURT = 'entityHurt'
export const EVENT_ENTITY_DIED = 'entityDied'

export class HurtEntityAction extends Action<LevelState, Payload> {

    public override apply(state: LevelState): void {
        const entity = state.entities[this.data.entityId]
        if (!entity) return

        entity.health -= this.data.damage
        state.emit(`${EVENT_ENTITY_HURT}:${entity.id}`)
        state.emit(EVENT_ENTITY_HURT, entity.id)

        // If entity is dead, remove its data from the level
        if (entity.health < 1) {
            state.emit(`${EVENT_ENTITY_DIED}:${entity.id}`)

            delete state.entities[this.data.entityId]

            // JS Proxy doesn't observe Arrays, so we must manually emit
            // the events for this prop
            state.emit(`${EVENT_PROP_CHANGED}:entities`)
            state.emit(EVENT_PROP_CHANGED)
        }
    }

}