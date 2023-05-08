import * as utils from 'utils';
import * as main from 'main';

class UI {    
    
    constructor() {
        this.title = document.createElement('text');
        this.title.innerText = "ThreeJSat";
        this.title.id = 'title';
        document.body.appendChild( this.title );
        
        this.addSatButt = document.createElement('button');
        this.addSatButt.innerText = "Add Satellite";
        this.addSatButt.id = 'addSatButt';
        this.addSatButt.addEventListener( 'click', () => this.addSat() );
        document.body.appendChild( this.addSatButt );
        
        this.simSpeed = document.createElement('text');
        this.simSpeed.innerText = "Sim Speed: x";
        this.simSpeed.id = "simSpeed";
        document.body.appendChild( this.simSpeed );

        this.focus = document.createElement('text');
        this.focus.innerText = "Focus";
        this.focus.id = "focus";
        document.body.appendChild( this.focus );
        
        this.focusList = document.createElement('select');
        this.focusList.id = 'focusList';
        this.focusList.addEventListener( "change", () => this.changeFocus() );
        document.body.appendChild( this.focusList) ;

        this.orbitalParams = document.createElement('text');
        this.orbitalParams.innerText = "Orbital Parameters";
        this.orbitalParams.id = "orbParams";
        document.body.appendChild(this.orbitalParams);

        this.semiMajor = document.createElement('text');
        this.semiMajor.innerText = "a: ";
        this.semiMajor.id = "semiMajor";
        document.body.appendChild(this.semiMajor);

        this.eccentricity = document.createElement('text');
        this.eccentricity.innerText = "e: ";
        this.eccentricity.id = "eccentricity";
        document.body.appendChild(this.eccentricity);

        this.inclination = document.createElement('text');
        this.inclination.innerText = "i: ";
        this.inclination.id = "inclination";
        document.body.appendChild(this.inclination);

        this.raan = document.createElement('text');
        this.raan.innerText = "Ω: ";
        this.raan.id = "raan";
        document.body.appendChild(this.raan);

        this.argPer = document.createElement('text');
        this.argPer.innerText = "ω: ";
        this.argPer.id = "argPer";
        document.body.appendChild(this.argPer);

        this.trueAnomaly = document.createElement('text');
        this.trueAnomaly.innerText = "ν:";
        this.trueAnomaly.id = "trueAnomaly";
        document.body.appendChild(this.trueAnomaly);

        this.position = document.createElement('text');
        this.position.innerText = 'position [km]';
        this.position.id = 'position';
        document.body.appendChild(this.position);

        this.r_x = document.createElement('text');
        this.r_x.innerText = 'x: ';
        this.r_x.id = 'r_x';
        document.body.appendChild(this.r_x);

        this.r_y = document.createElement('text');
        this.r_y.innerText = 'y: ';
        this.r_y.id = 'r_y';
        document.body.appendChild(this.r_y);

        this.r_z = document.createElement('text');
        this.r_z.innerText = 'z: ';
        this.r_z.id = 'r_z';
        document.body.appendChild(this.r_z);

        this.velocity = document.createElement('text');
        this.velocity.innerText = 'velocity [km/s]';
        this.velocity.id = 'velocity';
        document.body.appendChild(this.velocity);

        this.v_x = document.createElement('text');
        this.v_x.innerText = 'x: ';
        this.v_x.id = 'v_x';
        document.body.appendChild(this.v_x);

        this.v_y = document.createElement('text');
        this.v_y.innerText = 'y: ';
        this.v_y.id = 'v_y';
        document.body.appendChild(this.v_y);

        this.v_z = document.createElement('text');
        this.v_z.innerText = 'z: ';
        this.v_z.id = 'v_z';
        document.body.appendChild(this.v_z);

        this.quaternion = document.createElement('text');
        this.quaternion.innerText = 'quaternion';
        this.quaternion.id = 'quaternion';
        document.body.appendChild(this.quaternion);

        this.q_x = document.createElement('text');
        this.q_x.innerText = 'x: ';
        this.q_x.id = 'q_x';
        document.body.appendChild(this.q_x);

        this.q_y = document.createElement('text');
        this.q_y.innerText = 'y: ';
        this.q_y.id = 'q_y';
        document.body.appendChild(this.q_y);

        this.q_z = document.createElement('text');
        this.q_z.innerText = 'z: ';
        this.q_z.id = 'q_z';
        document.body.appendChild(this.q_z);

        this.q_w = document.createElement('text');
        this.q_w.innerText = 'w: ';
        this.q_w.id = 'q_w';
        document.body.appendChild(this.q_w);

        this.thrust = document.createElement('text');
        this.thrust.innerText = 'Thrust: ';
        this.thrust.id = "thrust"
        document.body.appendChild( this.thrust );

        this.thrustSlider = document.createElement('input');
        this.thrustSlider.setAttribute("type", "range");
        this.thrustSlider.id = 'thrustSlider';
        this.thrustSlider.value = "0";
        this.thrustSlider.addEventListener( 'input', () => this.updateThrustLevel() );
        document.body.appendChild( this.thrustSlider );

        this.date = new Date();
        this.ui_date = document.createElement('text');
        this.ui_date.innerText = this.date.toUTCString();
        this.ui_date.id = "ui_date";
        document.body.appendChild( this.ui_date );

        this.fps = document.createElement('text');
        this.fps.innerText = "FPS: ";
        this.fps.id = "fps";
        document.body.appendChild( this.fps );

        this.T = utils.getT( this.date );
    }
    
