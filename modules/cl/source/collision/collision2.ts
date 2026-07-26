import {vec2, vec2_copy, vec2_dist, vec2_dist_sq, vec2_dot, vec2_t, vec2n_add, vec2n_addmuls, vec2n_copy, vec2n_dir, vec2n_divs, vec2n_perp2, vec2n_rotate, vec2n_sub, vec2n_unit} from "@cl/math/vec2.ts";
import {abs, clamp} from "@cl/math/math.ts";
import {vec2n_swap} from "@cl/math/vec2_other.ts";

// point inside
export function point_inside_circle(cp: vec2_t, cr: number, p: vec2_t): boolean {
    return vec2_dist_sq(cp, p) <= cr * cr;
}

export function point_inside_aabb(bp: vec2_t, bs: vec2_t, p: vec2_t): boolean {
    const sx = bs[0] / 2.0, sy = bs[1] / 2.0;
    const px = p[0] - bp[0], py = p[1] - bp[1];

    return abs(px) <= sx && abs(py) <= sy;
}

export function point_inside_raabb(bp: vec2_t, bs: vec2_t, bf: boolean, p: vec2_t): boolean {
    let sx = bs[0] / 2.0, sy = bs[1] / 2.0;

    if (bf) {
        const temp = sx;
        sx = sy;
        sy = temp;
    }

    const px = p[0] - bp[0], py = p[1] - bp[1];

    return abs(px) <= sx && abs(py) <= sy;
}

export function point_inside_obb(bp: vec2_t, bs: vec2_t, ba: number, p: vec2_t): boolean {
    const sx = bs[0] / 2.0, sy = bs[1] / 2.0;
    const lp = vec2n_rotate(vec2n_sub(p, bp), -ba);

    return Math.abs(lp[0]) <= sx && Math.abs(lp[1]) <= sy;
}

export function sign(p0: vec2_t, p1: vec2_t, p2: vec2_t): number {
    return (p0[0] - p2[0]) * (p1[1] - p2[1]) - (p1[0] - p2[0]) * (p0[1] - p2[1]);
}

export function point_inside_triangle(a: vec2_t, b: vec2_t, c: vec2_t, p: vec2_t): boolean {
    const d0 = sign(p, a, b);
    const d1 = sign(p, b, c);
    const d2 = sign(p, c, a);
    const has_neg = (d0 < 0) || (d1 < 0) || (d2 < 0);
    const has_pos = (d0 > 0) || (d1 > 0) || (d2 > 0);

    return !(has_neg && has_pos);
}

export function point_inside_convex(points: vec2_t[], p: vec2_t): boolean {
    const l = points.length;
    const px = p[0], py = p[1];
    let first_sign: number|null = null;

    for (let i = 0; i < l; i += 1) {
        const curr = points[i];
        const next = points[(i + 1) % l];
        const x0 = curr[0], y0 = curr[1];
        const x1 = next[0], y1 = next[1];
        const cross = (x1 - x0) * (py - y0) - (y1 - y0) * (px - x0);
        const sign = Math.sign(cross);

        if (sign === 0) {
            continue;
        }

        if (!first_sign) {
            first_sign = sign;
        } else if (sign !== first_sign) {
            return false;
        }
    }

    return true;
}

export function point_inside_convex2(points: vec2_t[], pp: vec2_t, pa: number, p: vec2_t): boolean {
    return point_inside_convex(points, vec2n_rotate(vec2n_sub(p, pp), -pa));
}

export function point_inside_capsule(a: vec2_t, b: vec2_t, r: number, p: vec2_t) {
    const ax = a[0], ay = a[1];
    const bax = b[0] - ax, bay = b[1] - ay;
    const pax = p[0] - ax, pay = p[1] - ay;
    const t = (bax * pax + bay * pay) / (bax * bax + bay * bay);
    const tc = clamp(t, 0.0, 1.0);
    const tp = vec2(ax + bax * tc, ay + bay * tc);

    return vec2_dist_sq(tp, p) <= r * r;
}

// closest point
export function closest_point_circle(cp: vec2_t, cr: number, p: vec2_t): vec2_t {
    return vec2n_addmuls(cp, vec2n_dir(p, cp), cr);
}

