import {mat2_t, TYPE} from "./mat2.ts";
import {vec2_t} from "./vec2.ts";

export function mat2_rotation(out: mat2_t, r: number): void {
    const s = Math.sin(r), c = Math.cos(r);

    out[0] = c;
    out[1] = s;
    out[2] = -s;
    out[3] = c;
}

export function mat2n_rotation(r: number): mat2_t {
    const out = new TYPE(4);

    mat2_rotation(out, r);

    return out;
}

export function mat2_scaling(out: mat2_t, v: vec2_t) {
    out[0] = v[0];
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = v[1];
}

export function mat2n_scaling(v: vec2_t): mat2_t {
    const out = new TYPE(4);

    mat2_scaling(out, v);

    return out;
}

export function mat2_rotate(out: mat2_t, m: mat2_t, r: number): void {
    const e00 = m[0], e01 = m[1],
          e10 = m[2], e11 = m[3];
    const s = Math.sin(r), c = Math.cos(r);

    out[0] = e00 * c + e10 * s;
    out[1] = e01 * c + e11 * s;
    out[2] = e00 * -s + e10 * c;
    out[3] = e01 * -s + e11 * c;
}

export function mat2n_rotate(m: mat2_t, r: number): mat2_t {
    const out = new TYPE(4);

    mat2_rotate(out, m, r);

    return out;
}

export function mat2m_rotate(out: mat2_t, r: number): void {
    mat2_rotate(out, out, r);
}

export function mat2_scale(out: mat2_t, m: mat2_t, v: vec2_t): void {
    const x = v[0], y = v[1];

    out[0] = m[0] * x;
    out[1] = m[1] * x;
    out[2] = m[2] * y;
    out[3] = m[3] * y;
}

export function mat2n_scale(m: mat2_t, v: vec2_t): mat2_t {
    const out = new TYPE(4);

    mat2_scale(out, m, v);

    return out;
}

export function mat2m_scale(out: mat2_t, v: vec2_t): void {
    mat2_scale(out, out, v);
}
