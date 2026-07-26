import {abs, EPSILON} from "./math.ts";
import {vec3_t} from "./vec3.ts";

export const TYPE = Float32Array;
export type mat3_t = Float32Array;

// creation
export function mat3(e00: number = 1.0, e01: number = 0.0, e02: number = 0.0, e10: number = 0.0, e11?: number, e12: number = 0.0, e20: number = 0.0, e21: number = 0.0, e22?: number): mat3_t {
    const out = new TYPE(9);

    out[0] = e00;
    out[1] = e01;
    out[2] = e02;
    out[3] = e10;
    out[4] = e11 ?? e00;
    out[5] = e12;
    out[6] = e20;
    out[7] = e21;
    out[8] = e22 ?? e00;

    return out;
}

export function mat3_set(out: mat3_t, e00: number, e01: number, e02: number, e10: number, e11: number, e12: number, e20: number, e21: number, e22: number): void {
    out[0] = e00;
    out[1] = e01;
    out[2] = e02;
    out[3] = e10;
    out[4] = e11;
    out[5] = e12;
    out[6] = e20;
    out[7] = e21;
    out[8] = e22;
}

export function mat3_copy(out: mat3_t, m: mat3_t): void {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[3];
    out[4] = m[4];
    out[5] = m[5];
    out[6] = m[6];
    out[7] = m[7];
    out[8] = m[8];
}

export function mat3n_copy(m: mat3_t): mat3_t {
    const out = new TYPE(9);

    mat3_copy(out, m);

    return out;
}

// unary
export function mat3_zero(out: mat3_t): void {
    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = 0.0;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = 0.0;
}

export function mat3n_zero(): mat3_t {
    const out = new TYPE(9);

    mat3_zero(out);

    return out;
}

export function mat3_ident(out: mat3_t): void {
    out[0] = 1.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 1.0;
    out[5] = 0.0;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = 1.0;
}

export function mat3n_ident(): mat3_t {
    const out = new TYPE(9);

    mat3_ident(out);

    return out;
}

// arithmetic matrix x matrix
export function mat3_add(out: mat3_t, m0: mat3_t, m1: mat3_t): void {
    out[0] = m0[0] + m1[0];
    out[1] = m0[1] + m1[1];
    out[2] = m0[2] + m1[2];
    out[3] = m0[3] + m1[3];
    out[4] = m0[4] + m1[4];
    out[5] = m0[5] + m1[5];
    out[6] = m0[6] + m1[6];
    out[7] = m0[7] + m1[7];
    out[8] = m0[8] + m1[8];
}

export function mat3n_add(m0: mat3_t, m1: mat3_t): mat3_t {
    const out = new TYPE(9);

    mat3_add(out, m0, m1);

    return out;
}

export function mat3m_add(out: mat3_t, m: mat3_t): void {
    mat3_add(out, out, m);
}

export function mat3_sub(out: mat3_t, m0: mat3_t, m1: mat3_t): void {
    out[0] = m0[0] - m1[0];
    out[1] = m0[1] - m1[1];
    out[2] = m0[2] - m1[2];
    out[3] = m0[3] - m1[3];
    out[4] = m0[4] - m1[4];
    out[5] = m0[5] - m1[5];
    out[6] = m0[6] - m1[6];
    out[7] = m0[7] - m1[7];
    out[8] = m0[8] - m1[8];
}

export function mat3n_sub(m0: mat3_t, m1: mat3_t): mat3_t {
    const out = new TYPE(9);

    mat3_sub(out, m0, m1);

    return out;
}

export function mat3m_sub(out: mat3_t, m: mat3_t): void {
    mat3_sub(out, out, m);
}

// arithmetic matrix x scalar
export function mat3_muls(out: mat3_t, m: mat3_t, s: number): void {
    out[0] = m[0] * s;
    out[1] = m[1] * s;
    out[2] = m[2] * s;
    out[3] = m[3] * s;
    out[4] = m[4] * s;
    out[5] = m[5] * s;
    out[6] = m[6] * s;
    out[7] = m[7] * s;
    out[8] = m[8] * s;
}

