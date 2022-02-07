import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls  } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

/**
 * We are goint to do what ilithya did with her cool portfolio
 * https://www.ilithya.rocks
 * and create a bit 3D text in the middle of the scene with
 * objects floating around
 * 
 * We are goint to use the TextBufferGeometry class but we need
 * particular font format called typeface
 * 
 * If you are using a typeface you've download you must have the right
 * to use it
 * 
 * We can convert a font with tools like:
 * https://gero3.github.io/facetype.js
 * 
 * We can also use fonts provided by Three.js
 * Go to the /node_modules/three/examples/fonts folder
 * 
 * Creating a text geometry is long and hard for the computer.
 * Avoiding doing it too many times and keep the geometry as low poly as possible
 * By reducing the curveSegments and beveSegments.
 * Remove the wireframe once happy with the level of details
 */
const ThreeDText = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mountRef.current) {
            initThree()
        }
    })

    function initThree() {
        // Scene
        const scene = new THREE.Scene()

        // Axes helper
        const axesHelper = new THREE.AxesHelper()
        scene.add(axesHelper)

        /**
         * Textures
         */
        const textureLoader = new THREE.TextureLoader()
        const matcapTexture = textureLoader.load('src/assets/textures/matcaps/1.png')

        /**
         * Fonts
         * To load the font, we need FontLoader
         * 
         * We are going to use TextBufferGeometry
         */
        const fontLoader = new FontLoader()
        fontLoader.load(
            'src/assets/fonts/helvetiker_regular.typeface.json',
            (font) => {
                const textGeometry = new TextGeometry(
                    'Hello World',
                    {
                        font,
                        size: 0.5,
                        height: 0.2,
                        curveSegments: 6,
                        bevelEnabled: true,
                        bevelThickness: 0.03,
                        bevelSize: 0.02,
                        bevelOffset: 0,
                        bevelSegments: 4
                    }
                )

                /**
                 * USING THE BOUNDING
                 * The bunding is an information associated with geometry that tells
                 * what space is taken by that geometry
                 * It can be a box or a sphere
                 * 
                 * It helps Three.js calculate if the object is on the screen(frustum culling)
                 * We are going to use the bounding measures to recenter the geometry
                 * 
                 * By default, Three.js is using sphere bounding
                 * Calculate the box bounding with computeBoundingBox
                 * 
                 * The result is an instance of Box3 with min and max properties
                 * The min property isn't at 0 because of the bevelThickness and bevelSize.
                 * 
                 * Instead of moving the mesh, we are going to move the whole geometry with translate(...)
                 */
                
                /**
                 * The text looks centered but it's not because of the 
                 * bevelThickness and bevelSize
                 */
                //  textGeometry.computeBoundingBox()

                //  const boundingBox = textGeometry.boundingBox as THREE.Box3
                // textGeometry.translate(
                //     -(boundingBox.max.x - 0.02) * 0.5,
                //     -(boundingBox.max.y - 0.02) * 0.5,
                //     -(boundingBox.max.z - 0.03) * 0.5
                // )

                /**
                 * To centered using tanslate was long,
                 * There is a much faster way.
                 */
                textGeometry.center()


                /**
                 * ADD A MATCAP MATERIAL
                 * https://github.com/nidorx/matcaps
                 */

                const material = new THREE.MeshMatcapMaterial({
                    matcap: matcapTexture
                })

                const text = new THREE.Mesh(textGeometry, material)
                scene.add(text)

                console.time('donuts')
                /**
                 * Create 100 donuts
                 * Optimize
                 * We can use the same material and the same geometry on multiple Meshes
                 */
                const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

                for(let i = 0; i < 100; i++) {                   
                    // const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
                    // const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
                    const donut = new THREE.Mesh(donutGeometry, material)

                    // Add randomness in their position
                    donut.position.x = (Math.random() - 0.5) * 10
                    donut.position.y = (Math.random() - 0.5) * 10
                    donut.position.z = (Math.random() - 0.5) * 10

                    // Add randomness in their rotation
                    donut.rotation.x = Math.random() * Math.PI
                    donut.rotation.y = Math.random() * Math.PI

                    // Add randomness in their scale
                    const scale = Math.random()
                    donut.scale.set(scale, scale, scale)

                    scene.add(donut)
                }
                console.timeEnd('donuts')
            }
        )

        // Objects
        // Camera
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
        camera.position.z = 3
        scene.add(camera)

        // Renderer
        const renderer = new THREE.WebGLRenderer()
        renderer.setSize(sizes.width, sizes.height)
        mountRef.current?.appendChild(renderer.domElement)

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        const clock = new THREE.Clock()

        function animate() {
            renderer.render(scene, camera)

            // update controls
            controls.update()

            window.requestAnimationFrame(animate)
        }

        animate()
    }

    return (
        <div ref={mountRef}></div>
    )
}

export default ThreeDText