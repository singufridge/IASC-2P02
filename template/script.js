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
testSphere.position.set(0, 0, -5)
/* *** ANIMATION LOOP *** */
const clock = new THREE.Clock()

const animation = () => {
    
    console.log("tick")

    //Return elapsed time

    //Render
    renderer.render(scene, camera)
    //Request next frame
    //window.requestAnimationFrame(animation) //runs function on a loop
}
animation()