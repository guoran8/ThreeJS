import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'

/**
 * We can create our own or we can use a library
 * dat.GUI
 * control-panel
 * ControlKit
 * Guify
 * Oui
 */

const DebugUI = () => {
    const mountRef = useRef<HTMLDivElement>(null)
    const gui = new dat.GUI({
        width: 400,
        closed: true })
    // Press H to hide the panel
    // gui.hide()

    useEffect(() => {
        initThree()
    })

    function initThree() {
        const sizes = {
            width: 800,
            height: 600
        }

        const scene = new THREE.Scene()
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
        camera.position.z = 3

        // Debug
        // gui.add(mesh.position, 'x', -3, 3, 0.01)
        gui
            .add(mesh.position, 'x')
            .min(-3)
            .max(3)
            .step(0.001)
            .name('elevation')
        gui.add(mesh.position, 'y', -3, 3, 0.01)
        gui.add(mesh.position, 'z', -3, 3, 0.01)

        gui
            .add(mesh, 'visible')

        gui
            .add(mesh.material, 'wireframe')

        const parameters = {
            color: 0xff0000,
            spin: () => {
                gsap.to(mesh.rotation, {
                    duration: 1,
                    y: mesh.rotation.y + Math.PI * 2
                })
            }
        }

        gui
            .addColor(parameters, 'color')
            .onChange(() => {
                material.color.set(parameters.color)
            })

        gui
            .add(parameters, 'spin')

        const renderer = new THREE.WebGLRenderer()
        mountRef.current?.appendChild(renderer.domElement)

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)

        function animate() {
            window.requestAnimationFrame(animate)
            camera.lookAt(mesh.position)
            renderer.setSize(sizes.width, sizes.height)
            renderer.render(scene, camera)
        }
        animate()
    }

    return (
        <div ref={mountRef}></div>
    )
}

export default DebugUI