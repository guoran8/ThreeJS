import React from 'react'
import * as THREE from 'three'

const Lights = () => {
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

    // Objects
}

export default Lights