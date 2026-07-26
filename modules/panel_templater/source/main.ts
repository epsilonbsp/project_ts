import {atan2, clamp, floor, rad} from "@cl/math/math.ts";
import {point_on_line, line2_ab, side_of_line} from "@cl/collision/line2.ts";
import {polygon_from_aabb, polygon_point_inside, polygon_center, polygon_min_max, polgon_line_intersections, intersect_t} from "@cl/collision/polygon.ts";
import {vec2, vec2n_add, vec2n_divs, vec2_len, vec2n_sub, vec2_t} from "@cl/math/vec2.ts";
import {vec2_snap} from "@cl/math/vec2_other.ts";
import {vec3} from "@cl/math/vec3.ts";
import {mm_to_px} from "./unit.ts";
import {UT, gs_object, gui_bool, gui_button, gui_canvas, gui_collapsing_header, gui_input_number, gui_render, gui_select, gui_slider_number, gui_text, gui_update, gui_window, gui_window_grid, gui_window_layout, unit} from "@gui/gui.ts";
import {d2_aabb2, d2_clear_color_vec, d2_init, d2_line2, d2_mouse_pos, d2_polygon, d2_stroke_vec} from "@engine/d2.ts";
import {io_init, io_kb_key_down, io_m_button_down, io_m_move, io_m_wheel_scroll, kb_event_t, m_event_t, m_wheel_event_t} from "@engine/io.ts";

class polygon_t {
    points: vec2_t[];

    constructor(points: vec2_t[]) {
        this.points = points;
    }
};

enum MODE {
    SELECT,
    KNIFE,
    ANCHOR,
    HALF_SPLITTER,
    GRID_SNAPPER
};

const config = {
    width_mm: 210,
    height_mm: 297,
    page_margin_mm: 4,
    panel_margin_mm: 2,
    line_width_mm: 0.5,
    res_dpi: 300,
    angle: 45,
    mode: MODE.SELECT,
    grid_div: 3,
    snap_to_points: false
}

let width_px = mm_to_px(config.width_mm, config.res_dpi)
let height_px = mm_to_px(config.height_mm, config.res_dpi)
let page_margin_px = mm_to_px(config.page_margin_mm, config.res_dpi)
let panel_margin_px = mm_to_px(config.panel_margin_mm, config.res_dpi)
let line_width_px = mm_to_px(config.line_width_mm, config.res_dpi)
let polygons: polygon_t[] = []
let selected_polygon: polygon_t|null = null
let intersections_right: intersect_t[] = []
let intersections_left: intersect_t[] = [];
let mouse = vec2();

// anchor
let min_anchor = Infinity
let anchor_point: vec2_t|null = null
let start_point: vec2_t|null = null

// grid snapper
let selected_aabb: {min: vec2_t, max: vec2_t}|null = null
let position_snapped = vec2();

// colors
const clear_color = vec3(238, 238, 238);
const polygon_color = vec3(34, 34, 34);
const selected_polygon_color = vec3(125, 177, 255);
const knife_color = vec3(255, 197, 82);
const line_color = vec3(0, 255, 255);
const aabb_color = vec3(255, 0, 255);

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

const group = gui_collapsing_header(left, "Settings");

gui_input_number(group, "Width (mm)", gs_object(config, "width_mm"), 0.5, 0.0, 1000.0);
gui_input_number(group, "Height (mm)", gs_object(config, "height_mm"), 0.5, 0.0, 1000.0);
gui_input_number(group, "Resolution (dpi)", gs_object(config, "res_dpi"), 0.5, 0.0, 1000.0);
gui_input_number(group, "Page Margin (mm)", gs_object(config, "page_margin_mm"), 0.5, 0.0, 1000.0);
gui_input_number(group, "Panel Margin (mm)", gs_object(config, "panel_margin_mm"), 0.5, 0.0, 1000.0);
gui_input_number(group, "Line Width (mm)", gs_object(config, "line_width_mm"), 0.5, 0.0, 1000.0);
gui_select(group, "Mode", gs_object(config, "mode"), ["Select", "Knife", "Anchor", "Half Splitter", "Grid Snapper"], [MODE.SELECT, MODE.KNIFE, MODE.ANCHOR, MODE.HALF_SPLITTER, MODE.GRID_SNAPPER])
gui_slider_number(group, "Knife Angle", gs_object(config, "angle"), 1.0, -180.0, 180.0);
gui_slider_number(group, "Grid Divider", gs_object(config, "grid_div"), 1.0, 2.0, 9.0);
gui_bool(group, "Snap To Points", gs_object(config, "snap_to_points"));

gui_button(group, "Reset", () => {
    if (confirm("Are you sure you want to reset?")) {
        reset();
    }
})

gui_button(group, "Export PNG", () => {
    setTimeout(() => {
        const link = document.createElement("a");
        link.download = "Template.png";
        link.href = canvas_el.toDataURL("image/png");
        link.click();
    }, 1000);
});

