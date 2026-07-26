import {mat4, mat4_ident, mat4_t} from "@cl/math/mat4.ts";
import {mat4_scale, mat4_translate} from "@cl/math/mat4_affine.ts";
import {vec2, vec2m_addmuls, vec2_t} from "@cl/math/vec2.ts";
import {vec3} from "@cl/math/vec3.ts";

export class cam2_t {
    position: vec2_t;
    scale: number;
    roll: number;
    right: vec2_t;
    up: vec2_t;
    world_up: vec2_t;
    projection: mat4_t;
    near: number;
    far: number;
    view: mat4_t;
    movement_speed: number;
    roll_speed: number;
    zoom_speed: number;
};

export function cam2_new() {
    const cam = new cam2_t();

    cam.position = vec2();
    cam.right = vec2(1.0, 0.0);
    cam.up = vec2(0.0, 1.0);
    cam.world_up = vec2(0.0, 1.0);
    cam.projection = mat4(1.0);
    cam.near = -100.0;
    cam.far = 100.0;
    cam.view = mat4(1.0);
    cam.scale = 50;
    cam.roll = 0.0;
    cam.movement_speed = 0.1;
    cam.roll_speed = 0.1;
    cam.zoom_speed = 0.1;

    return cam;
}

export function cam2_move_right(cam: cam2_t, dir: number) {
    vec2m_addmuls(cam.position, cam.right, cam.movement_speed * dir);
}

export function cam2_move_up(cam: cam2_t, dir: number) {
    vec2m_addmuls(cam.position, cam.up, cam.movement_speed * dir);
}

export function cam2_roll(cam: cam2_t, dir: number) {
    cam.roll += cam.roll_speed * dir;
}

export function cam2_zoom(cam: cam2_t, dir: number) {
    cam.scale += cam.zoom_speed * dir;
}

export function cam2_compute_proj(cam: cam2_t, viewport_x: number, viewport_y: number): mat4_t {
    mat4_ident(cam.projection);
    mat4_scale(cam.projection, cam.projection, vec3(cam.scale / viewport_x, cam.scale / viewport_y, 1.0));

    return cam.projection;
}

export function cam2_compute_view(cam: cam2_t): mat4_t {
    mat4_ident(cam.view);
    mat4_translate(cam.view, cam.view, vec3(-cam.position[0], -cam.position[1], 0.0));

    return cam.view;
}

export function cam2_proj_mouse(cam: cam2_t, mouse: vec2_t, viewport_x: number, viewport_y: number): vec2_t {
    const x = mouse[0] / viewport_x * 2.0 - 1.0;
    const y = mouse[1] / viewport_y * -2.0 + 1.0;
    const w = viewport_x / cam.scale;
    const h = viewport_y / cam.scale;

    return vec2(cam.position[0] + x * w, cam.position[1] + y * h);
}
