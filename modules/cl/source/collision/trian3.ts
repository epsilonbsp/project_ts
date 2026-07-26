import {vec3_t} from "@cl/math/vec3.ts";

const TYPE = Float32Array;
export type trian3_t = Float32Array;

export function trian3(ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number): trian3_t {
    const out = new TYPE(9);

    out[0] = ax;
    out[1] = ay;
    out[2] = az;
    out[3] = bx;
    out[4] = by;
    out[5] = bz;
    out[6] = cx;
    out[7] = cy;
    out[8] = cz;

    return out;
}

export function trian3_new(): vec3_t {
    const out = new TYPE(9);

    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = 0.0;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = 0.0;

    return out;
}

export function trian3_clone(t: trian3_t): vec3_t {
    const out = new TYPE(9);

    out[0] = t[0];
    out[1] = t[1];
    out[2] = t[2];
    out[3] = t[3];
    out[4] = t[4];
    out[5] = t[5];
    out[6] = t[6];
    out[7] = t[7];
    out[8] = t[8];

    return out;
}

export function trian3_ab(a: vec3_t, b: vec3_t, c: vec3_t): trian3_t {
    const out = new TYPE(9);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = b[0];
    out[4] = b[1];
    out[5] = b[2];
    out[6] = c[0];
    out[7] = c[1];
    out[8] = c[2];

    return out;
}

export function trian3_set(t: trian3_t, ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number): trian3_t {
    t[0] = ax;
    t[1] = ay;
    t[2] = az;
    t[3] = bx;
    t[4] = by;
    t[5] = bz;
    t[6] = cx;
    t[7] = cy;
    t[8] = cz;

    return t;
}

export function trian3_copy(a: trian3_t, b: trian3_t): trian3_t {
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = b[3];
    a[4] = b[4];
    a[5] = b[5];
    a[6] = b[6];
    a[7] = b[7];
    a[8] = b[8];

    return a;
}

export function trian3_a(t: trian3_t): vec3_t {
    return t.subarray(0, 3);
}

export function trian3_b(t: trian3_t): vec3_t {
    return t.subarray(3, 6);
}

export function trian3_c(t: trian3_t): vec3_t {
    return t.subarray(6, 9);
}
