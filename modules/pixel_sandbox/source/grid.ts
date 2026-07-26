import {clamp, index2} from "@cl/math/math.ts";
import {rand_in} from "@cl/math/rand.ts";
import {vec3, vec3_t} from "@cl/math/vec3.ts";
import {vec3_bitpack256v} from "@cl/math/vec3_color.ts"
import {element_color, element_empty, ELEMENT_TYPE} from "./types.ts";
import {element_copy, ELEMENT_STATE, element_t} from "./element.ts";

export class grid_t {
    width: number;
    height: number;
    size: number;
    elements: element_t[];
    buffer: Uint8Array;
};

export function grid_new(width: number, height: number): grid_t {
    const size = width * height;

    const grid = new grid_t();
    grid.width = width;
    grid.height = height;
    grid.size = size;
    grid.elements = new Array(size);
    grid.buffer = new Uint8Array(size * 3);

    for (let i = 0; i < size; i += 1) {
        const element = element_empty(i);

        grid.elements[i] = element_empty(i);
        grid.buffer[i * 3] = (element.color >> 16) & 0xFF;
        grid.buffer[i * 3 + 1] =(element.color >> 8) & 0xFF;
        grid.buffer[i * 3 + 2] = element.color & 0xFF;
    }

    return grid;
}

export function grid_pos(grid: grid_t, curr: number, x: number, y: number): element_t {
    return grid.elements[(curr + x + grid.width * y + grid.size) % grid.size];
};

export function grid_curr(grid: grid_t, curr: number): element_t {
    return grid.elements[curr];
}

export function grid_left(grid: grid_t, curr: number): element_t {
    return grid.elements[(curr - 1 + grid.size) % grid.size];
}

export function grid_right(grid: grid_t, curr: number): element_t {
    return grid.elements[(curr + 1) % grid.size];
}

export function grid_down(grid: grid_t, curr: number): element_t {
    return grid.elements[(curr + grid.width) % grid.size];
}

export function grid_up(grid: grid_t, curr: number): element_t {
    return grid.elements[(curr - grid.width + grid.size) % grid.size];
}

export function grid_left_down(grid: grid_t, curr: number): element_t {
    return grid.elements[(curr - 1 + grid.width) % grid.size];
}

export function grid_left_up(grid: grid_t, curr: number): element_t {
    return grid.elements[(curr - 1 - grid.width + grid.size) % grid.size];
}

export function grid_right_down(grid: grid_t, curr: number): element_t {
    return grid.elements[(curr + 1 + grid.width) % grid.size];
}

export function grid_right_up(grid: grid_t, curr: number): element_t {
    return grid.elements[(curr + 1 - grid.width + grid.size) % grid.size];
}

export function grid_swap(grid: grid_t, e0: element_t, e1: element_t): void {
    grid.elements[e0.id] = e1;
    grid.elements[e1.id] = e0;

    const temp = e0.id;
    e0.id = e1.id;
    e1.id = temp;
}

const empty_preset = element_empty(0);

let frames = 0;

