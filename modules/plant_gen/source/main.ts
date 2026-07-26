import {gl_init, gl_link_program} from "@engine/gl.ts";
import {cam2_compute_proj, cam2_compute_view, cam2_move_right, cam2_move_up, cam2_new} from "@cl/camera/cam2.ts";
import {io_init, io_key_down} from "@engine/io.ts";
import {vec2, vec2n_addmuls, vec2_copy, vec2n_dir, vec2_t} from "@cl/math/vec2";
import {lsys_add_callback, lsys_add_rule, lsys_gen, lsys_new} from "./lsys.ts";
import {vec4, vec4_copy} from "@cl/math/vec4.ts";
import {COLOR_MODE, UT, group_t, gs_object, gui_button, gui_canvas, gui_collapsing_header, gui_color_edit, gui_group, gui_input_number, gui_input_text, gui_input_vec, gui_reload_component, gui_render, gui_select, gui_slider_number, gui_text, gui_update, gui_window, gui_window_grid, gui_window_layout, unit} from "@gui/gui.ts";
import {LEAF_TYPE, PRESETS} from "./presets.ts";
import {gen_circle, gen_line, gen_line_kite, gen_obb, gen_star, poly_data_t} from "@cl/geometry/triangulation2.ts";

const canvas_el = document.createElement("canvas");
const gl = gl_init(canvas_el);

const program = gl_link_program({
    [gl.VERTEX_SHADER]: `#version 300 es
        layout(location = 0) in vec3 i_position;
        layout(location = 1) in int i_color;
        uniform mat4 u_projection;
        uniform mat4 u_view;
        flat out int v_color;

        void main() {
            gl_Position = u_projection * u_view * vec4(i_position, 1.0);
            v_color = i_color;
        }
    `,
    [gl.FRAGMENT_SHADER]: `#version 300 es
        precision highp float;
        flat in int v_color;
        out vec4 o_frag_color;

        vec4 unpack256(int packed) {
            return vec4(
                (packed >> 24) & 0xFF,
                (packed >> 16) & 0xFF,
                (packed >> 8) & 0xFF,
                packed & 0xFF
            ) / 255.0;
        }

        void main() {
            o_frag_color = unpack256(v_color);
        }
    `
}) as WebGLProgram;

const u_projection = gl.getUniformLocation(program, "u_projection")!;
const u_view = gl.getUniformLocation(program, "u_view")!;

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, null, gl.STATIC_DRAW);

gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 16, 0);

gl.enableVertexAttribArray(1);
gl.vertexAttribIPointer(1, 1, gl.INT, 16, 12);

const ibo = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, null, gl.STATIC_DRAW);

let config = {
    input: "",
    iter: 0,
    preset: 0,
    rule_key: "",
    rule_content: "",
    rules: {} as {[key: string]: string},
    branch_color: vec4(255),
    leaf_color: vec4(255),
    flower_inner_color: vec4(255),
    flower_outer_color: vec4(255),
    leaf_size: vec2(1.0),
    leaf_ratio: 0.5,
    leaf_type: LEAF_TYPE.BOX,
    flower_inner_radius: 1.0,
    flower_outer_radius: 2.0
};

const lsys = lsys_new(vec2(0.0, -100.0), 90.0, 20.0, 40.0);
lsys.delta_angle = 20.0;

const poly_data = new poly_data_t();
poly_data.vertices = [];
poly_data.indices = [];
poly_data.stride = 4;
let index_count = poly_data.indices.length;

lsys_add_callback(lsys, "L", function(start: vec2_t, w0: number, end: vec2_t, w1: number): void {
    if (config.leaf_type === LEAF_TYPE.BOX) {
        gen_obb(start, config.leaf_size, Math.random(), -0.2, config.leaf_color, poly_data);
    } else {
        gen_line_kite(start, vec2n_addmuls(start, vec2n_dir(end, start), config.leaf_size[1]), config.leaf_size[0], config.leaf_ratio, -0.2, config.leaf_color, poly_data);
    }
});

lsys_add_callback(lsys, "J", function(start: vec2_t, w0: number, end: vec2_t, w1: number): void {
    gen_star(end, config.flower_outer_radius, config.flower_outer_radius * 0.8, 10, -0.1, config.flower_outer_color, poly_data);
    gen_circle(end, config.flower_inner_radius, 6, -0.2, config.flower_inner_color, poly_data);
});

