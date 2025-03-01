import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "OrbitControls";

/* *** SETUP *** */
const sizes = {
    width: window.innerWidth * 0.4,
    height: window.innerHeight,
    aspectRatio: window.innerWidth * 0.4 / window.innerHeight
}

/* *** SCENE *** */
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
//scene.background = new THREE.Color("black")

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
    antialias : true,
    alpha: true
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
cave.position.set(-8, 0, 0)
scene.add(cave)

// Objects
const mobile = new THREE.Group();

// Disc
const discGeo = new THREE.CylinderGeometry(
    2,
    2,
    .3,
    32
)
const discMat = new THREE.MeshNormalMaterial()
const disc = new THREE.Mesh(discGeo, discMat)

disc.position.set(0, 2, 0)
disc.castShadow = true
mobile.add(disc)

// Strings
const stringGeo = new THREE.CylinderGeometry(
    .15,
    .15,
    4,
    10
);
const stringMat = new THREE.MeshNormalMaterial()

// front pair
const stringOne = new THREE.Mesh(stringGeo, stringMat)
const stringTwo = new THREE.Mesh(stringGeo, stringMat)
stringOne.castShadow = true
stringTwo.castShadow = true
stringOne.position.set(-1.3, 0, .5)
stringTwo.position.set(-1.3, 0, -.5)

// mid pair near
const stringThree = new THREE.Mesh(stringGeo, stringMat)
const stringFour = new THREE.Mesh(stringGeo, stringMat)
stringThree.castShadow = true
stringFour.castShadow = true
stringThree.position.set(-.5, 0, 1.3)
stringFour.position.set(-.5, 0, -1.3)

// mid pair far
const stringFive = new THREE.Mesh(stringGeo, stringMat)
const stringSix = new THREE.Mesh(stringGeo, stringMat)
stringFive.castShadow = true
stringSix.castShadow = true
stringFive.position.set(.5, 0, 1.3)
stringSix.position.set(.5, 0, -1.3)

//back pair
const stringSeven = new THREE.Mesh(stringGeo, stringMat)
const stringEight = new THREE.Mesh(stringGeo, stringMat)
stringSeven.castShadow = true
stringEight.castShadow = true
stringSeven.position.set(1.3, 0, .5)
stringEight.position.set(1.3, 0, -.5)

mobile.add(stringOne)
mobile.add(stringTwo)

mobile.add(stringThree)
mobile.add(stringFour)

mobile.add(stringFive)
mobile.add(stringSix)

mobile.add(stringSeven)
mobile.add(stringEight)

scene.add(mobile)
mobile.position.set(3, 0, 0)

/* *** LIGHTS *** */
// Ambient Light
const directionalLight = new THREE.DirectionalLight(
    new THREE.Color('white'),
    0.5
)
scene.add(directionalLight)
directionalLight.position.set(12, 0, 0)
directionalLight.target = cave
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048

/* *** DOM INTERACTIONS *** */
const domObj = {
    part: 2,
    firstChange: false,
    secondChange: false,
    thirdChange: false,
    fourthChange: false
}

// part-one
document.querySelector('#part-one').onclick = function() {
    domObj.part = 1
}

// part-two
document.querySelector('#part-two').onclick = function() {
    domObj.part = 2
}

// first change
document.querySelector('#first-change').onclick = function() {
    domObj.firstChange = true
}

// second change
document.querySelector('#second-change').onclick = function() {
    domObj.secondChange = true
}

// third change
document.querySelector('#third-change').onclick = function() {
    domObj.thirdChange = true
}

// fourth change
document.querySelector('#fourth-change').onclick = function() {
    domObj.fourthChange = true
}

/* *** ANIMATION LOOP *** */
const clock = new THREE.Clock()

const animation = () => {
    //Return elapsed time
    const elapsedTime = clock.getElapsedTime()

    // part-one
    if(domObj.part === 1) {
        camera.position.set(1, 0, 0)
    }

    // part-two
    if(domObj.part === 2) {
        camera.position.set(12, -2, 5)
    }

    // first change
    if(domObj.firstChange) {
        mobile.rotation.y = elapsedTime;
    }

    // second change
    if(domObj.secondChange) {
        disc.rotation.z = elapsedTime;
    }

    // third change
    if(domObj.thirdChange) {
        disc.rotation.x = elapsedTime;
    }

    // fourth change
    if(domObj.fourthChange) {
        disc.position.z = Math.sin(elapsedTime * 1.5) * 2;
    }

    //Update OrbitControls
    controls.update()

    //Render
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation) //runs function on a loop
}
animation()