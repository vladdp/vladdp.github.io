export const scale = 10000;
export const speed = 1200;
export const rotSpeed = 0.001;
export const MU = 3.986 * (10**5);

export const colors = [
    'gold',
    'silver', // yellow
    0xDAF7A6, // pastel green
    0x2AF3EB, // cyan
    0xF32AF3, // light purple
    0x793A00, // brown
    0x790033, // burgundy
    0xD20000, // red
    0xDEDEDE, // light gray
    0xA4A7FF, // pastel blue #10
    0xFAA4FF, // light pink
    0xBF00FF, // purple
    0x0AFF00, // green
    0x8D8D8D, // gray
    0xFF9800, // orange
    0xFAFF00, // another yellow
    0x00A2B3, // turquoise
    0xFFC0CB, // pink
    0x00ff7f, // mint green
    0xffffff, // white #20
];

export function linspace(start, end, steps) {
    var x = [];

    const step = (end - start) / (steps - 1);

    for (var i = 0; i < steps; i++) {
        x.push(start + (step * i))
    }

    return x;
}

// multiply 3x3 matrix with 3x1 matrix
export function matmul(A, B) {
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

export function rot_x(xyz, theta=0) {
    const R_x = [ [1, 0, 0],
            [0, Math.cos(theta), -Math.sin(theta)],
            [0, Math.sin(theta), Math.cos(theta)]];

    matmul(R_x, xyz);
}

export function rot_y(xyz, theta=0) {
    const R_y = [ [Math.cos(theta), 0, Math.sin(theta)],
                  [0, 1, 0],
                  [-Math.sin(theta), 0, Math.cos(theta)]];

    matmul(R_y, xyz);
}

export function rot_z(xyz, theta=0) {
    const R_z = [ [Math.cos(theta), -Math.sin(theta), 0],
                  [Math.sin(theta), Math.cos(theta), 0],
                  [0, 0, 1]];

    matmul(R_z, xyz);
}

export function toRadians(angle) {
    return (angle/180) * Math.PI;
}

export function toDegrees(angle) {
    return (angle/Math.PI) * 180;
}