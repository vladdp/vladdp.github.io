import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { CelestialBody, Planet, Moon } from 'celestials';
import { Satellite } from 'sat';
import data from 'celestial_data' assert { type: 'json'};
import { UI } from 'ui';
import * as utils from 'utils';


const scene = new THREE.Scene();
const attitudeIndicatorScene = new THREE.Scene();
const ui = new UI();
var simSpeed = 1;
ui.updateSimSpeed( simSpeed );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1e12 );
const attitudeIndicatorCamera = new THREE.PerspectiveCamera( 75, 1, 0.1, 100 );

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector( '#bg' ),
});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const attitudeIndicatorRenderer = new THREE.WebGLRenderer( {
    antialias: true,
    alpha: true,
    canvas:document.querySelector( '#ai' ),
});
attitudeIndicatorRenderer.setPixelRatio( window.devicePixelRatio );

const aiTexture = new THREE.TextureLoader().load( "assets/att_ind.png" );
aiTexture.anisotropy = attitudeIndicatorRenderer.capabilities.getMaxAnisotropy();

const attitudeIndicator = new THREE.Mesh(
    new THREE.SphereGeometry( 10, 64, 64 ),
    new THREE.MeshBasicMaterial({
        map: aiTexture,
        // metalness: 0.5,
    })
);

const heading = new THREE.Mesh( 
    new THREE.SphereGeometry( 10.1, 64, 64 ),
    new THREE.MeshBasicMaterial( {
        map: new THREE.TextureLoader().load( "assets/heading.png" ),
        transparent: true,
    })
)

attitudeIndicatorCamera.position.set( 17, 0, 0 );

attitudeIndicatorScene.add( attitudeIndicator );
attitudeIndicatorScene.add( heading );
const attitudeIndicatorControls = new OrbitControls( attitudeIndicatorCamera, attitudeIndicatorRenderer.domElement );
attitudeIndicatorControls.update();
attitudeIndicatorControls.enabled = false;

const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableDamping = true;
controls.update();

var bodies = {};
bodies["Sun"] = new CelestialBody( data.Sun );
bodies["Earth"] = new Planet( data.Planet.Earth );
bodies["Mercury"] = new Planet( data.Planet.Mercury );
bodies["Venus"] = new Planet( data.Planet.Venus );
bodies["Mars"] = new Planet( data.Planet.Mars );
bodies["Jupiter"] = new Planet( data.Planet.Jupiter );
bodies["Saturn"] = new Planet( data.Planet.Saturn );
bodies["Moon"] = new Moon( data.Moon.Moon );
bodies["Ganymede"] = new Moon( data.Moon.Ganymede );
bodies["Io"] = new Moon( data.Moon.Io );
bodies["Europa"] = new Moon( data.Moon.Europa );
bodies["DeepSpace"] = new Satellite( 'DeepSpace', 'gold' );

var currentFocus = "Earth";
setFocus( currentFocus );
ui.bodyFocusList.value = "Earth";

const sunLight = new THREE.PointLight( "white", 1 );
scene.add( sunLight );

const date = new Date();
console.log( date.toUTCString() );
date.setMilliseconds( date.getMilliseconds() + bodies["DeepSpace"].period * 1000 );
console.log( bodies["DeepSpace"].period );
console.log( date.toUTCString() );

const fpsInterval = 1000 / 60;
var now, then = performance.now();
var fps, oldTimeStamp=0, milliSecondsPassed, elapsed;
let bodyPos0, bodyPos1, dbodyPos = new THREE.Vector3();

function animate( timeStamp ) {
    requestAnimationFrame( animate );

    now = performance.now();
    elapsed = timeStamp - then;
    
    if ( elapsed >= fpsInterval ) {
        then = timeStamp - ( elapsed % fpsInterval );
        bodyPos0 = bodies[currentFocus].getPosition().clone();

        fps = Math.round( 1000 / (timeStamp - oldTimeStamp) );
        ui.updateFPS( fps );
        
        milliSecondsPassed = performance.now() - oldTimeStamp;
        ui.updateDate( milliSecondsPassed * simSpeed );

        for (var body in bodies) {
            bodies[body].update( milliSecondsPassed * simSpeed );
        }
        
        ui.updateAttitude( bodies["DeepSpace"] );

        bodyPos1 = bodies[currentFocus].getPosition().clone();
        dbodyPos.copy(bodyPos1.sub(bodyPos0).clone());
        
        oldTimeStamp = timeStamp;
        
        controls.object.position.add(dbodyPos);
        controls.update();

        attitudeIndicator.rotation.x = bodies["DeepSpace"].getEuler().x;
        attitudeIndicator.rotation.y = bodies["DeepSpace"].getEuler().y;
        attitudeIndicator.rotation.z = bodies["DeepSpace"].getEuler().z;

        renderer.render(scene, camera);
        attitudeIndicatorRenderer.render( attitudeIndicatorScene, attitudeIndicatorCamera );
    } else {
        console.log("Dropped Frame.");
    }
}

document.addEventListener( 'keypress', ( event ) => {
    const keyName = event.key;

    if ( keyName === 'a' ) {
        bodies['DeepSpace'].yaw( 1 );
    }
    
    if ( keyName === 'd' ) {
        bodies['DeepSpace'].yaw( -1 );
    }

    if ( keyName === 's' ) {
        bodies['DeepSpace'].pitch( -1 );
    }
    
    if ( keyName === 'w' ) {
        bodies['DeepSpace'].pitch( 1 );
    }

    if ( keyName === 'q' ) {
        bodies['DeepSpace'].roll( 1 );
    }
    
    if ( keyName === 'e' ) {
        bodies['DeepSpace'].roll( -1 );
    }

    if ( keyName === '=' ) {
        simSpeed += 10000;
        for (var body in bodies) {
            bodies[body].setSimSpeed( simSpeed );
        }
        ui.updateSimSpeed( simSpeed );
    }

    if ( keyName === '-' ) {
        simSpeed -= 10000;
        for (var body in bodies) {
            bodies[body].setSimSpeed( simSpeed );
        }
        ui.updateSimSpeed( simSpeed );
    }
});

export function createSatellite( name ) {
    bodies[name] = new Satellite( name, 'gold' );
}

export function addToScene( element ) {
    scene.add(element);
}

export function updateParams( body ) {
    ui.updateParams( body );
}

export function updateThrust( thrustLevel ) {
    bodies["DeepSpace"].setThrustLevel( thrustLevel );
}

export function addBodyFocus( object ) {
    ui.addBodyFocus(object);
}

export function addSatFocus( object ) {
    ui.addSatFocus(object);
}

export function setFocus( body ) {
    
    currentFocus = body;
    controls.target = bodies[body].getPosition();
    controls.object.position.set( 
        bodies[body].getPosition().x + 2 * bodies[body].radius, 
        bodies[body].getPosition().y + 2 * bodies[body].radius, 
        bodies[body].getPosition().z + 2 * bodies[body].radius 
    );
    
    controls.update();

}
    
export function getFocus() {
    return ui.focusList.value;
}

export function getDate() {
    return ui.getDate();
}

export function getT() {
    return ui.T;
}

export function getFPS() {
    return fps;
}

export function getBodyPosition( body ) {
    return bodies[body].getPosition();
}

export function getBodyMass( body ) {
    return bodies[body].getMass();
}

function resize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.onresize = resize;

console.log( 0 <= 1e-6 );

window.addEventListener("load", () => {
    console.log("Page is fully loaded.");

    animate();
})