    addSat() {
        let name = prompt( "Enter satellite name: ");

        if ( name !== '' && name !== null ) {
            main.createSatellite( name );
        }
    }

    changeSat() {
        this.currentSat = this.satList.selectedIndex;

        this.update();
    }

    addFocus( object ) {
        this.focusList.add( object );
    }

    changeFocus() {
        main.setFocus( this.focusList.value );
    }

    updateAttitude( satellite ) {
        this.r_x.innerText = "x: " + satellite.getPositionIJK().x.toFixed(2).toString();
        this.r_y.innerText = "y: " + satellite.getPositionIJK().y.toFixed(2).toString();
        this.r_z.innerText = "z: " + satellite.getPositionIJK().z.toFixed(2).toString();

        this.v_x.innerText = "x: " + satellite.getVelocityIJK().x.toFixed(3).toString();
        this.v_y.innerText = "y: " + satellite.getVelocityIJK().y.toFixed(3).toString();
        this.v_z.innerText = "z: " + satellite.getVelocityIJK().z.toFixed(3).toString();

        this.q_x.innerText = "x:  " + satellite.getQuaternion().x.toFixed(6).toString();
        this.q_y.innerText = "y:  " + satellite.getQuaternion().y.toFixed(6).toString();
        this.q_z.innerText = "z:  " + satellite.getQuaternion().z.toFixed(6).toString();
        this.q_w.innerText = "w: " + satellite.getQuaternion().w.toFixed(6).toString();
    }

    updateParams( satellite ) {
        this.semiMajor.innerText = "a: " + satellite.a.toFixed(2);
        this.eccentricity.innerText = "e: " + satellite.e.toFixed(3);
        this.inclination.innerText = "i: " + utils.toDegrees(satellite.i).toFixed(3) + " deg";
        this.raan.innerText = "Ω: " + utils.toDegrees(satellite.raan).toFixed(3) + " deg";
        this.argPer.innerText = "ω: " + utils.toDegrees(satellite.w).toFixed(3) + " deg";
        this.trueAnomaly.innerText = "ν: " + utils.toDegrees(satellite.v_0).toFixed(3) + " deg";
    }

    updateThrustLevel() {
        main.updateThrust( this.thrustSlider.value );
    }

    updateSimSpeed( simSpeed ) {
        this.simSpeed.innerText = "Sim Speed: x" + simSpeed.toString();
    }

    updateDate( inc ) {
        this.date.setMilliseconds( this.date.getMilliseconds() + inc );
        this.ui_date.innerText = this.date.toUTCString();

        this.T = utils.getT( this.date );
    }

    getDate() {
        return this.date;
    }

    updateFPS( fps ) {
        this.fps.innerText = "FPS: " + fps.toString();
    }

}

export { UI };