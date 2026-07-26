export const TYPE = Float32Array;
export type vec4_t = Float32Array;

// creation
export function vec4(x: number = 0.0, y?: number, z?: number, w?: number): vec4_t {
    const out = new TYPE(4);

    out[0] = x;
    out[1] = y ?? x;
    out[2] = z ?? x;
    out[3] = w ?? x;

    return out;
}

export function vec4_set(out: vec4_t, x: number, y: number, z: number, w: number): void {
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
}

export function vec4_copy(out: vec4_t, v: vec4_t): void {
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
    out[3] = v[3];
}

export function vec4n_copy(v: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_copy(out, v);

    return out;
}

// unary
export function vec4_zero(out: vec4_t): void {
    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
}

export function vec4n_zero(): vec4_t {
    const out = new TYPE(4);

    vec4_zero(out);

    return out;
}

export function vec4_abs(out: vec4_t, v: vec4_t): void {
    out[0] = Math.abs(v[0]);
    out[1] = Math.abs(v[1]);
    out[2] = Math.abs(v[2]);
    out[3] = Math.abs(v[3]);
}

export function vec4n_abs(v: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_abs(out, v);

    return out;
}

export function vec4m_abs(out: vec4_t): void {
    vec4_abs(out, out);
}

export function vec4_neg(out: vec4_t, v: vec4_t): void {
    out[0] = -v[0];
    out[1] = -v[1];
    out[2] = -v[2];
    out[3] = -v[3];
}

export function vec4n_neg(v: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_neg(out, v);

    return out;
}

export function vec4m_neg(out: vec4_t): void {
    vec4_neg(out, out);
}

export function vec4_inv(out: vec4_t, v: vec4_t): void {
    out[0] = 1.0 / v[0];
    out[1] = 1.0 / v[1];
    out[2] = 1.0 / v[2];
    out[3] = 1.0 / v[3];
}

export function vec4n_inv(v: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_neg(out, v);

    return out;
}

export function vec4m_inv(out: vec4_t): void {
    vec4_neg(out, out);
}

// arithmetic vector x vector
export function vec4_add(out: vec4_t, v0: vec4_t, v1: vec4_t): void {
    out[0] = v0[0] + v1[0];
    out[1] = v0[1] + v1[1];
    out[2] = v0[2] + v1[2];
    out[3] = v0[3] + v1[3];
}

export function vec4n_add(v0: vec4_t, v1: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_add(out, v0, v1);

    return out;
}

export function vec4m_add(out: vec4_t, v: vec4_t): void {
    vec4_add(out, out, v);
}

export function vec4_sub(out: vec4_t, v0: vec4_t, v1: vec4_t): void {
    out[0] = v0[0] - v1[0];
    out[1] = v0[1] - v1[1];
    out[2] = v0[2] - v1[2];
    out[3] = v0[3] - v1[3];
}

export function vec4n_sub(v0: vec4_t, v1: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_sub(out, v0, v1);

    return out;
}

export function vec4m_sub(out: vec4_t, v: vec4_t): void {
    vec4_sub(out, out, v);
}

export function vec4_mul(out: vec4_t, v0: vec4_t, v1: vec4_t): void {
    out[0] = v0[0] * v1[0];
    out[1] = v0[1] * v1[1];
    out[2] = v0[2] * v1[2];
    out[3] = v0[3] * v1[3];
}

export function vec4n_mul(v0: vec4_t, v1: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_mul(out, v0, v1);

    return out;
}

export function vec4m_mul(out: vec4_t, v: vec4_t): void {
    vec4_mul(out, out, v);
}

export function vec4_div(out: vec4_t, v0: vec4_t, v1: vec4_t): void {
    out[0] = v0[0] / v1[0];
    out[1] = v0[1] / v1[1];
    out[2] = v0[2] / v1[2];
    out[3] = v0[3] / v1[3];
}

export function vec4n_div(v0: vec4_t, v1: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_div(out, v0, v1);

    return out;
}

export function vec4m_div(out: vec4_t, v: vec4_t): void {
    vec4_div(out, out, v);
}

// arithmetic vector x scalar
export function vec4_adds(out: vec4_t, v: vec4_t, s: number): void {
    out[0] = v[0] + s;
    out[1] = v[1] + s;
    out[2] = v[2] + s;
    out[3] = v[3] + s;
}

export function vec4n_adds(v: vec4_t, s: number): vec4_t {
    const out = new TYPE(4);

    vec4_adds(out, v, s);

    return out;
}

export function vec4m_adds(out: vec4_t, s: number): void {
    vec4_adds(out, out, s);
}

export function vec4_subs(out: vec4_t, v: vec4_t, s: number): void {
    out[0] = v[0] - s;
    out[1] = v[1] - s;
    out[2] = v[2] - s;
    out[3] = v[3] - s;
}

export function vec4n_subs(v: vec4_t, s: number): vec4_t {
    const out = new TYPE(4);

    vec4_subs(out, v, s);

    return out;
}

