import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { gsap } from 'gsap'

/**
 * Base
 */


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const floorDiff = textureLoader.load('./wood_floor/wood_floor_diff.webp')
const floorDisp = textureLoader.load('./wood_floor/wood_floor_disp.webp')
const floorARM = textureLoader.load('./wood_floor/wood_floor_arm.webp')
const floorNor = textureLoader.load('./wood_floor/wood_floor_nor_gl.webp')

floorDiff.colorSpace = THREE.SRGBColorSpace
floorDiff.repeat.set(3, 3)
floorDiff.wrapS = THREE.RepeatWrapping
floorDiff.wrapT = THREE.RepeatWrapping

floorDisp.repeat.set(3, 3)
floorDisp.wrapS = THREE.RepeatWrapping
floorDisp.wrapT = THREE.RepeatWrapping

floorARM.repeat.set(3, 3)
floorARM.wrapS = THREE.RepeatWrapping
floorARM.wrapT = THREE.RepeatWrapping

floorNor.repeat.set(3, 3)
floorNor.wrapS = THREE.RepeatWrapping
floorNor.wrapT = THREE.RepeatWrapping

const wallDiff = textureLoader.load('./plaster_wall/plaster_wall_diff.webp')
const wallDisp = textureLoader.load('./plaster_wall/plaster_wall_disp.webp')
const wallARM = textureLoader.load('./plaster_wall/plaster_wall_arm.webp')
const wallNor = textureLoader.load('./plaster_wall/plaster_wall_nor_gl.webp')

wallDiff.colorSpace = THREE.SRGBColorSpace
wallDiff.repeat.set(3, 3)
wallDiff.wrapS = THREE.RepeatWrapping
wallDiff.wrapT = THREE.RepeatWrapping

wallDisp.repeat.set(3, 3)
wallDisp.wrapS = THREE.RepeatWrapping
wallDisp.wrapT = THREE.RepeatWrapping

wallARM.repeat.set(3, 3)
wallARM.wrapS = THREE.RepeatWrapping
wallARM.wrapT = THREE.RepeatWrapping

wallNor.repeat.set(3, 3)
wallNor.wrapS = THREE.RepeatWrapping
wallNor.wrapT = THREE.RepeatWrapping

/**
 * Dimensions
 */
const dimensions = {
    width: 6,
    depth: 6,
    height: 2
}

/**
 * Floor
 */
const floorGeometry = new THREE.PlaneGeometry(dimensions.width, dimensions.depth)
const floorMaterial = new THREE.MeshStandardMaterial({
    color: '#bbbbbb',
    map: floorDiff,
    aoMap: floorARM,
    roughnessMap: floorARM,
    metalnessMap: floorARM,
    normalMap: floorNor,
    displacementMap: floorDisp,
    displacementScale: 0.3,
    displacementBias: -0.155
})
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotateX( - 0.5 * Math.PI)
floor.position.set(0, 0, 0)
scene.add(floor)

// gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001).name('Floor Displacement Bias')
// gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('Floor Displacement Scale')


/**
 * Walls
 */
const wallGroup = new THREE.Group()
scene.add(wallGroup)

const wallGeometry = new THREE.PlaneGeometry(dimensions.width, dimensions.height)
const wallMaterial = new THREE.MeshStandardMaterial({
    color: '#556677',
    map: wallDiff,
    aoMap: wallARM,
    roughnessMap: wallARM,
    metalnessMap: wallARM,
    normalMap: wallNor,
    displacementMap: wallDisp,
    displacementScale: 0.3,
    displacementBias: -0.219
})
const wall1 = new THREE.Mesh(wallGeometry, wallMaterial)
wall1.position.set(0, dimensions.height / 2, dimensions.depth / 2)
wall1.rotateX(1 * Math.PI)
// wallGroup.add(wall1)

const wall2 = new THREE.Mesh(wallGeometry, wallMaterial)
wall2.position.set(0, dimensions.height / 2, - (dimensions.depth / 2))
// wall2.rotateX(1 * Math.PI)
wallGroup.add(wall2)

const wall3 = new THREE.Mesh(wallGeometry, wallMaterial)
wall3.position.set(dimensions.depth / 2, dimensions.height / 2, 0)
wall3.rotateY(- 0.5 * Math.PI)
wallGroup.add(wall3)

