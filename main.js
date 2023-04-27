import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { CelestialBody } from 'celestials';
import data from 'celestial_data' assert { type: 'json'};
import { Moon } from 'moon';
import { UI } from 'ui';
import * as utils from 'utils';


var date = new Date();
var T = utils.getT( date );
console.log(date.toString());
console.log(date.getTime());
console.log( T );


const scene = new THREE.Scene();
const ui = new UI();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
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
    "Jupiter": new CelestialBody(data.Planet.Jupiter),
};

setFocus("Earth");
ui.focusList.value = "Earth";

const moon = new Moon();

scene.add(moon.shape);

ui.addSat();

const earth = new THREE.Mesh(
    new THREE.SphereGeometry( 6371 / utils.scale, 64, 64 ),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load( "assets/earth.jpg" ),
    })
);

scene.add( earth );

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

const fps = 60;

function animate() {

    requestAnimationFrame(animate);

    ui.updateDate( 1000 / fps );
    bodies["Earth"].update();
    
    // bodies["Sun"].shape.rotation.y += 0.0001;
    // bodies["Earth"].sphere.rotation.y += 0.1;
    // moon.shape.rotation.y += 0.00001;

    // for ( let i=0; i<ui.sats.length; i++ ) {
    //     ui.sats[i].setPos();
    // }
    // moon.setPos();    

    renderer.render(scene, camera);
}

function resize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.onresize = resize;
animate();