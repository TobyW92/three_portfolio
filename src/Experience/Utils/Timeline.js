import Experience from '../Experience'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default class Timeline {

    constructor() {

        this.experience = new Experience()
        this.scene = this.experience.scene

        gsap.registerPlugin(ScrollTrigger)

        this.timelines = {}

        this.createTimelines()

    }

    createTimelines() {
        this.timelines.t1 = gsap.timeline({
            scrollTrigger: {
                trigger: '.t1',
                start: '-100vh bottom',
                end: 'bottom center',
                scrub: true,
                markers: true
            }
        })

        this.timelines.t1.to('.t1', {
            bottom: "5vh",
          }, '<')



        this.timelines.t2 = gsap.timeline({
            scrollTrigger: {
              trigger: '.tl2',
              start: 'top bottom',
              end: 'bottom center',
              scrub: true,
            }
        })

        this.timelines.t2.to('.t1', {
            opacity: 0,
          },'<')

        this.timelines.t2.to('.t2', {
            bottom: "5vh",
        },'<')

        this.timelines.t3 = gsap.timeline({
            scrollTrigger: {
              trigger: '.tl3',
              start: 'top bottom',
              end: 'bottom center',
              scrub: true,
            }
        })

        this.timelines.t3.to('.t2', {
            opacity: 0,
          },'<')

        this.timelines.t3.to('.t3', {
            bottom: "5vh",
        },'<')

        this.timelines.t4 = gsap.timeline({
            scrollTrigger: {
              trigger: '.tl4',
              start: 'top bottom',
              end: 'bottom center',
              scrub: true,
            }
        })

        this.timelines.t4.to('.t3', {
            opacity: 0,
          },'<')

        this.timelines.t4.to('.t4', {
            bottom: "5vh",
        },'<')

        this.timelines.t5 = gsap.timeline({
            scrollTrigger: {
              trigger: '.tl5',
              start: 'top bottom',
              end: 'bottom center',
              scrub: true,
            }
        })

        this.timelines.t5.to('.t4', {
            opacity: 0,
          },'<')

        this.timelines.t5.to('.t5', {
            bottom: "unset",
            top: '5vh'
        },'<')
    }

}
