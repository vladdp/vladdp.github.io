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

        this.thrust = document.createElement('text');
        this.thrust.innerText = 'Thrust: ';
        this.thrust.id = "thrust"
        document.body.appendChild( this.thrust );

        this.thrustSlider = document.createElement('input');
        this.thrustSlider.setAttribute("type", "range");
        this.thrustSlider.id = 'thrustSlider';
        this.thrustSlider.value = "0";
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

    updateSimSpeed( simSpeed ) {
        this.simSpeed.innerText = "Sim Speed: x" + simSpeed.toString();
    }

    updateDate( inc ) {
        this.date.setMilliseconds( this.date.getMilliseconds() + inc );
        this.ui_date.innerText = this.date.toUTCString();

        this.T = utils.getT( this.date );
    }

    updateFPS( fps ) {
        this.fps.innerText = "FPS: " + fps.toString();
    }

}

export { UI };