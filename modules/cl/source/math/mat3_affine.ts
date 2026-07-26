import {mat3_t, TYPE} from "./mat3.ts";
import {vec2_t} from "./vec2.ts";

export function mat3_translation(out: mat3_t, v: vec2_t): void {
    out[0] = 1.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 1.0;
    out[5] = 0.0;
    out[6] = v[0];
    out[7] = v[1];
    out[8] = 1.0;
}

export function mat3n_translation(v: vec2_t): mat3_t {
    const out = new TYPE(9);

    mat3_translation(out, v);

    return out;
}

export function mat3_rotation(out: mat3_t, r: number): void {
    const s = Math.sin(r), c = Math.cos(r);

    out[0] = c;
    out[1] = s;
    out[2] = 0.0;
    out[3] = -s;
    out[4] = c;
    out[5] = 0.0;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = 1.0;
}

export function mat3n_rotation(r: number): mat3_t {
    const out = new TYPE(9);

    mat3_rotation(out, r);

    return out;
}

export function mat3_scaling(out: mat3_t, v: vec2_t): void {
    out[0] = v[0];
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = v[1];
    out[5] = 0.0;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = 1.0;
}

export function mat3n_scaling(v: vec2_t): mat3_t {
    const out = new TYPE(9);

    mat3_scaling(out, v);

    return out;
}

export function mat3_translate(out: mat3_t, m: mat3_t, v: vec2_t): void {
    const e00 = m[0], e01 = m[1], e02 = m[2],
          e10 = m[3], e11 = m[4], e12 = m[5],
          e20 = m[6], e21 = m[7], e22 = m[8];
    const x = v[0], y = v[1];

    out[0] = e00;
    out[1] = e01;
    out[2] = e02;
    out[3] = e10;
    out[4] = e11;
    out[5] = e12;
    out[6] = e00 * x + e10 * y + e20;
    out[7] = e01 * x + e11 * y + e21;
    out[8] = e02 * x + e12 * y + e22;
}

export function mat3n_translate(m: mat3_t, v: vec2_t): mat3_t {
    const out = new TYPE(9);

    mat3_translate(out, m, v);

    return out;
}

export function mat3m_translate(out: mat3_t, v: vec2_t): void {
    mat3_translate(out, out, v);
}

export function mat3_rotate(out: mat3_t, m: mat3_t, r: number): void {
    const e00 = m[0], e01 = m[1], e02 = m[2],
          e10 = m[3], e11 = m[4], e12 = m[5],
          e20 = m[6], e21 = m[7], e22 = m[8];
    const s = Math.sin(r), c = Math.cos(r);

    out[0] = e00 * c + e10 * s;
    out[1] = e01 * c + e11 * s;
    out[2] = e02 * c + e12 * s;
    out[3] = e10 * c - e00 * s;
    out[4] = e11 * c - e01 * s;
    out[5] = e12 * c - e02 * s;
    out[6] = e20;
    out[7] = e21;
    out[8] = e22;
}

export function mat3n_rotate(m: mat3_t, r: number): mat3_t {
    const out = new TYPE(9);

    mat3_rotate(out, m, r);

    return out;
}

export function mat3m_rotate(out: mat3_t, r: number): void {
    mat3_rotate(out, out, r);
}

export function mat3_scale(out: mat3_t, m: mat3_t, v: vec2_t): void {
    const x = v[0], y = v[1];

    out[0] = m[0] * x;
    out[1] = m[1] * x;
    out[2] = m[2] * x;
    out[3] = m[3] * y;
    out[4] = m[4] * y;
    out[5] = m[5] * y;
    out[6] = m[6];
    out[7] = m[7];
    out[8] = m[8];
}

export function mat3n_scale(m: mat3_t, v: vec2_t): mat3_t {
    const out = new TYPE(9);

    mat3_scale(out, m, v);

    return out;
}

export function mat3m_scale(out: mat3_t, v: vec2_t): void {
    mat3_scale(out, out, v);
}
