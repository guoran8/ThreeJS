import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import gsap from 'gsap'


const Animation = () => {
    // TODO: JUST FOR TEST
    const mountRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        initThree()
    }, [])

    const initThree = () => {
    
        /**
         * Scene
         */
        const scene = new THREE.Scene()

        /**
         * Objects
         */
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        /**
         * Sizes
         */
        const sizes = {
            width: 800,
            height: 600
        }

        /**
         * Camera
         */
        const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height)
        camera.position.z = 3
        scene.add(camera)

        /**
         * Renderer
         */
        const renderer = new THREE.WebGLRenderer()
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement)
        }
        renderer.setSize(sizes.width, sizes.height)

        gsap.to(mesh.position, {
            duration: 1,
            delay: 1,
            x: 2
        })

        gsap.to(mesh.position, {
            duration: 1,
            delay: 2,
            x: 0
        })


        /**
         * Animation
         */
        // let time = Date.now() // Time
        // const clock = new THREE.Clock() // Clock

        const tick = () => {
            // const currentTime = Date.now()
            // const deltaTime = currentTime - time
            // time = currentTime
            // mesh.rotation.y += 0.001 * deltaTime

            // Clock
            // const elapsedTime = clock.getElapsedTime()
            // camera.position.x = Math.cos(elapsedTime)
            // camera.position.y = Math.sin(elapsedTime)
            // camera.lookAt(mesh.position)

            renderer.render(scene, camera)
            window.requestAnimationFrame(tick)
        }

        tick()
    }


    return (
        <div ref={mountRef}></div>
    )
}

export default Animation