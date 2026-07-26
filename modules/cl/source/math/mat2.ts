import {vec2_t} from "./vec2.ts";
import {abs, EPSILON} from "./math.ts"

export const TYPE = Float32Array;
export type mat2_t = Float32Array;

// creation
export function mat2(e00 = 1.0, e01 = 0.0, e10 = 0.0, e11?: number): mat2_t {
    const out = new TYPE(4);

    out[0] = e00;
    out[1] = e01;
    out[2] = e10;
    out[3] = e11 ?? e00;

    return out;
}

export function mat2_set(out: mat2_t, e00: number, e01: number, e10: number, e11: number): void {
    out[0] = e00;
    out[1] = e01;
    out[2] = e10;
    out[3] = e11;
}

export function mat2_copy(out: mat2_t, m: mat2_t): void {
    out[0] = m[0];
    out[1] = m[1];
    out[2] = m[2];
    out[3] = m[3];
}

export function mat2n_copy(m: mat2_t): mat2_t {
    const out = new TYPE(4);

    mat2_copy(out, m);

    return out;
}

// unary
export function mat2_zero(out: mat2_t): void {
    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
}

export function mat2n_zero(): mat2_t {
    const out = new TYPE(4);

    mat2_zero(out);

    return out;
}

export function mat2_ident(out: mat2_t): void {
    out[0] = 1.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 1.0;
}

export function mat2n_ident(): mat2_t {
    const out = new TYPE(4);

    mat2_ident(out);

    return out;
}

// arithmetic matrix x matrix
export function mat2_add(out: mat2_t, m0: mat2_t, m1: mat2_t): void {
    out[0] = m0[0] + m1[0];
    out[1] = m0[1] + m1[1];
    out[2] = m0[2] + m1[2];
    out[3] = m0[3] + m1[3];
}

export function mat2n_add(m0: mat2_t, m1: mat2_t): mat2_t {
    const out = new TYPE(4);

    mat2_add(out, m0, m1);

    return out;
}

export function mat2m_add(out: mat2_t, m: mat2_t): void {
    mat2_add(out, out, m);
}

export function mat2_sub(out: mat2_t, m0: mat2_t, m1: mat2_t): void {
    out[0] = m0[0] - m1[0];
    out[1] = m0[1] - m1[1];
    out[2] = m0[2] - m1[2];
    out[3] = m0[3] - m1[3];
}

export function mat2n_sub(m0: mat2_t, m1: mat2_t): mat2_t {
    const out = new TYPE(4);

    mat2_sub(out, m0, m1);

    return out;
}

export function mat2m_sub(out: mat2_t, m: mat2_t): void {
    mat2_sub(out, out, m);
}

// arithmetic matrix x scalar
export function mat2_muls(out: mat2_t, m: mat2_t, s: number): void {
    out[0] = m[0] * s;
    out[1] = m[1] * s;
    out[2] = m[2] * s;
    out[3] = m[3] * s;
}

export function mat2n_muls(m: mat2_t, s: number): mat2_t {
    const out = new TYPE(4);

    mat2_muls(out, m, s);

    return out;
}

export function mat2m_muls(out: mat2_t, s: number): void {
    mat2_muls(out, out, s);
}

// arithmetic matrix x matrix x scalar
export function mat2_addmuls(out: mat2_t, m0: mat2_t, m1: mat2_t, s: number): void {
    out[0] = m0[0] + m1[0] * s;
    out[1] = m0[1] + m1[1] * s;
    out[2] = m0[2] + m1[2] * s;
    out[3] = m0[3] + m1[3] * s;
}

export function mat2n_addmuls(m0: mat2_t, m1: mat2_t, s: number): mat2_t {
    const out = new TYPE(4);

    mat2_addmuls(out, m0, m1, s);

    return out;
}

export function mat2m_addmuls(out: mat2_t, m: mat2_t, s: number): void {
    mat2_addmuls(out, out, m, s);
}

