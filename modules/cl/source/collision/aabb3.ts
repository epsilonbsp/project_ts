import {vec3_t, vec3_abs, vec3_add, vec3_sub, vec3n_divs, vec3n_add, vec3n_sub, vec3n_abs} from "@cl/math/vec3.ts";

export class aabb3_t {
    position: vec3_t;
    size: vec3_t;
};

export function aabb3(position: vec3_t, size: vec3_t): aabb3_t {
    const out = new aabb3_t();
    out.position = position;
    out.size = size;

    return out;
}

export function aabb3_half(position: vec3_t, size: vec3_t): aabb3_t {
    const out = new aabb3_t();
    out.position = position;
    out.size = vec3n_divs(size, 2.0);

    return out;
}

export function aabb3_minmax(min: vec3_t, max: vec3_t): aabb3_t {
    const out = new aabb3_t();
    out.position = out.position = vec3n_divs(vec3n_add(min, max), 2.0);
    out.size = vec3n_abs(vec3n_sub(max, min));

    return out;
}
