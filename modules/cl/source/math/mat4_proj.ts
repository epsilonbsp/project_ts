import {mat4_t, TYPE} from "./mat4.ts";

export function mat4_perspective(out: mat4_t, fov: number, aspect: number, near: number, far: number): void {
    const f = 1.0 / Math.tan(fov / 2.0);
    const nf = 1.0 / (near - far);

    out[0] = f / aspect;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = f;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = 0.0;
    out[9] = 0.0;
    out[10] = (far + near) * nf;
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = 2.0 * far * near * nf;
    out[15] = 0.0;
}

export function mat4n_perspective(fov: number, aspect: number, near: number, far: number): mat4_t {
    const out = new TYPE(16);

    mat4_perspective(out, fov, aspect, near, far);

    return out;
}
