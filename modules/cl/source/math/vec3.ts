export const TYPE = Float32Array;
export type vec3_t = Float32Array;

// creation
export function vec3(x: number = 0.0, y?: number, z?: number): vec3_t {
    const out = new TYPE(3);

    out[0] = x;
    out[1] = y ?? x;
    out[2] = z ?? x;

    return out;
}

export function vec3_set(out: vec3_t, x: number, y: number, z: number): void {
    out[0] = x;
    out[1] = y;
    out[2] = z;
}

export function vec3_copy(out: vec3_t, v: vec3_t): void {
    out[0] = v[0];
    out[1] = v[1];
    out[2] = v[2];
}

export function vec3n_copy(v: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_copy(out, v);

    return out;
}

// unary
export function vec3_zero(out: vec3_t): void {
    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
}

export function vec3n_zero(): vec3_t {
    const out = new TYPE(3);

    vec3_zero(out);

    return out;
}

export function vec3_abs(out: vec3_t, v: vec3_t): void {
    out[0] = Math.abs(v[0]);
    out[1] = Math.abs(v[1]);
    out[2] = Math.abs(v[2]);
}

export function vec3n_abs(v: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_abs(out, v);

    return out;
}

export function vec3m_abs(out: vec3_t): void {
    vec3_abs(out, out);
}

export function vec3_neg(out: vec3_t, v: vec3_t): void {
    out[0] = -v[0];
    out[1] = -v[1];
    out[2] = -v[2];
}

export function vec3n_neg(v: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_neg(out, v);

    return out;
}

export function vec3m_neg(out: vec3_t): void {
    vec3_neg(out, out);
}

export function vec3_inv(out: vec3_t, v: vec3_t): void {
    out[0] = 1.0 / v[0];
    out[1] = 1.0 / v[1];
    out[2] = 1.0 / v[2];
}

export function vec3n_inv(v: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_neg(out, v);

    return out;
}

export function vec3m_inv(out: vec3_t): void {
    vec3_neg(out, out);
}

// arithmetic vector x vector
export function vec3_add(out: vec3_t, v0: vec3_t, v1: vec3_t): void {
    out[0] = v0[0] + v1[0];
    out[1] = v0[1] + v1[1];
    out[2] = v0[2] + v1[2];
}

export function vec3n_add(v0: vec3_t, v1: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_add(out, v0, v1);

    return out;
}

export function vec3m_add(out: vec3_t, v: vec3_t): void {
    vec3_add(out, out, v);
}

export function vec3_sub(out: vec3_t, v0: vec3_t, v1: vec3_t): void {
    out[0] = v0[0] - v1[0];
    out[1] = v0[1] - v1[1];
    out[2] = v0[2] - v1[2];
}

export function vec3n_sub(v0: vec3_t, v1: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_sub(out, v0, v1);

    return out;
}

export function vec3m_sub(out: vec3_t, v: vec3_t): void {
    vec3_sub(out, out, v);
}

export function vec3_mul(out: vec3_t, v0: vec3_t, v1: vec3_t): void {
    out[0] = v0[0] * v1[0];
    out[1] = v0[1] * v1[1];
    out[2] = v0[2] * v1[2];
}

export function vec3n_mul(v0: vec3_t, v1: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_mul(out, v0, v1);

    return out;
}

export function vec3m_mul(out: vec3_t, v: vec3_t): void {
    vec3_mul(out, out, v);
}

export function vec3_div(out: vec3_t, v0: vec3_t, v1: vec3_t): void {
    out[0] = v0[0] / v1[0];
    out[1] = v0[1] / v1[1];
    out[2] = v0[2] / v1[2];
}

export function vec3n_div(v0: vec3_t, v1: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_div(out, v0, v1);

    return out;
}

export function vec3m_div(out: vec3_t, v: vec3_t): void {
    vec3_div(out, out, v);
}

// arithmetic vector x scalar
export function vec3_adds(out: vec3_t, v: vec3_t, s: number): void {
    out[0] = v[0] + s;
    out[1] = v[1] + s;
    out[2] = v[2] + s;
}

export function vec3n_adds(v: vec3_t, s: number): vec3_t {
    const out = new TYPE(3);

    vec3_adds(out, v, s);

    return out;
}

