import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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

        // for animate function can access
        let sphere
        let sphereShadow

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
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
            gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
            scene.add(ambientLight)

            // Directional light
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
            directionalLight.position.set(2, 2, -1)

            // Activate the shadows on the light with the castShadow
            directionalLight.castShadow = true

            /**
             * Spot Light
             */
            const spotLight = new THREE.SpotLight(0xffffff, 0.4, 10, Math.PI * 0.3)
            spotLight.castShadow = true
            spotLight.position.set(0, 2, 2)

            /**
             * We can improve the shadow quality using the same technics that we used for
             * the directional light
             */
            spotLight.shadow.mapSize.width = 1024
            spotLight.shadow.mapSize.height = 1024

            /**
             * Because we are using a SpotLight, Three.js is using a PerspectiveCamera
             * We must change the fov property to adapt the amplitude
             */
            spotLight.shadow.camera.fov = 30
            spotLight.shadow.camera.near = 1
            spotLight.shadow.camera.far = 6

            scene.add(spotLight)
            scene.add(spotLight.target)

            const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
            spotLightCameraHelper.visible = false
            scene.add(spotLightCameraHelper)

            /**
             * Point light
             */
            const pointLight = new THREE.PointLight(0xffffff, 0.3)
            pointLight.castShadow = true
            pointLight.position.set(-1, 1, 0)

            pointLight.shadow.mapSize.width = 1024
            pointLight.shadow.mapSize.height = 1024

            pointLight.shadow.camera.near = 0.1
            pointLight.shadow.camera.far = 5
            scene.add(pointLight)

            /**
             * The camera helper seems to be PerspectiveCamera facing downward
             * Three.js uses a PerspectiveCamera but in all 6 directions and finishes downward.
             */
            const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
            pointLightCameraHelper.visible = false
            scene.add(pointLightCameraHelper)

            /**
             * Shadow map optimizations
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
             * You can control the shadow blur with the radius property
             * directionalLight.shadow.radius = 10
             *
             * This technic doesn't use the proximity of the camera with the
             * object, it's a general and cheap blur
             *
             * Different types of algorithms can be applied to shadow maps
             * • THREE.BasicShadowMap - Very performant but lousy quality.
             * • THREE.PCFShadowMap - Less performant but smoother edges (default).
             * • THREE.PCFSoftShadowMap - Less performant but even softer edges.
             * • THREE.VSMShadowMap - Less performant, more constraints, can have unexpected results.
             *
             * The radius doesn't work with THREE.PCFSoftShadowMap
             */
            directionalLight.shadow.mapSize.width = 1024
            directionalLight.shadow.mapSize.height = 1024

            directionalLight.shadow.camera.top = 2
            directionalLight.shadow.camera.right = 2
            directionalLight.shadow.camera.bottom = -2
            directionalLight.shadow.camera.left = -2

            directionalLight.shadow.camera.near = 1
            directionalLight.shadow.camera.far = 6

            directionalLight.shadow.radius = 10

            const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
            directionalLightCameraHelper.visible = false
            
            gui.add(directionalLightCameraHelper, 'visible').name('shadow camera visible')
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
             *
             * BAKING SHADOW
             * A good alternative to three.js shadows is bake shadows
             * We integrate shadows in textures that we apply on materials
             *
             * Instead of MeshStandardMaterial use a MeshBasicMaterial on the
             * plane material with the bakedShadow
             *
             * Unfortunately it's not dynamic
             *
             * BAKING SHADOWS ALTERNATIVE
             * We can also use a more simpler baked shadow and move it
             * so it stays under the sphere
             */

            const textureLoader = new THREE.TextureLoader()
            const bakedShadow = textureLoader.load('src/assets/textures/bakedShadow.jpg')
            const simpleShadow = textureLoader.load('src/assets/textures/simpleShadow.jpg')

            sphere = new THREE.Mesh(
                new THREE.SphereBufferGeometry(0.5, 32, 32),
                material
            )

            sphere.castShadow = true

            const plane = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(5, 5),
                material
                // new THREE.MeshBasicMaterial({ map: bakedShadow })
            )

            plane.rotation.x = - Math.PI * 0.5
            plane.position.y = -0.5
            plane.receiveShadow = true


            // Create a plane slightly above the floor with an alphaMap using
            // the simpleShadow
            sphereShadow = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(1.5, 1.5),
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    transparent: true,
                    alphaMap: simpleShadow
                })
            )
            sphereShadow.rotation.x = -Math.PI * 0.5
            // must add 0.01
            sphereShadow.position.y = plane.position.y + 0.01

            scene.add(sphere, sphereShadow, plane)
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


        // Renderer
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(sizes.width, sizes.height)

        // Activate the shadow maps on the renderer
        renderer.shadowMap.enabled = false

        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        mountRef.current?.appendChild(renderer.domElement)

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        const clock = new THREE.Clock()
        // Animate
        function animate() {
            const elapsedTime = clock.getElapsedTime()

            // update controls
            controls.update()

            // Update the sphere
            sphere.position.x = Math.cos(elapsedTime) * 1.5
            sphere.position.z = Math.sin(elapsedTime) * 1.5
            sphere.position.y = Math.abs(Math.sin(elapsedTime * 1.5))

            // Update the shadow
            sphereShadow.position.x = sphere.position.x
            sphereShadow.position.z = sphere.position.z
            sphereShadow.material.opacity = (1 - Math.abs(sphere.position.y)) * 0.3

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