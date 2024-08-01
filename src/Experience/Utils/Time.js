import EventEmitter from './EventEmitter'

export default class Time extends EventEmitter {

    constructor() {

        super()


        this.start = Date.now()
        this.current = this.start
        this.elapsed = 0
        this.delta = 16
        // 0 delta can cause bugs - 16 is equal to refresh rate on 60hz monitor

        window.requestAnimationFrame(() => {
            this.tick()
        })

    }

    tick() {
        const currentTime = Date.now()
        this.delta = currentTime - this.current
        this.current = currentTime
        this.elapsed = this.current - this.start

        this.trigger('tick')

        window.requestAnimationFrame(() => {
            this.tick()
        })
    }
}