export function vec3m_adds(out: vec3_t, s: number): void {
    vec3_adds(out, out, s);
}

export function vec3_subs(out: vec3_t, v: vec3_t, s: number): void {
    out[0] = v[0] - s;
    out[1] = v[1] - s;
    out[2] = v[2] - s;
}

export function vec3n_subs(v: vec3_t, s: number): vec3_t {
    const out = new TYPE(3);

    vec3_subs(out, v, s);

    return out;
}

export function vec3m_subs(out: vec3_t, s: number): void {
    vec3_subs(out, out, s);
}

export function vec3_muls(out: vec3_t, v: vec3_t, s: number): void {
    out[0] = v[0] * s;
    out[1] = v[1] * s;
    out[2] = v[2] * s;
}

export function vec3n_muls(v: vec3_t, s: number): vec3_t {
    const out = new TYPE(3);

    vec3_muls(out, v, s);

    return out;
}

export function vec3m_muls(out: vec3_t, s: number): void {
    vec3_muls(out, out, s);
}

export function vec3_divs(out: vec3_t, v: vec3_t, s: number): void {
    out[0] = v[0] / s;
    out[1] = v[1] / s;
    out[2] = v[2] / s;
}

export function vec3n_divs(v: vec3_t, s: number): vec3_t {
    const out = new TYPE(3);

    vec3_divs(out, v, s);

    return out;
}

export function vec3m_divs(out: vec3_t, s: number): void {
    vec3_divs(out, out, s);
}

// arithmetic vector x vector x scalar
export function vec3_addmuls(out: vec3_t, v0: vec3_t, v1: vec3_t, s: number): void {
    out[0] = v0[0] + v1[0] * s;
    out[1] = v0[1] + v1[1] * s;
    out[2] = v0[2] + v1[2] * s;
}

export function vec3n_addmuls(v0: vec3_t, v1: vec3_t, s: number): vec3_t {
    const out = new TYPE(3);

    vec3_addmuls(out, v0, v1, s);

    return out;
}

export function vec3m_addmuls(out: vec3_t, v: vec3_t, s: number): void {
    vec3_addmuls(out, out, v, s);
}

// product
export function vec3_dot(v0: vec3_t, v1: vec3_t): number {
    return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
}

