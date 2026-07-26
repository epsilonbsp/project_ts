import {gl, gl_link_program} from "@engine/gl.ts";
import {ATTRIB_TYPE, layout_attrib, layout_build_gl, layout_new} from "@engine/layout.ts";
import {cam3_t} from "@cl/camera/cam3.ts";
import {mat4_t} from "@cl/math/mat4.ts";
import {vec3, vec3_t} from "@cl/math/vec3.ts";
import {rgb} from "@cl/math/vec3_color.ts";

const layout = layout_new();
layout_attrib(layout, ATTRIB_TYPE.F32, 3);
layout_attrib(layout, ATTRIB_TYPE.F32, 3);
layout_attrib(layout, ATTRIB_TYPE.F32, 2);

export class model_rdata_t {
    vertices: Float32Array;
    indices: Uint32Array;
    index_count: number;
    vao: WebGLVertexArrayObject;
    vbo: WebGLBuffer;
    ibo: WebGLBuffer;
    tbo: WebGLTexture;
};

export function model_rdata_new(): model_rdata_t {
    const rdata = new model_rdata_t();
    rdata.vertices = new Float32Array(0);
    rdata.indices = new Uint32Array(0);
    rdata.index_count = 0;
    rdata.vao = 0;
    rdata.vbo = 0;
    rdata.ibo = 0;
    rdata.tbo = 0;

    return rdata;
}

export function model_rdata_build(rdata: model_rdata_t, vertices: number[], indices: number[]): void {
    rdata.vertices = new Float32Array(vertices);
    rdata.indices = new Uint32Array(indices);
    rdata.index_count = indices.length;

    rdata.vao = gl.createVertexArray();
    gl.bindVertexArray(rdata.vao);

    rdata.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rdata.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, rdata.vertices, gl.STATIC_DRAW);

    layout_build_gl(layout);

    rdata.ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, rdata.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, rdata.indices, gl.STATIC_DRAW);
}

export function model_rdata_texture(rdata: model_rdata_t, w: number, h: number, data: Uint8ClampedArray, is_flipped: boolean): void {
    rdata.tbo = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, rdata.tbo);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    if (is_flipped) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    }

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

export class model_rend_t {
    prog: any;
    ligth_dir: vec3_t;
    ligth_color: vec3_t;
};

export function model_rend_new(): model_rend_t {
    const rend = new model_rend_t();

    const prog = rend.prog = {} as any;

    prog.id = gl_link_program({
        [gl.VERTEX_SHADER]: `#version 300 es
            layout(location = 0) in vec3 i_position;
            layout(location = 1) in vec3 i_normal;
            layout(location = 2) in vec2 i_tex_coord;
            out vec3 v_normal;
            out vec2 v_tex_coord;
            uniform mat4 u_projection;
            uniform mat4 u_view;
            uniform mat4 u_model;

            void main() {
                gl_Position = u_projection * u_view * u_model * vec4(i_position, 1.0);
                v_normal = i_normal;
                v_tex_coord = i_tex_coord;
            }
        `,
        [gl.FRAGMENT_SHADER]: `#version 300 es
            precision highp float;
            out vec4 o_frag_color;
            in vec3 v_normal;
            in vec2 v_tex_coord;
            uniform vec3 u_light_dir;
            uniform vec3 u_light_color;
            uniform sampler2D u_texture;

            void main() {
                vec3 color;

                vec3 light_dir = normalize(u_light_dir);

                float diffuse_factor = max(0.2, dot(v_normal, light_dir));
                vec3 diffuse = u_light_color * diffuse_factor;

                color += diffuse;

                o_frag_color = texture(u_texture, v_tex_coord) * vec4(color, 1.0);
            }
        `
    })!;

    prog.u_projection = gl.getUniformLocation(prog.id, "u_projection")!;
    prog.u_view = gl.getUniformLocation(prog.id, "u_view")!;
    prog.u_model = gl.getUniformLocation(prog.id, "u_model")!;
    prog.u_light_dir = gl.getUniformLocation(prog.id, "u_light_dir")!;
    prog.u_light_color = gl.getUniformLocation(prog.id, "u_light_color")!;

    rend.ligth_dir = vec3(1.0);
    rend.ligth_color = rgb(255, 255, 255);

    return rend;
}

export function model_rend_render(rend: model_rend_t, rdata: model_rdata_t, cam: cam3_t, model: mat4_t): void {
    gl.useProgram(rend.prog.id);
    gl.uniformMatrix4fv(rend.prog.u_projection, false, cam.projection);
    gl.uniformMatrix4fv(rend.prog.u_view, false, cam.view);
    gl.uniformMatrix4fv(rend.prog.u_model, false, model);
    gl.uniform3fv(rend.prog.u_light_dir, rend.ligth_dir);
    gl.uniform3fv(rend.prog.u_light_color, rend.ligth_color);

    gl.bindVertexArray(rdata.vao);

    if (rdata.tbo) {
        gl.bindTexture(gl.TEXTURE_2D, rdata.tbo);
    }

    gl.drawElements(gl.TRIANGLES, rdata.index_count, gl.UNSIGNED_INT, 0);
}
