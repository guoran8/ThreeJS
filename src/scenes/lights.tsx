import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls  } from 'three/examples/jsm/controls/OrbitControls'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'

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
         * Debug ui
         */
          const gui = new dat.GUI({
            width: 400,
            closed: true
        })

        /**
         * Lights
         * 
         * Performance
         * Lights can cost a lot when it comes to performances
         * Try to add as few lights as possible and try to use the lights that cost less
         * Minimal cost: AmbientLight/HemisphereLight
         * Moderate cost: DirectionalLight/PointLight
         * High cost: SpotLight/RectAreaLight
         * 
         * Bake
         * The idea is to bake the light into the texture
         * This can be done in a 3D software
         * The drawback is that we cannot move the light anymore and
         * we have to load huge texture
         * Example: https://threejs-journey.com/ baked.jpg
         * 
         * Helper
         * To assist us with positioning the lights, we can use helpers
         * HemisphereLightHelper
         * DirectionalLightHelper
         * PointLightHelper
         * RectAreaLightHelper
         * SpotLightHelper
         */

        {
            /**
             * The AmbientLight applies omnidirectional lighting
             * • color
             * • intensity
             */
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
            ambientLight.color = new THREE.Color(0xffffff)
            ambientLight.intensity = 0.5
            scene.add(ambientLight)
            gui.add(ambientLight, 'intensity', 0, 1, 0.001)
        }
        
        {
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

            // Helper
            const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
            scene.add(directionalLightHelper)
        }
       

        {
             /**
             * The HemishphereLight is similar to the AmbientLight but with
             * a different color from the sky than the color coming from ground
             * • color(or skyColor)
             * • groundColor
             * • intensity
             */
            const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.5)
            scene.add(hemisphereLight)

            // Helper
            const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
            scene.add(hemisphereLightHelper)
        }
       

        {
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

            // Helper
            const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
            scene.add(pointLightHelper)
        }
        
        {
            /** 
             * The RectAreaLight works like the big ractangle lights
             * you can see on the photoshoot set
             * It's a mix between a directional light and a diffuse light
             * • color 
             * • intensity
             * • width
             * • height
             * 
             * The RectAreaLight only works with MeshStandardMaterial and
             * MeshPhysicalMaterial
             */
            const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 3, 1)

            // You can then move the light and rotate it
            // You can also use lookAt(...) to rotate more easily
            rectAreaLight.position.set(-1.5, 0, 1.5)
            rectAreaLight.lookAt(new THREE.Vector3())
            scene.add(rectAreaLight)

            // RectAreaLightHelper isn't part of the three variable and
            // we must import it
            // we need to update it on the next frame and also update its
            // position and rotation manually
            //
            // rectAreaLightHelper.position.copy(rectAreaLight.position)
            // rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
            // rectAreaLightHelper.update()
            const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
            scene.add(rectAreaLightHelper)
        }
       
        {
             /**
             * The SpotLight is like a flashlight
             * It's a cone of light starting at a point and oriented in a direction
             * • color
             * • intensity
             * • distance
             * • angle
             * • penumbra
             * • decay
             */
            const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 6, Math.PI * 0.1, 0.5, 1)
            spotLight.position.set(0, 2, 3)
            scene.add(spotLight)
            // To rotate the SpotLight, we need to add its target property to the scene
            // and move it
            spotLight.target.position.x = -0.75
            scene.add(spotLight.target)

            // Helper
            // The SpotLight has no size, we also need to call its update(...) method on
            // next frame after moving the target
            const spotLigheHelper = new THREE.SpotLightHelper(spotLight)
            scene.add(spotLigheHelper)
        }
       

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

        animate()
    }
   
    return (
        <div ref={mountRef}></div>
    )
}

export default Lights