import { gameInstance } from '@'
import { getStore, jsx, KnownStores, Container } from '@/engine'
import { Viewport } from './components/Viewport'
import { GridMap } from './components/GridMap'
import { UI } from './components/ui/UI'
import { CameraState } from './level'
import gsap from 'gsap'

export default () => {
	const camera: CameraState = getStore(KnownStores.CAMERA)
	const refs = {
		rotationPlane: null,
		gridMap: null,
		world: null,
		showAnim: null,
	}

	const view = <Viewport refs={refs}>
		<Container ref={n => refs.world = n} name={'World'} scale={camera.scale}>
			<Container ref={n => refs.rotationPlane = n} angle={camera.angle} y={100}>
				<GridMap ref={n => refs.gridMap = n} />
			</Container>
		</Container>
		<UI ref={n => refs.ui = n} />
	</Viewport >

	refs.showAnim = gsap.timeline()
		.to([refs.gridMap.refs.entityLayer, refs.gridMap.refs.tileLayer,], { alpha: 1 })
		.to(refs.rotationPlane, { y: 0 }, '<')

	gameInstance.ticker.add(dt => {
		for (const node of [refs.rotationPlane]) {
			node.pivot.set(node.width / 2, node.height / 2,)
		}

		refs.rotationPlane.angle = camera.angle

		refs.world.position.set(
			gameInstance.config.baseWidth / 2,
			gameInstance.config.baseHeight / 2,
		)
	})
	return view
}