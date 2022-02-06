import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls  } from 'three/examples/jsm/controls/OrbitControls'

const Material = () => {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mountRef.current) {
            initThree()
        }
    })

    function initThree() {
        /**
         * Scene
         */
        const scene = new THREE.Scene()

        /**
         * Textures
         */
        const textureLoader = new THREE.TextureLoader()

        const doorColorTexture = textureLoader.load('src/assets/textures/door/color.jpg')
        const doorAlphaTexture = textureLoader.load('src/assets/textures/door/alpha.jpg')
        const doorAmbientOcclusionTexture = textureLoader.load('src/assets/textures/door/ambientOcclusion.jpg')
        const doorHeightTexture = textureLoader.load('src/assets/textures/door/height.jpg')
        const doorNormalTexture = textureLoader.load('src/assets/textures/door/normal.jpg')
        const doorMetalnessTexture = textureLoader.load('src/assets/textures/door/metalness.jpg')
        const doorRoughnessTexture = textureLoader.load('src/assets/textures/door/roughness.jpg')
        const matcapTexture = textureLoader.load('src/assets/textures/matcaps/8.png')
        const gradientTexture = textureLoader.load('src/assets/textures/gradients/5.jpg')
        gradientTexture.minFilter = THREE.NearestFilter
        gradientTexture.magFilter = THREE.NearestFilter
        gradientTexture.generateMipmaps = false

        /**
         * Three.js only supports cube environment maps
         * You can find multiple environment maps in the
         * assets/textures/environmentMaps folder
         * 
         * To load a cube texture, we must use the CubeTextureLoader instead of
         * the TextureLoader
         * 
         * HDRIHaven(https://polyhaven.com/hdris)
         * Hundreds of awesome HDRIs(High Dynamic Range Imaging)
         * Not a cube map
         * 
         * To convert HDRIs to cube maps, use this online tool
         * https://matheowis.github.io/HDRI-to-CubeMap
         */
        const cubeTextureLoader = new THREE.CubeTextureLoader()
        const environmentMapTexture = cubeTextureLoader.load([
            'src/assets/textures/environmentMaps/2/px.jpg',
            'src/assets/textures/environmentMaps/2/nx.jpg',
            'src/assets/textures/environmentMaps/2/py.jpg',
            'src/assets/textures/environmentMaps/2/ny.jpg',
            'src/assets/textures/environmentMaps/2/pz.jpg',
            'src/assets/textures/environmentMaps/2/nz.jpg',
        ])
        

        /**
         * Objects
         */
        // const material = new THREE.MeshBasicMaterial()
        // material.color = new THREE.Color('purple')
        // material.color.set(0xff00ff)
        // material.map = doorColorTexture
        // material.wireframe = true

        // material.transparent = true // opacity controls the general opacity,
        // material.opacity = 0.5      // we need to set transparent = true

        // material.alphaMap = doorAlphaColorTexture // alphaMap controls the transparency with a texture
        
        /**
         * side let you decide which side of a face is visible
         * THREE.FrontSide(default)
         * THREE.BackSide
         * THREE.DoubleSide
         */
        // material.side = THREE.DoubleSide

        /**
         * The MeshNormalMaterial displays a nice purple color that
         * looks like the normal texture
         * 
         * Normals are information that contains the direction of outside of the face
         * 
         * Normals can be use for lighting, reflection, refraction, etc
         * MeshNormalMaterial shares common properties with MeshBasicMaterial
         * like wirefram, transparent, opacity and side
         * but there is also a flatShading property
         * flatShading will flatten the faces, meaing that normals won't be
         * interpolated between the vertices.
         * 
         * MeshNormalMaterial is ususally used to debug normals, but the color looks
         * so great that you can use it for your projects.
         * https://www.ilithya.rocks
         */
        // const material = new THREE.MeshNormalMaterial()
        // material.flatShading = true

        /**
         * MeshMatcapMaterial will display a color by using the normal as reference
         * to pick the right color on a texture that looks like a sphere
         */
        // const material = new THREE.MeshMatcapMaterial()
        // material.matcap = matcapTexture

        /**
         * MeshDepthMaterial
         */
        //  const material = new THREE.MeshDepthMaterial()

        /** 
        * MeshLamberMaterial will react to light
        */
        // const material = new THREE.MeshLambertMaterial()

        /**
         * MeshPhongMaterial
         */
        // const material = new THREE.MeshPhongMaterial()
        // material.shininess = 1000
        // material.specular = new THREE.Color(0x1188ff)

        /**
         * MeshToonMaterial
         */
        //  const material = new THREE.MeshToonMaterial()
         // we see gradient instead of a clear seperation because the gradient is
         // small and the magFilger tries to fix it with the mipmapping
         // set the minFilter and magFilter to THREE.NearestFilter
         // we can also deactivate the mipmapping with 
         // gradientTexture.generateMipmaps = false
        //  material.gradientMap = gradientTexture

        /**
         * MeshStandardMaterial
         */
        const material = new THREE.MeshStandardMaterial()
        material.metalness = 0.7
        material.roughness = 0.2

        // Use the environmentMapTexture in the envMap property of the material
        material.envMap = environmentMapTexture

        // material.map = doorColorTexture
        // material.aoMap = doorAmbientOcclusionTexture
        // material.aoMapIntensity = 1

        // It should look terrible because it lacks vertices and the displacement 
        // is way too strong.
        // material.displacementMap = doorHeightTexture
        // material.displacementScale = 0.05

        // Instead of specifying uniform metalness and roughness for
        // the whole geometry, we can use matalnessMap and roughnessMap
        // The reflection looks weird becase the metalness and roughness properties
        // still affect each map respectively
        // Comment metalness and roughness or use their original values
        /// material.metalnessMap = doorMetalnessTexture
        /// material.roughnessMap = doorRoughnessTexture

        // Normal will fake the normals orientation and
        // add details on the surface regardless of the subdivision
        // material.normalMap = doorNormalTexture

        // We can change the normal intensity with the normalScale property(Vector2)
        // material.normalScale.set(0.5, 0.5)

        // Finally, we can control the alpha using the alphaMap property
        // Don't forget transparent = true
        // material.transparent = true
        // material.alphaMap = doorAlphaTexture

        /**
         * MeshPhysicalMaterial
         * MeshPhysicalMaterial is the same as MeshStandardMaterial but with
         * support of a clear coat effect.
         * Example:
         * https://threejs.org/examples/?q=clear#webgl_materials_physical_clearcoat
        */

        /**
         * POINTS MATERIAL
         * You can use PointsMaterial with paricles
         */

        /**
         * SHADER MATERIAL AND RAW SHADER MATERIAL
         * ShaderMaterial and RawShaderMaterial can both be used to create your own material
         */

        /**
         * 
         * ENVIRONMENT MAP
         * The environment map is an image of what's surrounding the scene.
         * It can be used for reflection or refraction but also for general lighting.
         * Environment maps are supported by multiple materials but we are going to
         * use MshStandardMaterial
         * 
         * Set a nice looking MeshStandardMaterial
         * const material = new THREE.MeshStandardMaterial()
         * material.metalness = 0.7
         * material.roughness = 0.2
         * 
         */

        const sphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(0.5, 64, 64),
            material
        )
        sphere.position.x = -2
        sphere.geometry.setAttribute(
            'uv2',
            new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
        )

        const plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1, 1, 100, 100),
            material
        )

        plane.geometry.setAttribute(
            'uv2',
            new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
        )

        const torus = new THREE.Mesh(
            new THREE.TorusBufferGeometry(0.3, 0.2, 64, 128),
            material
        )
        torus.position.x = 2

        torus.geometry.setAttribute(
            'uv2',
            new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
        )

        scene.add(sphere, plane, torus)

        /**
          * Lights
          */
         const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
         scene.add(ambientLight)

         const pointLight = new THREE.PointLight(0xffffff, 0.5)
         pointLight.position.x = 2
         pointLight.position.y = 3
         pointLight.position.z = 4
         scene.add(pointLight)

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
         * Debug ui
         */
        const gui = new dat.GUI({
            width: 400,
            closed: true
        })

        gui.add(material, 'metalness', 0, 1, 0.001)
        gui.add(material, 'roughness', 0, 1, 0.001)
        gui.add(material, 'aoMapIntensity', 0, 10, 0.001)
        gui.add(material, 'displacementScale', 0, 1, 0.0001)
        
        /**
         * Animate
         */
        const clock = new THREE.Clock()
        
        function animate() {
            const elapsedTime = clock.getElapsedTime()

            // Update objects
            sphere.rotation.y = 0.1 * elapsedTime
            plane.rotation.y = 0.1 * elapsedTime
            torus.rotation.y = 0.1 * elapsedTime

            sphere.rotation.x = 0.15 * elapsedTime
            plane.rotation.x = 0.15 * elapsedTime
            torus.rotation.x = 0.15 * elapsedTime

            // Update controls
            controls.update()
            
            // Render
            renderer.render(scene, camera)

            window.requestAnimationFrame(animate)
        }

        animate()
        
    }

    return (
        <div ref={mountRef}></div>
    )
}

export default Material