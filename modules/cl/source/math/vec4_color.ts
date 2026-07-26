import {vec4_t, TYPE} from "./vec4.ts";

export function rgba(r: number = 0.0, g: number = 0.0, b: number = 0.0, a: number = 0.0): vec4_t {
    const out = new TYPE(4);

    out[0] = r / 255.0;
    out[1] = g / 255.0;
    out[2] = b / 255.0;
    out[3] = a / 255.0;

    return out;
}

export function hexa(h: number): vec4_t {
    const out = new TYPE(4);

    out[0] = ((h >> 24) & 0xFF) / 255.0;
    out[1] = ((h >> 16) & 0xFF) / 255.0;
    out[2] = ((h >> 8) & 0xFF) / 255.0;
    out[3] = (h & 0xFF) / 255.0;

    return out;
}

export function vec4_bitpack256(r: number, g: number, b: number, a: number): number {
    return (((r & 0xFF) << 24) | ((g & 0xFF) << 16) | ((b & 0xFF) << 8) | (a & 0xFF)) >>> 0;
}

export function vec4_bitpack256v(v: vec4_t): number {
    return (((v[0] & 0xFF) << 24) | ((v[1] & 0xFF) << 16) | ((v[2] & 0xFF) << 8) | (v[3] & 0xFF)) >>> 0;
}

export function vec4_bitunpack256(p: number): vec4_t {
    const out = new TYPE(4);

    out[0] = (p >> 24) & 0xFF,
    out[1] = (p >> 16) & 0xFF,
    out[2] = (p >> 8) & 0xFF,
    out[3] = p & 0xFF

    return out;
}

export function vec4_pack256(r: number, g: number, b: number, a: number): number {
    return r + g * 256 + b * 65536 + a * 16777216;
}

export function vec4_pack256v(v: vec4_t): number {
    return v[0] + v[1] * 256 + v[2] * 65536 + v[3] * 16777216;
}
