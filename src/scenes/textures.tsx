import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls  } from 'three/examples/jsm/controls/OrbitControls'

const Textures = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mountRef.current) {
            initTHREE()
        }
    })

    function initTHREE() {
        const scene = new THREE.Scene()

        /**
         * Texture
         */
        // const image = new Image()
        // image.src = 'src/assets/textures/door/color.jpg'
        // const texture = new THREE.Texture(image)
        // image.onload = () => {
        //     texture.needsUpdate = true
        // }

        /**
         * Texture loader
         * We can use a LoadingManager to mutualize the events
         * It's useful if we want to know the global loading progress or be informed
         * when everything is loaded
         */
        const loadingManager = new THREE.LoadingManager()
        loadingManager.onStart = () => {
            console.log('onStart')
        }
        loadingManager.onLoad = () => {
            console.log('onLoad')
        }
        loadingManager.onProgress = () => {
            console.log('onProgress')
        }
        loadingManager.onError = () => {
            console.log('onError')
        }

        const textureLoader = new THREE.TextureLoader(loadingManager)
        // const colorTexture = textureLoader.load('src/assets/textures/door/color.jpg')
        // const colorTexture = textureLoader.load('src/assets/textures/checkerboard-8x8.png')
        // const colorTexture = textureLoader.load('src/assets/textures/checkerboard-1024x1024.png')
        const colorTexture = textureLoader.load('src/assets/textures/minecraft.png')
        const alphaTexture = textureLoader.load('src/assets/textures/door/alpha.jpg')
        const heightTexture = textureLoader.load('src/assets/textures/door/height.jpg')
        const normalTexture = textureLoader.load('src/assets/textures/door/normal.jpg')
        const ambientOcclusionTexture = textureLoader.load('src/assets/textures/door/ambientOcclusion.jpg')
        const metalnessTexture = textureLoader.load('src/assets/textures/door/metalness.jpg')
        const roughnessTexture = textureLoader.load('src/assets/textures/door/roughness.jpg')

        // We can repeat the texture by using the repeat property
        // It's a Vector2 with x and y properties
        // colorTexture.repeat.x = 2
        // colorTexture.repeat.y = 3

        // By default, the texture doesn't repeat and the last pixel get stretched
        // We can change that with THREE.RepeatWrapping on the wrapS and wrapT properties
        // colorTexture.wrapS = THREE.RepeatWrapping
        // colorTexture.wrapT = THREE.RepeatWrapping

        // We can alternate the direction with THREE.MirroredRepeatWrapping
        // colorTexture.wrapS = THREE.MirroredRepeatWrapping
        // colorTexture.wrapT = THREE.MirroredRepeatWrapping

        // We can offset the texture using the offset property which is a Vector2
        // colorTexture.offset.x = 0.5
        // colorTexture.offset.y = 0.5

        // We can rotate the texture using the rotation property
        // colorTexture.rotation = Math.PI * 0.25

        // the 0, 0 UV coordinates
        // the rotation occurs around the bottom left corner
        // We can change this pivot point with the center property which is a Vector2:
        // colorTexture.center.x = 0.5
        // colorTexture.center.y = 0.5

        colorTexture.generateMipmaps = false
        colorTexture.minFilter = THREE.NearestFilter
        colorTexture.magFilter = THREE.NearestFilter

        /**
         * Objects
         */
        const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
        const material = new THREE.MeshBasicMaterial({
            map: colorTexture
        })
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)


        /**
         * Camera
         */
        const sizes = {
            width: 800,
            height: 600
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
        
        /**
         * Animation
         */
        function animate() {
            window.requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }

        animate()
    }

    return (
        <div ref={mountRef}></div>
    )
}

export default Textures
