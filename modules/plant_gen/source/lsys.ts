import {rad} from "@cl/math/math.ts";
import {vec2, vec2n_addmuls, vec2n_copy, vec2_copy, vec2_t} from "@cl/math/vec2.ts";

export enum CHANGER_TYPE {
    NONE,
    LINEAR,
    GEOMETRIC,
    EXPONENTIAL
};

export class changer_t {
    type: CHANGER_TYPE;
    dir: number;
    param: number;
};

export function changer_new(type: CHANGER_TYPE, param: number): changer_t {
    const changer = new changer_t();
    changer.type = type;
    changer.param = param;

    return changer;
}

export function changer_none(): changer_t {
    return changer_new(CHANGER_TYPE.NONE, 0);
}

export function changer_calc(changer: changer_t, value: number): number {
    if (changer.type === CHANGER_TYPE.LINEAR) {
        return value + changer.param;
    } else if (changer.type === CHANGER_TYPE.GEOMETRIC) {
        return value * changer.param;
    } else if (changer.type === CHANGER_TYPE.EXPONENTIAL) {
        return Math.pow(value, changer.param);
    }

    return value;
}

export type lsys_callback_t = (p0: vec2_t, w0: number, p1: vec2_t, w1: number) => void;

export class lsys_t {
    position: vec2_t;
    angle: number;
    width: number;
    length: number;
    delta_angle: number;
    changer_width: changer_t;
    changer_length: changer_t;
    rules: {[key: string]: string};
    callbacks: {[key: string]: lsys_callback_t};
};

export function lsys_new(position: vec2_t, angle: number, width: number, length: number): lsys_t {
    const lsys = new lsys_t();
    lsys.position = position;
    lsys.angle = angle;
    lsys.width = width;
    lsys.length = length;
    lsys.delta_angle = 90.0;
    lsys.changer_width = changer_none();
    lsys.changer_length = changer_none();
    lsys.rules = {};
    lsys.callbacks = {};

    return lsys;
}

export class lsys_state_t {
    position: vec2_t;
    angle: number;
    width: number;
    length: number;
};

export function lsys_state_new(position: vec2_t, angle: number, width: number, length: number): lsys_state_t {
    const state = new lsys_state_t();
    state.position = vec2n_copy(position);
    state.angle = angle;
    state.width = width;
    state.length = length;

    return state;
}

export class lsys_action_t {
    value: string;
    prev: lsys_action_t|null;
    next: lsys_action_t|null;
};

export function lsys_action_new(value: string): lsys_action_t {
    const action = new lsys_action_t();
    action.value = value;
    action.prev = null;
    action.next = null;

    return action;
};

export function lsys_add_rule(lsys: lsys_t, key: string, value: string) {
    lsys.rules[key] = value;
}

export function lsys_add_callback(lsys: lsys_t, key: string, callback: lsys_callback_t) {
    lsys.callbacks[key] = callback;
}

export function lsys_clear_rules(lsys: lsys_t) {
    lsys.rules = {};
}

export function lsys_parse(lsys: lsys_t, input: string): [lsys_action_t, lsys_action_t] {
    const first = lsys_action_new(input[0]);
    let last = first;

    for (let i = 1; i < input.length; i += 1) {
        const c = input[i];

        const action = lsys_action_new(c);
        action.prev = last;
        last.next = action;

        last = action;
    }

    return [first, last];
}

export function lsys_expand(lsys: lsys_t, action: lsys_action_t): void {
    let curr: lsys_action_t|null = action;

    while (curr) {
        const rule = lsys.rules[curr.value];

        if (rule) {
            const [first, last] = lsys_parse(lsys, rule);

            if (curr.prev) {
                curr.prev.next = first;
            }

            if (curr.next) {
                last.next = curr.next;
                curr.next.prev = last;
            }

            first.prev = curr.prev;

            if (curr === action) {
                action = first;
            }
        }

        curr = curr.next;
    }
}

export function lsys_gen(lsys: lsys_t, input: string, limit: number) {
    const [first] = lsys_parse(lsys, input);

    for (let i = 0; i < limit; i += 1) {
        lsys_expand(lsys, first);
    }

    const stack: lsys_state_t[] = [];
    let state = lsys_state_new(lsys.position, lsys.angle, lsys.width, lsys.length);
    let curr: lsys_action_t|null = first;
    let prev_pos = vec2n_copy(state.position);
    let prev_width = state.width;

    while (curr) {
        const c = curr.value;

        switch (c) {
            case "f":
            case "F":
                const direction = vec2(Math.cos(rad(state.angle)), Math.sin(rad(state.angle)));

                const next_position = vec2n_addmuls(state.position, direction, state.length);
                const next_width = changer_calc(lsys.changer_width, state.width);
                const next_length = changer_calc(lsys.changer_length, state.length);

                const callback = lsys.callbacks[c];

                if (callback) {
                    callback(vec2n_copy(state.position), state.width, vec2n_copy(next_position), next_width);
                }

                vec2_copy(prev_pos, state.position);
                prev_width = state.width;
                vec2_copy(state.position, next_position);
                state.width = next_width;
                state.length = next_length;

                break;
            case "-":
                state.angle += lsys.delta_angle;

                break;
            case "+":
                state.angle -= lsys.delta_angle;

                break;
            case "[":
                stack.push(lsys_state_new(state.position, state.angle, state.width, state.length));

                break;
            case "]":
                const stack_state = stack.pop();

                if (stack_state) {
                    state = stack_state;
                }

                break;
            default:
                {
                    const callback = lsys.callbacks[c];

                    if (callback) {
                        callback(prev_pos, prev_width, state.position, state.width);
                    }
                }

                break;
        }

        curr = curr.next;
    }
}
