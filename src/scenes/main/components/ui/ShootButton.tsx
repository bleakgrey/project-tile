import { gameInstance } from "@"
import { jsx, lerpColor, Label, Rope, Sprite } from "@/engine"
import { BitmapText, Point, RenderTexture, SimpleRope, Texture, utils } from "pixi.js"
import { gsap, Linear } from 'gsap'
import { Sprite2d } from "pixi-projection"
import Assets from "../../Assets"

export function ShootButton(props: any) {
    let label: BitmapText, rope: SimpleRope, fill: Sprite2d

    let points = []
    const radius = 120
    const maxRopePoints = 100
    const step = Math.PI / maxRopePoints
    const texture = RenderTexture.create({ width: 512 })

    let ropePoints = maxRopePoints - Math.round((texture.width / (radius * Math.PI)) * maxRopePoints)
    ropePoints /= 2

    for (let i = maxRopePoints - ropePoints; i > ropePoints; i--) {
        const x = radius * Math.cos(step * i);
        const y = radius * Math.sin(step * i);
        points.push(new Point(x, -y));
    }

    const setText = (str: string) => {
        gsap.timeline()
            .to(rope, { alpha: 0, duration: 0.15 })
            .call(() => {
                label.text = str
                label.visible = true
                gameInstance.renderer.render(label, texture)
                label.visible = false
            })
            .to(rope, { alpha: 1, duration: 0.15 })
        rope.texture = texture
    }

    const setFill = (val: number) => {
        fill.width = fill.height = 180 * val
        fill.tint = utils.string2hex(
            lerpColor('#FFC300', '#FF5733', val)
        )
    }

    const view = <Sprite setText={setText} setFill={setFill}>
        {/* Background */}
        <Sprite texture={Assets.SHADOW} alpha={1} tint={0xffffff} anchor={{ x: 0.5, y: 0.5 }} width={200} height={200} />
        <Sprite texture={Assets.SHADOW} alpha={0.5} tint={0xbebebe} anchor={{ x: 0.5, y: 0.5 }} width={180} height={180} />
        <Sprite ref={n => fill = n} texture={Assets.SHADOW_GRADIENT} tint={0xFFC300} anchor={{ x: 0.5, y: 0.5 }} width={0} height={0} />

        {/* Icon */}
        <Sprite texture={Assets.SHOOT_ICON} anchor={{ x: 0.5, y: 0.5 }} width={100} height={100} y={20} tint={0x000000} alpha={0.2} />
        <Sprite texture={Assets.SHOOT_ICON} anchor={{ x: 0.5, y: 0.5 }} width={100} height={100} y={10} />

        {/* Curved text overlay */}
        <Label ref={n => label = n} text={''} visible={false} tint={0xffffff} />
        <Rope ref={n => rope = n} texture={Texture.EMPTY} points={points} />
    </Sprite>

    const rotationAnim = gsap
        .timeline({ repeat: -1 })
        .to(rope, { angle: 360, ease: Linear.easeNone, duration: 20 })

    return view
}