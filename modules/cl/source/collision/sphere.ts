import {vec3_t} from "@cl/math/vec3.ts";

export class sphere_t {
    position: vec3_t;
    diameter: number;

    get radius(): number {
        return this.diameter / 2.0;
    }

    set radius(r: number) {
        this.diameter = r * 2.0;
    }
};

export function sphere(position: vec3_t, diameter: number): sphere_t {
    const out = new sphere_t();
    out.position = position;
    out.diameter = diameter;

    return out;
}

export function sphere_r(position: vec3_t, radius: number): sphere_t {
    const out = new sphere_t();
    out.position = position;
    out.diameter = radius * 2.0;

    return out;
}
