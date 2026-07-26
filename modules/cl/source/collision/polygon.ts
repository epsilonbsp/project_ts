import {vec2, vec2_t} from "@cl/math/vec2.ts";

export function polygon_from_aabb(min: vec2_t, max: vec2_t): vec2_t[] {
    return [
        vec2(min[0], min[1]),
        vec2(max[0], min[1]),
        vec2(max[0], max[1]),
        vec2(min[0], max[1])
    ]
}

export function polygon_point_inside(points: vec2_t[], point: vec2_t): boolean {
    const x = point[0];
    const y = point[1];
    let inside = false;

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        let xi = points[i][0], yi = points[i][1];
        let xj = points[j][0], yj = points[j][1];

        let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside
}


export function polygon_center(points: vec2_t[]): vec2_t {
    let sumX = 0;
    let sumY = 0;

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        sumX += point[0];
        sumY += point[1];
    }

    const meanX = sumX / points.length;
    const meanY = sumY / points.length;

    return vec2(meanX, meanY);
}

export function polygon_min_max(points: vec2_t[]): {min: vec2_t, max: vec2_t} {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const x = point[0];
        const y = point[1];

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
    }

    return {
        min: vec2(minX, minY),
        max: vec2(maxX, maxY)
    };
}

export type intersect_t = {
    point: vec2_t,
    index: number
};

export function polgon_line_intersections(points: vec2_t[], i: vec2_t, angle: number, offset: number): intersect_t[] {
    i = vec2(i[0] + Math.cos(angle + Math.PI / 2) * offset, i[1] + Math.sin(angle + Math.PI / 2) * offset)
    let j = vec2(i[0] + Math.cos(angle), i[1] + Math.sin(angle))

    const intersections: intersect_t[] = []

    for (let a = 0; a < points.length; ++a) {
        const k = points[a]
        const l = points[(a + 1) % points.length]

        const d = (l[1] - k[1]) * (j[0] - i[0]) - (l[0] - k[0]) * (j[1] - i[1])

        if (d == 0) {
            continue
        }

        const n1 = (l[0] - k[0]) * (i[1] - k[1]) - (l[1] - k[1]) * (i[0] - k[0])
        const n2 = (j[0] - i[0]) * (i[1] - k[1]) - (j[1] - i[1]) * (i[0] - k[0])
        const t1 = n1 / d
        const t2 = n2 / d

        if (t2 > 0 && t2 < 1) {
            const px = i[0] + (t1 * (j[0] - i[0]))
            const py = i[1] + (t1 * (j[1] - i[1]))
            const vec = vec2(px, py)
            intersections.push({point: vec, index: a})
        }

        if (intersections.length == 2) {
            break
        }
    }

    return intersections
}
