import { Container, DisplayObject, Loader } from 'pixi.js'

export abstract class Scene extends Container {

    protected view?: DisplayObject
    protected viewCreator: (refs: any) => DisplayObject
    protected assets: any

    constructor(
        assets: any,
        viewCreator: (refs: any) => DisplayObject,
    ) {
        super()
        this.assets = assets
        this.viewCreator = viewCreator
    }

    public async loadAssets() {
        return new Promise(resolve => {
            const loader = Loader.shared
            loader.onComplete.add(() => resolve(true))

            for (const url of Object.values(this.assets)) {
                if (!url.includes('.atlas'))
                    loader.add(url, url)
            }
            loader.load()
        })
    }

    public onStart() {
        this.view = this.addChild(this.viewCreator(this))
    }
    public onStop() { }

    public watch<T>(
        obj: T,
        propMap: { [propName: string]: (val: any) => void },
    ): T {
        const invokeCallback = (prop, value) => {
            const callback = propMap[prop]
            callback && callback(value)
        }

        const proxy = new Proxy(obj as object, {
            set(target, prop, newValue, receiver) {
                const result = Reflect.set(...arguments)
                invokeCallback(prop, newValue)
                invokeCallback('*', null)

                return result
            },
        })

        // Trigger to immediately sync the state
        for (const [key, value] of Object.entries(obj)) {
            invokeCallback(key, value)
        }

        return proxy as T
    }

}