const wall4 = new THREE.Mesh(wallGeometry, wallMaterial)
wall4.position.set(- (dimensions.depth / 2), dimensions.height / 2, 0)
wall4.rotateY(0.5 * Math.PI)
// wallGroup.add(wall4)

// gui.add(wall1.material, 'displacementBias').min(-1).max(1).step(0.001).name('Wall Displacement Bias')
// gui.add(wall1.material, 'displacementScale').min(0).max(10).step(0.001).name('Wall Displacement Scale')

/**
 * Models
 */
const gltfLoader = new GLTFLoader()

const asteroidGroup = new THREE.Group()
asteroidGroup.position.set(-1.75, 0, -2.6)
scene.add(asteroidGroup)

gltfLoader.load('./models/arcade/asteroids.glb', (gltf) => {
    const arcade = gltf.scene
    arcade.scale.setScalar(0.175)
    arcade.name = 'Asteroids'
    
    asteroidGroup.add(arcade)
})


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 5)
scene.add(ambientLight)

// const directionalLight = new THREE.DirectionalLight('#ffffff', 2)
// directionalLight.position.set(0, 4, 0)
// scene.add(directionalLight)




/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    cssRenderer.setSize(sizes.width, sizes.height)
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
scene.add(camera)


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * CSS Renderer
 */
// const cssRenderer = new CSS2DRenderer()
const cssRenderer = new CSS3DRenderer()
cssRenderer.setSize(sizes.width, sizes.height)
cssRenderer.domElement.style.position = 'fixed'
cssRenderer.domElement.style.top = '0px'
cssRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(cssRenderer.domElement)

/**
 * CSS 2d Element
 */
const asteroidsGame = document.createElement('div')
asteroidsGame.innerHTML = `<div class="game">
      <canvas id="gameCanvas" width="900" height="695">
      </canvas>  
      <button class="mute" onclick="Mute();"><img src='./volume/volume-on.svg' id='soundON' class=''><img src='./volume/volume-off.svg' id='soundOFF' class='hidden'></button>
      <button class=" playButton playAgain hidden" onclick="newGame();">Play Again?</button>
      <button class=" playButton playGame" onclick="getCanvas();">Play Game?</button>
      <h3 class="aiOFF hidden">// Turret Mode: Disabled //</h3>
      <h3 class="aiON hidden">// Turret Mode: ENGAGED //</h3>
    </div>
    <div class="gameInstr">Use Arrow Keys to Move and Space Bar to Fire.
      <br>
      Down Arrow to Toggle Weapons AI / Turret Mode.
    </div>
    `
asteroidsGame.style.width = '900px'
asteroidsGame.style.height = '695px'
asteroidsGame.style.pointerEvents = 'none'

const gameScreen = new CSS3DObject(asteroidsGame)
gameScreen.scale.set(.0005, .0005, .0005)
gameScreen.position.set(0.0001, 1.181, 0.017)
gameScreen.rotation.set(-0.33, 0, 0)
asteroidGroup.add(gameScreen)
gameScreen.visible = false



document.getElementById('playNow').addEventListener('click', () => {
    gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '-1.77',
        y: '1.3663921284258616',
        z: '-2.1',
        onUpdate: function() {
            gameScreen.visible = true
        },
    })
    gsap.to(camera.rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '-0.3',
        y: '0.0012787126341464068',
        z: '0.004629962114136886'
    })
    document.querySelector('.project').classList.add("hidden")
    document.querySelector('#back').classList.remove("hidden")
})

camera.position.set(-2.65, 2, -1)
camera.rotation.set(-0.7853981633974484, -0.6154797086703871, -0.5235987755982987)


/**
 * Buttons
 */

document.getElementById('back').addEventListener('click', (e) => {
    gsap.to(camera.position, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: -2.65,
        y: 2,
        z: -1,
    })
    gsap.to(camera.rotation, {
        duration: 1.5,
        ease: 'power2.inOut',
        x: -0.7853981633974484,
        y: -0.6154797086703871,
        z: -0.5235987755982987,
    })
    document.querySelector('.project').classList.remove("hidden")
    document.querySelector('#back').classList.add("hidden")
})


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime= 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime


    // Render
    cssRenderer.render(scene, camera)
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()