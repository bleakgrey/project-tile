export interface State {
    canEnter(): boolean
    onEnter(): void
    onLeave(): void
}