export function closest_point_line(a: vec2_t, b: vec2_t, p: vec2_t): vec2_t {
    const ax = a[0], ay = a[1];
    const bax = b[0] - ax, bay = b[1] - ay;
    const pax = p[0] - ax, pay = p[1] - ay;
    const t = (bax * pax + bay * pay) / (bax * bax + bay * bay);
    const tc = clamp(t, 0.0, 1.0);

    return vec2(ax + bax * tc, ay + bay * tc);
}

export function closest_point_aabb(bp: vec2_t, bs: vec2_t, p: vec2_t): vec2_t {
    const bx = bp[0], by = bp[1];
    const sx = bs[0] / 2.0, sy = bs[1] / 2.0;
    const px = p[0], py = p[1];
    const minx = bx - sx, miny = by - sy;
    const maxx = bx + sx, maxy = by + sy;
    const cx = abs(minx - px) < abs(maxx - px) ? minx : maxx;
    const cy = abs(miny - py) < abs(maxy - py) ? miny : maxy;
    const ex = closest_point_line(vec2(cx, miny), vec2(cx, maxy), p);
    const ey = closest_point_line(vec2(minx, cy), vec2(maxx, cy), p);

    if (vec2_dist_sq(ex, p) < vec2_dist_sq(ey, p)) {
        return ex;
    }

    return ey;
}

export function closest_point_obb(bp: vec2_t, bs: vec2_t, ba: number, p: vec2_t): vec2_t {
    const lp = vec2n_rotate(vec2n_sub(p, bp), -ba);
    const cp = closest_point_aabb(vec2(), bs, lp);

    return vec2n_add(vec2n_rotate(cp, ba), bp);
}

export function closest_point_convex(points: vec2_t[], p: vec2_t): vec2_t {
    const l = points.length;
    let closest: vec2_t|null = null;

    for (let i = 0; i < l; i += 1) {
        const curr = points[i];
        const next = points[(i + 1) % l];
        const c = closest_point_line(curr, next, p);

        if (!closest || vec2_dist_sq(p, c) < vec2_dist_sq(p, closest)) {
            closest = c;
        }
    }

    return closest!;
}

export function closest_point_convex2(points: vec2_t[], pp: vec2_t, pa: number, p: vec2_t): vec2_t {
    const lp = vec2n_rotate(vec2n_sub(p, pp), -pa);
    const cp = closest_point_convex(points, lp);

    return vec2n_add(vec2n_rotate(cp, pa), pp);
}

export function closest_point_capsule(a: vec2_t, b: vec2_t, cr: number, p: vec2_t): vec2_t {
    const ax = a[0], ay = a[1];
    const bax = b[0] - ax, bay = b[1] - ay;
    const pax = p[0] - ax, pay = p[1] - ay;
    const t = (bax * pax + bay * pay) / (bax * bax + bay * bay);
    const tc = clamp(t, 0.0, 1.0);
    const tp = vec2(ax + bax * tc, ay + bay * tc);
    const dir = vec2n_dir(p, tp);

    return vec2n_addmuls(tp, dir, cr);
}

// overlap
export function overlap_circle_circle(p0: vec2_t, r0: number, p1: vec2_t, r1: number): boolean {
    return vec2_dist_sq(p0, p1) <= (r0 + r1) * (r0 + r1);
}

export function overlap_aabb_aabb_min_max2(min0: vec2_t, max0: vec2_t, min1: vec2_t, max1: vec2_t): boolean {
    return min0[0] < max1[0] && max0[0] > min1[0] && max0[1] > min1[1] && min0[1] < max1[1];
}

export function overlap_aabb_aabb2(ap: vec2_t, as: vec2_t, bp: vec2_t, bs: vec2_t): boolean {
    const hs1 = vec2n_divs(as, 2.0);
    const hs2 = vec2n_divs(bs, 2.0);
    const l1 = ap[0] - hs1[0];
    const r1 = ap[0] + hs1[0];
    const b1 = ap[1] - hs1[1];
    const t1 = ap[1] + hs1[1];
    const l2 = bp[0] - hs2[0];
    const r2 = bp[0] + hs2[0];
    const b2 = bp[1] - hs2[1];
    const t2 = bp[1] + hs2[1];

    return l1 < r2 && r1 > l2 && t1 > b2 && b1 < t2;
}

