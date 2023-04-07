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

// TODO: Refactor, and try to use Line3.
// Draw Earth xyz axis
const line_material = new THREE.LineBasicMaterial( { color: 0x00ffff});
const lx = [];
lx.push( new THREE.Vector3(0, 0, 0) );
lx.push( new THREE.Vector3(1, 0, 0) );
const ly = [];
ly.push( new THREE.Vector3(0, 0, 0) );
ly.push( new THREE.Vector3(0, 1, 0) );
const lz = [];
lz.push( new THREE.Vector3(0, 0, 0) );
lz.push( new THREE.Vector3(0, 0, 1) );

const lx_geometry = new THREE.BufferGeometry().setFromPoints( lx );
const ly_geometry = new THREE.BufferGeometry().setFromPoints( ly );
const lz_geometry = new THREE.BufferGeometry().setFromPoints( lz );

const line_x = new THREE.Line( lx_geometry, line_material );
const line_y = new THREE.Line( ly_geometry, line_material );
const line_z = new THREE.Line( lz_geometry, line_material );

scene.add(line_x);
scene.add(line_y);
scene.add(line_z);

ui.addSat();

export function addToScene(element) {
    scene.add(element);
}

function animate() {

    setTimeout( function() {
        requestAnimationFrame(animate);
    }, 1000 / 60 );
    
    earth.shape.rotation.y += ui.rotSpeed;
    ui.sats[0].setPos();
    
    controls.update();

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
}

animate();