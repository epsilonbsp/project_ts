import {vec2_t} from "@cl/math/vec2.ts";

const TYPE = Float32Array;
export type trian2_t = Float32Array;

export function trian2(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): trian2_t {
    const out = new TYPE(6);

    out[0] = ax;
    out[1] = ay;
    out[2] = bx;
    out[3] = by;
    out[4] = cx;
    out[5] = cy;

    return out;
}

export function trian2_new(): vec2_t {
    const out = new TYPE(6);

    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = 0.0;

    return out;
}

export function trian2_clone(t: trian2_t): vec2_t {
    const out = new TYPE(6);

    out[0] = t[0];
    out[1] = t[1];
    out[2] = t[2];
    out[3] = t[3];
    out[4] = t[4];
    out[5] = t[5];

    return out;
}

export function trian2_ab(a: vec2_t, b: vec2_t, c: vec2_t): trian2_t {
    const out = new TYPE(6);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = b[0];
    out[3] = b[1];
    out[4] = c[0];
    out[5] = c[1];

    return out;
}

export function trian2_set(t: trian2_t, ax: number, ay: number, bx: number, by: number, cx: number, cy: number): trian2_t {
    t[0] = ax;
    t[1] = ay;
    t[2] = bx;
    t[3] = by;
    t[4] = cx;
    t[5] = cy;

    return t;
}

export function trian2_copy(a: trian2_t, b: trian2_t): trian2_t {
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = b[3];
    a[4] = b[4];
    a[5] = b[5];

    return a;
}

export function trian2_a(t: trian2_t): vec2_t {
    return t.subarray(0, 2);
}

export function trian2_b(t: trian2_t): vec2_t {
    return t.subarray(2, 4);
}

export function trian2_c(t: trian2_t): vec2_t {
    return t.subarray(4, 6);
}
