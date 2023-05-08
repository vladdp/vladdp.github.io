import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import 'jquery';
import 'jquery-ui';

import { CelestialBody, Planet, Moon } from 'celestials';
import { Satellite } from 'sat';
import data from 'celestial_data' assert { type: 'json'};
import { UI } from 'ui';


const scene = new THREE.Scene();
const attitudeIndicatorScene = new THREE.Scene();
const ui = new UI();
var simSpeed = 1;
ui.updateSimSpeed( simSpeed );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1e12 );
const attitudeIndicatorCamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );

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

const attitudeIndicator = new THREE.Mesh(
    new THREE.SphereGeometry( 10, 64, 64 ),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load( "assets/attitude_indicator.png" ),
    })
);

attitudeIndicatorCamera.position.set( 13, 13, 13 );

attitudeIndicatorScene.add( attitudeIndicator );
const attitudeIndicatorControls = new OrbitControls( attitudeIndicatorCamera, attitudeIndicatorRenderer.domElement );
attitudeIndicatorControls.update();


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

setFocus("Earth");
ui.focusList.value = "Earth";

const sunLight = new THREE.PointLight( "white", 1 );
scene.add( sunLight );

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
        bodyPos0 = bodies[ui.focusList.value].getPosition().clone();

        milliSecondsPassed = ( performance.now() - oldTimeStamp );
    
        fps = Math.round( 1000 / milliSecondsPassed );
        
        ui.updateFPS( fps );
        ui.updateDate( milliSecondsPassed * simSpeed );

        for (var body in bodies) {
            bodies[body].update();
        }
        
        ui.updateAttitude( bodies["DeepSpace"] );

        bodyPos1 = bodies[ui.focusList.value].getPosition().clone();
        dbodyPos.copy(bodyPos1.sub(bodyPos0).clone());
        
        oldTimeStamp = timeStamp;
        
        controls.object.position.add(dbodyPos);
        controls.update();
        attitudeIndicatorControls.update();
        
        renderer.render(scene, camera);
        attitudeIndicatorRenderer.render( attitudeIndicatorScene, attitudeIndicatorCamera );
    } else {
        console.log("slow");
    }
}

document.addEventListener( 'keypress', ( event ) => {
    const keyName = event.key;

    if ( keyName === 'a' ) {
        bodies['DeepSpace'].yaw( -1 );
    }
    
    if ( keyName === 'd' ) {
        bodies['DeepSpace'].yaw( 1 );
    }

    if ( keyName === 's' ) {
        bodies['DeepSpace'].pitch( -1 );
    }
    
    if ( keyName === 'w' ) {
        bodies['DeepSpace'].pitch( 1 );
    }

    if ( keyName === 'q' ) {
        bodies['DeepSpace'].roll( -1 );
    }
    
    if ( keyName === 'e' ) {
        bodies['DeepSpace'].roll( 1 );
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

export function addFocus( object ) {
    ui.addFocus(object);
}

export function setFocus( body ) {
    controls.target = bodies[body].getPosition();
    controls.object.position.set( bodies[body].getPosition().x + 2 * bodies[body].radius, 
                                  bodies[body].getPosition().y + 2 * bodies[body].radius, 
                                  bodies[body].getPosition().z + 2 * bodies[body].radius );
    
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

// const accordion = document.createElement('div');
// accordion.id = 'accordion';
// document.body.appendChild( accordion );

// const orbitalElements = document.createElement('h3');
// orbitalElements.innerText = "Orbital Elements";
// orbitalElements.id = "orbitalElements";
// accordion.appendChild( orbitalElements );

// $(document).ready( function() {
//     console.log("Hello Jquery loaded in js file");
// } );

// $( function() {
//     console.log( "Making accordion." );
//     $( "#accordion" ).accordion({
//       collapsible: true
//     });
// } );

animate();