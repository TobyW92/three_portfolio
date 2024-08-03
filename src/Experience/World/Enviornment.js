import * as THREE from 'three'
import Experience from '../Experience'

export default class Environment {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.debug = this.experience.debug

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment')
        }

        this.setAmbientLight()
        // this.setSunLight()
        // this.setEnvironmentMap()
    }

    setAmbientLight() {
        this.ambientLight = new THREE.AmbientLight('#ffffff', 3)
        this.scene.add(this.ambientLight)

        if (this.debug.active) {
            this.debugFolder
                .add(this.ambientLight, 'intensity')
                .min(0)
                .max(10)
                .step(0.001)
                .name('ambient light intensity')

            this.debugFolder
                .addColor(this.ambientLight, 'color')
                .name('ambient light color')
        }
    }


}