export function vec4m_subs(out: vec4_t, s: number): void {
    vec4_subs(out, out, s);
}

export function vec4_muls(out: vec4_t, v: vec4_t, s: number): void {
    out[0] = v[0] * s;
    out[1] = v[1] * s;
    out[2] = v[2] * s;
    out[3] = v[3] * s;
}

export function vec4n_muls(v: vec4_t, s: number): vec4_t {
    const out = new TYPE(4);

    vec4_muls(out, v, s);

    return out;
}

export function vec4m_muls(out: vec4_t, s: number): void {
    vec4_muls(out, out, s);
}

export function vec4_divs(out: vec4_t, v: vec4_t, s: number): void {
    out[0] = v[0] / s;
    out[1] = v[1] / s;
    out[2] = v[2] / s;
    out[3] = v[3] / s;
}

export function vec4n_divs(v: vec4_t, s: number): vec4_t {
    const out = new TYPE(4);

    vec4_divs(out, v, s);

    return out;
}

export function vec4m_divs(out: vec4_t, s: number): void {
    vec4_divs(out, out, s);
}

// arithmetic vector x vector x scalar
export function vec4_addmuls(out: vec4_t, v0: vec4_t, v1: vec4_t, s: number): void {
    out[0] = v0[0] + v1[0] * s;
    out[1] = v0[1] + v1[1] * s;
    out[2] = v0[2] + v1[2] * s;
    out[3] = v0[3] + v1[3] * s;
}

export function vec4n_addmuls(v0: vec4_t, v1: vec4_t, s: number): vec4_t {
    const out = new TYPE(4);

    vec4_addmuls(out, v0, v1, s);

    return out;
}

export function vec4m_addmuls(out: vec4_t, v: vec4_t, s: number): void {
    vec4_addmuls(out, out, v, s);
}

// product
export function vec4_dot(v0: vec4_t, v1: vec4_t): number {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2] + v0[3] * v1[3];
}

// norm
export function vec4_len(v: vec4_t): number {
    return Math.hypot(v[0], v[1], v[2], v[3]);
}

export function vec4_len_sq(v: vec4_t): number {
    const x = v[0], y = v[1], z = v[2], w = v[3];

    return x * x + y * y + z * z + w * w;
}

export function vec4_dist(v0: vec4_t, v1: vec4_t): number {
    return Math.hypot(v0[0] - v1[0], v0[1] - v1[1], v0[2] - v1[2], v0[3] - v1[3]);
}

export function vec4_dist_sq(v0: vec4_t, v1: vec4_t): number {
    const x = v0[0] - v1[0];
    const y = v0[1] - v1[1];
    const z = v0[2] - v1[2];
    const w = v0[3] - v1[3];

    return x * x + y * y + z * z + w * w;
}

export function vec4_unit(out: vec4_t, v: vec4_t): void {
    const x = v[0], y = v[1], z = v[2], w = v[3];
    let l = x * x + y * y + z * z + w * w;

    if (l > 0.0) {
        l = 1.0 / Math.sqrt(l);
    }

    out[0] = x * l;
    out[1] = y * l;
    out[2] = z * l;
    out[3] = w * l;
}

export function vec4n_unit(v: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_unit(out, v);

    return out;
}

export function vec4m_unit(out: vec4_t): void {
    vec4_unit(out, out);
}

export function vec4_dir(out: vec4_t, v0: vec4_t, v1: vec4_t): void {
    const x = v0[0] - v1[0], y = v0[1] - v1[1], z = v0[2] - v1[2], w = v0[3] - v1[3];
    let l = x * x + y * y + z * z + w * w;

    if (l > 0.0) {
        l = 1.0 / Math.sqrt(l);
    }

    out[0] = x * l;
    out[1] = y * l;
    out[2] = z * l;
    out[3] = w * l;
}

export function vec4n_dir(v0: vec4_t, v1: vec4_t): vec4_t {
    const out = new TYPE(4);

    vec4_dir(out, v0, v1);

    return out;
}

// interpolation
export function vec4_lerp(out: vec4_t, v0: vec4_t, v1: vec4_t, t: number): void {
    const x = v0[0], y = v0[1], z = v0[2], w = v0[3];

    out[0] = x + t * (v1[0] - x);
    out[1] = y + t * (v1[1] - y);
    out[2] = z + t * (v1[2] - z);
    out[3] = w + t * (v1[3] - w);
}

export function vec4n_lerp(v0: vec4_t, v1: vec4_t, t: number): vec4_t {
    const out = new TYPE(4);

    vec4_lerp(out, v0, v1, t);

    return out;
}

export function vec4m_lerp(out: vec4_t, v: vec4_t, t: number): void {
    vec4_lerp(out, out, v, t);
}

// print
export function vec4_str(v: vec4_t): string {
    return `vec4(${v[0]}, ${v[1]}, ${v[2]}, ${v[3]})`;
}

export function vec4_print(v: vec4_t): void {
    console.log(vec4_str(v));
}
