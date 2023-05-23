export const AU = 149597870.7;
export const speed = 100;
export const rotSpeed = 0.001;
export const MU = 3.986 * (10**5);


export function linspace( start, end, steps ) {
    var x = [];

    const step = (end - start) / (steps - 1);

    for (var i = 0; i < steps; i++) {
        x.push(start + (step * i))
    }

    return x;
}

// multiply 3x3 matrix with Vector3
export function matmul( A, B ) {
    var bx, by, bz;

    for (var i=0; i<B.length; i++) {
        bx = B[i].x;
        by = B[i].y;
        bz = B[i].z;

        B[i].x = A[0][0]*bx + A[0][1]*by + A[0][2]*bz
        B[i].y = A[1][0]*bx + A[1][1]*by + A[1][2]*bz
        B[i].z = A[2][0]*bx + A[2][1]*by + A[2][2]*bz
    }
}

export function rot_x( xyz, theta=0 ) {
    const R_x = [ [1, 0, 0],
            [0, Math.cos(theta), -Math.sin(theta)],
            [0, Math.sin(theta), Math.cos(theta)]];

    matmul( R_x, xyz );
}

export function rot_y( xyz, theta=0 ) {
    const R_y = [ [Math.cos(theta), 0, Math.sin(theta)],
                  [0, 1, 0],
                  [-Math.sin(theta), 0, Math.cos(theta)]];

    matmul( R_y, xyz );
}

export function rot_z( xyz, theta=0 ) {
    const R_z = [ [Math.cos(theta), -Math.sin(theta), 0],
                  [Math.sin(theta), Math.cos(theta), 0],
                  [0, 0, 1]];

    matmul( R_z, xyz );
}

export function toRadians( angle ) {
    return ( angle / 180 ) * Math.PI;
}

export function toDegrees( angle ) {
    return ( angle / Math.PI ) * 180;
}

export function getT( date ) {
    const Y = date.getFullYear();
    const M = date.getUTCMonth() + 1;
    const D = date.getUTCDate();

    const A = Math.floor( ( M - 14 ) / 12 );
    const B = 1461 * ( Y + 4800 + A );
    const C = 367 * ( M - 2 - 12 * A );
    const E = Math.floor( ( Y + 4900 + A ) / 100 );
    const JDN = Math.floor( B / 4 ) + Math.floor( C / 12 )
                - Math.floor( ( 3 * E ) / 4 ) + D - 32075;

    const JD = JDN + date.getUTCHours() / 24 + date.getUTCMinutes() / 1440
                   + date.getUTCSeconds() / 86400 + date.getMilliseconds() / 86400000;

    return ( JD - 2451545.0 ) / 36525;
}