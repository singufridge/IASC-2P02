import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "OrbitControls";

/* *** SETUP *** */
const sizes = {
    width: window.innerWidth - 5,
    height: window.innerHeight - 5,
    aspectRatio: window.innerWidth / window.innerHeight
}

/* *** SCENE *** */
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("#d7b8bc")

//Camera
const camera = new THREE.PerspectiveCamera(
    75, //fov
    sizes.aspectRatio, //aspect ratio
    0.1, //near plane
    100 //far plane
)
scene.add(camera)
camera.position.set(0, 2, 6)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas : canvas,
    antialias : true
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/* *** MESHES *** */
// testSphere
const sphereGeometry = new THREE.SphereGeometry(1)
const sphereMaterial = new THREE.MeshNormalMaterial()
const testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)

scene.add(testSphere)
testSphere.position.set(0, 1, 0)

//Plane
const planeGeometry = new THREE.PlaneGeometry(10, 10, 50, 50)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide,
    wireframe: true
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)

scene.add(plane)
plane.rotation.x = Math.PI * 0.5

/* *** UI *** */
//UI
const ui = new dat.GUI()

//UI Object
const uiObject = {
    speed: 1,
    distance: 1
}

//testSphere UI
const sphereFolder = ui.addFolder('Sphere')

sphereFolder
    .add(testSphere.position, 'y')
    .min(-5)
    .max(5)
    .step(1)
    .name('Sphere Height')

sphereFolder
    .add(uiObject, 'speed')
    .min(1)
    .max(10)
    .step(.1)
    .name('Speed')

sphereFolder
    .add(uiObject, 'distance')
    .min(1)
    .max(5)
    .step(.1)
    .name('Distance')

//plane ui
const planeFolder = ui.addFolder('Plane')
planeFolder
    .add(planeMaterial, 'wireframe')
    .name('Toggle Wireframe')

/* *** ANIMATION LOOP *** */
const clock = new THREE.Clock()

const animation = () => {
    //Return elapsed time
    const elapsedTime = clock.getElapsedTime()

    //animate sphere
    testSphere.position.z = Math.sin(elapsedTime * uiObject.speed) * uiObject.distance
    testSphere.position.x = Math.cos(elapsedTime * uiObject.speed) * uiObject.distance

    //Update OrbitControls
    controls.update()

    //Render
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation) //runs function on a loop
}
animation()