import * as THREE from 'three'
import Experience from '../Experience'
import gridVertexPars from '../../shaders/plane/vertex_pars.js'
import gridVertexMain from '../../shaders/plane/vertex_main.js'

export default class Plane {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.timeline = this.experience.timeline

        this.waves = {
            A: { direction: 12, steepness: 0.2, wavelength: 15 },
            B: { direction: 75, steepness: 0.1, wavelength: 25 },
            C: { direction: -12, steepness: 0.2, wavelength: 15 },
        }

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Plane')
            this.debugFolder.add(this, 'addDebugTools')
        }

        this.setGeometry()
        this.setTextures()
        this.setMaterial()
        this.setMesh()
        this.setGridMaterial()
        this.setGridMesh()

        this.timeline.timelines.t1.to(this.material, {
            opacity: 0.8
        }, '<')
        this.timeline.timelines.t1.to(this.gridMaterial, {
            opacity: 0.35,
        }, '<')

    }

    
    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(1024, 256, 256, 128);
    }
    
    setTextures() {
        this.textures = {}
        this.textures.alpha = this.resources.items.planeAlphaTexture
        this.textures.displacement = this.resources.items.planeDisplacementTexture
    }
    
    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            side: THREE.BackSide,
            alphaMap: this.textures.alpha,
            transparent: true,
            opacity: 0,
            displacementMap: this.textures.displacement,
            displacementScale: 45,
        })

    }

    setGridMaterial() {
        this.gridMaterial = new THREE.MeshStandardMaterial({
            color: 0x03fcf4,
            wireframe: true,
            // alphaMap: this.textures.alpha,
            transparent: true,
            opacity: 0,
            displacementMap: this.textures.displacement,
            displacementScale: 45,
            emissive: 0x03fcf4,
            emissiveIntensity: 2,
            onBeforeCompile: (shader) => {
                this.gridMaterial.userData.shader = shader;
                shader.uniforms.uTime = {value: 0};
                const parsVertexString = `#include <displacementmap_pars_vertex>`;
                shader.vertexShader = shader.vertexShader.replace(parsVertexString, parsVertexString + gridVertexPars);
                const mainVertexString = `#include <displacementmap_vertex>`;
                shader.vertexShader = shader.vertexShader.replace(mainVertexString, mainVertexString + gridVertexMain);
                shader.uniforms.waveA = {
                    value: [
                    Math.sin( ( this.waves.A.direction * Math.PI ) / 180 ),
                    Math.cos( ( this.waves.A.direction * Math.PI ) / 180 ),
                    this.waves.A.steepness,
                    this.waves.A.wavelength,
                    ],
                };
                shader.uniforms.waveB = {
                    value: [
                    Math.sin( ( this.waves.B.direction * Math.PI ) / 180 ),
                    Math.cos( ( this.waves.B.direction * Math.PI ) / 180 ),
                    this.waves.B.steepness,
                    this.waves.B.wavelength,
                    ],
                };
                shader.uniforms.waveC = {
                    value: [
                    Math.sin( ( this.waves.C.direction * Math.PI ) / 180 ),
                    Math.cos( ( this.waves.C.direction * Math.PI ) / 180 ),
                    this.waves.C.steepness,
                    this.waves.C.wavelength,
                    ],
                };
            }
        })



    }
    
    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.y = -24
        this.mesh.rotation.x = Math.PI * 0.5
        this.scene.add(this.mesh)
    }

    setGridMesh() {
        this.gridMesh = new THREE.Mesh(this.geometry, this.gridMaterial)
        this.gridMesh.position.x = 8
        // this.gridMesh.rotation.x = Math.PI * 0.5
        this.mesh.add(this.gridMesh)
    }
    
    update() {
        if (this.gridMaterial.userData.shader) {
            this.gridMaterial.userData.shader.uniforms.uTime.value = this.experience.time.elapsed
        }
    }

    addDebugTools() {
        if (this.debug.active) {
            this.debugFolder
                .add(this.gridMaterial, 'displacementScale')
                .min(0)
                .max(360)
                .step(0.1)
            this.debugFolder
                .add(this.waves.A, 'direction')
                .min(0)
                .max(360)
                .step(1)
                .name('Wave A Direction')
                .onFinishChange(() => {
                    this.updateWaves()
                })
            this.debugFolder
                .add(this.waves.A, 'steepness')
                .min(0)
                .max(30)
                .step(0.01)
                .name('Wave A steepness')
                .onFinishChange(() => {
                    this.updateWaves()
                })
            this.debugFolder
                .add(this.waves.A, 'wavelength')
                .min(0)
                .max(200)
                .step(1)
                .name('Wave A wavelength')
                .onFinishChange(() => {
                    this.updateWaves()
                })
            this.debugFolder
                .add(this.waves.B, 'direction')
                .min(0)
                .max(360)
                .step(1)
                .name('Wave A Direction')
                .onFinishChange(() => {
                    this.updateWaves()
                })
            this.debugFolder
                .add(this.waves.B, 'steepness')
                .min(0)
                .max(30)
                .step(0.01)
                .name('Wave B steepness')
                .onFinishChange(() => {
                    this.updateWaves()
                })
            this.debugFolder
                .add(this.waves.B, 'wavelength')
                .min(0)
                .max(200)
                .step(1)
                .name('Wave B wavelength')
                .onFinishChange(() => {
                    this.updateWaves()
                })
            this.debugFolder
                .add(this.waves.C, 'direction')
                .min(0)
                .max(360)
                .step(1)
                .name('Wave A Direction')
                .onFinishChange(() => {
                    this.updateWaves()
                })
            this.debugFolder
                .add(this.waves.C, 'steepness')
                .min(0)
                .max(30)
                .step(0.01)
                .name('Wave C steepness')
                .onFinishChange(() => {
                    this.updateWaves()
                })
            this.debugFolder
                .add(this.waves.C, 'wavelength')
                .min(0)
                .max(200)
                .step(1)
                .name('Wave C wavelength')
                .onFinishChange(() => {
                    this.updateWaves()
                })
        }
    }

    updateWaves() {

        this.gridMaterial.userData.shader.uniforms.waveA.value = [
            Math.sin( ( this.waves.A.direction * Math.PI ) / 180 ),
            Math.cos( ( this.waves.A.direction * Math.PI ) / 180 ),
            this.waves.A.steepness,
            this.waves.A.wavelength,
        ]

        this.gridMaterial.userData.shader.uniforms.waveB.value =[
            Math.sin( ( this.waves.B.direction * Math.PI ) / 180 ),
            Math.cos( ( this.waves.B.direction * Math.PI ) / 180 ),
            this.waves.B.steepness,
            this.waves.B.wavelength,
        ]

        this.gridMaterial.userData.shader.uniforms.waveC.value = [
            Math.sin( ( this.waves.C.direction * Math.PI ) / 180 ),
            Math.cos( ( this.waves.C.direction * Math.PI ) / 180 ),
            this.waves.C.steepness,
            this.waves.C.wavelength,
        ]

    }

}