export function mat3n_muls(m: mat3_t, s: number): mat3_t {
    const out = new TYPE(9);

    mat3_muls(out, m, s);

    return out;
}

export function mat3m_muls(out: mat3_t, s: number): void {
    mat3_muls(out, out, s);
}

// arithmetic matrix x matrix x scalar
export function mat3_addmuls(out: mat3_t, m0: mat3_t, m1: mat3_t, s: number): void {
    out[0] = m0[0] + m1[0] * s;
    out[1] = m0[1] + m1[1] * s;
    out[2] = m0[2] + m1[2] * s;
    out[3] = m0[3] + m1[3] * s;
    out[4] = m0[4] + m1[4] * s;
    out[5] = m0[5] + m1[5] * s;
    out[6] = m0[6] + m1[6] * s;
    out[7] = m0[7] + m1[7] * s;
    out[8] = m0[8] + m1[8] * s;
}

export function mat3n_addmuls(m0: mat3_t, m1: mat3_t, s: number): mat3_t {
    const out = new TYPE(9);

    mat3_addmuls(out, m0, m1, s);

    return out;
}

export function mat3m_addmuls(out: mat3_t, m: mat3_t, s: number): void {
    mat3_addmuls(out, out, m, s);
}

// product matrix x matrix
export function mat3_mul(out: mat3_t, m0: mat3_t, m1: mat3_t): void {
    const a00 = m0[0], a01 = m0[1], a02 = m0[2],
          a10 = m0[3], a11 = m0[4], a12 = m0[5],
          a20 = m0[6], a21 = m0[7], a22 = m0[8];
    const b00 = m1[0], b01 = m1[1], b02 = m1[2],
          b10 = m1[3], b11 = m1[4], b12 = m1[5],
          b20 = m1[6], b21 = m1[7], b22 = m1[8];

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a00 * b10 + a10 * b11 + a20 * b12;
    out[4] = a01 * b10 + a11 * b11 + a21 * b12;
    out[5] = a02 * b10 + a12 * b11 + a22 * b12;
    out[6] = a00 * b20 + a10 * b21 + a20 * b22;
    out[7] = a01 * b20 + a11 * b21 + a21 * b22;
    out[8] = a02 * b20 + a12 * b21 + a22 * b22;
}

export function mat3n_mul(m0: mat3_t, m1: mat3_t): mat3_t {
    const out = new TYPE(9);

    mat3_mul(out, m0, m1);

    return out;
}

export function mat3m_mul(out: mat3_t, m: mat3_t): void {
    mat3_mul(out, out, m);
}

// product matrix x vector
export function mat3_mulmv(out: vec3_t, v: vec3_t, m: mat3_t): void {
    const x = v[0], y = v[1], z = v[2];

    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
}

export function mat3n_mulmv(v: vec3_t, m: mat3_t): vec3_t {
    const out = new TYPE(2);

    mat3_mulmv(out, v, m);

    return out;
}

export function mat3m_mulmv(out: vec3_t, m: mat3_t): void {
    mat3_mulmv(out, out, m);
}

export function mat3_mulvm(out: vec3_t, v: vec3_t, m: mat3_t): void {
    const x = v[0], y = v[1], z = v[2];

    out[0] = x * m[0] + y * m[1] + z * m[2];
    out[1] = x * m[3] + y * m[4] + z * m[5];
    out[2] = x * m[6] + y * m[7] + z * m[8];
}

export function mat3n_mulvm(v: vec3_t, m: mat3_t): vec3_t {
    const out = new TYPE(2);

    mat3_mulvm(out, v, m);

    return out;
}

export function mat3m_mulvm(out: vec3_t, m: mat3_t): void {
    mat3_mulvm(out, out, m);
}