gui_button(group, "Export SVG", () => {
    let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${ width_px }" height="${ height_px }">\n`;
    out += `<style>polygon { fill: none; stroke: black; stroke-width: ${ line_width_px }; }</style>\n`;

    for (const polygon of polygons) {
        let points_attrib = "";

        for (const point of polygon.points) {;
            points_attrib += point[0] + "," + point[1] + " ";
        }
    
        out += `<polygon points="${ points_attrib }" />`;
    }

    out += "</svg>\n";

    const link = document.createElement("a");
    link.download = "Template.svg";
    link.href = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(out);
    link.click();
})

gui_text(group, `
    Controls:<br>
    F - apply/cut<br>
    R - reset selection<br>
    LMB - select<br>
    scroll - change angle
`);

const canvas = gui_canvas(right, false);

gui_render(root, document.body);

const canvas_el = canvas.canvas_el;
canvas_el.width = width_px;
canvas_el.height = height_px;

if (canvas_el.width < canvas_el.height) {
    canvas_el.style.width = "auto";
    canvas_el.style.height = "100%";
} else {
    canvas_el.style.width = "100%";
    canvas_el.style.height = "auto";
}

d2_init(canvas_el);
io_init();

function reset() {
    width_px = mm_to_px(config.width_mm, config.res_dpi);
    height_px = mm_to_px(config.height_mm, config.res_dpi);
    page_margin_px = mm_to_px(config.page_margin_mm, config.res_dpi);
    panel_margin_px = mm_to_px(config.panel_margin_mm, config.res_dpi);
    line_width_px = mm_to_px(config.line_width_mm, config.res_dpi);

    canvas_el.width = width_px;
    canvas_el.height = height_px;

    if (canvas_el.width < canvas_el.height) {
        canvas_el.style.width = "auto";
        canvas_el.style.height = "100%";
    } else {
        canvas_el.style.width = "100%";
        canvas_el.style.height = "auto";
    }

    polygons = [];
    polygons.push(
        new polygon_t(polygon_from_aabb(vec2(page_margin_px, page_margin_px), vec2(width_px - page_margin_px, height_px - page_margin_px)))
    );
}

function compute_intersections() {
    if (selected_polygon) {
        d2_stroke_vec(selected_polygon_color, line_width_px);
        d2_polygon(selected_polygon.points);

        if (config.mode == MODE.KNIFE) {
            intersections_left = polgon_line_intersections(selected_polygon.points, mouse, rad(config.angle), -panel_margin_px / 2);
            intersections_right = polgon_line_intersections(selected_polygon.points, mouse, rad(config.angle), panel_margin_px / 2);
        } else if (config.mode == MODE.ANCHOR) {
            min_anchor = Infinity;
            anchor_point = null;

            for (let a = 0; a < selected_polygon.points.length; ++a) {
                const p1 = selected_polygon.points[a];
                const p2 = selected_polygon.points[(a + 1) % selected_polygon.points.length];
                const tp = config.snap_to_points ? p1 : point_on_line(line2_ab(p1, p2), mouse);
                const l = vec2_len(vec2n_sub(tp, mouse));

                if (l < min_anchor) {
                    min_anchor = l;
                    anchor_point = tp;
                }
            }

            if (start_point) {
                const d = vec2n_sub(start_point, mouse);
                const angle = atan2(d[1], d[0]);
                intersections_left = polgon_line_intersections(selected_polygon.points, start_point, angle, -panel_margin_px / 2);
                intersections_right = polgon_line_intersections(selected_polygon.points, start_point, angle, panel_margin_px / 2);
            }
        } else if (config.mode == MODE.HALF_SPLITTER) {
            const center = polygon_center(selected_polygon.points);
            intersections_left = polgon_line_intersections(selected_polygon.points, center, rad(config.angle), -panel_margin_px / 2);
            intersections_right = polgon_line_intersections(selected_polygon.points, center, rad(config.angle), panel_margin_px / 2);
        } else if (config.mode == MODE.GRID_SNAPPER) {
            const minmax = selected_aabb || polygon_min_max(selected_polygon.points);
            const size = vec2n_sub(minmax.max, minmax.min);
            const relative = vec2n_sub(mouse, minmax.min);
            position_snapped = vec2n_add(vec2_snap(relative, vec2n_divs(size, config.grid_div), vec2()), minmax.min);

            intersections_left = polgon_line_intersections(selected_polygon.points, position_snapped, rad(config.angle), -panel_margin_px / 2);
            intersections_right = polgon_line_intersections(selected_polygon.points, position_snapped, rad(config.angle), panel_margin_px / 2);
        }
    }
}

