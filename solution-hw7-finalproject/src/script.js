import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

//canvas
const canvas = document.querySelector('canvas.webgl');

//scene
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const bakedTexture = textureLoader.load('/models/Room/baked.jpg');

const screenTexture = textureLoader.load('/models/Room/screen.jpg');

const laptopScreenTexture = textureLoader.load('/models/Room/laptop_screen.jpg');

bakedTexture.flipY = false;

screenTexture.flipY = false;

laptopScreenTexture.flipY = false;

const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture });

const screenMaterial = new THREE.MeshBasicMaterial({ map: screenTexture });

const laptopScreenMaterial = new THREE.MeshBasicMaterial({ map: laptopScreenTexture });

scene.background = new THREE.Color(0x869345);

//models
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

let interactiveObjects = [];

let animationObjects = {};

gltfLoader.load(
    '/models/Room/room_texture.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            if (child.name === "wacom_tablet"){
                interactiveObjects.push(child);
            } else if (child.name === "eraser"){
                interactiveObjects.push(child);
            } else if (child.name === "mouse"){
                interactiveObjects.push(child);
            } else if (child.name === "blue_pen"){
                interactiveObjects.push(child);
            } else if (child.name === "yellow_pen"){
                interactiveObjects.push(child);
            } else if (child.name === "purple_pen"){
                interactiveObjects.push(child);
            } else if (child.name === "laptop_spacebar"){
                interactiveObjects.push(child);
            } else if (child.name === "desktop_monitor"){
                interactiveObjects.push(child);
            } else if (child.name === "blue_box"){
                interactiveObjects.push(child);
                animationObjects.blue_box = child;
            } else if (child.name === "purple_book"){
                interactiveObjects.push(child);
                animationObjects.purple_book = child;
            } else if (child.name === "chair"){
                interactiveObjects.push(child);
                animationObjects.chair = child;
            }
            child.material = bakedMaterial;
            if (child.name === "desktop_screen"){
                child.material = screenMaterial;
                animationObjects.desktop_screen = child;
            } else if (child.name === "laptop_screen"){
                interactiveObjects.push(child);
                child.material = laptopScreenMaterial;
                animationObjects.laptop_screen = child;
            }   
        })

        gltf.scene.scale.set(2, 2, 2);
        gltf.scene.position.set(.2, 0, .5);
        scene.add(gltf.scene);

    }
)

//floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
);

//raycaster
const raycaster = new THREE.Raycaster();

//new mouse
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event) =>
{
    mouse.x = event.clientX / sizes.width * 2 - 1;
    mouse.y = - (event.clientY / sizes.height) * 2 + 1;
})

//lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
scene.add(ambientLight);


const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = - 7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = - 7;
directionalLight.position.set(- 5, 5, 0);
scene.add(directionalLight);

//sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

//responsive size update
window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    if (sizes.width < 400){
        controls.maxZoom = .25;
        controls.minZoom = .25;
    } else if (sizes.width < 800){
        controls.maxZoom = .5;
        controls.minZoom = .5;
    } else {
        controls.maxZoom = 1;
        controls.minZoom = 1;
    }

    //camera update
    camera.left = sizes.width / -400;
    camera.right = sizes.width / 400;
    camera.top = sizes.height / 400;    
    camera.bottom = sizes.height / -400;
    camera.updateProjectionMatrix();

    //update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//camera
const camera = new THREE.OrthographicCamera(sizes.width / -400, sizes.width / 400, sizes.height / 400, sizes.height / -400, 0, 1000);
camera.position.set(2, 1, 2);
scene.add(camera);

//controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, .5, 0);
controls.enableDamping = true;
if (sizes.width < 400){
    controls.maxZoom = .25;
    controls.minZoom = .25;
} else if (sizes.width < 800){
    controls.maxZoom = .5;
    controls.minZoom = .5;
} else {
    controls.maxZoom = 1;
    controls.minZoom = 1;
}
controls.minAzimuthAngle = .5;
controls.maxAzimuthAngle = .9;
controls.maxPolarAngle = .3;
controls.minPolarAngle = 1.1;
controls.enablePan = false;

//renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//animate
const clock = new THREE.Clock();
let previousTime = 0;
let blueBoxFallSpeed = 0;
let blueBoxAcceleration = 0;
let currentIntersect = null;
let currentChairSpeed = .1;
let chairFriction = .95;
let purpleBookMoveSpeed = 0;
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    //model update
    if(mixer)
    {
        mixer.update(deltaTime);
    }

    //control update
    controls.update();

    //raycaster
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(interactiveObjects);
    
    if(intersects.length)
    {
        if(!currentIntersect)
        {
            console.log('mouse enter');
        }

        currentIntersect = intersects[0];
    }
    else
    {
        if(currentIntersect)
        {
            console.log('mouse leave');
        }
        
        currentIntersect = null;
    }
    if (animationObjects != null && animationObjects.chair != null){
        animationObjects.chair.rotation.y += deltaTime * currentChairSpeed;
        currentChairSpeed = currentChairSpeed - (currentChairSpeed * chairFriction * deltaTime);
        if (currentChairSpeed < .1){
            currentChairSpeed = .1;
        }
    }
    if (animationObjects != null && animationObjects.blue_box != null){
        if (animationObjects.blue_box.rotation.x < Math.PI + (Math.PI / 2) - .1){
            animationObjects.blue_box.rotation.x += deltaTime * blueBoxFallSpeed;
            blueBoxFallSpeed += blueBoxAcceleration * deltaTime;
        }
    }
    if (animationObjects != null && animationObjects.purple_book != null){
        if ((animationObjects.purple_book.position.z < -.3062 && purpleBookMoveSpeed > 0) || (animationObjects.purple_book.position.z > -.3262 && purpleBookMoveSpeed < 0)){
            animationObjects.purple_book.position.z += deltaTime * purpleBookMoveSpeed;
        }
    }

    // render
    renderer.render(scene, camera);

    // call tick next frame
    window.requestAnimationFrame(tick);
}




tick()

//click events
window.addEventListener('click', () =>
{
    console.log("clickEventFiring");
    if(currentIntersect)
    { 
        console.log(currentIntersect.object.name);
        switch(currentIntersect.object.name)
        {
            case "wacom_tablet":
                console.log("i'm clicking the wacom tablet hello");
                break;
            case "eraser":
                console.log("i'm clicking the eraser hello");
                break;
            case "mouse":
                console.log("i'm clicking the mouse hello");
                // animationObjects.desktop_screen.material = screenMaterial;
                // animationObjects.desktop_screen.material.texture = screenMaterial;
                if (screenTexture.offset.y === 0){
                    if (screenTexture.offset.x === 0){
                        screenTexture.offset.x = .5;
                    } else {
                        screenTexture.offset.y = .33;
                        screenTexture.offset.x = 0;
                    } 
                } else {
                    if (screenTexture.offset.x === 0){
                        screenTexture.offset.x = .5;
                    } else {
                        screenTexture.offset.y = 0;
                        screenTexture.offset.x = 0;
                    } 
                }
                break;
            case "blue_pen":
                console.log("i'm clicking the blue pen hello");
                break;
            case "yellow_pen":
                console.log("i'm clicking the yellow pen hello");
                break;
            case "purple_pen":
                console.log("i'm clicking the purple pen hello");
                break;
            case "laptop_spacebar":
                console.log("i'm clicking the laptop spacebar hello");
                if (laptopScreenTexture.offset.y === 0){
                    if (laptopScreenTexture.offset.x === 0){
                        laptopScreenTexture.offset.x = .5;
                    } else {
                        laptopScreenTexture.offset.y = .33;
                        laptopScreenTexture.offset.x = 0;
                    } 
                } else {
                    if (laptopScreenTexture.offset.x === 0){
                        laptopScreenTexture.offset.x = .5;
                    } else {
                        laptopScreenTexture.offset.y = 0;
                        laptopScreenTexture.offset.x = 0;
                    } 
                }
                break;
            case "desktop_monitor":
                console.log("i'm clicking the desktop monitor hello");
                break;
            case "laptop_screen":
                console.log("i'm clicking the laptop screen hello");
                break;
            case "blue_box":
                console.log("i'm clicking the blue box hello");
                blueBoxFallSpeed = 1;
                blueBoxAcceleration = 20;
                break;
            case "purple_book":
                console.log("i'm clicking the purple book hello");
                console.log(animationObjects.purple_book.position.z)
                if (purpleBookMoveSpeed == .2){
                    purpleBookMoveSpeed = -.2;
                } else {
                    purpleBookMoveSpeed = .2;
                }
                break;
            case "chair_1":
            case "chair_2":
                console.log("i'm clicking the chair hello");
                currentChairSpeed += 2;
                break;  
        }
    }
})