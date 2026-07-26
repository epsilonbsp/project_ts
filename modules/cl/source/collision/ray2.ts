import {vec2_t} from "@cl/math/vec2.ts";

export class ray2_t {
    position: vec2_t;
    direction: vec2_t;
};

export function ray2(position: vec2_t, direction: vec2_t): ray2_t {
    const out = new ray2_t();
    out.position = position;
    out.direction = direction;

    return out;
}
