import * as THREE from 'three';

/* *** SCENE *** */
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("#d7b8bc")

//Camera
const camera = new THREE.PerspectiveCamera(
    75, //fov
    window.innerWidth / window.innerHeight, //aspect ratio
    0.1, //near plane
    100 //far plane
)
scene.add(camera)
camera.position.set(0, 0, 7)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas : canvas,
    antialias : true
})
renderer.setSize(window.innerWidth, window.innerHeight)


/* *** MESHES *** */
// testSphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(testSphere)

//torus
const torusGeometry = new THREE.TorusGeometry(3, .3, 16, 100)
const torusMaterial = new THREE.MeshNormalMaterial()
const testTorus = new THREE.Mesh(torusGeometry, torusMaterial)
scene.add(testTorus)

/* *** ANIMATION LOOP *** */
const clock = new THREE.Clock()

const animation = () => {
    //Return elapsed time
    const elapsedTime = clock.getElapsedTime()

    //Animate testSphere
    const speed = 1.5
    const distance = 1.5
    testSphere.position.z = Math.sin(elapsedTime * speed) * distance
    testSphere.position.x = Math.cos(elapsedTime * speed) * distance

    testSphere.rotation.y = elapsedTime * speed

    const scale = Math.sin(elapsedTime * speed)
    //testSphere.scale.y = scale

    //Animate torus
    testTorus.rotation.y = elapsedTime * speed
    //Render
    renderer.render(scene, camera)
    
    //Request next frame
    window.requestAnimationFrame(animation) //runs function on a loop
}
animation()