import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls  } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

/**
 * https://www.bilibili.com/video/BV1xm4y1978J?p=13
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
                textGeometry.computeBoundingBox()
                const boundingBox = textGeometry.boundingBox as THREE.Box3
                textGeometry.translate(
                    -boundingBox.max.x * 0.5,
                    -boundingBox.max.y * 0.5,
                    -boundingBox.max.z * 0.5
                )

                const textMaterial = new THREE.MeshBasicMaterial({
                    wireframe: true
                })
                const text = new THREE.Mesh(textGeometry, textMaterial)
                scene.add(text)
            }
        )

        // Objects
        // Camera
        const sizes = {
            width: 1200,
            height: 600
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