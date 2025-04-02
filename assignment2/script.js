import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "OrbitControls";

/* *** SETUP *** */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
}

// Resizing
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.aspectRatio = window.innerWidth / window.innerHeight

    // Update Camera
    camera.aspect = sizes.aspectRatio
    camera.updateProjectionMatrix()

    // Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



/* *** SCENE *** */
//Canvas
const canvas = document.querySelector('.webgl')

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("grey")

//Camera
const camera = new THREE.PerspectiveCamera(
    75, //fov
    sizes.aspectRatio, //aspect ratio
    0.1, //near plane
    100 //far plane
)
scene.add(camera)
camera.position.set(25, 15, 0)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas : canvas,
    antialias : true
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/* *** LIGHTS *** */
// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/* *** MESHES *** */
const drawCube = (height, params) => {
    
    let cubeGeometry

    // Ceate Shape
    if (params.shape == 0) {
        cubeGeometry = new THREE.BoxGeometry(.3, .3, .3)
    } else if (params.shape == 1) {
        cubeGeometry = new THREE.SphereGeometry(.3, 7, 4)
    }

    // Create Material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(params.color)
    })

    // Wireframe
    if (params.wireframe) {
        material.wireframe = true
    }

    // Create Cube
    const cube = new THREE.Mesh(cubeGeometry, material)

    // Scale Cube
    cube.scale.y = params.scale
    cube.scale.x = params.scale
    cube.scale.z = params.scale

    // Dynamic Diameter
    let diameter = 0

    if (params.dynamicDiameter == 0) {
        diameter = params.diameter
    } else if (params.dynamicDiameter == 1) {
        diameter = params.diameter + (height * 0.4)
    } else if (params.dynamicDiameter == -1) {
        diameter = params.diameter - (height * 0.4)
    }

    // Position Cube
    cube.position.x = (Math.random() - 0.5) * diameter
    cube.position.z = (Math.random() - 0.5) * diameter
    cube.position.y = height - 5

    // Random Cube Rotation
    if (params.rotation == 1) { // rotate at random
        cube.rotation.x = Math.random() * 2 * Math.PI
        cube.rotation.y = Math.random() * 2 * Math.PI
        cube.rotation.z = Math.random() * 2 * Math.PI

    } else if (params.rotation == 2) { // objects face the center
        cube.lookAt(0, height, 0)
    }

    params.group.add(cube)
}



/* *** UI *** */
//UI
const ui = new dat.GUI()

let preset = {}

// Groups
const group1 = new THREE.Group()
scene.add(group1)
const group2 = new THREE.Group()
scene.add(group2)
const group3 = new THREE.Group()
scene.add(group3)

const uiObj = {
    sourceText: "Here is my source text.",
    saveSourceText() {
        saveSourceText()
    },
    term1: {
        term: 'shire',
        color: '#599532',
        shape: 1,
        group: group1,
        diameter: 20,
        dynamicDiameter: -1,
        nCubes: 100,
        rotation: 1,
        scale: 1,
        wireframe: false
    },
    term2: {
        term: 'mordor',
        color: '#2C2625',
        shape: 0,
        group: group2,
        diameter: 12,
        dynamicDiameter: 1,
        nCubes: 80,
        rotation: 2,
        scale: 1.5,
        wireframe: true
    },
    term3: {
        term: 'fellowship',
        color: '#FFA31E',
        shape: 0,
        group: group3,
        diameter: 8,
        dynamicDiameter: 0,
        nCubes: 50,
        rotation: 1,
        scale: 1,
        wireframe: false
    },
    saveTerms() {
        saveTerms()
    },
    rotateCamera: false
}

// UI Functions
const saveSourceText = () => {
    // UI
    preset = ui.save()
    textFolder.hide()
    termsFolder.show()
    visualizeFolder.show()

    // Text Analysis
    tokenizeSrcTxt(uiObj.sourceText)
}

const saveTerms = () => {
    // UI
    preset = ui.save
    visualizeFolder.hide()
    cameraFolder.show()

    // Text Analysis
    findSearch(uiObj.term1)
    findSearch(uiObj.term2)
    findSearch(uiObj.term3)
}

// Text
const textFolder = ui.addFolder("Source Text")

textFolder
    .add(uiObj, 'sourceText')
    .name("SourceText")

textFolder
    .add(uiObj, 'saveSourceText')
    .name("Save")


// Terms
const termsFolder = ui.addFolder("Search Terms")

termsFolder
    .add(uiObj.term1, 'term')
    .name("Term 1")

termsFolder
    .addColor(uiObj.term1, 'color')
    .name("Term 1 Color")

termsFolder
    .add(group1, 'visible')
    .name('Term 1 Visibility')

termsFolder
    .add(uiObj.term2, 'term')
    .name("Term 2")

termsFolder
    .addColor(uiObj.term2, 'color')
    .name("Term 2 Color")

termsFolder
    .add(group2, 'visible')
    .name('Term 2 Visibility')

termsFolder
    .add(uiObj.term3, 'term')
    .name("Term 3")

termsFolder
    .addColor(uiObj.term3, 'color')
    .name("Term 3 Color")

termsFolder
    .add(group3, 'visible')
    .name('Term 3 Visibility')

// Visualize
const visualizeFolder = ui.addFolder("Visualize")

visualizeFolder
    .add(uiObj, 'saveTerms')
    .name("Visualize")

// Camera
const cameraFolder = ui.addFolder("Camera")

cameraFolder
    .add(uiObj, 'rotateCamera')
    .name('Turntable')

termsFolder.hide()
visualizeFolder.hide()
cameraFolder.hide()

/* *** TEXT ANALYSIS *** */
// Variables
let parsedText, tokenizedText

// Parse and Tokenize sourceText
const tokenizeSrcTxt = (sourceText) => {
    // Strip periods and downcase src text
    parsedText = sourceText.replaceAll(".", "").toLowerCase()
    
    // Tokenize
    tokenizedText = parsedText.split(/[^\w']+/)
}

// Find searchTerm in tokenizedText
const findSearch = (params) => {

    // Identify term using for loop
    for (let i = 0; i < tokenizedText.length; i++) {
        if (tokenizedText[i] === params.term) {
            // Convert i into height, between 0-20
            const height = (100 / tokenizedText.length) * i * 0.2

            // Call drawCube nCube times using converted height
            for(let a = 0; a < params.nCubes; a++) {
                drawCube(height, params)
            }
        }
    }
}

tokenizeSrcTxt("Here is my sourceText")

/* *** ANIMATION LOOP *** */
const clock = new THREE.Clock()

const animation = () => {
    //Return elapsed time
    const elapsedTime = clock.getElapsedTime()

    //Update OrbitControls
    controls.update()

    // Animate Terms
    // Term 2

    // Rotate Camera
    if (uiObj.rotateCamera) {
        camera.position.x = Math.sin(elapsedTime * 0.1) * 27
        camera.position.z = Math.cos(elapsedTime * 0.1) * 27
        camera.position.y = 10
        camera.lookAt(0, 0, 0)
    }

    //Render
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation) //runs function on a loop
}
animation()