function cut(): void {
    if (selected_polygon && intersections_left.length == 2 && intersections_right.length == 2) {
        const index_left_a = intersections_left[0].index;
        const index_left_b = intersections_left[1].index;
        const index_right_a = intersections_right[0].index;
        const index_right_b = intersections_right[1].index;
        const points_left = [];
        const points_right = [];

        for (let a = 0; a < selected_polygon.points.length; ++a) {
            const point = selected_polygon.points[a];
            const l1 = side_of_line(line2_ab(intersections_left[0].point, intersections_left[1].point), point);
            const l2 = side_of_line(line2_ab(intersections_right[0].point, intersections_right[1].point), point);

            if (floor(l1 + l2) > panel_margin_px) {
                if (l1 < l2) {
                    points_left.push(point);
                } else {
                    points_right.push(point);
                }
            }

            if (a == index_left_a) {
                points_left.push(intersections_left[0].point);
            }

            if (a == index_left_b) {
                points_left.push(intersections_left[1].point);
            }

            if (a == index_right_a) {
                points_right.push(intersections_right[0].point);
            }

            if (a == index_right_b) {
                points_right.push(intersections_right[1].point);
            }
        }

        polygons.push(new polygon_t(points_left));
        polygons.push(new polygon_t(points_right));
        polygons.splice(polygons.indexOf(selected_polygon), 1);
        selected_polygon = null;
        intersections_left = [];
        intersections_right = [];
    }
}

io_m_move(function(event: m_event_t): void {
    if (event.target === canvas_el) {
        mouse = d2_mouse_pos(event.x, event.y);

        if (selected_polygon) {
            if (!polygon_point_inside(selected_polygon.points, mouse)) {
                selected_polygon = null;
            }
        } else {
            for (const polygon of polygons) {
                if (polygon_point_inside(polygon.points, mouse)) {
                    selected_polygon = polygon;
                }
            }
        }

        compute_intersections();
    } else {
        selected_polygon = null;
    }
});

io_m_button_down(function(): void {
    if (config.mode == MODE.GRID_SNAPPER && selected_polygon) {
        selected_aabb = polygon_min_max(selected_polygon.points);
    }
});

io_m_wheel_scroll(function(event: m_wheel_event_t): void {
    if (config.mode != MODE.SELECT) {
        config.angle = clamp(config.angle + event.yd * 5, -180.0, 180.0);

        compute_intersections();
    }
});

io_kb_key_down(function(event: kb_event_t): void {
    if (config.mode == MODE.SELECT) {
        if (event.code == "Delete") {
            if (selected_polygon) {
                polygons.splice(polygons.indexOf(selected_polygon), 1);
                selected_polygon = null;
            }
        }
    } else if (config.mode == MODE.ANCHOR) {
        if (event.code == "KeyF") {
            if (!start_point) {
                if (anchor_point) {
                    start_point = anchor_point;
                    compute_intersections();
                }
            } else {
                cut();
                start_point = null;
            }
        }
    } else if (config.mode == MODE.KNIFE) {
        if (event.code == "KeyF") {
            cut();
        }
    } else if (config.mode == MODE.HALF_SPLITTER) {
        if (event.code == "KeyF") {
            cut();
        }
    } else if (config.mode == MODE.GRID_SNAPPER) {
        if (event.code == "KeyF") {
            cut();
        }
    }

    if (event.code == "KeyR") {
        selected_aabb = null;
    }
});

function render_knife(): void {
    if (intersections_left.length == 2 && intersections_right.length == 2) {
        d2_stroke_vec(knife_color, line_width_px);
        d2_line2(intersections_left[0].point, intersections_left[1].point);
        d2_stroke_vec(knife_color, line_width_px);
        d2_line2(intersections_right[0].point, intersections_right[1].point);
    }
}

function render(): void {
    d2_clear_color_vec(clear_color);

    for (const polygon of polygons) {
        d2_stroke_vec(polygon_color, line_width_px);
        d2_polygon(polygon.points);
    }

    if (selected_polygon) {
        d2_stroke_vec(selected_polygon_color, line_width_px);
        d2_polygon(selected_polygon.points);

        if (config.mode == MODE.KNIFE) {
            render_knife();
        } else if (config.mode == MODE.ANCHOR) {
            if (start_point) {
                render_knife();
            } else {
                if (anchor_point) {
                    d2_stroke_vec(line_color, line_width_px);
                    d2_line2(anchor_point, mouse);
                }
            }
        } else if (config.mode == MODE.HALF_SPLITTER) {
            render_knife();
        } else if (config.mode == MODE.GRID_SNAPPER) {
            d2_stroke_vec(line_color, line_width_px);
            d2_line2(position_snapped, mouse)
            render_knife();
        }
    }

    if (selected_aabb) {
        d2_stroke_vec(aabb_color, line_width_px);
        d2_aabb2(selected_aabb.min, selected_aabb.max);
    }

    requestAnimationFrame(render)
}

reset();

setInterval(function() {
    gui_update(root);
}, 1000.0 / 30.0);

render();
