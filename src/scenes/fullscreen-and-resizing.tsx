import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const FullscreenAndResizing = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mountRef.current) {
            initThree()
        }
    }, [])

    const initThree = () => {
        // Scene
        const scene = new THREE.Scene()

        // Objects
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        // Sizes
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width/ sizes.height)
        camera.position.z = 3
        camera.lookAt(mesh.position)

        // Renderer
        const renderer = new THREE.WebGLRenderer()

        mountRef.current?.appendChild(renderer.domElement)

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        const animate = () => {
            requestAnimationFrame(animate)
            controls.update()
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
            renderer.setSize(sizes.width, sizes.height)
            // Avoid doing this because it might be too much to handle for the device
            // Limit to something like 2
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            renderer.render(scene, camera)
        }

        animate()
        addResizingListener(sizes)
        addDBClickListener(renderer.domElement)
    }

    const addResizingListener = (sizes) => {
        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
        })
    }

    const addDBClickListener = (canvas) => {
        window.addEventListener('dblclick', () => {
            // to work on Safari
            const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
            if (!fullscreenElement) {
                if (canvas.requestFullscreen) {
                    canvas.requestFullscreen()
                } else if (canvas.webkitRequestFullscreen) {
                    canvas.webkitRequestFullscreen()
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().then()
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen()
                }
            }
        })
    }

    return (
        <div ref={mountRef}></div>
    )
}

export default FullscreenAndResizing