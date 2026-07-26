import {vec2_t, vec2n_abs, vec2n_sub, vec2n_divs, vec2n_add} from "@cl/math/vec2.ts";

export class aabb2_t {
    position: vec2_t;
    size: vec2_t;
};

export function aabb2(position: vec2_t, size: vec2_t): aabb2_t {
    const out = new aabb2_t();
    out.position = position;
    out.size = size;

    return out;
}

export function aabb2_half(position: vec2_t, size: vec2_t): aabb2_t {
    const out = new aabb2_t();
    out.position = position;
    out.size = vec2n_divs(size, 2.0);

    return out;
}

export function aabb2_minmax(min: vec2_t, max: vec2_t): aabb2_t {
    const out = new aabb2_t();
    out.position = vec2n_divs(vec2n_add(min, max), 2.0);
    out.size = vec2n_abs(vec2n_sub(max, min));

    return out;
}
