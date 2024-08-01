import * as THREE from 'three'
import Experience from '../Experience'
import starVertexShader from '../../shaders/stars/vertex.glsl'
import starFragmentShader from '../../shaders/stars/fragment.glsl'

export default class Stars {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        this.setStarGeometry()
        this.setStarMaterial()
        this.setStarMesh()
    }

    setStarGeometry() {

        const starSettings = {
            maxCount: 1000,
        }

        const randomPositions = new Float32Array(starSettings.maxCount * 3)
        for (let i = 0; i < starSettings.maxCount; i++) {
          const i3 = i * 3
          randomPositions[i3] = (Math.random() - 0.5) * 2000
          randomPositions[i3 + 1] = (Math.random() - 0.5) * 600
          randomPositions[i3 + 2] = (Math.random() - 0.5) * 900
        }

        this.starGeometry = new THREE.BufferGeometry()
        this.starGeometry.setAttribute('position',
            new THREE.BufferAttribute(randomPositions, 3))

    }

    setStarMaterial() {
        const colors = {
            A: '#ff00ff',
            B: '#00ffff'
        }

        this.starMaterial = new THREE.ShaderMaterial({
            vertexShader: starVertexShader,
            fragmentShader: starFragmentShader,
            uniforms:
            {
                uSize: new THREE.Uniform(7),
                uColorA: new THREE.Uniform(new THREE.Color(colors.A)),
                uColorB: new THREE.Uniform(new THREE.Color(colors.B))
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })

    }

    setStarMesh() {
        this.instance = new THREE.Points(this.starGeometry, this.starMaterial)
        this.scene.add(this.instance)
    }
}