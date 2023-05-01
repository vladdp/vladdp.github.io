import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { CelestialBody, Planet, Moon } from 'celestials';
import data from 'celestial_data' assert { type: 'json'};
import { UI } from 'ui';


var date = new Date();
console.log(date.toString());

const scene = new THREE.Scene();
const ui = new UI();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1e12);
camera.position.set(1, 1, 1);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableDamping = true;
controls.update();

var bodies = {};
bodies["Sun"] = new CelestialBody(data.Sun);
bodies["Earth"] = new Planet(data.Planet.Earth);
bodies["Mercury"] = new Planet(data.Planet.Mercury);
bodies["Venus"] = new Planet(data.Planet.Venus);
bodies["Mars"] = new Planet(data.Planet.Mars);
bodies["Jupiter"] = new Planet(data.Planet.Jupiter);
bodies["Moon"] = new Moon(data.Moon.Moon);
bodies["Ganymede"] = new Moon(data.Moon.Ganymede);

setFocus("Earth");
ui.focusList.value = "Earth";

ui.addSat();

scene.add( new THREE.HemisphereLight() );

const directionalLight = new THREE.DirectionalLight( 0xffeedd );
				directionalLight.position.set( 0, 0, 2 );
				scene.add( directionalLight );

var model;
                
const loader = new GLTFLoader();
await loader.load( 'assets/models/deep_space/deep_space.glb', 
    function ( gltf ) {
        model = gltf;
        model.scene.rotation.y += 1;
        scene.add( model.scene );
} );


const fpsInterval = 1000 / 60;
var now, then = performance.now();
var fps, oldTimeStamp=0, secondsPassed, elapsed, inc;
let bodyPos0, bodyPos1, dbodyPos = new THREE.Vector3();

function animate( timeStamp ) {
    requestAnimationFrame(animate);
    
    now = performance.now();
    elapsed = timeStamp - then;
    
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    
    fps = Math.round( 1 / secondsPassed );
    
    if ( elapsed >= fpsInterval ) {
        then = timeStamp - ( elapsed % fpsInterval );
        bodyPos0 = bodies[ui.focusList.value].sphere.position.clone();
        
        ui.updateFPS( fps );
        ui.updateDate( (performance.now() - oldTimeStamp) * 10000 );
        
        for (var body in bodies) {
            bodies[body].update();
        }
        
        for ( let i=0; i < ui.sats.length; i++ ) {
            ui.sats[i].update();
        }
        
        bodyPos1 = bodies[ui.focusList.value].sphere.position.clone();
        dbodyPos.copy(bodyPos1.sub(bodyPos0).clone());
        
        oldTimeStamp = timeStamp;
        
        controls.object.position.add(dbodyPos);
        controls.update();
        
        renderer.render(scene, camera);
    } else {
        console.log("slow");
    }
}

export function addToScene( element ) {
    scene.add(element);
}

export function addFocus( object ) {
    ui.addFocus(object);
}

export function setFocus( body ) {
    controls.object.position.set( bodies[body].sphere.position.x + 2 * bodies[body].radius, 
    bodies[body].sphere.position.y + 2 * bodies[body].radius, 
    bodies[body].sphere.position.z + 2 * bodies[body].radius );
    controls.target = bodies[body].sphere.position;
    
    controls.update();
}
    
export function getFocus() {
    return ui.focusList.value;
}
    
export function getT() {
    return ui.T;
}

export function getBodyPosition( body ) {
    return bodies[body].sphere.position;
}

function resize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.onresize = resize;

animate();