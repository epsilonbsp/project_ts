import {vec2_t} from "@cl/math/vec2.ts";
import {cam2_t} from "@cl/camera/cam2.ts";
import {gl, gl_link_program} from "@engine/gl.ts";

const px_per_instance = 4;

export class field_rdata_t {
    data: Float32Array;
    len: number;
    cap: number;
    instances: Float32Array[];
    tbo: WebGLTexture;
};

export function field_rdata_new(cap: number): field_rdata_t {
    const data = new Float32Array(cap * px_per_instance);
    const instances: Float32Array[] = [];

    for (let i = 0; i < cap; i += 1) {
        instances.push(new Float32Array(data.buffer, i * px_per_instance * 4, px_per_instance));
    }

    const tbo = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tbo);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, cap * px_per_instance / 4, 1, 0, gl.RGBA, gl.FLOAT, data);

    const rdata = new field_rdata_t();
    rdata.data = data;
    rdata.len = 0;
    rdata.cap = cap;
    rdata.instances = instances;
    rdata.tbo = tbo;

    return rdata;
}

export function field_rdata_instance(rdata: field_rdata_t, index: number, position: vec2_t, radius: number, mass: number) {
    const instance = rdata.instances[index];

    instance[0] = position[0];
    instance[1] = position[1];
    instance[2] = radius;
    instance[3] = mass;
};

export class field_rend_t {
    w: number;
    h: number;
    tex_prog: any;
    out_prog: any;
    fbo: WebGLFramebuffer;
    tbo: WebGLTexture;
};

export function field_rend_new(w: number, h: number): field_rend_t {
    const rend = new field_rend_t();
    rend.w = w;
    rend.h = h;
    rend.tex_prog = {};
    rend.out_prog = {};
    rend.fbo = 0;
    rend.tbo = 0;

    return rend;
}

