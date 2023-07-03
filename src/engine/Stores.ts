export const KnownStores = {
    LEVEL_STATE: 'levelState',
    CAMERA: 'camera',
    SCENE: 'scene',
    SCENE_VIEW: 'sceneView',
}

const savedStores: { [id: string]: any } = {}

export function saveStore<T>(id: string, store: T): T {
    console.debug('Save store:', id)
    savedStores[id] = store
    return store
}

export function getStore<T>(id: string): T {
    console.debug('Get store:', id)
    return savedStores[id]
}