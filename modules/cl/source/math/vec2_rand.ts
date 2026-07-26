import {vec2_t, TYPE} from "./vec2.ts";

export function vec2_rand(out: vec2_t): void {
    out[0] = Math.random();
    out[1] = Math.random();
}

export function vec2n_rand(): vec2_t {
    const out = new TYPE(2);

    vec2_rand(out);

    return out;
}

export function vec2_rand_unit(out: vec2_t, scale: number): void {
    const r = Math.random() * 2.0 * Math.PI;

    out[0] = Math.cos(r) * scale;
    out[1] = Math.sin(r) * scale;
}

export function vec2n_rand_unit(scale: number): vec2_t {
    const out = new TYPE(2);

    vec2_rand_unit(out, scale);

    return out;
}