// special
export function mat3_det(m: mat3_t): number {
    const e00 = m[0], e01 = m[1], e02 = m[2],
          e10 = m[3], e11 = m[4], e12 = m[5],
          e20 = m[6], e21 = m[7], e22 = m[8];

    return (
        e00 * (e22 * e11 - e12 * e21) +
        e01 * (-e22 * e10 + e12 * e20) +
        e02 * (e21 * e10 - e11 * e20)
    );
}

export function mat3_frob(m: mat3_t): number {
    return Math.hypot(
        m[0], m[1], m[2],
        m[3], m[4], m[5],
        m[6], m[7], m[8]
    );
}

export function mat3_transp(out: mat3_t, m: mat3_t): void {
    const e00 = m[0], e01 = m[1], e02 = m[2],
          e10 = m[3], e11 = m[4], e12 = m[5],
          e20 = m[6], e21 = m[7], e22 = m[8];

    out[0] = e00;
    out[1] = e10;
    out[2] = e20;
    out[3] = e01;
    out[4] = e11;
    out[5] = e21;
    out[6] = e02;
    out[7] = e12;
    out[8] = e22;
}

export function mat3n_transp(m: mat3_t): mat3_t {
    const out = new TYPE(9);

    mat3_transp(out, m);

    return out;
}

export function mat3m_transp(out: mat3_t): void {
    mat3_transp(out, out);
}

export function mat3_adjoint(out: mat3_t, m: mat3_t): void {
    const e00 = m[0], e01 = m[1], e02 = m[2],
          e10 = m[3], e11 = m[4], e12 = m[5],
          e20 = m[6], e21 = m[7], e22 = m[8];

    out[0] = e11 * e22 - e12 * e21;
    out[1] = e02 * e21 - e01 * e22;
    out[2] = e01 * e12 - e02 * e11;
    out[3] = e12 * e20 - e10 * e22;
    out[4] = e00 * e22 - e02 * e20;
    out[5] = e02 * e10 - e00 * e12;
    out[6] = e10 * e21 - e11 * e20;
    out[7] = e01 * e20 - e00 * e21;
    out[8] = e00 * e11 - e01 * e10;
}

export function mat3n_adjoint(m: mat3_t): mat3_t {
    const out = new TYPE(9);

    mat3_adjoint(out, m);

    return out;
}

export function mat3m_adjoint(out: mat3_t): void {
    mat3_adjoint(out, out);
}

export function mat3_inv(out: mat3_t, m: mat3_t): void {
    const a00 = m[0], a01 = m[1], a02 = m[2],
          a10 = m[3], a11 = m[4], a12 = m[5],
          a20 = m[6], a21 = m[7], a22 = m[8];
    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;

    if (abs(det) < EPSILON) {
        return;
    }

    det = 1.0 / det;

    out[0] = b01 * det;
    out[1] = (-a22 * a01 + a02 * a21) * det;
    out[2] = (a12 * a01 - a02 * a11) * det;
    out[3] = b11 * det;
    out[4] = (a22 * a00 - a02 * a20) * det;
    out[5] = (-a12 * a00 + a02 * a10) * det;
    out[6] = b21 * det;
    out[7] = (-a21 * a00 + a01 * a20) * det;
    out[8] = (a11 * a00 - a01 * a10) * det;
}

export function mat3n_inv(m: mat3_t): mat3_t {
    const out = new TYPE(9);

    mat3_inv(out, m);

    return out;
}

export function mat3m_inv(out: mat3_t): void {
    mat3_inv(out, out);
}

export function mat3_str(m: mat3_t): string {
    return "mat3(\n" +
        `\t${m[0]}, ${m[3]}, ${m[6]},\n` +
        `\t${m[1]}, ${m[4]}, ${m[7]},\n` +
        `\t${m[2]}, ${m[5]}, ${m[8]}\n` +
        ")";
}

export function mat3_print(m: mat3_t): void {
    console.log(mat3_str(m));
}
