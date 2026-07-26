export const TYPE = Float32Array;
export type vec2_t = Float32Array;

// creation
export function vec2(x: number = 0.0, y?: number): vec2_t {
    const out = new TYPE(2);

    out[0] = x;
    out[1] = y ?? x;

    return out;
}

export function vec2_set(out: vec2_t, x: number, y: number): void {
    out[0] = x;
    out[1] = y;
}

export function vec2_copy(out: vec2_t, v: vec2_t): void {
    out[0] = v[0];
    out[1] = v[1];
}

export function vec2n_copy(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_copy(out, v);

    return out;
}

// unary
export function vec2_zero(out: vec2_t): void {
    out[0] = 0.0;
    out[1] = 0.0;
}

export function vec2n_zero(): vec2_t {
    const out = new TYPE(2);

    vec2_zero(out);

    return out;
}

export function vec2_abs(out: vec2_t, v: vec2_t): void {
    out[0] = Math.abs(v[0]);
    out[1] = Math.abs(v[1]);
}

export function vec2n_abs(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_abs(out, v);

    return out;
}

export function vec2m_abs(out: vec2_t): void {
    vec2_abs(out, out);
}

export function vec2_neg(out: vec2_t, v: vec2_t): void {
    out[0] = -v[0];
    out[1] = -v[1];
}

export function vec2n_neg(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_neg(out, v);

    return out;
}

export function vec2m_neg(out: vec2_t): void {
    vec2_neg(out, out);
}

export function vec2_inv(out: vec2_t, v: vec2_t): void {
    out[0] = 1.0 / v[0];
    out[1] = 1.0 / v[1];
}

export function vec2n_inv(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_neg(out, v);

    return out;
}

export function vec2m_inv(out: vec2_t): void {
    vec2_neg(out, out);
}

// arithmetic vector x vector
export function vec2_add(out: vec2_t, v0: vec2_t, v1: vec2_t): void {
    out[0] = v0[0] + v1[0];
    out[1] = v0[1] + v1[1];
}

export function vec2n_add(v0: vec2_t, v1: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_add(out, v0, v1);

    return out;
}

export function vec2m_add(out: vec2_t, v: vec2_t): void {
    vec2_add(out, out, v);
}

export function vec2_sub(out: vec2_t, v0: vec2_t, v1: vec2_t): void {
    out[0] = v0[0] - v1[0];
    out[1] = v0[1] - v1[1];
}

export function vec2n_sub(v0: vec2_t, v1: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_sub(out, v0, v1);

    return out;
}

export function vec2m_sub(out: vec2_t, v: vec2_t): void {
    vec2_sub(out, out, v);
}

export function vec2_mul(out: vec2_t, v0: vec2_t, v1: vec2_t): void {
    out[0] = v0[0] * v1[0];
    out[1] = v0[1] * v1[1];
}

export function vec2n_mul(v0: vec2_t, v1: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_mul(out, v0, v1);

    return out;
}

export function vec2m_mul(out: vec2_t, v: vec2_t): void {
    vec2_mul(out, out, v);
}

export function vec2_div(out: vec2_t, v0: vec2_t, v1: vec2_t): void {
    out[0] = v0[0] / v1[0];
    out[1] = v0[1] / v1[1];
}

export function vec2n_div(v0: vec2_t, v1: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_div(out, v0, v1);

    return out;
}

export function vec2m_div(out: vec2_t, v: vec2_t): void {
    vec2_div(out, out, v);
}

// arithmetic vector x scalar
export function vec2_adds(out: vec2_t, v: vec2_t, s: number): void {
    out[0] = v[0] + s;
    out[1] = v[1] + s;
}

export function vec2n_adds(v: vec2_t, s: number): vec2_t {
    const out = new TYPE(2);

    vec2_adds(out, v, s);

    return out;
}

export function vec2m_adds(out: vec2_t, s: number): void {
    vec2_adds(out, out, s);
}

export function vec2_subs(out: vec2_t, v: vec2_t, s: number): void {
    out[0] = v[0] - s;
    out[1] = v[1] - s;
}

export function vec2n_subs(v: vec2_t, s: number): vec2_t {
    const out = new TYPE(2);

    vec2_subs(out, v, s);

    return out;
}

export function vec2m_subs(out: vec2_t, s: number): void {
    vec2_subs(out, out, s);
}

export function vec2_muls(out: vec2_t, v: vec2_t, s: number): void {
    out[0] = v[0] * s;
    out[1] = v[1] * s;
}

export function vec2n_muls(v: vec2_t, s: number): vec2_t {
    const out = new TYPE(2);

    vec2_muls(out, v, s);

    return out;
}

export function vec2m_muls(out: vec2_t, s: number): void {
    vec2_muls(out, out, s);
}

export function vec2_divs(out: vec2_t, v: vec2_t, s: number): void {
    out[0] = v[0] / s;
    out[1] = v[1] / s;
}

export function vec2n_divs(v: vec2_t, s: number): vec2_t {
    const out = new TYPE(2);

    vec2_divs(out, v, s);

    return out;
}

export function vec2m_divs(out: vec2_t, s: number): void {
    vec2_divs(out, out, s);
}

// arithmetic vector x vector x scalar
export function vec2_addmuls(out: vec2_t, v0: vec2_t, v1: vec2_t, s: number): void {
    out[0] = v0[0] + v1[0] * s;
    out[1] = v0[1] + v1[1] * s;
}

export function vec2n_addmuls(v0: vec2_t, v1: vec2_t, s: number): vec2_t {
    const out = new TYPE(2);

    vec2_addmuls(out, v0, v1, s);

    return out;
}

