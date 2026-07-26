import {TYPE, vec4_t} from "./vec4.ts";

// rounding
export function vec4_trunc(out: vec4_t, v: vec4_t): void {
    out[0] = Math.trunc(v[0]);
    out[1] = Math.trunc(v[1]);
    out[2] = Math.trunc(v[2]);
    out[3] = Math.trunc(v[3]);
}

export function vec4n_trunc(v: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_trunc(out, v);

    return out;
}

export function vec4m_trunc(out: vec4_t): void {
    vec4_trunc(out, out);
}

export function vec4_floor(out: vec4_t, v: vec4_t): void {
    out[0] = Math.floor(v[0]);
    out[1] = Math.floor(v[1]);
    out[2] = Math.floor(v[2]);
    out[3] = Math.floor(v[3]);
}

export function vec4n_floor(v: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_floor(out, v);

    return out;
}

export function vec4m_floor(out: vec4_t): void {
    vec4_floor(out, out);
}

export function vec4_ceil(out: vec4_t, v: vec4_t): void {
    out[0] = Math.ceil(v[0]);
    out[1] = Math.ceil(v[1]);
    out[2] = Math.ceil(v[2]);
    out[3] = Math.ceil(v[3]);
}

export function vec4n_ceil(v: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_ceil(out, v);

    return out;
}

export function vec4m_ceil(out: vec4_t): void {
    vec4_ceil(out, out);
}

export function vec4_round(out: vec4_t, v: vec4_t): void {
    out[0] = Math.round(v[0]);
    out[1] = Math.round(v[1]);
    out[2] = Math.round(v[2]);
    out[3] = Math.round(v[3]);
}

export function vec4n_round(v: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_round(out, v);

    return out;
}

export function vec4m_round(out: vec4_t): void {
    vec4_round(out, out);
}

export function vec4_snap(out: vec4_t, v: vec4_t, g: vec4_t): vec4_t {
    out[0] = Math.round(v[0] / g[0]) * g[0];
    out[1] = Math.round(v[1] / g[1]) * g[1];
    out[2] = Math.round(v[2] / g[2]) * g[2];
    out[3] = Math.round(v[3] / g[3]) * g[3];

    return out;
}

export function vec4n_snap(v: vec4_t, g: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_snap(out, v, g);

    return out;
}

export function vec2m_snap(out: vec4_t, g: vec4_t): void {
    vec4_snap(out, out, g);
}


// bounding
export function vec4_min(out: vec4_t, v0: vec4_t, v1: vec4_t): void {
    out[0] = Math.min(v0[0], v1[0]);
    out[1] = Math.min(v0[1], v1[1]);
    out[2] = Math.min(v0[2], v1[2]);
    out[3] = Math.min(v0[3], v1[3]);
}

export function vec4n_min(v0: vec4_t, v1: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_min(out, v0, v1);

    return out;
}

export function vec4_max(out: vec4_t, v0: vec4_t, v1: vec4_t): void {
    out[0] = Math.max(v0[0], v1[0]);
    out[1] = Math.max(v0[1], v1[1]);
    out[2] = Math.max(v0[2], v1[2]);
    out[3] = Math.max(v0[3], v1[3]);
}

export function vec4n_max(v0: vec4_t, v1: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_max(out, v0, v1);

    return out;
}

export function vec4_clamp(out: vec4_t, v: vec4_t, min: vec4_t, max: vec4_t): void {
    out[0] = Math.min(Math.max(v[0], min[0]), max[0]);
    out[1] = Math.min(Math.max(v[1], min[1]), max[1]);
    out[2] = Math.min(Math.max(v[2], min[2]), max[2]);
    out[3] = Math.min(Math.max(v[3], min[3]), max[3]);
}

export function vec4n_clamp(v: vec4_t, min: vec4_t, max: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_clamp(out, v, min, max);

    return out;
}

export function vec4m_clamp(out: vec4_t, min: vec4_t, max: vec4_t): void {
    vec4_clamp(out, out, min, max);
}

// comparison
export function vec4_equals_exact(v0: vec4_t, v1: vec4_t): boolean {
    return v0[0] === v1[0] && v0[1] === v1[1] && v0[2] === v1[2] && v0[3] === v1[3];
}

export function vec4_equals(v0: vec4_t, v1: vec4_t, e: number = 0.000001): boolean {
    const a0 = v0[0], a1 = v0[1], a2 = v0[2], a3 = v0[3];
    const b0 = v1[0], b1 = v1[1], b2 = v1[2], b3 = v1[3];

    return (
        Math.abs(a0 - b0) <= e * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
        Math.abs(a1 - b1) <= e * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
        Math.abs(a2 - b2) <= e * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
        Math.abs(a3 - b3) <= e * Math.max(1.0, Math.abs(a3), Math.abs(b3))
    );
}
