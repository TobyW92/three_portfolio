import Experience from '../Experience'
import Environment from './Enviornment'
import Plane from './Plane'
import Particles from './Particles'
import Stars from './Stars'
import Ship from './Ship'
import Logos from './Logos'

export default class World {

    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        this.resources.on('ready', () => {
            this.plane = new Plane()
            this.particles = new Particles()
            this.enviornment = new Environment()
            this.stars = new Stars()
            this.ship = new Ship()
            this.logos = new Logos()
        })

    }

    update() {

        if (this.plane) {
            this.plane.update()
        }
        if (this.ship) {
            this.ship.update()
        }
        if (this.logos) {
            this.logos.update()
        }
        if (this.particles) {
            this.particles.update()
        }
    }
}