import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {render} from 'react-dom'
import animation from './animation'

const Geometry = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mountRef.current) {
            initThree()
        }
    }, [])

    function initThree() {
        // Sizes
        const sizes = {
            width: 800,
            height: 600
        }

        // Scene
        const scene = new THREE.Scene()

        // Objects
        // const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
        // const geometry = new THREE.BufferGeometry()

        // We are going to use Vector3 to create vertices and put
        // them in the vertices array
        // const vertice1 = new THREE.Vector3(0, 0, 0)
        // const vertice2 = new THREE.Vector3(0, 3, 0)
        // const vertice3 = new THREE.Vector3(1, 0, 0)
        // geometry.setFromPoints([
        //     vertice1,
        //     vertice2,
        //     vertice3
        // ])

        // Create a bunch of random triangles
        // let points = []
        // for (let i = 0; i < 50; i++) {
        //     points.push(
        //         new THREE.Vector3(
        //             (Math.random() - 0.5) * 4,
        //             (Math.random() - 0.5) * 4,
        //             (Math.random() - 0.5) * 4
        //         ),
        //         new THREE.Vector3(
        //             (Math.random() - 0.5) * 4,
        //             (Math.random() - 0.5) * 4,
        //             (Math.random() - 0.5) * 4
        //         ),
        //         new THREE.Vector3(
        //             (Math.random() - 0.5) * 4,
        //             (Math.random() - 0.5) * 4,
        //             (Math.random() - 0.5) * 4
        //         )
        //     )
        // }
        // geometry.setFromPoints(points)

        // Specify a length and then fill the array
        // const positionArray = new Float32Array([
        //     0, 0, 0,
        //     0, 1, 0,
        //     1, 0, 1
        // ])
        const count = 50
        const positionArray = new Float32Array(count * 3 * 3)

        for (let i = 0; i < count * 3 * 3; i++) {
            positionArray[i] = (Math.random() - 0.5) * 4
        }
        // Convert that Float32Array to a BufferAttribute
        const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
        // Add this BufferAttribute to our BufferGeometry with setAttribute()
        // position is the name that will be used in the shaders
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', positionAttribute)

        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
        camera.position.z = 3

        // Renderers
        const renderer = new THREE.WebGLRenderer()
        mountRef.current?.appendChild(renderer.domElement)

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)

        function animate() {
            requestAnimationFrame(animate)
            renderer.setSize(sizes.width, sizes.height)
            renderer.render(scene, camera)
        }

        animate()
    }

    return (
        <div ref={mountRef}></div>
    )
}

export default Geometry