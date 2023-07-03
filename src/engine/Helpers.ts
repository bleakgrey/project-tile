import { DisplayObject, Loader, BitmapText, Texture } from 'pixi.js'

export type NodeConstructor = (props: any, children: any[], refs: any) => DisplayObject

// This namespace enables syntax highlighting for Typescript in VSCode
declare global {
	namespace JSX {
		type Element = DisplayObject
		type ElementClass = NodeConstructor
	}
}

export function getTexture(id: String): Texture {
	return Loader.shared.resources[id].texture
}

// This function is used to render scene views (.tsx files)
export function jsx(
	tag: JSX.ElementClass,
	props: any,
	...children: any[]
): DisplayObject {
	// Construct node from tag
	if (!props) props = {}
	let node: any = tag(props, children, props.refs || {})

	// Apply props
	for (const prop in props) {
		const value = props[prop]
		switch (prop) {
			case "ref":
				props.ref(node)
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