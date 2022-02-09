import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls  } from 'three/examples/jsm/controls/OrbitControls'

const Lights = () => {
    
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mountRef.current) {
            initThree()
        }
    })
   

    function initThree() {
         // Scene
        const scene = new THREE.Scene()

        /**
         * Lights
         * 
         * The AmbientLight applies omnidirectional lighting
         * • color
         * • intensity
         */
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        ambientLight.color = new THREE.Color(0xffffff)
        ambientLight.intensity = 0.5
        scene.add(ambientLight)

        /**
         * The directionalLight will have a sun-like effect as if the sun
         * rays were traveling in paralle
         * • intensity
         * • color
         */
        const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3)
        // To change the direction, move the light
        directionalLight.position.set(1, 0.25, 0)
        scene.add(directionalLight)

        /**
         * The HemishphereLight is similar to the AmbientLight but with
         * a different color from the sky than the color coming from ground
         * • color(or skyColor)
         * • groundColor
         * • intensity
         */
        const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.5)
        scene.add(hemisphereLight)

        /**
         * The pointLight is almost like a lighter
         * The light starts at an infinitely small point spreads uniformly in
         * directions.
         * • color
         * • intensity
         * 
         * By default, the light intensity doesn't fade.
         * We can control the fade distance and how fast it fades with
         * distance and decay
         */
        const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2)
        pointLight.position.set(1, -0.5, 1)
        scene.add(pointLight)

        /** 
         * The RectAreaLight works like the big ractangle lights
         * you can see on the photoshoot set
         * It's a mix between a directional light and a diffuse light
         * • color 
         * • intensity
         * • width
         * • height
         */
        const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1)
        scene.add(rectAreaLight)


        /**
         * Objects
         */
        // Material
        const material = new THREE.MeshStandardMaterial()
        material.roughness = 0.4

        // Objects
        const sphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.5, 32, 32),
            material
        )
        sphere.position.x = -1.5

        const cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
            material
        )

        const torus = new THREE.Mesh(
            new THREE.TorusBufferGeometry(0.3, 0.2, 32, 64),
            material
        )
        torus.position.x = 1.5

        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(5, 5),
            material
        )
        plane.rotation.x = -Math.PI * 0.5
        plane.position.y = -0.65

        scene.add(sphere, cube, torus, plane)

        /** 
         * Camera
         */
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
        camera.position.z = 3

        /**
         * Renderer
         */
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(sizes.width, sizes.height)
        mountRef.current?.appendChild(renderer.domElement)

        /**
         * Controls
         */
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        /**
         * Animate
         */
        const clock = new THREE.Clock()

        function animate() {
            const elapsedTime = clock.getElapsedTime()
            // Update objects
            sphere.rotation.y = 0.1 * elapsedTime
            cube.rotation.y = 0.1 * elapsedTime
            torus.rotation.y = 0.1 * elapsedTime

            sphere.rotation.x = 0.15 * elapsedTime
            cube.rotation.x = 0.15 * elapsedTime
            torus.rotation.x = 0.15 * elapsedTime

            // Update controls
            controls.update()

            // Rneder
            renderer.render(scene, camera)

            // Call animate again on the next frame
            window.requestAnimationFrame(animate)
        }

       /**
         * Debug ui
         */
        const gui = new dat.GUI({
            width: 400,
            closed: true
        })

        gui.add(ambientLight, 'intensity', 0, 1, 0.001)
        

        animate()
    }
   
    return (
        <div ref={mountRef}></div>
    )
}

export default Lights