import * as THREE from 'three'
import Lenis from 'lenis'
import Stats from 'stats.js'

import Sizes from './Utils/Sizes'
import Time from './Utils/Time'
import Camera from './Camera'
import Renderer from './Renderer'
import World from './World/World'
import Resources from './Utils/Resources'
import sources from './sources'
import Timeline from './Utils/Timeline'
import Debug from './Utils/Debug'

let instance = null

export default class Experience {
    constructor(canvas) {

        if (instance) {
            return instance
        }
        instance = this

        window.experience = this

        this.canvas = canvas

        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.resources = new Resources(sources)
        this.camera = new Camera()
        this.renderer = new Renderer()
        this.world = new World()
        this.timeline = new Timeline()

        this.lenis = new Lenis()
        this.lenis.on('scroll', (e) => {
            this.camera.instance.position.x = -580 + (this.lenis.progress * 1050)
        })
        this.lenis.emitter.events.scroll[0]()

        this.stats = new Stats()
        this.stats.showPanel(0)
        document.body.appendChild(this.stats.dom)
       

        this.sizes.on('resize', () => {
            this.resize()
        })

        this.time.on('tick', () => {
            this.update()
        })

    }

    resize() {
        // console.log('resize happened')
        this.camera.resize()
        this.renderer.resize()
        this.world.particles.resize()
        this.world.ship.resize()
    }

    update() {
        // console.log('tick happened')
        this.stats.begin()

        this.lenis.raf(this.time.elapsed)
        this.camera.update()
        this.world.update()
        this.renderer.update()

        this.stats.end()
    }

    destroy() {
        this.sizes.off('resize')
        this.time.off('tick')

        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose()

                for (const key in child.material) {
                    const value = child.material[key]

                    if (value && typeof value.dispose == 'function') {
                        value.dispose()
                    }
                }
            }
        })
        this.camera.controls.dispose()
        this.renderer.instance.dispose()
        if (this.debug.active) {
            this.debug.ui.destroy()
        }
    }

}