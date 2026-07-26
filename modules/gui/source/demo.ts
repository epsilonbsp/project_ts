import {COLOR_MODE, UT, gs_object, gui_bool, gui_button, gui_canvas, gui_checkbox_group, gui_collapsing_header, gui_color_edit, gui_group, gui_input_number, gui_input_text, gui_input_vec, gui_radio_group, gui_render, gui_select, gui_slider_number, gui_text, gui_update, gui_window, gui_window_grid, gui_window_layout, unit, vec_t} from "./gui.ts";

const test = {
    input_number: 0.0,
    slider_number: 5.0,
    input_vec2: [1.0, 2.0],
    input_vec3: [1.0, 2.0, 3.0],
    input_vec4: [1.0, 2.0, 3.0, 4.0],
    input_mat2: [1.0, 0.0, 0.0, 1.0],
    input_mat3: [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0],
    input_mat4: [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0],
    color_edit3: [0.4, 0.2, 0.2],
    color_edit4:[0.2, 0.4, 0.6, 0.5],
    radio: "option_a",
    checkbox: ["option_a"],
    select: 0,
    input_text: "Input Text",
    bool: false,
    cond_select: 0
};

// setup windows
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

// canvas
const canvas = gui_canvas(right);

gui_render(root, document.body);

const canvas_el = canvas.canvas_el;
const d2 = canvas_el.getContext("2d") as CanvasRenderingContext2D;

// numerical inputs
const numerical_inputs = gui_collapsing_header(left, "Numerical Inputs", false);
gui_input_number(numerical_inputs, "Input Number", gs_object(test, "input_number"), 1.0, 0.0, 10.0, function(value: number): void {
    console.log(value);
});
gui_slider_number(numerical_inputs, "Slider Number", gs_object(test, "slider_number"), 1.0, 0.0, 10.0, function(value: number): void {
    console.log(value);
});
gui_input_vec(numerical_inputs, "Input Vec2", test.input_vec2, 1.0, 0.0, 10.0, 2.0, function(value: vec_t): void {
    console.log(value);
});
gui_input_vec(numerical_inputs, "Input Vec3", test.input_vec3, 1.0, 0.0, 10.0, 3.0, function(value: vec_t): void {
    console.log(value);
});
gui_input_vec(numerical_inputs, "Input Vec4", test.input_vec4, 1.0, 0.0, 10.0, 4.0, function(value: vec_t): void {
    console.log(value);
});
gui_input_vec(numerical_inputs, "Input Mat2", test.input_mat2, 1.0, 0.0, 10.0, 2.0, function(value: vec_t): void {
    console.log(value);
});
gui_input_vec(numerical_inputs, "Input Mat3", test.input_mat3, 1.0, 0.0, 10.0, 3.0, function(value: vec_t): void {
    console.log(value);
});
gui_input_vec(numerical_inputs, "Input Mat4", test.input_mat4, 1.0, 0.0, 10.0, 4.0, function(value: vec_t): void {
    console.log(value);
});

// colors edits
const colors = gui_collapsing_header(left, "Color Edits", false);
gui_text(colors, "Colors");
gui_color_edit(colors, "Color Edit3", COLOR_MODE.R_0_1, test.color_edit3, function(value: vec_t): void {
    console.log(value);
});
gui_color_edit(colors, "Color Edit4", COLOR_MODE.R_0_1, test.color_edit4, function(value: vec_t): void {
    console.log(value);
});

// combos
const combos = gui_collapsing_header(left, "Combos", false);
gui_radio_group(combos, "Radio", gs_object(test, "radio"), ["Options A", "Options B", "Options C"], ["option_a", "option_b", "option_c"], function(value: any): void {
    console.log(value);
});
gui_checkbox_group(combos, "Checkbox", gs_object(test, "checkbox"), ["Options A", "Options B", "Options C"], ["option_a", "option_b", "option_c"], function(value: any): void {
    console.log(value);
});
gui_select(combos, "Select", gs_object(test, "select"), ["Options A", "Options B", "Options C"], [0, 1, 2], function(value: any): void {
    console.log(value);
});

// other inputs
const other_inputs = gui_collapsing_header(left, "Other Inputs", false);
gui_bool(other_inputs, "Bool", gs_object(test, "bool"), function(value: boolean): void {
    console.log(value);
});
gui_input_text(other_inputs, "Input Text", gs_object(test, "input_text"), function(value: string): void {
    console.log(value);
});
gui_button(other_inputs, "Button", function(): void {
    console.log("Button onclick");
});

// conditional rendering
const conditional_rendering = gui_collapsing_header(left, "Conditional Rendering", false);
const g1 = gui_group(conditional_rendering);

const select = gui_select(g1, "Select", gs_object(test, "cond_select"), ["Options A", "Options B"], [0, 1], function(): void {
    gui_update(g1);
});

const g2 = gui_group(g1, function(): boolean {
    return select.value.get() === 0;
});

gui_text(g2, "Group 1 content");

const g3 = gui_group(g1, function(): boolean {
    return select.value.get() === 1;
});

gui_text(g3, "Group 2 content");

gui_render(left, root.container(), false);

setInterval(() => {
    gui_update(root);
}, 1000 / 30);

function render() {
    d2.fillStyle = "#b2c9db";
    d2.fillRect(0, 0, canvas_el.width, canvas_el.height);
    requestAnimationFrame(render);
}

render();
