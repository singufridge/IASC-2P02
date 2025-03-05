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
camera.position.set(0, 2, -12)

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas : canvas,
    antialias : true
})
renderer.setSize(sizes.width, sizes.height)

// Controls
const controls = new OrbitControls(camera, renderer.canvas)
controls.enableDamping = true

/* *** LIGHTS *** */
// Directional Light
const directionalLight = new THREE.DirectionalLight(0x404040, 100)
scene.add(directionalLight)

/* *** MESHES *** */
// Cube
const cubeGeometry = new THREE.BoxGeometry(.5, .5, .5)

const drawCube = (height, color) => {
    
    // Create Material
    const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color)
    })

    // Create Cube
    const cube = new THREE.Mesh(cubeGeometry, material)

    // Position Cube
    cube.position.x = (Math.random() - 0.5) * 10
    cube.position.z = (Math.random() - 0.5) * 10
    cube.position.y = height - 2

    // Random Cube Rotation
    cube.rotation.x = Math.random() * 2 * Math.PI
    cube.rotation.y = Math.random() * 2 * Math.PI
    cube.rotation.z = Math.random() * 2 * Math.PI

    // Add cube
    scene.add(cube)
}

/*
drawCube(-1,'blue')
drawCube(0,'red')
drawCube(1,'yellow')
*/

/* *** UI *** */
//UI
const ui = new dat.GUI()

/* *** TEXT ANALYSIS *** */
// Source Text
const sourceText = "The quick brown fox jumped over the lazy dog."

// Variables
let parsedText, tokenizedText

// Parse and Tokenize sourceText
const tokenizeSrcTxt = () => {
    // Strip periods and downcase src text
    parsedText = sourceText.replaceAll(".", "").toLowerCase()
    
    // Tokenize
    tokenizedText = parsedText.split(/[^\w']+/)
    console.log(tokenizedText)


}

// Find searchTerm in tokenizedText
const findSearch = (term, color) => {

    // Identify term using for loop
    for (let i = 0; i < tokenizedText.length; i++) {
        if (tokenizedText[i] === term) {
            // Convert i into height, between 0-20
            const height = (100 / tokenizedText.length) * i * 0.2

            // Call drawCube 100x using converted height
            for(let a = 0; a < 100; a++) {
                drawCube(i, color)
            }
        }
    }
}

tokenizeSrcTxt()
findSearch('the', 'pink')
findSearch('lazy', 'white')
findSearch('brown', 'red')

/* *** ANIMATION LOOP *** */
const clock = new THREE.Clock()

const animation = () => {
    //Return elapsed time
    const elapsedTime = clock.getElapsedTime()

    //Update OrbitControls
    controls.update()

    //Render
    renderer.render(scene, camera)

    //Request next frame
    window.requestAnimationFrame(animation) //runs function on a loop
}
animation()