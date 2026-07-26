
import {frand_in} from "@cl/math/rand.ts";
import {vec2, vec2n_add, vec2_copy, vec2_set, vec2n_sub, vec2n_dir, vec2_dist, vec2m_muls, vec2m_add} from "@cl/math/vec2.ts";
import {vec4} from "@cl/math/vec4.ts";
import {point_inside_circle} from "@cl/collision/collision2.ts";
import {cam2_compute_proj, cam2_compute_view, cam2_move_right, cam2_move_up, cam2_new, cam2_proj_mouse, cam2_zoom} from "@cl/camera/cam2.ts";
import {io_init, io_kb_key_down, io_key_down, io_m_button_down, io_m_button_up, io_m_move, kb_event_t, m_event_t} from "@engine/io.ts";
import {create_canvas} from "@engine/canvas.ts";
import {gl_init} from "@engine/gl.ts";
import {circle_rdata_build, circle_rdata_instance, circle_rdata_new, circle_rend_build, circle_rend_init, circle_rend_render} from "@engine/circle_rend.ts";
import {ball_integrate, ball_new, ball_t, ball_sap} from "./ball.ts";
import {field_rdata_instance, field_rdata_new, field_rend_init, field_rend_new, field_rend_render} from "./field_rend.ts";
import {clamp} from "@cl/math/math.ts";

io_init();

const canvas_el = create_canvas(document.body);
const gl = gl_init(canvas_el);

const cam = cam2_new();
cam.movement_speed = 0.2;
cam.zoom_speed = 0.2;

const ball_cap = 256;
const ball_count = 256;
const area = 64.0;
const balls: ball_t[] = [];

function generate_balls() {
    for (let i = balls.length; balls.length < ball_count; i += 1) {
        const position = vec2(frand_in(-area, area), frand_in(-area, area));
        const mass = frand_in(1.0, 100.0);
        const density = 10.0;

        balls.push(ball_new(position, mass, density));
    }
}

generate_balls();

const mouse_pos = vec2();

let drag_flag = false;
let drag_ball: ball_t|null = null;
const drag_pos = vec2();

circle_rend_init();

const circle_rdata = circle_rdata_new();
circle_rdata_build(circle_rdata, ball_cap);

circle_rend_build(circle_rdata);

const lod = 1;
const field_rend = field_rend_new(Math.trunc(canvas_el.width / 2), Math.trunc(canvas_el.height / lod));
field_rend_init(field_rend);

const field_rdata = field_rdata_new(ball_cap);

let time = 0.0;
let last_time = 0.0;
let delta_time = 0.0;

gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

io_m_move(function(event: m_event_t): void {
    vec2_set(mouse_pos, event.x, event.y);

    const point = cam2_proj_mouse(cam, mouse_pos, canvas_el.width, canvas_el.height);

    if (drag_flag && drag_ball) {
        vec2_copy(drag_ball.position, vec2n_add(drag_ball.drag_pos, vec2n_sub(point, drag_pos)));
    }
});

io_m_button_down(function(event: m_event_t): void {
    vec2_set(mouse_pos, event.x, event.y);

    const point = cam2_proj_mouse(cam, mouse_pos, canvas_el.width, canvas_el.height);

    for (const ball of balls) {
        if (point_inside_circle(ball.position, ball.radius, point)) {
            drag_ball = ball;

            break;
        }
    }

    if (drag_ball) {
        drag_flag = true;
        vec2_copy(drag_pos, point);
        vec2_copy(drag_ball.drag_pos, drag_ball.position);
    }
});

io_m_button_up(function(event: m_event_t): void {
    vec2_set(mouse_pos, event.x, event.y);

    drag_flag = false;
    drag_ball = null;
});

io_kb_key_down(function(event: kb_event_t): void {
    if (event.code === "KeyR") {
        generate_balls();
    }
});

function update(): void {
    if (io_key_down("KeyA")) {
        cam2_move_right(cam, -1.0);
    }

    if (io_key_down("KeyD")) {
        cam2_move_right(cam, 1.0);
    }

    if (io_key_down("KeyS")) {
        cam2_move_up(cam, -1.0);
    }

    if (io_key_down("KeyW")) {
        cam2_move_up(cam, 1.0);
    }

    if (io_key_down("KeyQ")) {
        cam2_zoom(cam, -1.0);
        cam.scale = clamp(cam.scale, 10.0, 300.0);
    }

    if (io_key_down("KeyE")) {
        cam2_zoom(cam, 1.0);
        cam.scale = clamp(cam.scale, 10.0, 300.0);
    }

    cam2_compute_proj(cam, canvas_el.width, canvas_el.height);
    cam2_compute_view(cam);

    ball_sap(balls, true);

    for (let i = 0; i < balls.length; i += 1) {
        const ball0 = balls[i];

        for (let j = i + 1; j < balls.length; j += 1) {
            const ball1 = balls[j];

            const d = vec2_dist(ball0.position, ball1.position) + 0.001;
            const g = 1.0;
            const m = (ball0.mass * ball1.mass);
            const f = g * m / (d * d);
            const dir = vec2n_dir(ball1.position, ball0.position);

            vec2m_muls(dir, f);
            vec2m_add(ball0.force, dir);

            vec2m_muls(dir, -1.0);
            vec2m_add(ball1.force, dir);
        }
    }

    for (let i = 0; i < balls.length; i += 1) {
        const ball = balls[i];

        circle_rdata_instance(
            circle_rdata,
            i,
            ball.position,
            ball.radius,
            0.0,
            vec4(84, 84, 84, 255),
            vec4(219, 219, 219, 255),
            0.2
        );

        field_rdata_instance(
            field_rdata,
            i,
            ball.position,
            ball.radius,
            ball.mass
        );

        ball_integrate(ball, delta_time / 1000.0);
    }
}

function render(): void {
    gl.viewport(0, 0, canvas_el.width, canvas_el.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    field_rdata.len = balls.length;
    field_rend_render(field_rend, field_rdata, cam);

    circle_rdata.len = balls.length;
    circle_rend_render(circle_rdata, cam);
}

function loop(): void {
    time = performance.now() / 1000.0;
    delta_time = last_time / time;
    last_time = time;

    update();
    render();

    requestAnimationFrame(loop);
}

loop();
