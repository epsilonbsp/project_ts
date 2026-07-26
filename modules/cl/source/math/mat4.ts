import {abs, EPSILON} from "./math.ts";
import {vec4_t} from "./vec4.ts";

export const TYPE = Float32Array;
export type mat4_t = Float32Array;

// creation
export function mat4(e00: number = 1.0, e01: number = 0.0, e02: number = 0.0, e03: number = 0.0, e10: number = 0.0, e11?: number, e12: number = 0.0, e13: number = 0.0, e20: number = 0.0, e21: number = 0.0, e22?: number, e23: number = 0.0, e30: number = 0.0, e31: number = 0.0, e32: number = 0.0, e33?: number): mat4_t {
    const out = new TYPE(16);

    out[0] = e00;
    out[1] = e01;
    out[2] = e02;
    out[3] = e03;
    out[4] = e10;
    out[5] = e11 ?? e00;
    out[6] = e12;
    out[7] = e13;
    out[8] = e20;
    out[9] = e21;
    out[10] = e22 ?? e00;
    out[11] = e23;
    out[12] = e30;
    out[13] = e31;
    out[14] = e32;
    out[15] = e33 ?? e00;

    return out;
}

export function mat4_set(out: mat4_t, e00: number, e01: number, e02: number, e03: number, e10: number, e11: number, e12: number, e13: number, e20: number, e21: number, e22: number, e23: number, e30: number, e31: number, e32: number, e33: number): void {
    out[0] = e00;
    out[1] = e01;
    out[2] = e02;
    out[3] = e03;
    out[4] = e10;
    out[5] = e11;
    out[6] = e12;
    out[7] = e13;
    out[8] = e20;
    out[9] = e21;
    out[10] = e22;
    out[11] = e23;
    out[12] = e30;
    out[13] = e31;
    out[14] = e32;
    out[15] = e33;
}

export function mat4_copy(out: mat4_t, m: mat4_t): void {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[3];
    out[4] = m[4];
    out[5] = m[5];
    out[6] = m[6];
    out[7] = m[7];
    out[8] = m[8];
    out[9] = m[9];
    out[10] = m[10];
    out[11] = m[11];
    out[12] = m[12];
    out[13] = m[13];
    out[14] = m[14];
    out[15] = m[15];
}

export function mat4n_copy(m: mat4_t): mat4_t {
    const out = new TYPE(16);

    mat4_copy(out, m);

    return out;
}

// unary
export function mat4_zero(out: mat4_t): void {
    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = 0.0;
    out[7] = 0.0;
    out[8] = 0.0;
    out[9] = 0.0;
    out[10] = 0.0;
    out[11] = 0.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = 0.0;
    out[15] = 0.0;
}

export function mat4n_zero(): mat4_t {
    const out = new TYPE(16);

    mat4_zero(out);

    return out;
}

export function mat4_ident(out: mat4_t): void {
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
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = 0.0;
    out[15] = 1.0;
}

export function mat4n_ident(): mat4_t {
    const out = new TYPE(16);

    mat4_ident(out);

    return out;
}

// arithmetic matrix x matrix
export function mat4_add(out: mat4_t, m0: mat4_t, m1: mat4_t): void {
    out[0] = m0[0] + m1[0];
    out[1] = m0[1] + m1[1];
    out[2] = m0[2] + m1[2];
    out[3] = m0[3] + m1[3];
    out[4] = m0[4] + m1[4];
    out[5] = m0[5] + m1[5];
    out[6] = m0[6] + m1[6];
    out[7] = m0[7] + m1[7];
    out[8] = m0[8] + m1[8];
    out[9] = m0[9] + m1[9];
    out[10] = m0[10] + m1[10];
    out[11] = m0[11] + m1[11];
    out[12] = m0[12] + m1[12];
    out[13] = m0[13] + m1[13];
    out[14] = m0[14] + m1[14];
    out[15] = m0[15] + m1[15];
}

