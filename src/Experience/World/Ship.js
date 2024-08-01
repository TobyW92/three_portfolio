import Experience from '../Experience'
import * as THREE from 'three'
import gsap from 'gsap'

export default class Ship {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.timeline = this.experience.timeline

        this.hasScrolled = {
            value: false,
        }

        this.timeline.timelines.t1.to(this.hasScrolled, {
            value: true
        }, '<')

        this.tween = {}
        this.tween.created = false
        this.tween.toTarget = 0

        this.resource = this.resources.items.shipModel

        this.setModel()

        if (this.experience.lenis.progress > 0) {
            this.hasScrolled.value = true
            this.anchor.rotation.x = 1 * (Math.PI / 180)
        }
    }

    setModel() {
        this.anchor = new THREE.Points()
        this.anchor.name = 'shipAnchor'
        this.camera.instance.add(this.anchor)
        this.anchor.position.set(0, -3, -15)
        this.anchor.rotation.x = 10 * (Math.PI / 180)
        
        this.anchor.position.z = Math.max(Math.min(-30 / (this.experience.sizes.width / this.experience.sizes.height), -15), -25)

        this.model = this.resource.scene
        this.model.rotation.y = Math.PI
        this.anchor.add(this.model)

        this.timeline.timelines.t1.to(this.anchor.rotation, {
            z: 45 * (Math.PI / 180),
            x: 1 * (Math.PI / 180),
        }, '<')

        this.timeline.timelines.t1.to(this.anchor.position, {
            x: 3,
        },'<')

        this.timeline.timelines.t2.to(this.anchor.position, {
            x: -3
        }, '<')

        this.timeline.timelines.t2.to(this.anchor.rotation, {
            z: -45 * (Math.PI / 180)
        }, '<')

        this.timeline.timelines.t3.to(this.anchor.rotation, {
            z: 45 * (Math.PI / 180),
        }, '<')

        this.timeline.timelines.t3.to(this.anchor.position, {
            x: 3,
        },'<')

        this.timeline.timelines.t4.to(this.anchor.position, {
            x: -3
        }, '<')

        this.timeline.timelines.t4.to(this.anchor.rotation, {
            z: -45 * (Math.PI / 180)
        }, '<')

        this.timeline.timelines.t5.to(this.anchor.rotation, {
            z: 0 * (Math.PI / 180),
        }, '<')

        this.timeline.timelines.t5.to(this.anchor.position, {
            x: 0,
            y: this.anchor.position.y - 2
            
        },'<')

    }

    update() {
        this.model.position.y = Math.sin(this.time.elapsed * 0.0005) * 0.5;
        this.rotate()
    }

    resize() {
        this.anchor.position.z = Math.max(Math.min(-30 / (this.experience.sizes.width / this.experience.sizes.height), -15), -25)
    }

    rotate() {
        if (!this.hasScrolled.value) {
            this.anchor.rotation.y > 2 * Math.PI ? this.anchor.rotation.y = 0.004 : this.anchor.rotation.y += 0.004
            this.tween.toTarget = this.anchor.rotation.y >= Math.PI ? 2 * Math.PI : 0
            this.tween.created = false
            this.timeline.timelines.t1.from(this.anchor.rotation, {
                y: this.anchor.rotation.y
            }, '<')

            this.tween.from = 0
        }

        if (this.hasScrolled.value && !this.tween.created) {
            this.timeline.timelines.t1.to(this.anchor.rotation, {
                y: this.tween.toTarget
            }, '<')
            this.tween.created = true
        }
        

    }
}