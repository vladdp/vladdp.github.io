import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { CelestialBody } from 'celestials';
import data from 'celestial_data' assert { type: 'json'};
import { UI } from 'ui';
import * as utils from 'utils';


var date = new Date();
var T = utils.getT( date );
console.log(date.toString());
console.log( "T:", T );

const scene = new THREE.Scene();
const ui = new UI();

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000000);
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

var bodies = {};
bodies["Sun"] = new CelestialBody(data.Sun);
bodies["Earth"] = new CelestialBody(data.Planet.Earth);
bodies["Moon"] = new CelestialBody(data.Moon.Moon);
bodies["Mercury"] = new CelestialBody(data.Planet.Mercury);
bodies["Venus"] = new CelestialBody(data.Planet.Venus);
bodies["Mars"] = new CelestialBody(data.Planet.Mars);
bodies["Jupiter"] = new CelestialBody(data.Planet.Jupiter);

console.log(bodies["Moon"].radius);

setFocus("Earth");
ui.focusList.value = "Earth";

bodies["Earth"].ellipse.visible = false;

ui.addSat();

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

export function getT() {
    return ui.T;
}

export function getBodyPosition( body ) {
    return bodies[body].sphere.position;
}

const fps = 60;
const fpsInterval = 1000 / fps;
var then = performance.now();
var now, elapsed;

function animate() {

    requestAnimationFrame(animate);

    now = performance.now();
    elapsed = now - then;
    // console.log(elapsed);

    if ( elapsed > fpsInterval ) {
        then = now - ( elapsed % fpsInterval );

        ui.updateDate( elapsed );
        
        for (var body in bodies) {
            bodies[body].update();
        }
    
        for ( let i=0; i<ui.sats.length; i++ ) {
            ui.sats[i].setPos();
        }

        renderer.render(scene, camera);
    }
}

function resize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.onresize = resize;

animate();