export function vec3_cross(out: vec3_t, v0: vec3_t, v1: vec3_t): void {
    const ax = v0[0], ay = v0[1], az = v0[2];
    const bx = v1[0], by = v1[1], bz = v1[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
}

export function vec3n_cross(v0: vec3_t, v1: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_cross(out, v0, v1);

    return out;
}

// norm
export function vec3_len(v: vec3_t): number {
    return Math.hypot(v[0], v[1], v[2]);
}

export function vec3_len_sq(v: vec3_t): number {
    const x = v[0], y = v[1], z = v[2];

    return x * x + y * y + z * z;
}

export function vec3_dist(v0: vec3_t, v1: vec3_t): number {
    return Math.hypot(v0[0] - v1[0], v0[1] - v1[1], v0[2] - v1[2]);
}

export function vec3_dist_sq(v0: vec3_t, v1: vec3_t): number {
    const x = v0[0] - v1[0];
    const y = v0[1] - v1[1];
    const z = v0[2] - v1[2];

    return x * x + y * y + z * z;
}

export function vec3_unit(out: vec3_t, v: vec3_t): void {
    const x = v[0], y = v[1], z = v[2];
    let l = x * x + y * y + z * z;

    if (l > 0.0) {
        l = 1.0 / Math.sqrt(l);
    }

    out[0] = x * l;
    out[1] = y * l;
    out[2] = z * l;
}

export function vec3n_unit(v: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_unit(out, v);

    return out;
}

export function vec3m_unit(out: vec3_t): void {
    vec3_unit(out, out);
}

export function vec3_dir(out: vec3_t, v0: vec3_t, v1: vec3_t): void {
    const x = v0[0] - v1[0], y = v0[1] - v1[1], z = v0[2] - v1[2];
    let l = x * x + y * y + z * z;

    if (l > 0.0) {
        l = 1.0 / Math.sqrt(l);
    }

    out[0] = x * l;
    out[1] = y * l;
    out[2] = z * l;
}

export function vec3n_dir(v0: vec3_t, v1: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_dir(out, v0, v1);

    return out;
}

// geometric
export function vec3_refl(out: vec3_t, v: vec3_t, n: vec3_t): void {
    const l = vec3_dot(n, v) * 2.0;

    out[0] = v[0] - n[0] * l;
    out[1] = v[1] - n[1] * l;
    out[2] = v[2] - n[2] * l;
}

export function vec3n_refl(v: vec3_t, n: vec3_t): vec3_t {
    const out = new TYPE(3);

    vec3_refl(out, v, n);

    return out;
}

// interpolation
export function vec3_lerp(out: vec3_t, v0: vec3_t, v1: vec3_t, t: number): void {
    const x = v0[0], y = v0[1], z = v0[2];

    out[0] = x + t * (v1[0] - x);
    out[1] = y + t * (v1[1] - y);
    out[2] = z + t * (v1[2] - z);
}

export function vec3n_lerp(v0: vec3_t, v1: vec3_t, t: number): vec3_t {
    const out = new TYPE(3);

    vec3_lerp(out, v0, v1, t);

    return out;
}

export function vec3m_lerp(out: vec3_t, v: vec3_t, t: number): void {
    vec3_lerp(out, out, v, t);
}

// rotation
export function vec3_rotate_x(out: vec3_t, v: vec3_t, p: vec3_t, r: number): void {
    const p0 = v[0] - p[0], p1 = v[1] - p[1], p2 = v[2] - p[2];
    const r0 = p0,
          r1 = p1 * Math.cos(r) - p2 * Math.sin(r),
          r2 = p1 * Math.sin(r) + p2 * Math.cos(r);

    out[0] = r0 + p[0];
    out[1] = r1 + p[1];
    out[2] = r2 + p[2];
}

export function vec3n_rotate_x(v: vec3_t, p: vec3_t, r: number): vec3_t {
    const out = new TYPE(3);

    vec3_rotate_x(out, v, p, r);

    return out;
}

export function vec3m_rotate_x(out: vec3_t, p: vec3_t, r: number): void {
    vec3_rotate_x(out, out, p, r);
}

export function vec3_rotate_y(out: vec3_t, v: vec3_t, p: vec3_t, r: number): void {
    const p0 = v[0] - p[0], p1 = v[1] - p[1], p2 = v[2] - p[2];
    const r0 = p2 * Math.sin(r) + p0 * Math.cos(r),
          r1 = p1,
          r2 = p2 * Math.cos(r) - p0 * Math.sin(r);

    out[0] = r0 + p[0];
    out[1] = r1 + p[1];
    out[2] = r2 + p[2];
}

export function vec3n_rotate_y(v: vec3_t, p: vec3_t, r: number): vec3_t {
    const out = new TYPE(3);

    vec3_rotate_y(out, v, p, r);

    return out;
}

export function vec3m_rotate_y(out: vec3_t, p: vec3_t, r: number): void {
    vec3_rotate_y(out, out, p, r);
}

export function vec3_rotate_z(out: vec3_t, v: vec3_t, p: vec3_t, r: number): void {
    const p0 = v[0] - p[0], p1 = v[1] - p[1], p2 = v[2] - p[2];
    const r0 = p0 * Math.cos(r) - p1 * Math.sin(r),
          r1 = p0 * Math.sin(r) + p1 * Math.cos(r),
          r2 = p2;

    out[0] = r0 + p[0];
    out[1] = r1 + p[1];
    out[2] = r2 + p[2];
}

export function vec3n_rotate_z(v: vec3_t, p: vec3_t, r: number): vec3_t {
    const out = new TYPE(3);

    vec3_rotate_z(out, v, p, r);

    return out;
}

export function vec3m_rotate_z(out: vec3_t, p: vec3_t, r: number): void {
    vec3_rotate_z(out, out, p, r);
}

// print
export function vec3_str(v: vec3_t): string {
    return `vec3(${v[0]}, ${v[1]}, ${v[2]})`;
}

export function vec3_print(v: vec3_t): void {
    console.log(vec3_str(v));
}