// product matrix x matrix
export function mat2_mul(out: mat2_t, m0: mat2_t, m1: mat2_t): void {
    const a00 = m0[0], a01 = m0[1],
          a10 = m0[2], a11 = m0[3];
    const b00 = m1[0], b01 = m1[1],
          b10 = m1[2], b11 = m1[3];

    out[0] = a00 * b00 + a10 * b01;
    out[1] = a01 * b00 + a11 * b01;
    out[2] = a00 * b10 + a10 * b11;
    out[3] = a01 * b10 + a11 * b11;
}

export function mat2n_mul(m0: mat2_t, m1: mat2_t): mat2_t {
    const out = new TYPE(4);

    mat2_mul(out, m0, m1);

    return out;
}

export function mat2m_mul(out: mat2_t, m: mat2_t): void {
    mat2_mul(out, out, m);
}

// product matrix x vector
export function mat2_mulmv(out: vec2_t, v: vec2_t, m: mat2_t): void {
    const x = v[0], y = v[1];

    out[0] = x * m[0] + y * m[2];
    out[1] = x * m[1] + y * m[3];
}

export function mat2n_mulmv(v: vec2_t, m: mat2_t): vec2_t {
    const out = new TYPE(2);

    mat2_mulmv(out, v, m);

    return out;
}

export function mat2m_mulmv(out: vec2_t, m: mat2_t): void {
    mat2_mulmv(out, out, m);
}

export function mat2_mulvm(out: vec2_t, v: vec2_t, m: mat2_t): void {
    const x = v[0], y = v[1];

    out[0] = x * m[0] + y * m[1];
    out[1] = x * m[2] + y * m[3];
}

export function mat2n_mulvm(v: vec2_t, m: mat2_t): vec2_t {
    const out = new TYPE(2);

    mat2_mulvm(out, v, m);

    return out;
}

export function mat2m_mulvm(out: vec2_t, m: mat2_t): void {
    mat2_mulvm(out, out, m);
}

// special
export function mat2_det(m: mat2_t): number {
    return m[0] * m[3] - m[2] * m[1];
}

export function mat2_frob(m: mat2_t): number {
    return Math.hypot(
        m[0], m[1],
        m[2], m[3]
    );
}

export function mat2_transp(out: mat2_t, m: mat2_t): void {
    const temp = m[1];

    out[0] = m[0];
    out[1] = m[2];
    out[2] = temp;
    out[3] = m[3];
}

export function mat2n_transp(m: mat2_t): mat2_t {
    const out = new TYPE(4);

    mat2_transp(out, m);

    return out;
}

export function mat2m_transp(out: mat2_t): void {
    mat2_transp(out, out);
}

export function mat2_adjoint(out: mat2_t, m: mat2_t): void {
    out[0] = m[3];
    out[1] = -m[1];
    out[2] = -m[2];
    out[3] = m[0];
}

export function mat2n_adjoint(m: mat2_t): mat2_t {
    const out = new TYPE(4);

    mat2_adjoint(out, m);

    return out;
}

export function mat2m_adjoint(out: mat2_t): void {
    mat2_adjoint(out, out);
}

export function mat2_inv(out: mat2_t, m: mat2_t): void {
    const e00 = m[0], e01 = m[1],
          e10 = m[2], e11 = m[3];
    let det = e00 * e11 - e10 * e01;

    if (abs(det) < EPSILON) {
        return;
    }

    det = 1.0 / det;

    out[0] = e11 * det;
    out[1] = -e01 * det;
    out[2] = -e10 * det;
    out[3] = e00 * det;
}

export function mat2n_inv(m: mat2_t): mat2_t {
    const out = new TYPE(4);

    mat2_inv(out, m);

    return out;
}

export function mat2m_inv(out: mat2_t): void {
    mat2_inv(out, out);
}

export function mat2_str(m: mat2_t): string {
    return "mat2(\n" +
        `\t${m[0]}, ${m[2]},\n` +
        `\t${m[1]}, ${m[3]},\n` +
        ")";
}

export function mat2_print(m: mat2_t): void {
    console.log(mat2_str(m));
}
