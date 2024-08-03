import Experience from '../Experience'
import * as THREE from 'three'

export default class Logos {
    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.time = this.experience.time
        this.resources = this.experience.resources
        this.timeline = this.experience.timeline

        this.resources = {
            jsModel: this.resources.items.jsModel,
            javaModel: this.resources.items.javaModel,
            pythonModel: this.resources.items.pythonModel
        }

        this.addLogos()

        this.timeline.timelines.t2.to(this.anchor.position, {
           y: 1
        }, '<')

        this.timeline.timelines.t3.to(this.anchor.position, {
            y: 20
         }, '<')

    }

    addLogos() {

        this.jsModel = this.resources.jsModel.scene
        this.javaModel = this.resources.javaModel.scene
        this.pythonModel = this.resources.pythonModel.scene

        this.anchor = new THREE.Points()
        // this.anchor.scale.set(3, 3, 3)

        this.anchor.add(this.jsModel, this.javaModel, this.pythonModel)
        this.jsModel.position.set(0, 1.5, 0)
        this.javaModel.position.set(1.5, -1.5, 0)
        this.pythonModel.position.set(-1.5, -1.5, 0)

        this.camera.instance.add(this.anchor)
        this.anchor.position.set(0, 20, -25)

    }

    update() {
        this.anchor.rotateZ(0.00045 * this.time.delta)
        // this.anchor.rotateY(.00075 * this.time.delta)
        this.jsModel.rotateZ(0.00033 * this.time.delta)
        this.jsModel.rotateY(.00015 * this.time.delta)
        this.javaModel.rotateZ(0.0003 * this.time.delta)
        this.javaModel.rotateY(.0002 * this.time.delta)
        this.pythonModel.rotateZ(0.0004 * this.time.delta)
        this.pythonModel.rotateY(.0001 * this.time.delta)
    }
}