export function overlap_aabb_aabb2_x(ap: vec2_t, as: vec2_t, bp: vec2_t, bs: vec2_t): boolean {
    const hs1 = vec2n_divs(as, 2.0);
    const hs2 = vec2n_divs(bs, 2.0);
    const l1 = ap[0] - hs1[0];
    const r1 = ap[0] + hs1[0];
    const l2 = bp[0] - hs2[0];
    const r2 = bp[0] + hs2[0];

    return l1 < r2 && r1 > l2;
}

export function overlap_aabb_aabb2_y(ap: vec2_t, as: vec2_t, bp: vec2_t, bs: vec2_t): boolean {
    const hs1 = vec2n_divs(as, 2.0);
    const hs2 = vec2n_divs(bs, 2.0);
    const b1 = ap[1] - hs1[1];
    const t1 = ap[1] + hs1[1];
    const b2 = bp[1] - hs2[1];
    const t2 = bp[1] + hs2[1];

    return t1 > b2 && b1 < t2;
}

export function overlap_raabb_raabb2(ap: vec2_t, as: vec2_t, af: boolean, bp: vec2_t, bs: vec2_t, bf: boolean): boolean {
    const hs1 = af ? vec2n_swap(vec2n_copy(as)) : as;
    const hs2 = bf ? vec2n_swap(vec2n_copy(bs)) : bs;

    return overlap_aabb_aabb2(ap, hs1, bp, hs2);
}

export function overlap_raabb_raabb2_x(ap: vec2_t, as: vec2_t, af: boolean, bp: vec2_t, bs: vec2_t, bf: boolean): boolean {
    const hs1 = af ? vec2n_swap(vec2n_copy(as)) : as;
    const hs2 = bf ? vec2n_swap(vec2n_copy(bs)) : bs;

    return overlap_aabb_aabb2_x(ap, hs1, bp, hs2);
}

export function overlap_raabb_raabb2_y(ap: vec2_t, as: vec2_t, af: boolean, bp: vec2_t, bs: vec2_t, bf: boolean): boolean {
    const hs1 = af ? vec2n_swap(vec2n_copy(as)) : as;
    const hs2 = bf ? vec2n_swap(vec2n_copy(bs)) : bs;

    return overlap_aabb_aabb2_y(ap, hs1, bp, hs2);
}

// line intersect
export function line_intersect_circle(cp: vec2_t, cr: number, a: vec2_t, b: vec2_t): vec2_t[] {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const fx = a[0] - cp[0];
    const fy = a[1] - cp[1];
    const A = dx * dx + dy * dy;
    const B = 2 * (fx * dx + fy * dy);
    const C = fx * fx + fy * fy - cr * cr;
    const D = B * B - 4 * A * C;

    if (D < 0) {
        return [];
    }

    const sqrt_d = Math.sqrt(D);
    const t1 = (-B - sqrt_d) / (2 * A);
    const t2 = (-B + sqrt_d) / (2 * A);
    const points: vec2_t[] = [];

    if (t1 >= 0 && t1 <= 1) {
        points.push(vec2(a[0] + t1 * dx, a[1] + t1 * dy));
    }

    if (t2 >= 0 && t2 <= 1) {
        points.push(vec2(a[0] + t2 * dx, a[1] + t2 * dy));
    }

    return points;
}

