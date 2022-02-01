import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const Camera = () => {
    const mountRef = useRef<HTMLDivElement>(null)
    const sizes = {
        width: 600,
        height: 800
    }
    const cursor = {
        x: 0,
        y: 0
    }

    useEffect(() => {
        initThree()
        mouseMove()
    }, [])

    const initThree = () => {
        const scene = new THREE.Scene()

        const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
        // const aspectRatio = sizes.width / sizes.height
        // const camera = new THREE.OrthographicCamera(
        //     -1 * aspectRatio,
        //     1 * aspectRatio,
        //     1,
        //     -1,
        //     0.1,
        //     100
        // )

        // camera.position.x = 2
        // camera.position.y = 2
        camera.position.z = 3
        camera.lookAt(mesh.position)
        // scene.add(camera)

        const renderer = new THREE.WebGLRenderer()

        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement)
        }

        /**
         * Controls
         */
        const controls = new OrbitControls(camera, renderer.domElement)
        // controls.target.y = 2
        // controls.update()
        controls.enableDamping = true

        renderer.setSize(sizes.width, sizes.height)
        // renderer.render(scene, camera)

        const clock = new THREE.Clock()

        const tick = () => {
            const elapsedTime = clock.getElapsedTime()
            // mesh.rotation.y = elapsedTime
            // Update camera
            // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
            // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
            // camera.position.y = cursor.y * 5
            // // camera.position.y = cursor.y * 10
            // camera.lookAt(mesh.position)

            controls.update() // for damping
            // Render
            renderer.render(scene, camera)
            window.requestAnimationFrame(tick)
        }

        tick()
    }

    const mouseMove = () => {
        document.addEventListener('mousemove', (event) => {
            cursor.x = event.clientX / sizes.width - 0.5
            cursor.y = -(event.clientY / sizes.height - 0.5)
        })
    }

    return (
        <div ref={mountRef}></div>
    )
}

export default Camera