export function mat4n_add(m0: mat4_t, m1: mat4_t): mat4_t {
    const out = new TYPE(16);

    mat4_add(out, m0, m1);

    return out;
}

export function mat4m_add(out: mat4_t, m: mat4_t): void {
    mat4_add(out, out, m);
}

export function mat4_sub(out: mat4_t, m0: mat4_t, m1: mat4_t): void {
    out[0] = m0[0] - m1[0];
    out[1] = m0[1] - m1[1];
    out[2] = m0[2] - m1[2];
    out[3] = m0[3] - m1[3];
    out[4] = m0[4] - m1[4];
    out[5] = m0[5] - m1[5];
    out[6] = m0[6] - m1[6];
    out[7] = m0[7] - m1[7];
    out[8] = m0[8] - m1[8];
    out[9] = m0[9] - m1[9];
    out[10] = m0[10] - m1[10];
    out[11] = m0[11] - m1[11];
    out[12] = m0[12] - m1[12];
    out[13] = m0[13] - m1[13];
    out[14] = m0[14] - m1[14];
    out[15] = m0[15] - m1[15];
}

export function mat4n_sub(m0: mat4_t, m1: mat4_t): mat4_t {
    const out = new TYPE(16);

    mat4_sub(out, m0, m1);

    return out;
}

export function mat4m_sub(out: mat4_t, m: mat4_t): void {
    mat4_sub(out, out, m);
}

// arithmetic matrix x scalar
export function mat4_muls(out: mat4_t, m: mat4_t, s: number): void {
    out[0] = m[0] * s;
    out[1] = m[1] * s;
    out[2] = m[2] * s;
    out[3] = m[3] * s;
    out[4] = m[4] * s;
    out[5] = m[5] * s;
    out[6] = m[6] * s;
    out[7] = m[7] * s;
    out[8] = m[8] * s;
    out[9] = m[9] * s;
    out[10] = m[10] * s;
    out[11] = m[11] * s;
    out[12] = m[12] * s;
    out[13] = m[13] * s;
    out[14] = m[14] * s;
    out[15] = m[15] * s;
}

export function mat4n_muls(m: mat4_t, s: number): mat4_t {
    const out = new TYPE(16);

    mat4_muls(out, m, s);

    return out;
}

export function mat4m_muls(out: mat4_t, s: number): void {
    mat4_muls(out, out, s);
}

// arithmetic matrix x matrix x scalar
export function mat4_addmuls(out: mat4_t, m0: mat4_t, m1: mat4_t, s: number): void {
    out[0] = m0[0] + m1[0] * s;
    out[1] = m0[1] + m1[1] * s;
    out[2] = m0[2] + m1[2] * s;
    out[3] = m0[3] + m1[3] * s;
    out[4] = m0[4] + m1[4] * s;
    out[5] = m0[5] + m1[5] * s;
    out[6] = m0[6] + m1[6] * s;
    out[7] = m0[7] + m1[7] * s;
    out[8] = m0[8] + m1[8] * s;
    out[9] = m0[9] + m1[9] * s;
    out[10] = m0[10] + m1[10] * s;
    out[11] = m0[11] + m1[11] * s;
    out[12] = m0[12] + m1[12] * s;
    out[13] = m0[13] + m1[13] * s;
    out[14] = m0[14] + m1[14] * s;
    out[15] = m0[15] + m1[15] * s;
}

export function mat4n_addmuls(m0: mat4_t, m1: mat4_t, s: number): mat4_t {
    const out = new TYPE(16);

    mat4_addmuls(out, m0, m1, s);

    return out;
}

export function mat4m_addmuls(out: mat4_t, m: mat4_t, s: number): void {
    mat4_addmuls(out, out, m, s);
}

