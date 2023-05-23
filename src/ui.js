import * as utils from 'utils';
import * as main from 'main';

class UI {    
    
    constructor() {
        this.title = document.createElement('text');
        this.title.innerText = "ThreeJSat";
        this.title.id = 'title';
        document.body.appendChild( this.title );

        this.tabs = document.createElement('div');
        this.tabs.className = 'tab';
        this.tabs.id = 'tabs';
        document.body.appendChild( this.tabs );

        this.infoTab = document.createElement('button');
        this.infoTab.className = 'tablinks';
        this.infoTab.innerText = 'Info';
        this.infoTab.id = 'infoTab';
        this.infoTab.addEventListener( 'click', () => this.openTab( 'infoTab', 'infoTabContent' ) );
        this.tabs.appendChild( this.infoTab );

        this.focusTab = document.createElement('button');
        this.focusTab.className = 'tablinks';
        this.focusTab.innerText = 'Focus';
        this.focusTab.id = 'focusTab';
        this.focusTab.addEventListener( 'click', () => this.openTab( 'focusTab', 'focusTabContent' ) );
        this.tabs.appendChild( this.focusTab );

        this.addTab = document.createElement('button');
        this.addTab.className = 'tablinks';
        this.addTab.innerText = 'Add';
        this.addTab.id = 'addTab';
        this.addTab.addEventListener( 'click', () => this.openTab( 'addTab', 'addTabContent' ) );
        this.tabs.appendChild( this.addTab );

        this.infoTabContent = document.createElement('div');
        this.infoTabContent.className = 'tabcontent';
        this.infoTabContent.id = 'infoTabContent';
        document.body.appendChild( this.infoTabContent );

        this.focusTabContent = document.createElement('div');
        this.focusTabContent.className = 'tabcontent';
        this.focusTabContent.id = 'focusTabContent';
        document.body.appendChild( this.focusTabContent );

        this.addTabContent = document.createElement('div');
        this.addTabContent.className = 'tabcontent';
        this.addTabContent.id = 'addTabContent';
        document.body.appendChild( this.addTabContent );

        this.addSatButt = document.createElement('button');
        this.addSatButt.innerText = "Add Satellite";
        this.addSatButt.id = 'addSatButt';
        this.addSatButt.addEventListener( 'click', () => this.addSat() );
        this.addTabContent.appendChild( this.addSatButt );
        
        this.simSpeed = document.createElement('text');
        this.simSpeed.innerText = "Sim Speed: x";
        this.simSpeed.id = "simSpeed";
        document.body.appendChild( this.simSpeed );

        this.body = document.createElement('text');
        this.body.innerText = "Body: ";
        this.body.id = "body";
        this.focusTabContent.appendChild( this.body );
        
        this.bodyFocusList = document.createElement('select');
        this.bodyFocusList.id = 'bodyFocusList';
        this.focusTabContent.appendChild( this.bodyFocusList);

        this.bodyFocusButt = document.createElement('button');
        this.bodyFocusButt.innerText = 'Set Focus';
        this.bodyFocusButt.id = 'bodyFocusButt';
        this.bodyFocusButt.addEventListener( 'click', () => this.changeBodyFocus() );
        this.focusTabContent.appendChild( this.bodyFocusButt);

        this.sat = document.createElement('text');
        this.sat.innerText = "Sat: ";
        this.sat.id = "sat";
        this.focusTabContent.appendChild( this.sat );
        
        this.satFocusList = document.createElement('select');
        this.satFocusList.id = 'satFocusList';
        this.focusTabContent.appendChild( this.satFocusList);

        this.satFocusButt = document.createElement('button');
        this.satFocusButt.innerText = 'Set Focus';
        this.satFocusButt.id = 'satFocusButt';
        this.satFocusButt.addEventListener( 'click', () => this.changeSatFocus() );
        this.focusTabContent.appendChild( this.satFocusButt);

        this.semiMajor = document.createElement('text');
        this.semiMajor.innerText = "a: ";
        this.semiMajor.id = "semiMajor";
        this.infoTabContent.appendChild( this.semiMajor );

        this.eccentricity = document.createElement('text');
        this.eccentricity.innerText = "e: ";
        this.eccentricity.id = "eccentricity";
        this.infoTabContent.appendChild( this.eccentricity );

        this.inclination = document.createElement('text');
        this.inclination.innerText = "i: ";
        this.inclination.id = "inclination";
        this.infoTabContent.appendChild( this.inclination );

        this.raan = document.createElement('text');
        this.raan.innerText = "Ω: ";
        this.raan.id = "raan";
        this.infoTabContent.appendChild( this.raan );

        this.argPer = document.createElement('text');
        this.argPer.innerText = "ω: ";
        this.argPer.id = "argPer";
        this.infoTabContent.appendChild( this.argPer );

        this.trueAnomaly = document.createElement('text');
        this.trueAnomaly.innerText = "ν:";
        this.trueAnomaly.id = "trueAnomaly";
        this.infoTabContent.appendChild( this.trueAnomaly );

        this.position = document.createElement('text');
        this.position.innerText = 'position [km]';
        this.position.id = 'position';
        this.infoTabContent.appendChild( this.position );

        this.r_x = document.createElement('text');
        this.r_x.innerText = 'x: ';
        this.r_x.id = 'r_x';
        this.infoTabContent.appendChild(this.r_x);

        this.r_y = document.createElement('text');
        this.r_y.innerText = 'y: ';
        this.r_y.id = 'r_y';
        this.infoTabContent.appendChild(this.r_y);

        this.r_z = document.createElement('text');
        this.r_z.innerText = 'z: ';
        this.r_z.id = 'r_z';
        this.infoTabContent.appendChild(this.r_z);

        this.velocity = document.createElement('text');
        this.velocity.innerText = 'velocity [km/s]';
        this.velocity.id = 'velocity';
        this.infoTabContent.appendChild(this.velocity);

        this.v_x = document.createElement('text');
        this.v_x.innerText = 'x: ';
        this.v_x.id = 'v_x';
        this.infoTabContent.appendChild(this.v_x);

        this.v_y = document.createElement('text');
        this.v_y.innerText = 'y: ';
        this.v_y.id = 'v_y';
        this.infoTabContent.appendChild(this.v_y);

        this.v_z = document.createElement('text');
        this.v_z.innerText = 'z: ';
        this.v_z.id = 'v_z';
        this.infoTabContent.appendChild(this.v_z);

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

    addBodyFocus( object ) {
        this.bodyFocusList.add( object );
    }

    addSatFocus( object ) {
        this.satFocusList.add( object );
    }

    changeBodyFocus() {
        main.setFocus( this.bodyFocusList.value );
    }

    changeSatFocus() {
        main.setFocus( this.satFocusList.value );
    }

    openTab( tabName, contentName ) {

        if ( !document.getElementById( contentName ).checkVisibility() ) {
            var i, tabcontent, tablinks;

            tabcontent = document.getElementsByClassName( "tabcontent" );
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].style.display = "none";
            }
    
            tablinks = document.getElementsByClassName("tablinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
    
            document.getElementById( contentName ).style.display = "block";
            document.getElementById( tabName ).className += " active";

        } else {

            document.getElementById( contentName ).style.display = "none";
            document.getElementById( tabName ).className = "tablinks";

        }

    }

