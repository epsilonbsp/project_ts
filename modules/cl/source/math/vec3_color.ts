import {vec3_t, TYPE} from "./vec3.ts";

export function rgb(r: number = 0.0, g: number = 0.0, b: number = 0.0): vec3_t {
    const out = new TYPE(3);

    out[0] = r / 255.0;
    out[1] = g / 255.0;
    out[2] = b / 255.0;

    return out;
}

export function hex(h: number): vec3_t {
    const out = new TYPE(3);

    out[0] = ((h >> 16) & 0xFF) / 255.0;
    out[1] = ((h >> 8) & 0xFF) / 255.0;
    out[2] = (h & 0xFF) / 255.0;

    return out;
}

export function vec3_bitpack256(r: number, g: number, b: number): number {
    return ((r & 0xFF) << 16) | ((g & 0xFF) << 8) | (b & 0xFF);
}

export function vec3_bitpack256v(v: vec3_t): number {
    return ((v[0] & 0xFF) << 16) | ((v[1] & 0xFF) << 8) | (v[2] & 0xFF);
}

export function vec3_pack256(r: number, g: number, b: number): number {
    return r + g * 256 + b * 65536;
}

export function vec3_pack256v(v: vec3_t): number {
    return v[0] + v[1] * 256 + v[2] * 65536;
}
