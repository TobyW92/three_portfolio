import * as THREE from 'three'
import Experience from '../Experience'

export default class Music {
    constructor() {
        this.experience = new Experience()
        this.camera = this.experience.camera
        this.resources = this.experience.resources

        
        this.loader = new THREE.AudioLoader()
        this.listener = new THREE.AudioListener()
        this.camera.instance.add(this.listener)

        this.sound = new THREE.Audio(this.listener)

        this.soundPlaying = false

        this.loader.load('/music/space-racer-retro.mp3',(buffer) => {
            this.sound.setBuffer(buffer)
            this.sound.setLoop(true)
            this.sound.setVolume(0.1)
        })

        


        document.querySelector('#sound').addEventListener('click', () => {
            if (this.soundPlaying) {
                this.sound.pause()
                this.soundPlaying = false
                document.querySelector('#sound').innerHTML = 'Play Music'
            } else {
                this.sound.play()
                this.soundPlaying = true
                document.querySelector('#sound').innerHTML = 'Pause Music'
            }
            
        })
    }
}