    updateAttitude( satellite ) {
        this.r_x.innerText = "x: " + satellite.getPositionIJK().x.toFixed(2).toString();
        this.r_y.innerText = "y: " + satellite.getPositionIJK().y.toFixed(2).toString();
        this.r_z.innerText = "z: " + satellite.getPositionIJK().z.toFixed(2).toString();

        this.v_x.innerText = "x: " + satellite.getVelocityIJK().x.toFixed(3).toString();
        this.v_y.innerText = "y: " + satellite.getVelocityIJK().y.toFixed(3).toString();
        this.v_z.innerText = "z: " + satellite.getVelocityIJK().z.toFixed(3).toString();

        // this.q_x.innerText = "x:  " + satellite.getQuaternion().x.toFixed(6).toString();
        // this.q_y.innerText = "y:  " + satellite.getQuaternion().y.toFixed(6).toString();
        // this.q_z.innerText = "z:  " + satellite.getQuaternion().z.toFixed(6).toString();
        // this.q_w.innerText = "w: " + satellite.getQuaternion().w.toFixed(6).toString();
    }

    updateParams( satellite ) {
        this.semiMajor.innerText = "a: " + satellite.a.toFixed(2);
        this.eccentricity.innerText = "e: " + satellite.e.toFixed(3);
        this.inclination.innerText = "i: " + utils.toDegrees(satellite.i).toFixed(3) + " deg";
        this.raan.innerText = "Ω: " + utils.toDegrees(satellite.raan).toFixed(3) + " deg";
        this.argPer.innerText = "ω: " + utils.toDegrees(satellite.w).toFixed(3) + " deg";
        this.trueAnomaly.innerText = "ν: " + utils.toDegrees(satellite.nu).toFixed(3) + " deg";
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