lsys_add_callback(lsys, "F", function(start: vec2_t, w0: number, end: vec2_t, w1: number): void {
    gen_line(start, w0, end, w1, 0.0, config.branch_color, poly_data)
});

function load_preset(id: number): void {
    const preset = PRESETS[id];
    config.input = preset.input;
    config.iter = preset.iter;
    vec4_copy(config.branch_color, preset.branch_color);
    vec4_copy(config.leaf_color, preset.leaf_color);
    vec4_copy(config.flower_inner_color, preset.flower_inner_color);
    vec4_copy(config.flower_outer_color, preset.flower_outer_color);
    config.leaf_type = preset.leaf_type;
    vec2_copy(config.leaf_size, preset.leaf_size);
    config.leaf_ratio = preset.leaf_ratio;
    config.flower_inner_radius = preset.flower_inner_radius;
    config.flower_outer_radius = preset.flower_outer_radius;


    lsys.angle = preset.angle;
    lsys.delta_angle = preset.delta_angle;
    lsys.length = preset.length;
    lsys.width = preset.width;
    lsys.changer_length.type = preset.length_changer_type;
    lsys.changer_length.param = preset.length_changer_param;
    lsys.changer_width.type = preset.width_changer_type;
    lsys.changer_width.param = preset.width_changer_param;
    vec2_copy(lsys.position, preset.position);

    config.rules = {};

    for (const key in preset.rules) {
        const value = preset.rules[key];
        config.rules[key] = value;
    }
}

load_preset(config.preset);

function generate(): void {
    poly_data.vertices = [];
    poly_data.indices = [];
    lsys.rules = {};

    for (const key in config.rules) {
        const value = config.rules[key];

        lsys_add_rule(lsys, key, value);
    }

    lsys_gen(lsys, config.input, config.iter);

    const vertices = poly_data.vertices;
    const indices = poly_data.indices;

    const buffer = new ArrayBuffer(vertices.length * 4);
    const view = new DataView(buffer);

    for (let i = 0; i < vertices.length; i += 4) {
        view.setFloat32(i * 4, vertices[i], true);
        view.setFloat32(i * 4 + 4, vertices[i + 1], true);
        view.setFloat32(i * 4 + 8, vertices[i + 2], true);
        view.setInt32(i * 4 + 12, vertices[i + 3], true);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

    index_count = indices.length;
}

function add_rule(): void {
    if (/^[a-zA-Z]$/.test(config.rule_key) && /^[a-zA-Z+-]+$/.test(config.rule_content)) {
        config.rules[config.rule_key] = config.rule_content;
    }
}

function clear_rules(): void {
    config.rules = {};
    rule_group.children = [];
}

const camera = cam2_new();
camera.scale = 10.0;
camera.movement_speed = 2.0;

io_init();

function update() {
    if (io_key_down("KeyA")) {
        cam2_move_right(camera, -1.0);
    }

    if (io_key_down("KeyD")) {
        cam2_move_right(camera, 1.0);
    }

    if (io_key_down("KeyS")) {
        cam2_move_up(camera, -1.0);
    }

    if (io_key_down("KeyW")) {
        cam2_move_up(camera, 1.0);
    }

    if (io_key_down("KeyQ")) {
        camera.scale -= 0.1;
    }

    if (io_key_down("KeyE")) {
        camera.scale += 0.1;
    }

    cam2_compute_proj(camera, canvas_el.width, canvas_el.height);
    cam2_compute_view(camera);
}

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.BLEND)
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

function render(): void {
    gl.viewport(0, 0, canvas_el.width, canvas_el.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniformMatrix4fv(u_projection, false, camera.projection);
    gl.uniformMatrix4fv(u_view, false, camera.view);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, index_count, gl.UNSIGNED_INT, 0);
}

function loop(): void {
    update();
    render();

    requestAnimationFrame(loop);
}

loop();

// gui
const preset_names = PRESETS.map(preset => preset.name);
const preset_values = Object.keys(PRESETS).map(v => parseInt(v));