export function line_intersect_line(a0: vec2_t, b0: vec2_t, a1: vec2_t, b1: vec2_t): vec2_t[] {
    const x1 = a0[0], y1 = a0[1], x2 = b0[0], y2 = b0[1];
    const x3 = a1[0], y3 = a1[1], x4 = b1[0], y4 = b1[1];
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (denom === 0) {
        return [];
    }

    const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denom;
    const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denom;
    const t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / ((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const u = ((px - x3) * (x4 - x3) + (py - y3) * (y4 - y3)) / ((x4 - x3) ** 2 + (y4 - y3) ** 2);

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return [vec2(px, py)];
    }

    return [];
}

export function line_intersect_aabb(bp: vec2_t, bs: vec2_t, a: vec2_t, b: vec2_t): vec2_t[] {
    const min_x = bp[0] - bs[0] / 2;
    const max_x = bp[0] + bs[0] / 2;
    const min_y = bp[1] - bs[1] / 2;
    const max_y = bp[1] + bs[1] / 2;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    let t_min = 0;
    let t_max = 1;

    if (dx !== 0) {
        let t1 = (min_x - a[0]) / dx;
        let t2 = (max_x - a[0]) / dx;

        if (t1 > t2) [t1, t2] = [t2, t1];
        t_min = Math.max(t_min, t1);
        t_max = Math.min(t_max, t2);
    } else if (a[0] < min_x || a[0] > max_x) {
        return [];
    }

    if (dy !== 0) {
        let t1 = (min_y - a[1]) / dy;
        let t2 = (max_y - a[1]) / dy;

        if (t1 > t2) [t1, t2] = [t2, t1];
        t_min = Math.max(t_min, t1);
        t_max = Math.min(t_max, t2);
    } else if (a[1] < min_y || a[1] > max_y) {
        return [];
    }

    if (t_min > t_max) return [];

    const points: vec2_t[] = [];

    if (t_min > 0 && t_min < 1) {
        points.push(vec2(a[0] + t_min * dx, a[1] + t_min * dy));
    }

    if (t_max > 0 && t_max < 1 && t_max !== t_min) {
        points.push(vec2(a[0] + t_max * dx, a[1] + t_max * dy));
    }

    return points;
}

export function line_intersect_obb(bp: vec2_t, bs: vec2_t, br: number, a: vec2_t, b: vec2_t) {
    const local_a = vec2n_rotate(vec2n_sub(a, bp), -br);
    const local_b = vec2n_rotate(vec2n_sub(b, bp), -br);
    const local_bp: vec2_t = vec2(0, 0);
    const local_bs = vec2(bs[0], bs[1]);
    const intersections = line_intersect_aabb(local_bp, local_bs, local_a, local_b);

    for (const inter of intersections) {
        vec2_copy(inter, vec2n_add(vec2n_rotate(inter, br), bp));
    }

    return intersections;
}

export function line_intersect_convex(points: vec2_t[], a: vec2_t, b: vec2_t): vec2_t[] {
    const intersections: vec2_t[] = [];

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];0.
        
        const edge_intersections = line_intersect_line(p1, p2, a, b);
        intersections.push(...edge_intersections);
    }

    return intersections;
}

export function line_intersect_convex2(points: vec2_t[], bp: vec2_t, br: number, a: vec2_t, b: vec2_t): vec2_t[] {
    const local_a = vec2n_rotate(vec2n_sub(a, bp), -br);
    const local_b = vec2n_rotate(vec2n_sub(b, bp), -br);
    const intersections = line_intersect_convex(points, local_a, local_b);

    for (const inter of intersections) {
        vec2_copy(inter, vec2n_add(vec2n_rotate(inter, br), bp));
    }

    return intersections;
}

export function line_intersect_capsule(a0: vec2_t, b0: vec2_t, cr: number, a1: vec2_t, b1: vec2_t): vec2_t[] {
    const d = vec2n_dir(a0, b0);
    const dp = vec2(-d[1], d[0]);
    const start0 = vec2n_addmuls(a0, dp, -cr);
    const start1 = vec2n_addmuls(a0, dp, cr);
    const end0 = vec2n_addmuls(b0, dp, -cr);
    const end1 = vec2n_addmuls(b0, dp, cr);

    const out: vec2_t[] = [];

    for (const point of line_intersect_circle(a0, cr, a1, b1)) {
        if (vec2_dist(point, closest_point_capsule(a0, b0, cr, point)) <= 0.001) {
            out.push(point);
        }
    }

    for (const point of line_intersect_circle(b0, cr, a1, b1)) {
        if (vec2_dist(point, closest_point_capsule(a0, b0, cr, point)) <= 0.001) {
            out.push(point);
        }
    }

    out.push(...line_intersect_line(start0, end0, a1, b1));
    out.push(...line_intersect_line(start1, end1, a1, b1));

    return out;
}

// mtv
export type mtv_t = {
    dir: vec2_t;
    depth: number;
};

