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
//Torus Knot
const knotGeometry = new THREE.TorusKnotGeometry(.5, .2);
const knotMaterial = new THREE.MeshNormalMaterial()
const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial)

scene.add(torusKnot)
torusKnot.position.set(0, 1, 0)

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
    distance: 1,
    scale: 1,
    rotationSpeed: 1,
    play: false
}

//testSphere UI
const knotFolder = ui.addFolder('Torus Knot')

knotFolder
    .add(uiObject, 'play')
    .name('Animate')

knotFolder
    .add(torusKnot.position, 'y')
    .min(-5)
    .max(5)
    .step(.5)
    .name('Height')

knotFolder
    .add(uiObject, 'speed')
    .min(1)
    .max(10)
    .step(.1)
    .name('Speed')

knotFolder
    .add(uiObject, 'distance')
    .min(1)
    .max(5)
    .step(.1)
    .name('Distance')

knotFolder
    .add(uiObject, 'scale')
    .min(1)
    .max(5)
    .step(.1)
    .name('Scale')

knotFolder
    .add(uiObject, 'rotationSpeed')
    .min(1)
    .max(20)
    .step(.1)
    .name('Rotation Speed')

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

    //Animate torus knot
    if(uiObject.play) {
        torusKnot.position.z = Math.sin(elapsedTime * uiObject.speed) * uiObject.distance
        torusKnot.position.x = Math.cos(elapsedTime * uiObject.speed) * uiObject.distance

        torusKnot.scale.x = uiObject.scale
        torusKnot.scale.y = uiObject.scale
        torusKnot.scale.z = uiObject.scale

        torusKnot.rotation.y = elapsedTime * uiObject.rotationSpeed
    }

    //Update OrbitControls
    controls.update()

    //Render
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation) //runs function on a loop
}
animation()