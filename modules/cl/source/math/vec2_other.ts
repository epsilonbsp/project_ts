import {TYPE, vec2_t} from "./vec2.ts";

// rounding
export function vec2_trunc(out: vec2_t, v: vec2_t): void {
    out[0] = Math.trunc(v[0]);
    out[1] = Math.trunc(v[1]);
}

export function vec2n_trunc(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_trunc(out, v);

    return out;
}

export function vec2m_trunc(out: vec2_t): void {
    vec2_trunc(out, out);
}

export function vec2_floor(out: vec2_t, v: vec2_t): void {
    out[0] = Math.floor(v[0]);
    out[1] = Math.floor(v[1]);
}

export function vec2n_floor(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_floor(out, v);

    return out;
}

export function vec2m_floor(out: vec2_t): void {
    vec2_floor(out, out);
}

export function vec2_ceil(out: vec2_t, v: vec2_t): void {
    out[0] = Math.ceil(v[0]);
    out[1] = Math.ceil(v[1]);
}

export function vec2n_ceil(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_ceil(out, v);

    return out;
}

export function vec2m_ceil(out: vec2_t): void {
    vec2_ceil(out, out);
}

export function vec2_round(out: vec2_t, v: vec2_t): void {
    out[0] = Math.round(v[0]);
    out[1] = Math.round(v[1]);
}

export function vec2n_round(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_round(out, v);

    return out;
}

export function vec2m_round(out: vec2_t): void {
    vec2_round(out, out);
}

export function vec2_snap(out: vec2_t, v: vec2_t, g: vec2_t): vec2_t {
    out[0] = Math.round(v[0] / g[0]) * g[0];
    out[1] = Math.round(v[1] / g[1]) * g[1];

    return out;
}

export function vec2n_snap(v: vec2_t, g: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_snap(out, v, g);

    return out;
}

export function vec2m_snap(out: vec2_t, g: vec2_t): void {
    vec2_snap(out, out, g);
}

// bounding
export function vec2_min(out: vec2_t, v0: vec2_t, v1: vec2_t): void {
    out[0] = Math.min(v0[0], v1[0]);
    out[1] = Math.min(v0[1], v1[1]);
}

export function vec2n_min(v0: vec2_t, v1: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_min(out, v0, v1);

    return out;
}

export function vec2_max(out: vec2_t, v0: vec2_t, v1: vec2_t): void {
    out[0] = Math.max(v0[0], v1[0]);
    out[1] = Math.max(v0[1], v1[1]);
}

export function vec2n_max(v0: vec2_t, v1: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_max(out, v0, v1);

    return out;
}

export function vec2_clamp(out: vec2_t, v: vec2_t, min: vec2_t, max: vec2_t): void {
    out[0] = Math.min(Math.max(v[0], min[0]), max[0]);
    out[1] = Math.min(Math.max(v[1], min[1]), max[1]);
}

export function vec2n_clamp(v: vec2_t, min: vec2_t, max: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_clamp(out, v, min, max);

    return out;
}

export function vec2m_clamp(out: vec2_t, min: vec2_t, max: vec2_t): void {
    vec2_clamp(out, out, min, max);
}

// comparison
export function vec2_equals_exact(v0: vec2_t, v1: vec2_t): boolean {
    return v0[0] === v1[0] && v0[1] === v1[1];
}

export function vec2_equals(v0: vec2_t, v1: vec2_t, e: number = 0.000001): boolean {
    const a0 = v0[0], a1 = v0[1];
    const b0 = v1[0], b1 = v1[1];

    return (
        Math.abs(a0 - b0) <= e * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
        Math.abs(a1 - b1) <= e * Math.max(1.0, Math.abs(a1), Math.abs(b1))
    );
}

// special
export function vec2_swap(out: vec2_t, v: vec2_t): void {
    out[0] = v[1];
    out[1] = v[0];
}

export function vec2n_swap(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_swap(out, v);

    return out;
}

export function vec2m_swap(out: vec2_t): void {
    vec2_swap(out, out);
}
