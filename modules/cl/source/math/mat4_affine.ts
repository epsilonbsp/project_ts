import {mat4_t, TYPE} from "./mat4.ts";
import {vec3_t} from "./vec3.ts";
import {EPSILON} from "./math.ts";

export function mat4_translation(out: mat4_t, v: vec3_t): void {
    out[0] = 1.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = 1.0;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = 0.0;
    out[9] = 0.0;
    out[10] = 1.0;
    out[11] = 0.0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1.0;
}

export function mat4_rotation_x(out: mat4_t, r: number): void {
    const s = Math.sin(r), c = Math.cos(r);

    out[0] = 1.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = c;
    out[6] = s;
    out[7] = 0.0;
    out[8] = 0.0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = 0.0;
    out[15] = 1.0;
}

export function mat4n_rotation_x(r: number): mat4_t {
    const out = new TYPE(16);

    mat4_rotation_x(out, r);

    return out;
}

export function mat4_rotation_y(out: mat4_t, r: number): void {
    const s = Math.sin(r), c = Math.cos(r);

    out[0] = c;
    out[1] = 0.0;
    out[2] = -s;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = 1.0;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = s;
    out[9] = 0.0;
    out[10] = c;
    out[11] = 0.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = 0.0;
    out[15] = 1.0;
}

export function mat4n_rotation_y(r: number): mat4_t {
    const out = new TYPE(16);

    mat4_rotation_y(out, r);

    return out;
}

export function mat4_rotation_z(out: mat4_t, r: number): void {
    const s = Math.sin(r), c = Math.cos(r);

    out[0] = c;
    out[1] = s;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = 0.0;
    out[9] = 0.0;
    out[10] = 1.0;
    out[11] = 0.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = 0.0;
    out[15] = 1.0;
}

export function mat4n_rotation_z(r: number): mat4_t {
    const out = new TYPE(16);

    mat4_rotation_z(out, r);

    return out;
}

export function mat4_scaling(out: mat4_t, v: vec3_t): void {
    out[0] = v[0];
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = v[1];
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = 0.0;
    out[9] = 0.0;
    out[10] = v[2];
    out[11] = 0.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = 0.0;
    out[15] = 1.0;
}

export function mat4n_scaling(v: vec3_t): mat4_t {
    const out = new TYPE(16);

    mat4_scaling(out, v);

    return out;
}

