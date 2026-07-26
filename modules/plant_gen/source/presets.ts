import {CHANGER_TYPE} from "./lsys.ts";
import {vec2, vec2_t} from "@cl/math/vec2.ts";
import {vec4, vec4_t} from "@cl/math/vec4.ts";

export enum LEAF_TYPE {
    BOX,
    KITE
};

export type preset_t = {
    name: string;
    position: vec2_t;
    width: number;
    length: number;
    angle: number;
    delta_angle: number;
    input: string;
    rules: {[key: string]: string};
    iter: number;
    branch_color: vec4_t;
    leaf_color: vec4_t;
    flower_inner_color: vec4_t;
    flower_outer_color: vec4_t;
    leaf_type: LEAF_TYPE;
    leaf_size: vec2_t;
    leaf_ratio: 0.5;
    flower_inner_radius: number;
    flower_outer_radius: number;
    width_changer_type: CHANGER_TYPE;
    width_changer_param: number;
    length_changer_type: CHANGER_TYPE;
    length_changer_param: number;
};

export const PRESETS: preset_t[] = [
    {
        name: "Flower 1",
        position: vec2(0.0, -80.0),
        width: 4.0,
        length: 20.0,
        angle: 90.0,
        delta_angle: 40.0,
        input: "F[-fL]F[+fL]FBFFFBBFFFFFJ",
        rules: {
            "B": "[-CCCFFJ][+CCCFFJ]",
            "C": "F[-FJ][+FJ]",
        },
        iter: 3,
        branch_color: vec4(25, 99, 30, 255),
        leaf_color: vec4(25, 99, 30, 255),
        flower_inner_color: vec4(224, 194, 61, 255),
        flower_outer_color: vec4(71, 76, 166, 255),
        leaf_type: LEAF_TYPE.KITE,
        leaf_size: vec2(5, 20),
        leaf_ratio: 0.5,
        flower_inner_radius: 1.5,
        flower_outer_radius: 3,
        width_changer_type: CHANGER_TYPE.GEOMETRIC,
        width_changer_param: 0.8,
        length_changer_type: CHANGER_TYPE.GEOMETRIC,
        length_changer_param: 0.8,
    },
    {
        name: "Flower 2",
        position: vec2(0.0, -80.0),
        width: 1.0,
        length: 20.0,
        angle: 90.0,
        delta_angle: 40.0,
        input: "F[+fL]F[-fL]FJ",
        rules: {},
        iter: 1,
        branch_color: vec4(87, 212, 130, 255),
        leaf_color: vec4(87, 212, 130, 255),
        flower_inner_color: vec4(235, 207, 52, 255),
        flower_outer_color: vec4(235, 52, 171, 255),
        leaf_type: LEAF_TYPE.KITE,
        leaf_size: vec2(4.0, 20),
        leaf_ratio: 0.5,
        flower_inner_radius: 3,
        flower_outer_radius: 6,
        width_changer_type: CHANGER_TYPE.NONE,
        width_changer_param: 0,
        length_changer_type: CHANGER_TYPE.NONE,
        length_changer_param: 0
    },
    {
        name: "Tree 1",
        position: vec2(0.0, -80.0),
        width: 12.0,
        length: 15.0,
        angle: 90.0,
        delta_angle: 25.0,
        input: "FFFFFB",
        rules: {
            "B": "[-FBfL][+FBfL]",
        },
        iter: 7,
        branch_color: vec4(161, 90, 43, 255),
        leaf_color: vec4(163, 207, 60, 255),
        flower_inner_color: vec4(235, 207, 52, 255),
        flower_outer_color: vec4(235, 52, 171, 255),
        leaf_type: LEAF_TYPE.KITE,
        leaf_size: vec2(3.0, 5),
        leaf_ratio: 0.5,
        flower_inner_radius: 3,
        flower_outer_radius: 6,
        width_changer_type: CHANGER_TYPE.GEOMETRIC,
        width_changer_param: 0.7,
        length_changer_type: CHANGER_TYPE.GEOMETRIC,
        length_changer_param: 0.95
    },
    {
        name: "Tree 2",
        position: vec2(0.0, -80.0),
        width: 12.0,
        length: 20.0,
        angle: 90.0,
        delta_angle: 30.0,
        input: "FFX",
        rules: {
            "X": "F[-FXL][+FXL]X",
        },
        iter: 4,
        branch_color: vec4(161, 90, 43, 255),
        leaf_type: LEAF_TYPE.KITE,
        leaf_color: vec4(163, 207, 60, 255),
        flower_inner_color: vec4(235, 207, 52, 255),
        flower_outer_color: vec4(235, 52, 171, 255),
        leaf_size: vec2(30),
        leaf_ratio: 0.5,
        flower_inner_radius: 3,
        flower_outer_radius: 6,
        width_changer_type: CHANGER_TYPE.GEOMETRIC,
        width_changer_param: 0.7,
        length_changer_type: CHANGER_TYPE.GEOMETRIC,
        length_changer_param: 0.95
    }
];
