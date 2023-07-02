import { Spine } from 'pixi-spine'
import { DisplayObject, Loader, BitmapText, Texture } from 'pixi.js'

// This namespace enables syntax highlighting for Typescript in VSCode
declare global {
	namespace JSX {
		type Element = DisplayObject
		interface ElementClass { }
	}
}

export function getTexture(id: String): Texture {
	return Loader.shared.resources[id].texture
}

// This function is used to render scene views (.tsx files)
export function jsx(
	tag: JSX.ElementClass | any,
	props: any,
	...children: any[]
): DisplayObject {
	// console.debug({ tag, props, children })

	// Construct node from tag
	let node
	if (tag == BitmapText) {
		node = new tag(props.text, props.style)
	}
	else if (tag == Spine) {
		const resource = Loader.shared.resources[props.asset]
		const spineData = resource.spineData
		node = new tag(spineData)
	}
	else {
		node = new tag()
	}

	// Apply props
	for (const prop in props) {
		const value = props[prop]
		switch (prop) {
			case "ref":
				props.ref(node)
				break
			case "texture":
				if (value instanceof Texture)
					node[prop] = value
				else
					node[prop] = getTexture(value)
				break
			default:
				node[prop] = value
				break
		}
	}

	// Add children
	for (const child of children) {
		if (child && child.addChild) {
			node.addChild(child)
		}
		else {
			console.warn('Skipped non-Node JSX child')
		}
	}

	return node
}