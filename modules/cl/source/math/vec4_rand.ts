import {vec4_t, TYPE} from "./vec4.ts";

export function vec4_rand(out: vec4_t): void {
    out[0] = Math.random();
    out[1] = Math.random();
    out[2] = Math.random();
    out[3] = Math.random();
}

export function vec4n_rand(): vec4_t {
    const out = new TYPE(4);

    vec4_rand(out);

    return out;
}