export function grid_update(grid: grid_t): void {
    frames += 1;

    for (let y = grid.height - 1; y >= 0; y -= 1) {
        const dir = Math.random() < 0.5;

        for (let x = 0; x < grid.width; x += 1) {
            const i = index2(dir ? x : grid.width - 1 - x, y, grid.width);
            const curr = grid_curr(grid, i);
            const down = grid_down(grid, i);
            const left_down = dir ? grid_left_down(grid, i) : grid_right_down(grid, i);
            const right_down = dir ? grid_right_down(grid, i) : grid_left_down(grid, i);
            const left = grid_left(grid, i);
            const right = grid_right(grid, i);

            if (curr.state === ELEMENT_STATE.VOID) {
                continue;
            }

            // gravity rule
            if (!curr.gravity_flag || i >= (grid.size - grid.width - 1)) {
                continue;
            }

            if (curr.state === ELEMENT_STATE.SOLID) {
                if (down.state === ELEMENT_STATE.VOID) {
                    grid_swap(grid, curr, down);
                } else if (left_down.state === ELEMENT_STATE.VOID) {
                    grid_swap(grid, curr, left_down);
                } else if (right_down.state === ELEMENT_STATE.VOID) {
                    grid_swap(grid, curr, right_down);
                } else if ((down.density > curr.density) && down.gravity_flag) {
                    grid_swap(grid, curr, down);
                }
            }

            if (curr.state === ELEMENT_STATE.LIQUID) {
                if (down.state === ELEMENT_STATE.VOID) {
                    grid_swap(grid, curr, down);
                } else if (left_down.state === ELEMENT_STATE.VOID) {
                    grid_swap(grid, curr, left_down);
                } else if (right_down.state === ELEMENT_STATE.VOID) {
                    grid_swap(grid, curr, right_down);
                } else if ((down.density > curr.density) && down.gravity_flag) {
                    grid_swap(grid, curr, down);
                } else if (left.state === ELEMENT_STATE.VOID) {
                    grid_swap(grid, curr, left);
                } else if (right.state === ELEMENT_STATE.VOID) {
                    grid_swap(grid, curr, right);
                } else if ((left.density > curr.density) && left.gravity_flag && left.state === ELEMENT_STATE.LIQUID) {
                    grid_swap(grid, curr, left);
                } else if ((right.density > curr.density) && right.gravity_flag && right.state === ELEMENT_STATE.LIQUID) {
                    grid_swap(grid, curr, right);
                }
            }
        }
    }

    for (let y = 0; y < grid.height; y += 1) {
        const dir = Math.random() < 0.5;

        for (let x = 0; x < grid.width; x += 1) {
            const i = index2(dir ? x : grid.width - 1 - x, y, grid.width);
            const curr = grid_curr(grid, i);
            const left = grid_left(grid, i);
            const right = grid_right(grid, i);
            const up = grid_up(grid, i);
            const left_up = grid_left_up(grid, i);
            const right_up = grid_right_up(grid, i);
            const down = grid_down(grid, i);
            const left_down = grid_left_down(grid, i) ;
            const right_down = grid_right_down(grid, i);

            if (curr.state === ELEMENT_STATE.VOID) {
                continue;
            }

            if (curr.type === ELEMENT_TYPE.FIRE) {
                curr.lifetime -= rand_in(-1, 8);

                const close = [left, right, up, left_up, right_up, down, left_down, right_down];
                const rand = close[rand_in(0, close.length - 1)];

                if ((rand.type === ELEMENT_TYPE.WOOD || rand.type === ELEMENT_TYPE.OIL) && Math.random() > 0.5) {
                    element_copy(rand, curr);
                    rand.color = vec3_bitpack256v(vary_color(element_color(rand.type), 16));
                    rand.lifetime = 200;
                }

                if (curr.lifetime <= 0 || rand.type === ELEMENT_TYPE.WATER) {
                    element_copy(curr, empty_preset);
                }
            }

            if (!(frames % 4 === 0)) {
                return;
            }

            // gravity rule
            if (!curr.gravity_flag || i < grid.width) {
                continue;
            }

            if (down.type === ELEMENT_TYPE.WOOD || down.type === ELEMENT_TYPE.OIL) {
                continue;
            }

            if (curr.state === ELEMENT_STATE.GAS) {
                const options: element_t[] = [];

                // Prioritize upward movement
                if (up.state === ELEMENT_STATE.VOID) options.push(up);
                if (left_up.state === ELEMENT_STATE.VOID) options.push(left_up);
                if (right_up.state === ELEMENT_STATE.VOID) options.push(right_up);
                if ((up.density < curr.density) && up.gravity_flag) options.push(up);

                if (left.state === ELEMENT_STATE.VOID) options.push(left);
                if (right.state === ELEMENT_STATE.VOID) options.push(right);
                if ((left.density < curr.density) && left.gravity_flag && left.state === ELEMENT_STATE.GAS) options.push(left);
                if ((right.density < curr.density) && right.gravity_flag && right.state === ELEMENT_STATE.GAS) options.push(right);

                if (Math.random() < 0.05 && down.state === ELEMENT_STATE.VOID) options.push(down);

                for (let i = options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [options[i], options[j]] = [options[j], options[i]];
                }

                for (let i = 0; i < options.length; i++) {
                    if (options[i] !== null) {
                        grid_swap(grid, curr, options[i]);
                        break;
                    }
                }
            }
        }
    }
}

export function grid_color(grid: grid_t): void {
    for (let i = 0; i < grid.size; i += 1) {
        const element = grid_curr(grid, i);
        grid.buffer[i * 3] = (element.color >> 16) & 0xFF;
        grid.buffer[i * 3 + 1] = (element.color >> 8) & 0xFF;
        grid.buffer[i * 3 + 2] = element.color & 0xFF;
    }
}

export function vary_color(color: vec3_t, amount: number): vec3_t {
    const v = rand_in(-amount, amount);
    const r = clamp(color[0] + v, 0, 255);
    const g = clamp(color[1] + v, 0, 255);
    const b = clamp(color[2] + v, 0, 255);

    return vec3(r, g, b);
}

export function grid_paint(grid: grid_t, preset: element_t, cx: number, cy: number, size: number): void {
    if (size <= 1) {
        const i = index2(cx, cy, grid.width);
        const element = grid_curr(grid, i);

        if (!element) {
            return;
        }

        element_copy(element, preset);

        if (element.type !== ELEMENT_TYPE.EMPTY) {
            element.color = vec3_bitpack256v(vary_color(element_color(element.type), 16));
        }
    } else {
        const radius = Math.floor(size / 2.0);

        for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
                const x = cx + dx;
                const y = cy + dy;

                if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) continue;

                if (dx * dx + dy * dy <= radius * radius) {
                    const i = index2(x, y, grid.width);
                    const element = grid_curr(grid, i);

                    if (!element) {
                        continue;
                    }

                    element_copy(element, preset);

                    if (element.type !== ELEMENT_TYPE.EMPTY) {
                        element.color = vec3_bitpack256v(vary_color(element_color(element.type), 16));
                    }
                }
            }
        }
    }
}

export function grid_clear(grid: grid_t, preset: element_t) {
    for (const element of grid.elements) {
        element_copy(element, preset);
    }
}
