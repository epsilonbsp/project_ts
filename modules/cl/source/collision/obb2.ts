import {vec2_t} from "@cl/math/vec2.ts";

export class obb2_t {
    position: vec2_t;
    size: vec2_t;
    rotation: number;
};

export function obb2(position: vec2_t, size: vec2_t, rotation: number): obb2_t {
    const out = new obb2_t();
    out.position = position;
    out.size = size;
    out.rotation = rotation;

    return out;
}
