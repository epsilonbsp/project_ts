import {face_has_vertex} from "./face.ts";
import {halfedge_is_boundary, halfedge_is_free} from "./halfedge.ts";
import {face_t, halfedge_t, vertex_t} from "./type.ts";
import {vec3_dist, vec3_t} from "@cl/math/vec3.ts";

export function *free_halfedges_out_loop(vertex: vertex_t, start?: halfedge_t) {
    start = start ?? vertex.halfedge!;

    for (const halfedge of loop_cw(vertex, start)) {
        if (halfedge_is_free(halfedge)) {
            yield halfedge;
        }
    }

    return null;
}

export function *free_halfedges_in_loop(vertex: vertex_t, start?: halfedge_t) {
    start = start ?? vertex.halfedge!;

    for (const halfedge of loop_cw(vertex, start)) {
        if (halfedge_is_free(halfedge.twin)) {
            yield halfedge.twin;
        }
    }

    return null;
}

export function *boundary_halfedges_out_loop(vertex: vertex_t, start?: halfedge_t) {
    start = start ?? vertex.halfedge!;

    for (const halfedge of loop_cw(vertex, start)) {
        if (halfedge_is_boundary(halfedge)) {
            yield halfedge;
        }
    }

    return null;
}

export function *boundary_halfedges_in_loop(vertex: vertex_t, start?: halfedge_t) {
    start = start ?? vertex.halfedge!;

    for (const halfedge of loop_cw(vertex, start)) {
        if (halfedge_is_boundary(halfedge.twin)) {
            yield halfedge.twin;
        }
    }

    return null;
}

export function vertex_is_free(vertex: vertex_t): boolean {
    if (vertex_is_isolated(vertex)) {
      return true;
    }

    for (const halfedge of loop_cw(vertex)) {
        if (halfedge_is_free(halfedge)) {
            return true;
        }
    }

    return false;
}

export function vertex_is_isolated(vertex: vertex_t): boolean {
    return vertex.halfedge === null;
}

export function common_faces_with_vertex(vertex: vertex_t, other: vertex_t): face_t[] {
    const faces: face_t[] = [];

    for (const halfedge of loop_cw(vertex)) {
        if (halfedge.face && face_has_vertex(halfedge.face, other)) {
            faces.push(halfedge.face);
        }
    }

    return faces;
}

export function vertex_matches_position(vertex: vertex_t, position: vec3_t, tolerance: number = 1e-10): boolean {
    return vec3_dist(vertex.position, position) < tolerance;
}

export function get_halfedge_to_vertex(vertex: vertex_t, other: vertex_t): halfedge_t|null {
    for (const halfedge of loop_cw(vertex)) {
        if (halfedge.twin.vertex === other) {
            return halfedge;
        }
    }

    return null;
}

export function is_connected_to_vertex(vertex: vertex_t, other: vertex_t): boolean {
    return get_halfedge_to_vertex(vertex, other) !== null;
}

export function *loop_cw(vertex: vertex_t, start?: halfedge_t) {
    start = start ?? vertex.halfedge!;

    if (start && start.vertex === vertex) {
        let curr: halfedge_t = start;

        do {
            yield curr;

            curr = curr.twin.next;
        } while(curr != start);
    }

    return null;
}

export function *loop_ccw(vertex: vertex_t, start?: halfedge_t) {
    start = start ?? vertex.halfedge!;

    if (start && start.vertex === vertex) {
        let curr: halfedge_t = start;

        do {
            yield curr;

            curr = curr.prev.twin;
        } while(curr != start);
    }

    return null;
}
