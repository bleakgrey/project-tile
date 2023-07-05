import MainScene from "../Scene"
import { SceneState } from "./SceneStates"
import { ChangeTurnAction, EntityIds, EVENT_ENTITY_HURT, PlaceEntityAction } from "../level"
import { ItemRegistry } from "../level"
import { ProjectileView } from "../components/entities/ProjectileView"
import * as Strings from '@/assets/strings/en_US.json'

export class OpponentTurnState extends SceneState {

    constructor(scene: MainScene) {
        super(scene)
        this.headingAnim
            .set(this.heading, { text: Strings.opponent_turn }, 0)
            .call(() => this.launch())
    }

    canEnter() {
        return this.level?.currentTurn == EntityIds.ENEMY
    }

    onEnter() {
        this.headingAnim.play(0)
    }

    launch() {
        this.level.once(EVENT_ENTITY_HURT, this.onDamaged, this)

        const self = this.level.entities[EntityIds.ENEMY]
        const player = this.level.entities[EntityIds.PLAYER]

        this.level.commit(new PlaceEntityAction({
            id: EntityIds.PROJECTILE,
            coords: self.coords,
            health: 1,
            data: {
                item: ItemRegistry.USELESS_ITEM,
                destination: this.level.tileToPos(player.coords),
                sender: self,
            },
            createRenderer: entity => ProjectileView({ entity })
        }))
    }

    onDamaged() {
        setTimeout(() => {
            this.level.commit(new ChangeTurnAction(null))
        }, 1000)

    }

}