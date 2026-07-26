import {vec2, vec2_print} from "@cl/math/vec2.ts";
import {vec3, vec3_print} from "@cl/math/vec3.ts";
import {vec4, vec4_print} from "@cl/math/vec4.ts";
import {mat2, mat2_print, mat2n_mul, mat2n_mulmv, mat2n_mulvm} from "@cl/math/mat2.ts";
import {mat3, mat3_print, mat3n_mul, mat3n_mulmv, mat3n_mulvm} from "@cl/math/mat3.ts";
import {mat4, mat4_print, mat4n_mul, mat4n_mulmv, mat4n_mulvm} from "@cl/math/mat4.ts";

export function test_mat2_mul() {
    const a = mat2(1, 2, 3, 4);
    const b = mat2(4, 3, 2, 1);

    console.log("a:");
    mat2_print(a);
    console.log("b:");
    mat2_print(b);
    console.log("a * b:");
    mat2_print(mat2n_mul(a, b));
    console.log("b * a:");
    mat2_print(mat2n_mul(b, a));
}

export function test_mat2_mul_mv() {
    const m = mat2(1, 2, 3, 4);
    const v = vec2(2, 1);

    console.log("m:");
    mat2_print(m);
    console.log("v:");
    vec2_print(v);
    console.log("m * v:");
    vec2_print(mat2n_mulmv(m, v));
    console.log("v * m:");
    vec2_print(mat2n_mulvm(v, m));
}

export function test_mat3_mul() {
    const a = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    const b = mat3(9, 8, 7, 6, 5, 4, 3, 2, 1);

    console.log("a:");
    mat3_print(a);
    console.log("b:");
    mat3_print(b);
    console.log("a * b:");
    mat3_print(mat3n_mul(a, b));
    console.log("b * a:");
    mat3_print(mat3n_mul(b, a));
}

export function test_mat3_mul_mv() {
    const m = mat3(1, 2, 3, 4, 5, 6, 7, 8, 9);
    const v = vec3(3, 2, 1);

    console.log("m:");
    mat3_print(m);
    console.log("v:");
    vec3_print(v);
    console.log("m * v:");
    vec3_print(mat3n_mulmv(m, v));
    console.log("v * m:");
    vec3_print(mat3n_mulvm(v, m));
}

export function test_mat4_mul() {
    const a = mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    const b = mat4(16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1);

    console.log("a:");
    mat4_print(a);
    console.log("b:");
    mat4_print(b);
    console.log("a * b:");
    mat4_print(mat4n_mul(a, b));
    console.log("b * a:");
    mat4_print(mat4n_mul(b, a));
}

export function test_mat4_mul_mv() {
    const m = mat4(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
    const v = vec4(4, 3, 2, 1);

    console.log("m:");
    mat4_print(m);
    console.log("v:");
    vec4_print(v);
    console.log("m * v:");
    vec4_print(mat4n_mulmv(m, v));
    console.log("v * m:");
    vec4_print(mat4n_mulvm(v, m));
}
