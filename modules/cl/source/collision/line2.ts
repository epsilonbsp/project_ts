import {vec2_t} from "@cl/math/vec2.ts";

const TYPE = Float32Array;
export type line2_t = Float32Array;

export function line2(x0: number, y0: number, x1: number, y1: number): line2_t {
    const out = new TYPE(4);

    out[0] = x0;
    out[1] = y0;
    out[2] = x1;
    out[3] = y1;

    return out;
}

export function line2_new(): vec2_t {
    const out = new TYPE(4);

    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;

    return out;
}

export function line2_clone(ln: line2_t): vec2_t {
    const out = new TYPE(4);

    out[0] = ln[0];
    out[1] = ln[1];
    out[2] = ln[2];
    out[3] = ln[3];

    return out;
}

export function line2_ab(a: vec2_t, b: vec2_t): line2_t {
    const out = new TYPE(4);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = b[0];
    out[3] = b[1];

    return out;
}

export function line2_set(ln: line2_t, x0: number, y0: number, x1: number, y1: number): line2_t {
    ln[0] = x0;
    ln[1] = y0;
    ln[2] = x1;
    ln[3] = y1;

    return ln;
}

export function line2_copy(a: line2_t, b: line2_t): line2_t {
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = b[3];

    return a;
}

export function line2_a(ln: line2_t): vec2_t {
    return ln.subarray(0, 2);
}

export function line2_b(ln: line2_t): vec2_t {
    return ln.subarray(2, 4);
}

export function point_on_line(ln: line2_t, v: vec2_t): vec2_t {
    const out = new TYPE(2);
    const x = ln[0], y = ln[1];
    const bax = ln[2] - x, bay = ln[3] - y, pax = v[0] - x, pay = v[1] - y;
    const t = (bax * pax + bay * pay) / (bax * bax + bay * bay);

    out[0] = x + bax * t;
    out[1] = y + bay * t;

    return out;
}

export function side_of_line(ln: line2_t, v: vec2_t): number {
    const x = ln[0], y = ln[1];
    const bax = ln[2] - x, bay = ln[3] - y, pax = v[0] - x, pay = v[1] - y;
    const t = (bax * pax + bay * pay) / (bax * bax + bay * bay);
    const tx = x + bax * t, ty = y + bay * t;

    return Math.hypot(v[0] - tx, v[1] - ty);
}