// product matrix x matrix
export function mat4_mul(out: mat4_t, m0: mat4_t, m1: mat4_t): void {
    const a00 = m0[0],  a01 = m0[1],  a02 = m0[2],  a03 = m0[3],
          a10 = m0[4],  a11 = m0[5],  a12 = m0[6],  a13 = m0[7],
          a20 = m0[8],  a21 = m0[9],  a22 = m0[10], a23 = m0[11],
          a30 = m0[12], a31 = m0[13], a32 = m0[14], a33 = m0[15];
    const b00 = m1[0],  b01 = m1[1],  b02 = m1[2],  b03 = m1[3],
          b10 = m1[4],  b11 = m1[5],  b12 = m1[6],  b13 = m1[7],
          b20 = m1[8],  b21 = m1[9],  b22 = m1[10], b23 = m1[11],
          b30 = m1[12], b31 = m1[13], b32 = m1[14], b33 = m1[15];

    out[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
    out[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
    out[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
    out[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
    out[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
}

export function mat4n_mul(m0: mat4_t, m1: mat4_t): mat4_t {
    const out = new TYPE(16);

    mat4_mul(out, m0, m1);

    return out;
}

export function mat4m_mul(out: mat4_t, m: mat4_t): void {
    mat4_mul(out, out, m);
}

// product matrix x vector
export function mat4_mulmv(out: vec4_t, v: vec4_t, m: mat4_t): void {
    const x = v[0], y = v[1], z = v[2], w = v[3];

    out[0] = x * m[0] + y * m[4] + z * m[8] + w * m[12];
    out[1] = x * m[1] + y * m[5] + z * m[9] + w * m[13];
    out[2] = x * m[2] + y * m[6] + z * m[10] + w * m[14];
    out[3] = x * m[3] + y * m[7] + z * m[11] + w * m[15];
}

export function mat4n_mulmv(v: vec4_t, m: mat4_t): vec4_t {
    const out = new TYPE(2);

    mat4_mulmv(out, v, m);

    return out;
}

export function mat4m_mulmv(out: vec4_t, m: mat4_t): void {
    mat4_mulmv(out, out, m);
}

export function mat4_mulvm(out: vec4_t, v: vec4_t, m: mat4_t): void {
    const x = v[0], y = v[1], z = v[2], w = v[3];

    out[0] = x * m[0] + y * m[1] + z * m[2] + w * m[3];
    out[1] = x * m[4] + y * m[5] + z * m[6] + w * m[7];
    out[2] = x * m[8] + y * m[9] + z * m[10] + w * m[11];
    out[3] = x * m[12] + y * m[13] + z * m[14] + w * m[15];
}

export function mat4n_mulvm(v: vec4_t, m: mat4_t): vec4_t {
    const out = new TYPE(2);

    mat4_mulvm(out, v, m);

    return out;
}

export function mat4m_mulvm(out: vec4_t, m: mat4_t): void {
    mat4_mulvm(out, out, m);
}

// special
export function mat4_det(m: mat4_t): number {
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3],
          a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7],
          a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11],
          a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b0 = a00 * a11 - a01 * a10;
    const b1 = a00 * a12 - a02 * a10;
    const b2 = a01 * a12 - a02 * a11;
    const b3 = a20 * a31 - a21 * a30;
    const b4 = a20 * a32 - a22 * a30;
    const b5 = a21 * a32 - a22 * a31;
    const b6 = a00 * b5 - a01 * b4 + a02 * b3;
    const b7 = a10 * b5 - a11 * b4 + a12 * b3;
    const b8 = a20 * b2 - a21 * b1 + a22 * b0;
    const b9 = a30 * b2 - a31 * b1 + a32 * b0;

    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
}

export function mat4_frob(m: mat4_t): number {
    return Math.hypot(
        m[0],  m[1],  m[2],  m[3],
        m[4],  m[5],  m[6],  m[7],
        m[8],  m[9],  m[10], m[11],
        m[12], m[13], m[14], m[15]
    );
}

export function mat4_transp(out: mat4_t, m: mat4_t): void {
    const e00 = m[0],  e01 = m[1],  e02 = m[2],  e03 = m[3],
          e10 = m[4],  e11 = m[5],  e12 = m[6],  e13 = m[7],
          e20 = m[8],  e21 = m[9],  e22 = m[10], e23 = m[11],
          e30 = m[12], e31 = m[13], e32 = m[14], e33 = m[15];

    out[0] = e00;
    out[1] = e10;
    out[2] = e20;
    out[3] = e30;
    out[4] = e01;
    out[5] = e11;
    out[6] = e21;
    out[7] = e31;
    out[8] = e02;
    out[9] = e12;
    out[10] = e22;
    out[11] = e32;
    out[12] = e03;
    out[13] = e13;
    out[14] = e23;
    out[15] = e33;
}

export function mat4n_transp(m: mat4_t): mat4_t {
    const out = new TYPE(16);

    mat4_transp(out, m);

    return out;
}

export function mat4m_transp(out: mat4_t): void {
    mat4_transp(out, out);
}

export function mat4_adjoint(out: mat4_t, m: mat4_t): void {
    const a00 = m[0],  a01 = m[1],  a02 = m[2],  a03 = m[3],
          a10 = m[4],  a11 = m[5],  a12 = m[6],  a13 = m[7],
          a20 = m[8],  a21 = m[9],  a22 = m[10], a23 = m[11],
          a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    out[0] = a11 * b11 - a12 * b10 + a13 * b09;
    out[1] = a02 * b10 - a01 * b11 - a03 * b09;
    out[2] = a31 * b05 - a32 * b04 + a33 * b03;
    out[3] = a22 * b04 - a21 * b05 - a23 * b03;
    out[4] = a12 * b08 - a10 * b11 - a13 * b07;
    out[5] = a00 * b11 - a02 * b08 + a03 * b07;
    out[6] = a32 * b02 - a30 * b05 - a33 * b01;
    out[7] = a20 * b05 - a22 * b02 + a23 * b01;
    out[8] = a10 * b10 - a11 * b08 + a13 * b06;
    out[9] = a01 * b08 - a00 * b10 - a03 * b06;
    out[10] = a30 * b04 - a31 * b02 + a33 * b00;
    out[11] = a21 * b02 - a20 * b04 - a23 * b00;
    out[12] = a11 * b07 - a10 * b09 - a12 * b06;
    out[13] = a00 * b09 - a01 * b07 + a02 * b06;
    out[14] = a31 * b01 - a30 * b03 - a32 * b00;
    out[15] = a20 * b03 - a21 * b01 + a22 * b00;
}

export function mat4n_adjoint(m: mat4_t): mat4_t {
    const out = new TYPE(16);

    mat4_adjoint(out, m);

    return out;
}

export function mat4m_adjoint(out: mat4_t): void {
    mat4_adjoint(out, out);
}

export function mat4_inv(out: mat4_t, m: mat4_t): void {
    const a00 = m[0],  a01 = m[1],  a02 = m[2],  a03 = m[3],
          a10 = m[4],  a11 = m[5],  a12 = m[6],  a13 = m[7],
          a20 = m[8],  a21 = m[9],  a22 = m[10], a23 = m[11],
          a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (abs(det) < EPSILON) {
        return;
    }

    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
}

export function mat4n_inv(m: mat4_t): mat4_t {
    const out = new TYPE(16);

    mat4_inv(out, m);

    return out;
}

export function mat4m_inv(out: mat4_t): void {
    mat4_inv(out, out);
}

export function mat4_str(m: mat4_t): string {
    return "mat4(\n" +
        `\t${m[0]}, ${m[4]}, ${m[8]}, ${m[12]},\n` +
        `\t${m[1]}, ${m[5]}, ${m[9]}, ${m[13]},\n` +
        `\t${m[2]}, ${m[6]}, ${m[10]}, ${m[14]},\n` +
        `\t${m[3]}, ${m[7]}, ${m[11]}, ${m[15]}\n` +
        ")";
}

export function mat4_print(m: mat4_t): void {
    console.log(mat4_str(m));
}
