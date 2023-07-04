import { Container, DisplayObject, Loader } from 'pixi.js'

export abstract class Scene extends Container {

    public view?: DisplayObject
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
                if (!url.includes('.atlas') && Loader.shared.resources[url] == undefined) {
                    loader.add(url, url)
                }
            }
            loader.load()
        })
    }

    public onStart() {
        this.view = this.addChild(this.viewCreator())
    }
    public onStop() { }

}