export function mat4_translate(out: mat4_t, m: mat4_t, v: vec3_t): void {
    const x = v[0], y = v[1], z = v[2];

    out[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
    out[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
    out[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
    out[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
}

export function mat4n_translate(m: mat4_t, v: vec3_t): mat4_t {
    const out = new TYPE(16);

    mat4_translate(out, m, v);

    return out;
}

export function mat4m_translate(out: mat4_t, v: vec3_t): void {
    mat4_translate(out, out, v);
}

export function mat4_rotate(out: mat4_t, m: mat4_t, r: number, ax: vec3_t): void {
    let x = ax[0], y = ax[1], z = ax[2];
    let len = Math.sqrt(x * x + y * y + z * z);
    let s, c, t;
    let a00, a01, a02, a03;
    let a10, a11, a12, a13;
    let a20, a21, a22, a23;
    let b00, b01, b02;
    let b10, b11, b12;
    let b20, b21, b22;

    if (len < EPSILON) {
        return;
    }

    len = 1.0 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(r);
    c = Math.cos(r);
    t = 1.0 - c;

    a00 = m[0];
    a01 = m[1];
    a02 = m[2];
    a03 = m[3];
    a10 = m[4];
    a11 = m[5];
    a12 = m[6];
    a13 = m[7];
    a20 = m[8];
    a21 = m[9];
    a22 = m[10];
    a23 = m[11];

    b00 = x * x * t + c;
    b01 = y * x * t + z * s;
    b02 = z * x * t - y * s;
    b10 = x * y * t - z * s;
    b11 = y * y * t + c;
    b12 = z * y * t + x * s;
    b20 = x * z * t + y * s;
    b21 = y * z * t - x * s;
    b22 = z * z * t + c;

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
}

export function mat4n_rotate(m: mat4_t, r: number, ax: vec3_t): mat4_t {
    const out = new TYPE(16);

    mat4_rotate(out, m, r, ax);

    return out;
}

export function mat4m_rotate(out: mat4_t, r: number, ax: vec3_t): void {
    mat4_rotate(out, out, r, ax);
}

export function mat4_rotate_x(out: mat4_t, m: mat4_t, r: number): void {
    const e10 = m[4], e11 = m[5], e12 = m[6],  e13 = m[7],
          e20 = m[8], e21 = m[9], e22 = m[10], e23 = m[11];
    const s = Math.sin(r), c = Math.cos(r);

    out[4] = e10 * c + e20 * s;
    out[5] = e11 * c + e21 * s;
    out[6] = e12 * c + e22 * s;
    out[7] = e13 * c + e23 * s;
    out[8] = e20 * c - e10 * s;
    out[9] = e21 * c - e11 * s;
    out[10] = e22 * c - e12 * s;
    out[11] = e23 * c - e13 * s;
}

export function mat4n_rotate_x(m: mat4_t, r: number): mat4_t {
    const out = new TYPE(16);

    mat4_rotate_x(out, m, r);

    return out;
}

export function mat4m_rotate_x(out: mat4_t, r: number): void {
    mat4_rotate_x(out, out, r);
}

export function mat4_rotate_y(out: mat4_t, m: mat4_t, r: number): void {
    const e00 = m[0], e01 = m[1], e02 = m[2],  e03 = m[3],
          e20 = m[8], e21 = m[9], e22 = m[10], e23 = m[11];
    const s = Math.sin(r), c = Math.cos(r);

    out[0] = e00 * c - e20 * s;
    out[1] = e01 * c - e21 * s;
    out[2] = e02 * c - e22 * s;
    out[3] = e03 * c - e23 * s;
    out[8] = e00 * s + e20 * c;
    out[9] = e01 * s + e21 * c;
    out[10] = e02 * s + e22 * c;
    out[11] = e03 * s + e23 * c;
}

export function mat4n_rotate_y(m: mat4_t, r: number): mat4_t {
    const out = new TYPE(16);

    mat4_rotate_y(out, m, r);

    return out;
}

export function mat4m_rotate_y(out: mat4_t, r: number): void {
    mat4_rotate_y(out, out, r);
}

export function mat4_rotate_z(out: mat4_t, m: mat4_t, r: number): void {
    const e00 = m[0], e01 = m[1], e02 = m[2], e03 = m[3],
          e10 = m[4], e11 = m[5], e12 = m[6], e13 = m[7];
    const s = Math.sin(r), c = Math.cos(r);

    out[0] = e00 * c + e10 * s;
    out[1] = e01 * c + e11 * s;
    out[2] = e02 * c + e12 * s;
    out[3] = e03 * c + e13 * s;
    out[4] = e10 * c - e00 * s;
    out[5] = e11 * c - e01 * s;
    out[6] = e12 * c - e02 * s;
    out[7] = e13 * c - e03 * s;
}

export function mat4n_rotate_z(m: mat4_t, r: number): mat4_t {
    const out = new TYPE(16);

    mat4_rotate_z(out, m, r);

    return out;
}

export function mat4m_rotate_z(out: mat4_t, r: number): void {
    mat4_rotate_z(out, out, r);
}

export function mat4_scale(out: mat4_t, m: mat4_t, v: vec3_t): void {
    const x = v[0], y = v[1], z = v[2];

    out[0] = m[0] * x;
    out[1] = m[1] * x;
    out[2] = m[2] * x;
    out[3] = m[3] * x;
    out[4] = m[4] * y;
    out[5] = m[5] * y;
    out[6] = m[6] * y;
    out[7] = m[7] * y;
    out[8] = m[8] * z;
    out[9] = m[9] * z;
    out[10] = m[10] * z;
    out[11] = m[11] * z;
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];
}

export function mat4n_scale(m: mat4_t, v: vec3_t): mat4_t {
    const out = new TYPE(16);

    mat4_scale(out, m, v);

    return out;
}

export function mat4m_scale(out: mat4_t, v: vec3_t): void {
    mat4_scale(out, out, v);
}
