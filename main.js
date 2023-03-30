import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// import { Satellite } from 'sat';


const scene = new THREE.Scene();
// scene.background = new THREE.TextureLoader().load('assets/milky_way.jpeg');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

const scale = 10000;

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(0);
camera.position.setY(0);
camera.position.setZ(20000 / scale);
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

const earth_r = 6371 / scale

// const earth = new THREE.Mesh(
//     new THREE.SphereGeometry( earth_r, 64, 64 ),
//     new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } )
// )

const earth = new THREE.Mesh(
    new THREE.SphereGeometry( earth_r, 64, 64 ),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('assets/earth.jpg'),
    })
);
scene.add(earth);

// Orbit Parameters
const a = 100000 / scale;
const e = 0.8;

const p = a * (1-Math.pow(e, 2));

// Define ellipse
const theta = linspace( 0, 2*Math.PI, 100 );

var radius = [];
var x = [];
var y = [];
var z = new Array(100).fill(0);
var points = [];
for (var i=0; i < 100; i++) {
    radius[i] = p / ( 1 + e * Math.cos(theta[i]) );
    x[i] = radius[i] * Math.cos(theta[i]);
    y[i] = radius[i] * Math.sin(theta[i]);
    points.push( new THREE.Vector3( x[i], y[i], z[i] ));
}
const ellipse_geometry = new THREE.BufferGeometry().setFromPoints( points );
const ellipse_material = new THREE.LineBasicMaterial( { color: 0xff00ff } );
const line = new THREE.Line( ellipse_geometry, ellipse_material );

scene.add(line)

console.log()


function linspace(start, end, steps) {
    var x = [];

    const step = (end - start) / (steps - 1);

    for (var i = 0; i < steps; i++) {
        x.push(start + (step * i))
    }

    return x;
}


function animate() {
    requestAnimationFrame(animate);

    earth.rotation.y += 0.001

    controls.update()

    renderer.render(scene, camera);
}

animate();