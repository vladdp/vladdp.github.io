import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Earth } from 'earth';
import { Moon } from 'moon';
import { UI } from 'ui';


const scene = new THREE.Scene();
const ui = new UI();
const earth = new Earth();
const moon = new Moon();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(1, 1, 1);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

scene.add(earth.shape);
scene.add(moon.shape);

ui.addSat();

export function addToScene(element) {
    scene.add(element);
}

function animate() {

    setTimeout( function() {
        requestAnimationFrame(animate);
    }, 1000 / 60 );
    
    earth.shape.rotation.y += ui.rotSpeed;
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

// animate();