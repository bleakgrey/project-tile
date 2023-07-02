import { Spine } from 'pixi-spine'
import { Container, Sprite } from 'pixi.js'
import gsap from 'gsap'

import { Player } from '../match'
import Assets from '../Assets'

const PLAYER_SPINES = {
    [Player.CROSS]: Assets.CROSS,
    [Player.CIRCLE]: Assets.CIRCLE,
}

export function Cell() {
    let sprite!: Sprite

    const cell: any = <Container>
        <Sprite ref={el => sprite = el}
            texture={Assets.CELL}
            alpha={0}
        />
    </Container>

    const glowAnim = gsap.timeline({ paused: true })
        .fromTo(sprite, { alpha: 0 }, { alpha: 1, duration: 0.5 })

    cell.setGlow = (state: boolean) => {
        state == true ? glowAnim.play() : glowAnim.reverse()
    }

    cell.undraw = (spine: Spine) => {
        spine.autoUpdate = false
        spine.state.setAnimation(0, 'draw', false)

        const track = spine.state.tracks[0]
        const tracker = { time: track.animationEnd + (Math.random() * 0.5) }
        gsap.timeline()
            .to(tracker, {
                time: 0,
                duration: tracker.time,

                // Spine doesn't support playing animations in
                // reverse, so we update the track manually
                onUpdate: () => {
                    track.trackTime = 0
                    spine.update(tracker.time)
                }
            })
            .call(() => {
                cell.removeChild(spine)
            })
    }

    cell.draw = (symbol: Player) => {
        if (symbol == cell.symbol)
            return
        cell.symbol = symbol

        let spine = cell.spine as Spine
        if (spine) {
            cell.undraw(spine)
        }

        let asset = PLAYER_SPINES[symbol]
        if (!asset)
            return

        cell.spine = <Spine
            asset={asset}
            visible={true}
            x={202 / 2}
            y={202 / 2}
        />
        cell.addChild(cell.spine)
        cell.spine.state.setAnimation(0, 'draw', false)
    }

    return cell
}