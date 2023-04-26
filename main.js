import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { CelestialBody } from 'celestials';
import data from 'celestial_data' assert { type: 'json'};
import { Moon } from 'moon';
import { UI } from 'ui';


var currentTime = new Date();
console.log(currentTime);

const scene = new THREE.Scene();
const ui = new UI();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
camera.position.set(1, 1, 1);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.update();

const bodies = {
    "Sun": new CelestialBody(data.Sun),
    "Earth": new CelestialBody(data.Planet.Earth),
    "Mercury": new CelestialBody(data.Planet.Mercury),
    "Venus": new CelestialBody(data.Planet.Venus),
    "Mars": new CelestialBody(data.Planet.Mars),
}

setFocus("Earth")

const moon = new Moon();

scene.add(moon.shape);

ui.addSat();

export function addToScene( element ) {
    scene.add(element);
}

export function addFocus( object ) {
    ui.addFocus(object);
}

export function setFocus( body ) {
    console.log(body);
    controls.object.position.set( bodies[body].shape.position.x + 1, 
                                  bodies[body].shape.position.y + 1, 
                                  bodies[body].shape.position.z + 1 );
    controls.target = bodies[body].shape.position;
}

function animate() {

    setTimeout( function() {
        requestAnimationFrame(animate);
    }, 1000 / 60 );
    
    bodies["Sun"].shape.rotation.y += 0.0001;
    bodies["Earth"].shape.rotation.y += ui.rotSpeed; // why am I using ui.rotSpeed?
    moon.shape.rotation.y += 0.00001;

    for ( let i=0; i<ui.sats.length; i++ ) {
        ui.sats[i].setPos();
    }
    moon.setPos();

    controls.update();

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
}

animate();