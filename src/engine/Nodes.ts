import { Container2d, Sprite2d, Text2d } from "pixi-projection";
import { getTexture, NodeConstructor } from "./Helpers";

export const Sprite: NodeConstructor = (props, children, refs) => {
    if (props.texture && typeof props.texture === 'string') {
        props.texture = getTexture(props.texture)
    }

    const node = new Sprite2d(props.texture)

    if (props.affine) node.proj.affine = props.affine

    return node
}

export const Container: NodeConstructor = (props, children, refs) => {
    const node = new Container2d()

    if (props.affine) node.proj.affine = props.affine

    return node
}

export const Label: NodeConstructor = (props, children, refs) => {
    const node = new Text2d(props.text || '', props.style)
    return node
}