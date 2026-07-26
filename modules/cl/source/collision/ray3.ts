import {vec3_t} from "@cl/math/vec3.ts";

export class ray3_t {
    position: vec3_t;
    direction: vec3_t;
};

export function ray3(position: vec3_t, direction: vec3_t): ray3_t {
    const out = new ray3_t();
    out.position = position;
    out.direction = direction;

    return out;
}
