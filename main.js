import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { UI } from 'ui';
import * as utils from 'utils';

const scale = utils.scale;

const scene = new THREE.Scene();
// scene.background = new THREE.TextureLoader().load('assets/milky_way.jpeg');

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

const ui = new UI();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(1, 1, 1);
// camera.lookAt(new THREE.Vector3(1, 1, 1));
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// Earth
const earth_r = 6371 / scale
const earth = new THREE.Mesh(
    new THREE.SphereGeometry( earth_r, 64, 64 ),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('assets/earth.jpg'),
    })
);
scene.add(earth);

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

function update() {
    earth.rotation.y += ui.rotSpeed;

    controls.update();
}

function animate() {
    requestAnimationFrame(animate);

    update();

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.render(scene, camera);
}

animate();