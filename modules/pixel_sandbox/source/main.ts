import {gl_init, gl_link_program} from "@engine/gl.ts";
import {io_init, io_kb_key_down, io_m_button_down, io_m_button_up, io_m_move, io_m_wheel_scroll, kb_event_t, m_event_t, m_wheel_event_t} from "@engine/io.ts";
import {vec2, vec2_set} from "@cl/math/vec2.ts";
import {clamp} from "@cl/math/math.ts";
import {UT, get_enum_keys, get_enum_values, gs_object, gui_bool, gui_button, gui_canvas, gui_collapsing_header, gui_radio_group, gui_reload_component, gui_render, gui_slider_number, gui_update, gui_window, gui_window_grid, gui_window_layout, unit} from "@gui/gui.ts";
import {grid_clear, grid_color, grid_new, grid_paint, grid_update} from "./grid.ts";
import { element_air, element_dense_sand, element_empty, element_fire, element_oil, element_sand, element_stone, ELEMENT_TYPE, element_water, element_wood } from "./types.ts";

const root = gui_window(null);
gui_window_grid(
    root,
    [unit(300, UT.PX), unit(1, UT.FR), unit(300, UT.PX)],
    [unit(1, UT.FR), unit(1, UT.FR), unit(1, UT.FR)]
);

const left = gui_window(root);
const right = gui_window(root);
gui_window_layout(
    root,
    [
        left, right, right,
        left, right, right,
        left, right, right
    ]
);

const canvas = gui_canvas(right, false);

gui_render(root, document.body);

const parent_el = right.ref_el;
const canvas_el = canvas.canvas_el;
let canvas_size = parent_el.clientWidth < parent_el.clientHeight ? parent_el.clientWidth : parent_el.clientHeight;
canvas_el.width = canvas_el.height = canvas_size;

addEventListener("resize", function(): void {
    canvas_size = parent_el.clientWidth < parent_el.clientHeight ? parent_el.clientWidth : parent_el.clientHeight;
    canvas_el.width = canvas_el.height = canvas_size;
});

const gl = gl_init(canvas_el);

const program_main = gl_link_program({
    [gl.VERTEX_SHADER]: `#version 300 es
        out vec2 v_tex_coord;

        const vec2 positions[4] = vec2[](
            vec2(-1.0, 1.0),
            vec2(-1.0, -1.0),
            vec2(1.0, 1.0),
            vec2(1.0, -1.0)
        );

        const vec2 tex_coords[4] = vec2[](
            vec2(0.0, 0.0),
            vec2(0.0, 1.0),
            vec2(1.0, 0.0),
            vec2(1.0, 1.0)
        );

        void main() {
            gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
            v_tex_coord = tex_coords[gl_VertexID];
        }
    `,
    [gl.FRAGMENT_SHADER]: `#version 300 es
        precision highp float;
        out vec4 o_frag_color;
        in vec2 v_tex_coord;
        uniform sampler2D u_texture;

        void main() {
            o_frag_color = vec4(texture(u_texture, v_tex_coord).xyz, 1.0);
        }
    `
}) as WebGLProgram;

const grid = grid_new(256, 256);

const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, grid.width, grid.height, 0, gl.RGB, gl.UNSIGNED_BYTE, grid.buffer);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

const mouse_pos = vec2();
let is_mouse_down = false;

const elements = {
    [ELEMENT_TYPE.EMPTY]: element_empty(0),
    [ELEMENT_TYPE.STONE]: element_stone(0),
    [ELEMENT_TYPE.WOOD]: element_wood(0),
    [ELEMENT_TYPE.SAND]: element_sand(0),
    [ELEMENT_TYPE.DENSE_SAND]: element_dense_sand(0),
    [ELEMENT_TYPE.WATER]: element_water(0),
    [ELEMENT_TYPE.OIL]: element_oil(0),
    [ELEMENT_TYPE.AIR]: element_air(0),
    [ELEMENT_TYPE.FIRE]: element_fire(0)
}

const config = {
    element: ELEMENT_TYPE.SAND,
    size: 1,
    is_paused: false
};

io_init();

io_m_button_down(function(event: m_event_t): void {
    if (event.target !== canvas_el) {
        return;
    }

    if (event.button === 0) {
        is_mouse_down = true;
    }
});

io_kb_key_down(function(event: kb_event_t): void {
    if (event.code === "KeyR") {
        grid_clear(grid, element_empty(0));
    }

    if (event.code === "Space") {
        config.is_paused = !config.is_paused;
        gui_update(left);
    }
});

io_m_move(function(event: m_event_t): void {
    if (event.target === canvas_el) {
        vec2_set(mouse_pos, event.x, event.y);
    }
});

io_m_button_up(function(event: m_event_t): void {
    if (event.button === 0) {
        is_mouse_down = false;
    }
});

io_m_wheel_scroll(function(event: m_wheel_event_t): void {
    config.size = clamp(config.size - event.yd, 1, 32);
    gui_update(left);
});

function update(): void {
    if (is_mouse_down) {
        const x = Math.floor(mouse_pos[0] / canvas_el.width * grid.width);
        const y = Math.floor(mouse_pos[1] / canvas_el.height * grid.height);
        grid_paint(grid, elements[config.element], x, y, config.size);
    }

    if (!config.is_paused) {
        grid_update(grid);
    }
}

function render(): void {
    gl.viewport(0, 0, canvas_el.width, canvas_el.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    grid_color(grid);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, grid.width, grid.height, 0, gl.RGB, gl.UNSIGNED_BYTE, grid.buffer);
    gl.useProgram(program_main);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function loop(): void {
    update();
    render();

    requestAnimationFrame(loop);
}

loop();

const general_ch = gui_collapsing_header(left, "General");

gui_slider_number(general_ch, "Brush Size", gs_object(config, "size"), 1, 1, 32);
gui_bool(general_ch, "Is Paused", gs_object(config, "is_paused"));
gui_button(general_ch, "Reset", function() {
    grid_clear(grid, element_empty(0));
});

const elements_ch = gui_collapsing_header(left, "Elements");
gui_radio_group(elements_ch, "Element", gs_object(config, "element"), get_enum_keys(ELEMENT_TYPE), get_enum_values(ELEMENT_TYPE));

gui_reload_component(left);
