import React, {Component, ElementRef, useEffect, useRef} from 'react'
import * as THREE from 'three'

const BasicScene = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        initThreeJS()
    }, [])

    const initThreeJS = () => {

        // Scene
        const scene = new THREE.Scene()

        // Red cube
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000
        })

        const mesh = new THREE.Mesh(geometry, material)

        scene.add(mesh)

        // Sizes
        const sizes = {
            width: 800,
            height: 600
        }

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
        camera.position.z = 3
        // camera.position.x = 2
        // camera.position.y = 1

        scene.add(camera)

        // Renderer
        // Canvas
        // const canvas = document.querySelector('.webgl')
        // const renderer = new THREE.WebGLRenderer({
        //     canvas
        // })
        const renderer = new THREE.WebGLRenderer()
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement)
        }

        renderer.setSize(sizes.width, sizes.height)

        renderer.render(scene, camera)
    }

    return (
        <div ref={mountRef}></div>
    )
}

export default BasicScene