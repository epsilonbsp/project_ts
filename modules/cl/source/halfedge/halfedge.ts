import {halfedge_t} from "./type.ts";

export function halfedge_is_free(halfedge: halfedge_t): boolean {
    return halfedge.face === null;
}

export function halfedge_is_boundary(halfedge: halfedge_t): boolean {
    return halfedge.face === null && halfedge.twin.face !== null;
}

export function *halfedge_next_loop(start: halfedge_t) {
    let curr: halfedge_t = start;

    do {
        yield curr;

        curr = curr.next;
    } while(curr !== start);

    return null;
}

export function *halfedge_prev_loop(start: halfedge_t) {
    let curr: halfedge_t = start;

    do {
        yield curr;

        curr = curr.prev;
    } while(curr !== start);

    return null;
}