export function field_rend_init(rend: field_rend_t): void {
    const tex_prog = rend.tex_prog;

    tex_prog.id = gl_link_program({
        [gl.VERTEX_SHADER]: `#version 300 es
            layout(location = 0) in vec2 i_position;
            layout(location = 1) in float i_radius;

            const vec2 positions[4] = vec2[4](
                vec2(-1.0, -1.0),
                vec2(-1.0, 1.0),
                vec2(1.0, -1.0),
                vec2(1.0, 1.0)
            );

            void main() {
                gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
            }
        `,
        [gl.FRAGMENT_SHADER]: `#version 300 es
            precision highp float;
            out vec4 o_frag_color;
            uniform vec2 u_viewport;
            uniform mat4 u_projection;
            uniform mat4 u_view;
            uniform int u_instance_count;
            uniform float u_time;
            uniform sampler2D u_texture;

            int px_per_instance = 4;

            struct res_t {
                float voronoi;
                vec2 field;
            };

            res_t map(vec2 p) {
                float d1 = 1e10;
                float d2 = 1e10;
                vec2 field;

                for (int i = 0; i < u_instance_count; i += 1) {
                    vec4 tex0 = texelFetch(u_texture, ivec2(i * px_per_instance / 4, 0), 0);
                    vec2 position = tex0.xy;
                    float radius = tex0.z;
                    float mass = tex0.w;

                    vec2 diff = p - position;
                    vec2 dir = normalize(diff);
                    float len = length(diff);
                    float dist = len - radius;

                    if (dist < d1) {
                        d2 = d1;
                        d1 = dist;
                    } else if (dist < d2) {
                        d2 = dist;
                    }

                    field += dir * (mass / (dist * dist));
                }

                float voronoi = exp(-abs(d1 - d2) * 0.5);

                return res_t(voronoi, field);
            }

            float grid(vec2 p, float spacing) {
                vec2 grid = abs(fract(p / spacing - 0.5) - 0.5);

                vec2 aa = fwidth(p / spacing);
                vec2 grid_aa = smoothstep(vec2(0.0), aa, grid);

                return min(grid_aa.x, grid_aa.y);
            }

            float smooth_grid(vec2 uv, vec2 line_width) {
                vec2 ddx = dFdx(uv);
                vec2 ddy = dFdy(uv);
                vec2 uv_deriv = vec2(length(vec2(ddx.x, ddy.x)), length(vec2(ddx.y, ddy.y)));
                bvec2 invert_line = bvec2(line_width.x > 0.5, line_width.y > 0.5);
                vec2 target_width = vec2(
                    invert_line.x ? 1.0 - line_width.x : line_width.x,
                    invert_line.y ? 1.0 - line_width.y : line_width.y
                );
                vec2 draw_width = clamp(target_width, uv_deriv, vec2(0.5));
                vec2 line_aa = uv_deriv * 1.5;
                vec2 grid_uv = abs(fract(uv) * 2.0 - 1.0);
                grid_uv.x = invert_line.x ? grid_uv.x : 1.0 - grid_uv.x;
                grid_uv.y = invert_line.y ? grid_uv.y : 1.0 - grid_uv.y;
                vec2 grid2 = smoothstep(draw_width + line_aa, draw_width - line_aa, grid_uv);
                grid2 *= clamp(target_width / draw_width, 0.0, 1.0);
                grid2 = mix(grid2, target_width, clamp(uv_deriv * 2.0 - 1.0, 0.0, 1.0));
                grid2.x = invert_line.x ? 1.0 - grid2.x : grid2.x;
                grid2.y = invert_line.y ? 1.0 - grid2.y : grid2.y;

                return mix(grid2.x, 1.0, grid2.y);
            }

            void main() {
                mat4 proj_inv = inverse(u_projection);
                mat4 view_inv = inverse(u_view);
                vec2 tex_coord = gl_FragCoord.xy / u_viewport;
                vec2 uv = tex_coord * 2.0 - 1.0;
                vec2 pos = (view_inv * proj_inv * vec4(uv, 0.0, 1.0)).xy;
                res_t res = map(pos);

                vec2 distorted_pos = pos + res.field;
                float g = smooth_grid(distorted_pos, vec2(0.05));
                vec3 color = mix(vec3(0.0), vec3(1.0), g) * vec3(0.2, 0.6, 0.4);

                o_frag_color = vec4(color + vec3(0.5, 0.2, 0.6) * res.voronoi * 0.5, 1.0);
            }
        `
    })!;

    tex_prog.u_viewport = gl.getUniformLocation(tex_prog.id, "u_viewport");
    tex_prog.u_projection = gl.getUniformLocation(tex_prog.id, "u_projection");
    tex_prog.u_view = gl.getUniformLocation(tex_prog.id, "u_view");
    tex_prog.u_instance_count = gl.getUniformLocation(tex_prog.id, "u_instance_count");

    const out_prog = rend.out_prog;

    out_prog.id = gl_link_program({
        [gl.VERTEX_SHADER]: `#version 300 es
            out vec2 v_tex_coord;

            const vec2 positions[4] = vec2[4](
                vec2(-1.0, -1.0),
                vec2(-1.0, 1.0),
                vec2(1.0, -1.0),
                vec2(1.0, 1.0)
            );

            const vec2 tex_coords[4] = vec2[4](
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
                o_frag_color = texture(u_texture, v_tex_coord);
            }
        `
    })!;

    rend.fbo = gl.createFramebuffer();

    rend.tbo = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, rend.tbo);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, rend.w, rend.h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

export function field_rend_render(rend: field_rend_t, rdata: field_rdata_t, cam: cam2_t) {
    gl.bindTexture(gl.TEXTURE_2D, rdata.tbo);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, rdata.cap * px_per_instance / 4, 1, 0, gl.RGBA, gl.FLOAT, rdata.data);

    gl.bindFramebuffer(gl.FRAMEBUFFER, rend.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rend.tbo, 0);
    gl.viewport(0, 0, rend.w, rend.h);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(rend.tex_prog.id);
    gl.uniform2f(rend.tex_prog.u_viewport, rend.w, rend.h);
    gl.uniformMatrix4fv(rend.tex_prog.u_projection, false, cam.projection);
    gl.uniformMatrix4fv(rend.tex_prog.u_view, false, cam.view);
    gl.uniform1i(rend.tex_prog.u_instance_count, rdata.len);
    gl.bindTexture(gl.TEXTURE_2D, rdata.tbo);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(rend.out_prog.id);
    gl.bindTexture(gl.TEXTURE_2D, rend.tbo);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
