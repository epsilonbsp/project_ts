import {vec3_t} from "@cl/math/vec3.ts";

const TYPE = Float32Array;
export type line3_t = Float32Array;

export function line3(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): line3_t {
    const out = new TYPE(6);

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = x1;
    out[4] = y1;
    out[5] = z1;

    return out;
}

export function line3_new(): vec3_t {
    const out = new TYPE(6);

    out[0] = 0.0;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = 0.0;

    return out;
}

export function line3_clone(ln: line3_t): vec3_t {
    const out = new TYPE(6);

    out[0] = ln[0];
    out[1] = ln[1];
    out[2] = ln[2];
    out[3] = ln[3];
    out[4] = ln[4];
    out[5] = ln[5];

    return out;
}

export function line3_ab(a: vec3_t, b: vec3_t): line3_t {
    const out = new TYPE(6);

    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = b[0];
    out[4] = b[1];
    out[5] = b[2];

    return out;
}

export function line3_set(ln: line3_t, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): line3_t {
    ln[0] = x0;
    ln[1] = y0;
    ln[2] = z0;
    ln[3] = x1;
    ln[4] = y1;
    ln[5] = z1;

    return ln;
}

export function line3_copy(a: line3_t, b: line3_t): line3_t {
    a[0] = b[0];
    a[1] = b[1];
    a[2] = b[2];
    a[3] = b[3];
    a[4] = b[4];
    a[5] = b[5];

    return a;
}

export function line3_a(ln: line3_t): vec3_t {
    return ln.subarray(0, 3);
}

export function line3_b(ln: line3_t): vec3_t {
    return ln.subarray(3, 6);
}
