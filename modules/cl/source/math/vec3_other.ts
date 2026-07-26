import {TYPE, vec3_t} from "./vec3.ts";

// rounding
export function vec3_trunc(out: vec3_t, v: vec3_t): void {
    out[0] = Math.trunc(v[0]);
    out[1] = Math.trunc(v[1]);
    out[2] = Math.trunc(v[2]);
}

export function vec3n_trunc(v: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_trunc(out, v);

    return out;
}

export function vec3m_trunc(out: vec3_t): void {
    vec3_trunc(out, out);
}

export function vec3_floor(out: vec3_t, v: vec3_t): void {
    out[0] = Math.floor(v[0]);
    out[1] = Math.floor(v[1]);
    out[2] = Math.floor(v[2]);
}

export function vec3n_floor(v: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_floor(out, v);

    return out;
}

export function vec3m_floor(out: vec3_t): void {
    vec3_floor(out, out);
}

export function vec3_ceil(out: vec3_t, v: vec3_t): void {
    out[0] = Math.ceil(v[0]);
    out[1] = Math.ceil(v[1]);
    out[2] = Math.ceil(v[2]);
}

export function vec3n_ceil(v: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_ceil(out, v);

    return out;
}

export function vec3m_ceil(out: vec3_t): void {
    vec3_ceil(out, out);
}

export function vec3_round(out: vec3_t, v: vec3_t): void {
    out[0] = Math.round(v[0]);
    out[1] = Math.round(v[1]);
    out[2] = Math.round(v[2]);
}

export function vec3n_round(v: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_round(out, v);

    return out;
}

export function vec3m_round(out: vec3_t): void {
    vec3_round(out, out);
}

export function vec3_snap(out: vec3_t, v: vec3_t, g: vec3_t): vec3_t {
    out[0] = Math.round(v[0] / g[0]) * g[0];
    out[1] = Math.round(v[1] / g[1]) * g[1];
    out[2] = Math.round(v[2] / g[2]) * g[2];

    return out;
}

export function vec3n_snap(v: vec3_t, g: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_snap(out, v, g);

    return out;
}

export function vec3m_snap(out: vec3_t, g: vec3_t): void {
    vec3_snap(out, out, g);
}

// bounding
export function vec3_min(out: vec3_t, v0: vec3_t, v1: vec3_t): void {
    out[0] = Math.min(v0[0], v1[0]);
    out[1] = Math.min(v0[1], v1[1]);
    out[2] = Math.min(v0[2], v1[2]);
}

export function vec3n_min(v0: vec3_t, v1: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_min(out, v0, v1);

    return out;
}

export function vec3_max(out: vec3_t, v0: vec3_t, v1: vec3_t): void {
    out[0] = Math.max(v0[0], v1[0]);
    out[1] = Math.max(v0[1], v1[1]);
    out[2] = Math.max(v0[2], v1[2]);
}

export function vec3n_max(v0: vec3_t, v1: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_max(out, v0, v1);

    return out;
}

export function vec3_clamp(out: vec3_t, v: vec3_t, min: vec3_t, max: vec3_t): void {
    out[0] = Math.min(Math.max(v[0], min[0]), max[0]);
    out[1] = Math.min(Math.max(v[1], min[1]), max[1]);
    out[2] = Math.min(Math.max(v[2], min[2]), max[2]);
}

export function vec3n_clamp(v: vec3_t, min: vec3_t, max: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_clamp(out, v, min, max);

    return out;
}

export function vec3m_clamp(out: vec3_t, min: vec3_t, max: vec3_t): void {
    vec3_clamp(out, out, min, max);
}

// comparison
export function vec3_equals_exact(v0: vec3_t, v1: vec3_t): boolean {
    return v0[0] === v1[0] && v0[1] === v1[1] && v0[2] === v1[2];
}

export function vec3_equals(v0: vec3_t, v1: vec3_t, e: number = 0.000001): boolean {
    const a0 = v0[0], a1 = v0[1], a2 = v0[2];
    const b0 = v1[0], b1 = v1[1], b2 = v1[2];

    return (
        Math.abs(a0 - b0) <= e * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
        Math.abs(a1 - b1) <= e * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
        Math.abs(a2 - b2) <= e * Math.max(1.0, Math.abs(a2), Math.abs(b2))
    );
}
