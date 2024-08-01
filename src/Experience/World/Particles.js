import * as THREE from 'three'
import Experience from '../Experience'
import gsap from 'gsap'

import particlesVertexShader from '../../shaders/particles/vertex.glsl'
import particlesFragmentShader from '../../shaders/particles/fragment.glsl'

export default class Particles {


    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.time = this.experience.time
        this.timeline = this.experience.timeline
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.camera = this.experience.camera
    
        this.particles = {}

        this.resource = this.resources.items.particleModel

        this.setModel()
        

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Particles')
            this.addDebugTools()
        }

        this.timeline.timelines.t1.to('.t1', {
            onStart: () => {
                this.particles.morph1()
            },
            onReverseComplete: () => {
                this.particles.morph0()
            }
        })

        this.timeline.timelines.t3.to('.t3', {
            onStart: () => {
                this.particles.morph2()
            },
            onReverseComplete: () => {
                this.particles.morph1()
            }
        })

        this.timeline.timelines.t4.to('.t4', {
            onStart: () => {
                this.particles.morph4()
            },
            onReverseComplete: () => {
                this.particles.morph2()
            }
        })

        this.timeline.timelines.t5.to('.t5', {
            onStart: () => {
                this.particles.morph3()
            },
            onReverseComplete: () => {
                this.particles.morph4()
            }
        })

    }

    setModel() {

        this.model = this.resource.scene
        // this.model.scale.set(100, 100, 100)
        // Starting Index
        this.particles.index = 0

        // Get positions of the objects in model
        const positions = this.model.children.map((child) => {
            if (child instanceof THREE.Mesh) {
                return child.geometry.attributes.position
              }
        })

        // Set max vertex count and duplicate random vertexes of other objects so they all have same count
        this.particles.maxCount = 0
        for (const position of positions) {
            if (position.count > this.particles.maxCount) {
                this.particles.maxCount = position.count
            }
        }

        this.particles.positions = []

        for (const position of positions) {
            const originalArray = position.array
            const newArray = new Float32Array(this.particles.maxCount * 3)
    
            for (let i = 0; i < this.particles.maxCount; i++) {
                const i3 = i * 3
    
                if (i3 < originalArray.length) {
                    newArray[i3] = originalArray[i3]
                    newArray[i3 + 1] = originalArray[i3 + 1]
                    newArray[i3 + 2] = originalArray[i3 + 2]
                } else {
                    const randomIndex = Math.floor(position.count * Math.random()) * 3
                    newArray[i3] = originalArray[randomIndex]
                    newArray[i3 + 1] = originalArray[randomIndex + 1]
                    newArray[i3 + 2] = originalArray[randomIndex + 2]
                }
            }
            this.particles.positions.push(new THREE.Float32BufferAttribute(newArray, 3))
        }

        // Add another positions array - with random positions
        const randomPositions = new Float32Array(this.particles.maxCount * 3)
        for (let i = 0; i < this.particles.maxCount; i++) {
          const i3 = i * 3
          randomPositions[i3] = (Math.random() - 0.5) * 55 + 5
          randomPositions[i3 + 1] = (Math.random() - 0.5) * 55 + 5
          randomPositions[i3 + 2] = (Math.random() - 0.5) * 55 + 5
        }
        this.particles.positions.push(new THREE.Float32BufferAttribute(randomPositions, 3))


        // Set up Particle Geometry
        const sizeArray = new Float32Array(this.particles.maxCount)
        for (let i = 0; i < this.particles.maxCount; i++) {
            sizeArray[i] = Math.random()
        }
        this.particles.geometry = new THREE.BufferGeometry()
        this.particles.geometry.setAttribute('position', this.particles.positions[this.particles.index])
        this.particles.geometry.setAttribute('aPositionTarget', this.particles.positions[0])
        this.particles.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizeArray, 1))

        // Particle Material
        // this.particles.colorA = '#ff00ff'
        // this.particles.colorB = '#00ffff'
        this.particles.colorA = '#800080'
        this.particles.colorB = '#025f5f'
        this.particles.material = new THREE.ShaderMaterial({
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            uniforms:
            {
                uSize: new THREE.Uniform(0.6),
                uResolution: new THREE.Uniform(new THREE.Vector2(this.experience.sizes.width * this.experience.sizes.pixelRatio, this.experience.sizes.height * this.experience.sizes.pixelRatio)),
                uProgress: new THREE.Uniform(0),
                uColorA: new THREE.Uniform(new THREE.Color(this.particles.colorA)),
                uColorB: new THREE.Uniform(new THREE.Color(this.particles.colorB))
            },
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
        
        // Create Mesh & Add to Scene
        this.particles.points = new THREE.Points(this.particles.geometry, this.particles.material)
        this.particles.points.frustumCulled = false
        this.particles.points.scale.set(10, 10, 10)
        this.particles.points.rotation.x = 1.572
        // this.particles.points.rotation.z = Math.PI * 0.5
        // particles.points.rotation.y = Math.PI * 0.05
        this.particles.points.position.z = -50
        // this.particles.points.position.x = -0.5
        this.particles.points.position.y = 0
        // this.scene.add(this.particles.points)
        this.camera.instance.add(this.particles.points)

        // Add Animations Between Each Set of Positions
        this.particles.morph = (index) => {
            this.particles.geometry.attributes.position = this.particles.positions[this.particles.index]
            this.particles.geometry.attributes.aPositionTarget = this.particles.positions[index]
    
            // Animate Progress
            gsap.fromTo(
                this.particles.material.uniforms.uProgress,
                { value: 0 },
                { value: 1, duration: 2, ease: 'linear' }
            )
    
            this.particles.index = index
        }
    
        this.particles.morph0 = () => { this.particles.morph(0)
        }
        this.particles.morph1 = () => { this.particles.morph(1)
        }
        this.particles.morph2 = () => { this.particles.morph(2)
        }
        this.particles.morph3 = () => { this.particles.morph(3)
        }
        this.particles.morph4 = () => { this.particles.morph(4)
        }
        this.particles.morph5 = () => { this.particles.morph(5)
        }


    }

    addDebugTools() {
    this.debugFolder.addColor(this.particles, 'colorA').onChange(() => {
        this.particles.material.uniforms.uColorA.value.set(this.particles.colorA)
    })
    this.debugFolder.addColor(this.particles, 'colorB').onChange(() => {
        this.particles.material.uniforms.uColorB.value.set(this.particles.colorB)
    })
    // this.debugFolder.add(particles.material.uniforms.uProgress, 'value').min(0).max(1).step(0.001).name('Progress').listen()
    this.debugFolder.add(this.particles, 'morph0')
    this.debugFolder.add(this.particles, 'morph1')
    this.debugFolder.add(this.particles, 'morph2')
    this.debugFolder.add(this.particles, 'morph3')
    this.debugFolder.add(this.particles, 'morph4')
    this.debugFolder.add(this.particles, 'morph5')
    this.debugFolder.add(this.particles.points.scale, 'x').min(0).max(100).step(0.001).name('X Scale')
    this.debugFolder.add(this.particles.points.scale, 'y').min(0).max(100).step(0.001).name('y Scale')
    this.debugFolder.add(this.particles.points.scale, 'z').min(0).max(100).step(0.001).name('z Scale')
    this.debugFolder.add(this.particles.points.rotation, 'x').min(0).max(2 * Math.PI).step(0.001).name('x rot')
    this.debugFolder.add(this.particles.points.rotation, 'y').min(0).max(2 * Math.PI).step(0.001).name('y rot')
    this.debugFolder.add(this.particles.points.rotation, 'z').min(0).max(2 * Math.PI).step(0.001).name('z rot')

    this.debugFolder.add(this.particles.points.position, 'x').min(-1000).max(1000).step(0.001).name('X position')
    this.debugFolder.add(this.particles.points.position, 'y').min(-1000).max(1000).step(0.001).name('y position')
    this.debugFolder.add(this.particles.points.position, 'z').min(-1000).max(1000).step(0.001).name('z position')
    }

    update() {

    }

    resize() {
        this.particles.material.uniforms.uResolution.value.set(this.experience.sizes.width * this.experience.sizes.pixelRatio, this.experience.sizes.height * this.experience.sizes.pixelRatio)
    }


}