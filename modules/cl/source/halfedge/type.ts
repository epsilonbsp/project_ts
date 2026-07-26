import {vec3_t} from "@cl/math/vec3.ts";

export class halfedge_t {
    twin: halfedge_t;
    prev: halfedge_t;
    next: halfedge_t;
    vertex: vertex_t;
    face: face_t|null;

    constructor(vertex: vertex_t) {
        this.vertex = vertex;
    }
};

export class vertex_t {
    halfedge: halfedge_t|null;
    position: vec3_t;
};

export class face_t {
    halfedge: halfedge_t;

    constructor(halfedge: halfedge_t) {
        this.halfedge = halfedge;
    }
};
