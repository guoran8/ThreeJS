import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Camera from './camera'

/**
 * Now that we have lights, we want shadows
 * The dark shadow in the back of the objects are call core shadows
 * What we are missing are the drop shadow
 * 
 * Shadows have always been a challenge for real-time 3D rendering,
 * and developers must find tricks to display realistic shadows at a reasonable
 * frame rate
 * Three.js has a built-in solution
 * It's not perfect but it's convenient
 * 
 * When you do one render, Three.js will do render for each lights supporting shadows.
 * Those renders will simulate what the light sees as if it was a camera
 * During these lights renders, a MeshDepthMaterial replaces all members materials.
 * 
 * The lights renders are stored as textures and we call those shadow maps.
 * They are then used on every materials supposed to receive shadows and
 * projected on the geometry
 * 
 */
const Shadow = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mountRef.current) {
            initThree()
        }
    })

    function initThree() {
        // Scene
        const scene = new THREE.Scene()

        // GUI Debug
        const gui = new dat.GUI()

       
        {
            /**
             * Lights
             * Only the following types of lights support shadows
             * • PointLight
             * • DirectionalLight
             * • SpotLight
             */
            // Ambient light
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
            gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
            scene.add(ambientLight)

            // Directional light
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
            directionalLight.position.set(2, 2, -1)

            // Activate the shadows on the light with the castShadow
            directionalLight.castShadow = true

            /*
             * Shadow map optimiztions
             * RENDER SIZE
             * By default, the shadow map size is 512x512
             * We can improve it but keep a power of 2 for the mipmapping
             * 
             * NEAR AND FAR
             * To help use debug, we can use a CameraHelper with the camera used for
             * the shadow map located in the directionalLight.shadow.camera
             * 
             * AMPLITUDE
             * With the camera helper we can see that the amplitude is too large.
             * Because we are using a DirectionalLight, Three.js is using an OrthographicCamera.
             * We can control how far on each side the camera can see top, right, bottom and left.
             * 
             * The smaller the values, the more precise the shadow will be
             * If it's too small, the shadows will be cropped
             * 
             * Blur
             */
            directionalLight.shadow.mapSize.width = 1024
            directionalLight.shadow.mapSize.height = 1024

            directionalLight.shadow.camera.top = 2
            directionalLight.shadow.camera.right = 2
            directionalLight.shadow.camera.bottom = -2
            directionalLight.shadow.camera.left = -2

            directionalLight.shadow.camera.near = 1
            directionalLight.shadow.camera.far = 6

            const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
            
            gui.add(directionalLightCameraHelper, 'visible').name('shodow camera visible')
            gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
            gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
            gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
            gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
            scene.add(directionalLight)
            scene.add(directionalLightCameraHelper)
        }

        {
            // Material
            const material = new THREE.MeshStandardMaterial()
            material.roughness = 0.7
            gui.add(material, 'metalness').min(0).max(1).step(0.001)
            gui.add(material, 'roughness').min(0).max(1).step(0.001)

            // Objects
            /**
             * Go through each object and decide if it can cast a shadow with
             * castShadow and if it can receive shadow with receiveShadow
             */
            
            const sphere = new THREE.Mesh(
                new THREE.SphereBufferGeometry(0.5, 32, 32),
                material
            )
            sphere.castShadow = true

            const plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(5, 5),
                material
            )

            plane.rotation.x = - Math.PI * 0.5
            plane.position.y = -0.5
            plane.receiveShadow = true
            scene.add(sphere, plane)
        }
       
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        // Camera
        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
        camera.position.x = 1
        camera.position.y = 1
        camera.position.z = 3


        // Render
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(sizes.width, sizes.height)

        // Activate the shadow maps on the renderer
        renderer.shadowMap.enabled = true
        mountRef.current?.appendChild(renderer.domElement)

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        // Animate
        function animate() {
            controls.update()
            renderer.render(scene, camera)
            window.requestAnimationFrame(animate)
        }

        animate()
    }

    return (
        <div ref={mountRef}></div>
    )
}

export default Shadow