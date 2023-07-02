export class Action<
    T extends any,    // What state does this action operate on?
    D extends any,    // What params does this action take?
> {

    public data: D

    constructor(data: D) {
        this.data = data
    }

    public getCost(state: T): number {
        return 1
    }

    public canApply(state: T): boolean {
        return true
    }

    public apply(state: T) {
        throw new Error('Unimplemented')
    }

}