export function mtv_aabb_aabb2(ap: vec2_t, as: vec2_t, bp: vec2_t, bs: vec2_t): mtv_t|null {
    const hs1 = vec2n_divs(as, 2.0);
    const hs2 = vec2n_divs(bs, 2.0);

    const l1 = ap[0] - hs1[0];
    const r1 = ap[0] + hs1[0];
    const b1 = ap[1] - hs1[1];
    const t1 = ap[1] + hs1[1];

    const l2 = bp[0] - hs2[0];
    const r2 = bp[0] + hs2[0];
    const b2 = bp[1] - hs2[1];
    const t2 = bp[1] + hs2[1];

    if (!(l1 < r2 && r1 > l2 && t1 > b2 && b1 < t2)) {
        return null;
    }

    const overlap_x = Math.min(r1 - l2, r2 - l1);
    const overlap_y = Math.min(t1 - b2, t2 - b1);

    if (overlap_x < overlap_y) {
        return {
            dir: vec2((ap[0] < bp[0] ? -1.0: 1.0), 0.0),
            depth: overlap_x
        };
    } else {
        return {
            dir: vec2(0.0, (ap[1] < bp[1] ? -1.0 : 1.0)),
            depth: overlap_y
        };
    }
}

export function mtv_raabb_raabb2(ap: vec2_t, as: vec2_t, af: boolean, bp: vec2_t, bs: vec2_t, bf: boolean): mtv_t|null {
    const hs1 = af ? vec2n_swap(vec2n_copy(as)) : as;
    const hs2 = bf ? vec2n_swap(vec2n_copy(bs)) : bs;

    return mtv_aabb_aabb2(ap, hs1, bp, hs2);
}

export function compute_axes(points: vec2_t[]): vec2_t[] {
    const l = points.length;
    const axes: vec2_t[] = [];

    for (let i = 0; i < l; i++) {
        const curr = points[i];
        const next = points[(i + 1) % l];
        const axis = vec2n_unit(vec2n_perp2(curr, next));

        axes.push(axis);
    }

    return axes;
}

function project_points(points: vec2_t[], axis: vec2_t, pp: vec2_t, pa: number): {min: number; max: number} {
    let min = Infinity, max = -Infinity;

    for (const p of points) {
        const transformed = vec2n_add(vec2n_rotate(p, pa), pp);
        const proj = vec2_dot(transformed, axis);

        min = Math.min(min, proj);
        max = Math.max(max, proj);
    }

    return {min, max};
}

export function mtv_sat(
    points0: vec2_t[], axes0: vec2_t[], pp0: vec2_t, pa0: number,
    points1: vec2_t[], axes1: vec2_t[], pp1: vec2_t, pa1: number
): mtv_t|null {
    let min_overlap = Infinity;
    let min_axis: vec2_t | null = null;

    for (const axis of axes0) {
        const raxis = vec2n_rotate(axis, pa0);
        const proj0 = project_points(points0, raxis, pp0, pa0);
        const proj1 = project_points(points1, raxis, pp1, pa1);

        if (proj0.max < proj1.min || proj1.max < proj0.min) {
            return null;
        }

        const overlap = Math.min(proj0.max, proj1.max) - Math.max(proj0.min, proj1.min);

        if (overlap <= 0) {
            return null;
        }

        if (overlap < min_overlap) {
            min_overlap = overlap;
            min_axis = raxis;
        }
    }

    for (const axis of axes1) {
        const raxis = vec2n_rotate(axis, pa1);
        const proj0 = project_points(points0, raxis, pp0, pa0);
        const proj1 = project_points(points1, raxis, pp1, pa1);

        if (proj0.max < proj1.min || proj1.max < proj0.min) {
            return null;
        }

        const overlap = Math.min(proj0.max, proj1.max) - Math.max(proj0.min, proj1.min);

        if (overlap <= 0) {
            return null;
        }

        if (overlap < min_overlap) {
            min_overlap = overlap;
            min_axis = raxis;
        }
    }

    if (min_axis) {
        const direction = vec2n_sub(pp1, pp0);

        if (direction[0] * min_axis[0] + direction[1] * min_axis[1] < 0) {
            min_axis = vec2(-min_axis[0], -min_axis[1]);
        }

        return {
            dir: vec2(min_axis[0], min_axis[1]),
            depth: min_overlap
        };
    }

    return null;
}
