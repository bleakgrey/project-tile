import { Container, DisplayObject, Loader } from 'pixi.js'

export abstract class Scene extends Container {

    public view?: any
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
            loader.onComplete.add(() => {
                resolve(true)
            })

            for (const url of Object.values(this.assets)) {
                // Do not load inline assets
                if (typeof url == 'object') continue

                // Do not load inline spine atlases
                if (url.includes('.atlas')) continue

                // Do not load already present assets
                if (Loader.shared.resources[url] !== undefined) continue

                loader.add(url, url)
            }
            loader.load()
        })
    }

    public onStart() {
        this.view = this.addChild(this.viewCreator())
    }
    public onStop() { }

}