const changer_type_labels = [
    "NONE",
    "LINEAR",
    "GEOMETRIC",
    "EXPONENTIAL"
];
const changer_type_values = Object.keys(changer_type_labels).map(v => parseInt(v));

const leaf_type_labels = [
    "BOX",
    "KITE"
];
const leaf_type_values = Object.keys(leaf_type_labels).map(v => parseInt(v));

// root
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

let rule_group: group_t;

function reload_rule_group() {
    rule_group.children = [];

    for (const key in config.rules) {
        gui_input_text(rule_group, key, gs_object(config.rules, key));
    }

    gui_reload_component(rule_group);
}

// info
const info_ch = gui_collapsing_header(left, "Info", true);
gui_text(info_ch, `
<pre>
Camera controls:
    WASD - Move
    Q/E - Zoom In/Out
Language:
    "f" - Move forward
    "F" - Move forward and draw
    "-" - Rotate CCW
    "+" - Rotate CW
    "L" - Draw leaf
    "J" - Draw flower

For rules use single character names like "X"
</pre>
`);

// presets
const presets_ch = gui_collapsing_header(left, "Presets");

gui_select(presets_ch, "Preset", gs_object(config, "preset"), preset_names, preset_values, function(value: number) {
    load_preset(value);
    reload_rule_group();
    gui_update(left);
});


// settings
const settings_ch = gui_collapsing_header(left, "Settings");
gui_input_vec(settings_ch, "Start Position", lsys.position, 1.0, -100.0, 100.0, 2);
gui_slider_number(settings_ch, "Start Angle", gs_object(lsys, "angle"), 1.0, -180.0, 180.0);
gui_input_number(settings_ch, "Start Width", gs_object(lsys, "width"), 0.1, 0.1, 100.0);
gui_input_number(settings_ch, "Start Length", gs_object(lsys, "length"), 0.1, 0.1, 100.0);
gui_select(settings_ch, "Width Change Type",gs_object(lsys.changer_width, "type"), changer_type_labels, changer_type_values)
gui_input_number(settings_ch, "Width Change Param", gs_object(lsys.changer_width, "param"), 0.1, -100.0, 100.0);
gui_select(settings_ch, "Length Change Type", gs_object(lsys.changer_length, "type"), changer_type_labels, changer_type_values)
gui_input_number(settings_ch, "Length Change Param", gs_object(lsys.changer_length, "param"), 0.1, -100.0, 100.0);
gui_select(settings_ch, "Leaf Type", gs_object(config, "leaf_type"), leaf_type_labels, leaf_type_values);
gui_input_vec(settings_ch, "Leaf Size", config.leaf_size, 0.1, 0.1, 100.0, 2);
gui_slider_number(settings_ch, "Leaf Ratio", gs_object(config, "leaf_ratio"), 0.05, 0.0, 1.0);
gui_color_edit(settings_ch, "Branch Color", COLOR_MODE.R_0_255, config.branch_color);
gui_color_edit(settings_ch, "Leaf Color", COLOR_MODE.R_0_255, config.leaf_color);
gui_color_edit(settings_ch, "Flower Inner Color", COLOR_MODE.R_0_255, config.flower_inner_color);
gui_color_edit(settings_ch, "Flower Outer Color", COLOR_MODE.R_0_255, config.flower_outer_color);

// rules
const rules_ch = gui_collapsing_header(left, "Rules");
gui_input_text(rules_ch, "Rule Key", gs_object(config, "rule_key"));
gui_input_text(rules_ch, "Rule Value", gs_object(config, "rule_content"));

gui_button(rules_ch, "Add rule", function() {
    add_rule();
    reload_rule_group();
});

gui_button(rules_ch, "Clear rules", function() {
    clear_rules();
    reload_rule_group();
});

gui_text(rules_ch, "Rules:");
rule_group = gui_group(rules_ch);
reload_rule_group();

// generation
const generation_ch = gui_collapsing_header(left, "Generation");
gui_input_text(generation_ch, "Input", gs_object(config, "input"));
gui_slider_number(generation_ch, "Iterations", gs_object(config, "iter"), 1, 1, 10);
gui_button(generation_ch, "Generate", generate);

// canvas
const canvas = gui_canvas(right, true);
canvas.canvas_el = canvas_el;

gui_render(root, document.body);
