import { getStore, jsx, KnownStores } from '@/engine'
import { Container, Sprite } from '@/engine/Nodes'
import { Viewport } from './components/Viewport'
import { gameInstance } from '@'
import { GridMap } from './components/GridMap'
import { UI } from './components/ui/UI'
import { LevelState } from './level'
import { CameraState } from './level/CameraState'
import gsap from 'gsap'

export default (refs: any) => {
	let rotationPlane

	const level = getStore<LevelState>(KnownStores.LEVEL_STATE)
	const camera = getStore<CameraState>(KnownStores.CAMERA)

	const view = <Viewport>
		<Container ref={(n) => refs.world = n}
			name={'World'}
			scale={camera.scale}
		>
			<Container ref={(n) => rotationPlane = n} angle={camera.angle}>
				<GridMap />
			</Container>
		</Container>

		<UI />
	</Viewport >

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

	gsap.timeline({ repeat: -1, repeatDelay: 0 })
		.to(camera, { angle: '+=360', duration: 10 })

	return view
}