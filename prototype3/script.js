import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "OrbitControls";

/* *** SETUP *** */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

/* *** SCENE *** */
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("black")

//Camera
const camera = new THREE.PerspectiveCamera(
    75, //fov
    sizes.aspectRatio, //aspect ratio
    0.1, //near plane
    100 //far plane
)
scene.add(camera)
camera.position.set(10, 2, 7.5)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas : canvas,
    antialias : true
})
renderer.setSize(sizes.width, sizes.height)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/* *** MESHES *** */
// Cave
const planeGeo = new THREE.PlaneGeometry(15.5, 7.5)
const planeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('white'),
    side: THREE.DoubleSide
})
const cave = new THREE.Mesh(planeGeo, planeMat)
cave.rotation.y = Math.PI * .5;
cave.receiveShadow = true
scene.add(cave)

// Objects
// Torus
const torusGeometry = new THREE.TorusGeometry(
    1.2,
    .3,
    10,
    20,
    3.2
)
const torusMaterial = new THREE.MeshNormalMaterial()
const torusSmile = new THREE.Mesh(torusGeometry, torusMaterial)

torusSmile.position.set(6, .8, 0)
torusSmile.rotation.y = Math.PI * .5;
torusSmile.rotation.x = Math.PI;
torusSmile.castShadow = true
scene.add(torusSmile)

// Eye Spheres
const eyeGeometry = new THREE.SphereGeometry(.45);
const eyeMaterial = new THREE.MeshNormalMaterial()
const eyeOne = new THREE.Mesh(eyeGeometry, eyeMaterial)
const eyeTwo = new THREE.Mesh(eyeGeometry, eyeMaterial)

eyeOne.castShadow = true
eyeTwo.castShadow = true
eyeOne.position.set(6, 2, .8)
eyeTwo.position.set(6, 2, -.8)
scene.add(eyeOne)
scene.add(eyeTwo)

/* *** LIGHTS *** */
// Ambient Light
/*
const ambientLight = new THREE.AmbientLight(
    new THREE.Color('white')
)
scene.add(ambientLight)
*/

const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
scene.add(directionalLight)
directionalLight.position.set(20, 4, 0)
directionalLight.target = cave
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048

/* *** UI *** */
//UI
const ui = new dat.GUI()

const lightPosFolder = ui.addFolder('Light Position')

lightPosFolder
    .add(directionalLight.position, 'y')
    .min(-10)
    .max(10)
    .step(.1)
    .name('Y')

lightPosFolder
    .add(directionalLight.position, 'z')
    .min(-10)
    .max(10)
    .step(.1)
    .name('Z')

/* *** ANIMATION LOOP *** */
const clock = new THREE.Clock()

const animation = () => {
    //Return elapsed time
    const elapsedTime = clock.getElapsedTime()

    // Animate Objects
    /*
    torusSmile.rotation.y = elapsedTime;
    torusSmile.rotation.z = elapsedTime;
    */

    //Update OrbitControls
    controls.update()

    //Render
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation) //runs function on a loop
}
animation()