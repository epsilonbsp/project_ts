import {halfedge_next_loop} from "./halfedge.ts";
import {face_t, halfedge_t, vertex_t} from "./type.ts";

export function face_halfedge_from_vertex(face: face_t, vertex: vertex_t): halfedge_t|null {
    for (const he of halfedge_next_loop(face.halfedge)) {
        if (he.vertex === vertex) {
            return he;
        }
    }

    return null;
}

export function face_has_vertex(face: face_t, vertex: vertex_t): boolean {
    for (const he of halfedge_next_loop(face.halfedge)) {
        if (he.vertex === vertex) {
            return true;
        }
    }

    return false;
}