export function vec2m_addmuls(out: vec2_t, v: vec2_t, s: number): void {
    vec2_addmuls(out, out, v, s);
}

// product
export function vec2_dot(v0: vec2_t, v1: vec2_t): number {
    return v0[0] * v1[0] + v0[1] * v1[1];
}

export function vec2_cross(v0: vec2_t, v1: vec2_t): number {
    return v0[0] * v1[1] - v0[1] * v1[0];
}

// norm
export function vec2_len(v: vec2_t): number {
    return Math.hypot(v[0], v[1]);
}

export function vec2_len_sq(v: vec2_t): number {
    const x = v[0], y = v[1];

    return x * x + y * y;
}

export function vec2_dist(v0: vec2_t, v1: vec2_t): number {
    return Math.hypot(v0[0] - v1[0], v0[1] - v1[1]);
}

export function vec2_dist_sq(v0: vec2_t, v1: vec2_t): number {
    const x = v0[0] - v1[0], y = v0[1] - v1[1];

    return x * x + y * y;
}

export function vec2_unit(out: vec2_t, v: vec2_t): void {
    const x = v[0], y = v[1];
    let l = x * x + y * y;

    if (l > 0.0) {
        l = 1.0 / Math.sqrt(l);
    }

    out[0] = x * l;
    out[1] = y * l;
}

export function vec2n_unit(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_unit(out, v);

    return out;
}

export function vec2m_unit(out: vec2_t): void {
    vec2_unit(out, out);
}

export function vec2_dir(out: vec2_t, v0: vec2_t, v1: vec2_t): void {
    const x = v0[0] - v1[0], y = v0[1] - v1[1];
    let l = x * x + y * y;

    if (l > 0.0) {
        l = 1.0 / Math.sqrt(l);
    }

    out[0] = x * l;
    out[1] = y * l;
}

export function vec2n_dir(v0: vec2_t, v1: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_dir(out, v0, v1);

    return out;
}

// geometric
export function vec2_refl(out: vec2_t, v: vec2_t, n: vec2_t): void {
    const l = vec2_dot(n, v) * 2.0;

    out[0] = v[0] - n[0] * l;
    out[1] = v[1] - n[1] * l;
}

export function vec2n_refl(v: vec2_t, n: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_refl(out, v, n);

    return out;
}

export function vec2_perp(out: vec2_t, v: vec2_t): void {
    out[0] = -v[1];
    out[1] = v[0];
}

export function vec2n_perp(v: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_perp(out, v);

    return out;
}

export function vec2_perp2(out: vec2_t, v0: vec2_t, v1: vec2_t): void {
    out[0] = -(v0[1] - v1[1])
    out[1] = v0[0] - v1[0];
}

export function vec2n_perp2(v0: vec2_t, v1: vec2_t): vec2_t {
    const out = new TYPE(2);

    vec2_perp2(out, v0, v1);

    return out;
}

// interpolation
export function vec2_lerp(out: vec2_t, v0: vec2_t, v1: vec2_t, t: number): void {
    const x = v0[0], y = v0[1];

    out[0] = x + t * (v1[0] - x);
    out[1] = y + t * (v1[1] - y);
}

export function vec2n_lerp(v0: vec2_t, v1: vec2_t, t: number): vec2_t {
    const out = new TYPE(2);

    vec2_lerp(out, v0, v1, t);

    return out;
}

export function vec2m_lerp(out: vec2_t, v: vec2_t, t: number): void {
    vec2_lerp(out, out, v, t);
}

// rotation
export function vec2_rotate(out: vec2_t, v: vec2_t, a: number): void {
    const x = v[0], y = v[1];
    const c = Math.cos(a), s = Math.sin(a);

    out[0] = x * c - y * s;
    out[1] = x * s + y * c;
}

export function vec2n_rotate(v: vec2_t, a: number): vec2_t {
    const out = new TYPE(2);

    vec2_rotate(out, v, a);

    return out;
}

export function vec2m_rotate(out: vec2_t, a: number): void {
    vec2_rotate(out, out, a);
}

export function vec2_rotate2(out: vec2_t, v: vec2_t, p: vec2_t, a: number): vec2_t {
    const cx = p[0], cy = p[1];
    const x = v[0] - cx, y = v[1] - cy;
    const c = Math.cos(a), s = Math.sin(a);

    out[0] = x * c - y * s + cx;
    out[1] = x * s + y * c + cy;

    return out;
}

export function vec2n_rotate2(v: vec2_t, p: vec2_t, a: number): vec2_t {
    const out = new TYPE(2);

    vec2_rotate2(out, v, p, a);

    return out;
}

export function vec2m_rotate2(out: vec2_t, p: vec2_t, a: number): void {
    vec2_rotate2(out, out, p, a);
}

// angles
export function vec2_angle(v: vec2_t): number {
    return Math.atan2(v[1], v[0]);
}

export function vec2_angle2(v0: vec2_t, v1: vec2_t): number {
    const ax = v0[0], ay = v0[1], bx = v1[0], by = v1[1];
    const mag = Math.sqrt((ax * ax + ay * ay) * (bx * bx + by * by));
    const c = mag && (ax * bx + ay * by) / mag;

    return Math.acos(Math.min(Math.max(c, -1.0), 1.0));
}

// print
export function vec2_str(v: vec2_t): string {
    return `vec2(${v[0]}, ${v[1]})`;
}

export function vec2_print(v: vec2_t): void {
    console.log(vec2_str(v));
}
