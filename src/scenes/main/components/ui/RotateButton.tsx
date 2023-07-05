import { jsx, Sprite, Container, getStore, KnownStores } from "@/engine"
import { gsap } from 'gsap'
import { Sprite2d } from "pixi-projection"
import { CameraState } from "../../level"
import Assets from "../../Assets"

export function RotateButton() {
    let icon: Sprite2d

    const view = <Container interactive={true} buttonMode={true}>
        <Sprite texture={Assets.SHADOW} tint={0xffffff} anchor={{ x: 0.5, y: 0.5 }} width={150} height={150} />
        <Sprite texture={Assets.SHADOW} tint={0xbebebe} alpha={0.5} anchor={{ x: 0.5, y: 0.5 }} width={130} height={130} />

        <Sprite ref={n => icon = n}>
            <Sprite texture={Assets.ROTATE_ICON} width={80} height={80} anchor={{ x: 0.5, y: 0.5 }} y={10} tint={0x000000} alpha={0.2} />
            <Sprite texture={Assets.ROTATE_ICON} width={80} height={80} anchor={{ x: 0.5, y: 0.5 }} y={5} />
        </Sprite>
    </Container>

    view.on('pointerdown', () => {
        const camera: CameraState = getStore(KnownStores.CAMERA)

        view.interactive = false
        gsap.timeline()
            .to(icon, { angle: '+=360' })
            .to(camera, { angle: '+=90' }, '<')
            .call(() => { view.interactive = true })
    })

    return view
}