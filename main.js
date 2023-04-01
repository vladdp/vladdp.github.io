import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import * as utils from 'utils';
import { Satellite } from 'sat';

var rot_speed = utils.rot_speed;
const scale = utils.scale;

const scene = new THREE.Scene();
// scene.background = new THREE.TextureLoader().load('assets/milky_way.jpeg');

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

// Create Title text element
const title = document.createElement('div');
title.innerText = "ThreeJSat";
title.id = 'title';
document.body.appendChild(title);

// var text = document.getElementById("info");

// Create button
const addSatButt = document.createElement('button');
addSatButt.innerText = "Add Satellite";
addSatButt.id = 'AddSatButt';
addSatButt.addEventListener('click', () => { rot_speed += 1; });
document.body.appendChild(addSatButt);
// addSatButt.style.display = 'none';

// var dropDown = document.createElement('')


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(0);
camera.position.setY(0);
camera.position.setZ(20000 / scale);
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

// Satellite
const sats = []
sats.push( new Satellite() )
const points = sats[0].orbit();

// console.log(points.length)

const ellipse_geometry = new THREE.BufferGeometry().setFromPoints( points );
const ellipse_material = new THREE.LineBasicMaterial( { color: 0xeb7134 } );
const line = new THREE.Line( ellipse_geometry, ellipse_material );

scene.add(line)

function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += rot_speed;

    controls.update();

    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // text.innerHTML = "Speed: " + rot_speed;

    renderer.render(scene, camera);
}

animate();