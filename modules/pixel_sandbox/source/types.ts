import {ELEMENT_STATE, element_t} from "./element.ts";
import {vec3} from "@cl/math/vec3.ts";
import {vec3_bitpack256v} from "@cl/math/vec3_color.ts"

export enum ELEMENT_TYPE {
    EMPTY,
    STONE,
    WOOD,
    SAND,
    DENSE_SAND,
    WATER,
    OIL,
    AIR,
    FIRE
};

export const ELEMENT_COLOR = {
    [ELEMENT_TYPE.EMPTY]: vec3(235, 235, 235),
    [ELEMENT_TYPE.STONE]: vec3(99, 99, 99),
    [ELEMENT_TYPE.WOOD]: vec3(161, 102, 47),
    [ELEMENT_TYPE.SAND]: vec3(247, 201, 136),
    [ELEMENT_TYPE.DENSE_SAND]: vec3(209, 155, 105),
    [ELEMENT_TYPE.WATER]: vec3(82, 133, 235),
    [ELEMENT_TYPE.OIL]: vec3(77, 75, 38),
    [ELEMENT_TYPE.AIR]: vec3(169, 205, 222),
    [ELEMENT_TYPE.FIRE]: vec3(255, 92, 51)
};

export function element_color(type: ELEMENT_TYPE) {
    return ELEMENT_COLOR[type];
}

export function element_empty(id: number): element_t {
    const element = new element_t();
    element.id = id;
    element.type = ELEMENT_TYPE.EMPTY;
    element.color = vec3_bitpack256v(element_color(element.type));
    element.state = ELEMENT_STATE.VOID;
    element.gravity_flag = false;
    element.density = 0;
    element.lifetime = 0;

    return element;
}

export function element_stone(id: number): element_t {
    const element = new element_t();
    element.id = id;
    element.type = ELEMENT_TYPE.STONE;
    element.color = vec3_bitpack256v(element_color(element.type));
    element.state = ELEMENT_STATE.SOLID;
    element.gravity_flag = false;
    element.density = 1;
    element.lifetime = 0;

    return element;
}

export function element_wood(id: number): element_t {
    const element = new element_t();
    element.id = id;
    element.type = ELEMENT_TYPE.WOOD;
    element.color = vec3_bitpack256v(element_color(element.type));
    element.state = ELEMENT_STATE.SOLID;
    element.gravity_flag = false;
    element.density = 1;
    element.lifetime = 0;

    return element;
}

export function element_sand(id: number): element_t {
    const element = new element_t();
    element.id = id;
    element.type = ELEMENT_TYPE.SAND;
    element.color = vec3_bitpack256v(element_color(element.type));
    element.state = ELEMENT_STATE.SOLID;
    element.gravity_flag = true;
    element.density = 2;
    element.lifetime = 0;

    return element;
}

export function element_dense_sand(id: number): element_t {
    const element = new element_t();
    element.id = id;
    element.type = ELEMENT_TYPE.DENSE_SAND;
    element.color = vec3_bitpack256v(element_color(element.type));
    element.state = ELEMENT_STATE.SOLID;
    element.gravity_flag = true;
    element.density = 1;
    element.lifetime = 0;

    return element;
}

export function element_water(id: number): element_t {
    const element = new element_t();
    element.id = id;
    element.type = ELEMENT_TYPE.WATER;
    element.color = vec3_bitpack256v(element_color(element.type));
    element.state = ELEMENT_STATE.LIQUID;
    element.gravity_flag = true;
    element.density = 3;
    element.lifetime = 0;

    return element;
}

export function element_oil(id: number): element_t {
    const element = new element_t();
    element.id = id;
    element.type = ELEMENT_TYPE.OIL;
    element.color = vec3_bitpack256v(element_color(element.type));
    element.state = ELEMENT_STATE.LIQUID;
    element.gravity_flag = true;
    element.density = 4;
    element.lifetime = 0;

    return element;
}

export function element_air(id: number): element_t {
    const element = new element_t();
    element.id = id;
    element.type = ELEMENT_TYPE.AIR;
    element.color = vec3_bitpack256v(element_color(element.type));
    element.state = ELEMENT_STATE.GAS;
    element.gravity_flag = true;
    element.density = 4;
    element.lifetime = 0;

    return element;
}

export function element_fire(id: number): element_t {
    const element = new element_t();
    element.id = id;
    element.type = ELEMENT_TYPE.FIRE;
    element.color = vec3_bitpack256v(element_color(element.type));
    element.state = ELEMENT_STATE.GAS;
    element.gravity_flag = true;
    element.density = 4;
    element.lifetime = 400;

    return element;
}
