import {vec2_t, vec2, vec2_copy, vec2_dist, vec2_dist_sq, vec2_len_sq, vec2n_sub, vec2m_addmuls} from "@cl/math/vec2.ts";

export class circle_t {
    position: vec2_t
    radius: number;
};

export function circle_new(position: vec2_t, radius: number) {
    const circle = new circle_t();
    circle.position = position;
    circle.radius = radius;

    return circle;
}

export function circle_ab(a: circle_t, b: circle_t): circle_t {
    const offset = vec2n_sub(b.position, a.position);
    const dist_sq = vec2_len_sq(offset);
    const rad_diff = b.radius - a.radius;
    let position = vec2();
    let radius = 0.0;

    if (dist_sq <= rad_diff * rad_diff) {
        if (a.radius > b.radius) {
            vec2_copy(position, a.position);
            radius = a.radius;
        } else {
            vec2_copy(position, b.position);
            radius = b.radius;
        }
    } else {
        const dist = Math.sqrt(dist_sq);

        vec2_copy(position, a.position);
        radius = (dist + a.radius + b.radius) * 0.5;

        if (dist > 0.0) {
            vec2m_addmuls(position, offset, (radius - a.radius) / dist);
        }
    }

    const circle = new circle_t();
    circle.position = position;
    circle.radius = radius;

    return circle;
}

export function circle_area(a: circle_t): number {
    return Math.PI * (a.radius * a.radius);
}

export function circle_growth(a: circle_t, b: circle_t): number {
    const required_radius = vec2_dist(a.position, b.position) + b.radius;
    const growth = Math.max(0, required_radius - a.radius);

    return growth;
}

export function circle_overlap(a: circle_t, b: circle_t): boolean {
    return vec2_dist_sq(a.position, b.position) < (a.radius + b.radius) * (a.radius + b.radius);
}
