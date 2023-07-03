import { Action } from "./Action"
import { EVENT_PROP_CHANGED, LevelState } from "../LevelState"
import { Entity } from "../entities"
import { nanoid } from 'nanoid'

type Payload = Partial<Entity>

export class PlaceEntityAction extends Action<LevelState, Payload> {

    public override apply(state: LevelState): void {
        if (!this.data.id) {
            this.data.id = nanoid(6)
        }
        state.entities[this.data.id] = this.data

        // JS Proxy doesn't observe Arrays, so we must manually emit
        // the events for this prop
        state.emit(`${EVENT_PROP_CHANGED}:entities`)
        state.emit(EVENT_PROP_CHANGED)
    }

}