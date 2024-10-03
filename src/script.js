import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui'
import gsap from 'gsap'

const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 4);
// camera.lookAt(scene.position);
gui.add(camera.position, 'y').min(-10).max(40).step(0.1)

// Objects
const textureLoader = new THREE.TextureLoader()
const geometry = new THREE.PlaneGeometry(2, 2.5);

let rayCaster = new THREE.Raycaster()
// console.log(first)

// Load texture
for (let i = 0; i < 6; i++) {

    const material = new THREE.MeshBasicMaterial({
        map: textureLoader.load(`./Images/${i}.png`)
    })

    const Img = new THREE.Mesh(geometry, material)
    Img.position.set(3 + Math.random() + 0.3 * i, i * 4, 0)
    scene.add(Img)

}

let objects = []

scene.traverse((obj) => {
    if (obj?.isMesh) {
        objects.push(obj)
    }
})

// // Axes helper
// const axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);


// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Resize handler
const handleResize = () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener('resize', handleResize);

window.addEventListener('wheel', onMouseEvent)

let position = 0, y = 0

function onMouseEvent(event) {
    // console.log(event.deltaY)
    y = event.deltaY * -0.008
    
}

let mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

//-------------------------Analytics starts-------------------------------------

const geometry1 = new THREE.BoxGeometry(0.5, 0.5, 0.5)

let material = new THREE.MeshNormalMaterial()


// let allMesh=[]
// allMesh.push(new THREE.MeshBasicMaterial({color:0xff00ff}))
// allMesh.push(new THREE.MeshBasicMaterial({color:0xffff00}))
// allMesh.push(new THREE.MeshBasicMaterial({color:0x00ffff}))

const mesh = new THREE.InstancedMesh(geometry1, material, 50)
scene.add(mesh)
console.log(mesh)
    
for(let i = 0; i < 50; i++)
{
    // if(i === 0){
    //     mesh.getColorAt(1,new THREE.Color(0xff00ff))
    // }
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    )

    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))

    const matrix = new THREE.Matrix4()
    matrix.makeRotationFromQuaternion(quaternion)
    matrix.setPosition(position)
    

    // const randomMesh=Math.floor(Math.random() * allMesh.length)
    // console.log(randomMesh)
    
    mesh.setColorAt(5,new THREE.Color(0xffff00))
    mesh.setMatrixAt(i, matrix)
}

// Update to reflect the changes
// mesh.instanceMatrix.needsUpdate = true;
// mesh.instanceColor.needsUpdate = true;

//-------------------------Analytics ends-------------------------------------

// Animation loop
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    //update Y position
    position += y
    y *= 0.6
    camera.position.y = position

    //Hover Effect
    rayCaster.setFromCamera(mouse, camera)
    let interSects = rayCaster.intersectObjects(objects)
    // console.log(interSects)

    for (const interSect of interSects) {
        gsap.to(interSect.object.scale, { x: 1.5, y: 1.5 })
        gsap.to(interSect.object.rotation, { y:-0.4})
        gsap.to(interSect.object.position, { z:-0.9})
    }

    for (const obj of objects) {
        if (!interSects.find(interSect => interSect.object === obj)) {
            gsap.to(obj.scale, { x: 1, y: 1 })
            gsap.to(obj.rotation, { y: 0})
            gsap.to(obj.position, { z: 0})
        }
    }

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
