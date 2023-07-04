import { Container, getTexture, jsx, Label, Sprite } from '@/engine'
import { DisplayObject } from 'pixi.js'
import { gsap } from 'gsap'
import Assets from '../../Assets'
import * as Strings from '@/assets/strings/en_US.json'

export function Selector(props: any) {
    let activeItem: DisplayObject

    const getActive = () => {
        return activeItem
    }
    const setActive = (active: DisplayObject) => {
        activeItem = active.data
        view.children.forEach(child => {
            child.setActive(child == active)
        })
    }
    const view = <Container getActive={getActive} setActive={setActive} />

    let i = 0
    props.items.forEach(item => {
        const child = view.addChild(
            <Button y={i * 180} data={item} selector={view} />
        )
        child.on('pointerdown', () => setActive(child))
        i++
    })
    setActive(view.children[0])

    return view
}

function Button(props: any) {
    let bg, sprite, label

    const { texture, name } = props.data
    const view = <Sprite interactive={true} buttonMode={true}>
        <Sprite ref={n => bg = n}
            texture={getTexture(Assets.SHADOW)}
            alpha={0.3}
            tint={0xfefefe}
            anchor={{ x: 0.5, y: 0.5 }}
            scale={{ x: 1.1, y: 1.1 }}
            angle={-15}
        />
        <Sprite
            texture={texture}
            anchor={{ x: 0.5, y: 0.5 }}
            angle={-15}
            width={100} height={100}
            y={10}
            tint={0x000000}
            alpha={0.1}
        />
        <Sprite ref={n => sprite = n}
            texture={texture}
            anchor={{ x: 0.5, y: 0.5 }}
            angle={-15}
            width={100} height={100}
        />
        <Label ref={n => label = n}
            alpha={0}
            text={Strings[name]}
            anchor={{ x: 1, y: 0.5 }}
        />
    </Sprite>

    const clickAnim = gsap
        .timeline({ paused: true })
        .timeScale(3)
        .to(bg, { alpha: 1, angle: -25 })
        .to(bg.scale, { x: 1.4, y: 1.4 }, '<')

    const hoverAnim = gsap
        .timeline({ paused: true })
        .timeScale(3)
        .to(label, { alpha: 1 })
        .to(label, { x: -80 }, '<')

    view.setActive = (isActive = false) => {
        isActive ? clickAnim.play() : clickAnim.reverse()
    }

    view.on('pointerover', () => hoverAnim.play())
    view.on('pointerout', () => hoverAnim.reverse())
    return view
}