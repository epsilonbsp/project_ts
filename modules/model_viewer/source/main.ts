import {create_canvas} from "@engine/canvas.ts";
import {vertex_hash6} from "./model_loader.ts";
import {gl_init} from "@engine/gl.ts";
import {model_rdata_build, model_rdata_new, model_rdata_texture, model_rend_new, model_rend_render} from "./model_rend.ts";
import {cam3_compute_proj, cam3_compute_view, cam3_fru, cam3_move_forward, cam3_move_right, cam3_new, cam3_pan, cam3_tilt} from "@cl/camera/cam3.ts";
import {mat4} from "@cl/math/mat4.ts";
import {io_init, io_kb_key_down, io_key_down, io_m_move, kb_event_t, m_event_t} from "@engine/io.ts";

io_init();

const canvas_el = create_canvas(document.body);
const gl = gl_init(canvas_el);

const model = mat4(1.0);
const camera = cam3_new();

const model_rend = model_rend_new();
const model_rdata = model_rdata_new();
let is_loaded = false;

function load_obj(result: string): void {
    const positions_temp: number[] = [];
    const normals_temp: number[] = [];
    const tex_coords_temp: number[] = [];

    const vertex_map: {[key: string]: number} = {};
    let index = 0;

    const vertices: number[] = [];
    const indices: number[] = [];

    const lines = result.split(/\r?\n/);

    for (const line of lines) {
        if (line.startsWith("#")) {
            continue;
        }

        const parts = line.split(" ");

        switch (parts[0]) {
            case "v":
                for (let i = 1; i < parts.length; i += 1) {
                    const value = parseFloat(parts[i]);

                    positions_temp.push(value);
                }

                break;
            case "vn":
                for (let i = 1; i < parts.length; i += 1) {
                    const value = parseFloat(parts[i]);

                    normals_temp.push(value);
                }

                break;
            case "vt":
                for (let i = 1; i < parts.length; i += 1) {
                    const value = parseFloat(parts[i]);

                    tex_coords_temp.push(value);
                }

                break;
            case "f":
                for (let i = 1; i < parts.length; i += 1) {
                    const obj_indices = parts[i].split("/");
                    const position_index = parseInt(obj_indices[0], 10) - 1;
                    const normal_index = parseInt(obj_indices[2], 10) - 1;
                    const tex_coord_index = parseInt(obj_indices[1], 10) - 1;

                    const vx = positions_temp[position_index * 3];
                    const vy = positions_temp[position_index * 3 + 1];
                    const vz = positions_temp[position_index * 3 + 2];

                    const nx = normals_temp[normal_index * 3];
                    const ny = normals_temp[normal_index * 3 + 1];
                    const nz = normals_temp[normal_index * 3 + 2];

                    const tx = tex_coords_temp[tex_coord_index * 2];
                    const ty = tex_coords_temp[tex_coord_index * 2 + 1];

                    const hash = vertex_hash6(vx, vy, vz, nx, ny, nz);
                    // const hash = vertex_hash3(vx, vy, vz);

                    const vertex_index = vertex_map[hash];

                    if (vertex_index !== undefined) {
                        indices.push(vertex_index);
                    } else {
                        vertices.push(vx, vy, vz, nx, ny, nz, tx, ty);
                        indices.push(index);

                        vertex_map[hash] = index;
                        index += 1;
                    }
                }

                break;
        }
    }

    model_rdata_build(model_rdata, vertices, indices);
    is_loaded = true;
}

function load_png(): void {

}

canvas_el.ondragover = function(event: DragEvent): void {
    event.preventDefault();
}

function find_file(files: FileList, regex: RegExp): File|null {
    let obj_file: File|null = null;

    for (const file of files) {
        if (regex.test(file.name.toLowerCase())) {
            obj_file = file;

            break;
        }
    }

    return obj_file;
}

canvas_el.ondrop = function(event: DragEvent): void {
    event.preventDefault();

    const data_transfer = event.dataTransfer;

    if (!data_transfer) {
        return;
    }

    const files = data_transfer.files;
    const obj_file = find_file(files, /.obj$/);

    if (obj_file) {
        const reader = new FileReader();

        reader.onload = function(): void {
            const result = reader.result;

            if (!result || typeof result !== "string") {
                return;
            }

            load_obj(result);
        }

        reader.readAsText(obj_file);
    }

    const png_file = find_file(files, /.png$/);

    if (png_file) {
        const reader = new FileReader();

        reader.onload = function(): void {
            const result = reader.result as ArrayBuffer;

            const blob = new Blob([result], {type: "image/png"});
            const url = URL.createObjectURL(blob);
            const img = new Image();

            img.onload = function(): void {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;

                const ctx = canvas.getContext("2d");

                if (!ctx) {
                    return;
                }

                ctx.drawImage(img, 0, 0);

                const data = ctx.getImageData(0, 0, img.width, img.height);
                URL.revokeObjectURL(url);

                model_rdata_texture(model_rdata, data.width, data.height, data.data, true);
            };

            img.onerror = (e) => {
                URL.revokeObjectURL(url);
            };

            img.src = url;
        };

        reader.readAsArrayBuffer(png_file);
    }
}

io_m_move(function(event: m_event_t): void {
    if (document.pointerLockElement === canvas_el) {
        cam3_pan(camera, event.xd);
        cam3_tilt(camera, event.yd);
    }
});

io_kb_key_down(function(event: kb_event_t): void {
    if (event.code === "Backquote") {
        if (document.pointerLockElement === canvas_el) {
            document.exitPointerLock();
        } else {
            canvas_el.requestPointerLock();
        }
    }
});

function update(): void {
    if (document.pointerLockElement === canvas_el) {
        if (io_key_down("KeyA")) {
            cam3_move_right(camera, -1.0);
        }

        if (io_key_down("KeyD")) {
            cam3_move_right(camera, 1.0);
        }

        if (io_key_down("KeyS")) {
            cam3_move_forward(camera, -1.0);
        }

        if (io_key_down("KeyW")) {
            cam3_move_forward(camera, 1.0);
        }
    }

    cam3_fru(camera);
    cam3_compute_proj(camera, canvas_el.width, canvas_el.height);
    cam3_compute_view(camera);
}

gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

function render(): void {
    gl.viewport(0, 0, canvas_el.width, canvas_el.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (is_loaded) {
        model_rend_render(model_rend, model_rdata, camera, model);
    }
}

function loop(): void {
    update();
    render();

    requestAnimationFrame(loop);
}

loop();
