import {vec3_t, TYPE} from "./vec3.ts";

export function vec3_rand(out: vec3_t): void {
    out[0] = Math.random();
    out[1] = Math.random();
    out[2] = Math.random();
}

export function vec3n_rand(): vec3_t {
    const out = new TYPE(3);

    vec3_rand(out);

    return out;
}

export function vec3_rand_unit(out: vec3_t, scale: number): void {
    const r = Math.random() * 2.0 * Math.PI;
    const z = Math.random() * 2.0 - 1.0;
    const z_scale = Math.sqrt(1.0 - z * z) * scale;

    out[0] = Math.cos(r) * z_scale;
    out[1] = Math.sin(r) * z_scale;
    out[2] = z * scale;
}

export function vec3n_rand_unit(scale: number): vec3_t {
    const out = new TYPE(3);

    vec3_rand_unit(out, scale);

    return out;
}
