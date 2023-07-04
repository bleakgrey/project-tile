import { getStore, jsx, KnownStores } from '@/engine'
import { Container, Sprite } from '@/engine/Nodes'
import { Viewport } from './components/Viewport'
import { gameInstance } from '@'
import { GridMap } from './components/GridMap'
import { UI } from './components/ui/UI'
import { LevelState } from './level'
import { CameraState } from './level/CameraState'
import gsap from 'gsap'

export default () => {
	const refs = {}

	let rotationPlane

	const level: LevelState = getStore(KnownStores.LEVEL_STATE)
	const camera: CameraState = getStore(KnownStores.CAMERA)

	const view = <Viewport refs={refs}>
		<Container ref={(n) => refs.world = n}
			name={'World'}
			scale={camera.scale}
		>
			<Container ref={(n) => rotationPlane = n} angle={camera.angle} y={100} alpha={0}>
				<GridMap />
			</Container>
		</Container>

		<UI ref={(n) => refs.ui = n} />
	</Viewport >

	refs.showAnim = gsap.timeline()
		.to(rotationPlane, { alpha: 1, y: 0 })

	gameInstance.ticker.add(dt => {
		for (const node of [rotationPlane]) {
			node.pivot.set(
				node.width / 2,
				node.height / 2,
			)
		}

		rotationPlane.angle = camera.angle

		refs.world.position.set(
			gameInstance.config.baseWidth / 2,
			gameInstance.config.baseHeight / 2,
		)
	})
	return view
}