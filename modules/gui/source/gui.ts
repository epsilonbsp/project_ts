import "./gui.css";

// clamp
export function clamp(x: number, min: number, max: number): number {
    return Math.min(Math.max(x, min), max);
}

// vector type
export type typed_array_t =
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array;

export type vec_t = number[] | typed_array_t;

// unit
export enum UT {
    PX,
    PCT,
    FR
};

export const UNIT_STR = {
    [UT.PX]: "px",
    [UT.PCT]: "%",
    [UT.FR]: "fr"
};

export class unit_t {
    x: number;
    u: UT;
};

export function unit(x: number, u: UT): unit_t {
    const out = new unit_t();

    out.x = x;
    out.u = u;

    return out;
}

export function unit_str(unit: unit_t): string {
    return `${unit.x}${UNIT_STR[unit.u]}`;
}

// getset
export enum GETSET_TYPE {
    OBJECT,
    CALL
};

export class getset_t {
    type: GETSET_TYPE;
    object: any;
    key: string;
    call_get: () => any;
    call_set: (value: any) => void;

    get(): any {
        if (this.type === GETSET_TYPE.OBJECT) {
            return this.object[this.key];
        }

        return this.call_get();
    }

    set(value: any): void {
        if (this.type === GETSET_TYPE.OBJECT) {
            this.object[this.key] = value;
        } else {
            this.call_set(value);
        }
    }
};

export function gs_object(object: any, key: string): getset_t {
    const getset = new getset_t();
    getset.type = GETSET_TYPE.OBJECT;
    getset.object = object;
    getset.key = key;

    return getset;
}

export function gs_call(call_get: () => any, call_set: (value: any) => void): getset_t {
    const getset = new getset_t();
    getset.type = GETSET_TYPE.CALL;
    getset.call_get = call_get;
    getset.call_set = call_set;

    return getset;
}

// enum conversion
export function get_enum_keys(en: {}): string[] {
    const keys = Object.values(en);

    return keys.slice(0, keys.length / 2).map(v => String(v));
}

export function get_enum_values(en: {}): number[] {
    const values = Object.keys(en);

    return values.slice(0, values.length / 2).map(v => Number(v));
}

// element rendering
export function gui_render_label(label: string, parent_el: HTMLElement): HTMLSpanElement|null {
    if (!label) {
        return null;
    }

    const label_el = document.createElement("span");
    label_el.className = "gui_label";
    label_el.innerHTML = label;
    parent_el.append(label_el);

    return label_el;
}

export function gui_render_container(): HTMLDivElement {
    const container_el = document.createElement("div");
    container_el.className = "gui_container";

    return container_el;
}

export function gui_render_input(type: string, value: number, step: number, min: number, max: number): HTMLInputElement {
    const input_el = document.createElement("input");
    input_el.className = "gui_input";
    input_el.type = type;
    input_el.step = step.toString();
    input_el.min = min.toString();
    input_el.max = max.toString();
    input_el.value = value.toString();

    return input_el;
}

export function gui_render_table(rows: any, header: any): HTMLTableElement {
    const table_el = document.createElement("table");
    table_el.className = "gui_table";

    if (header.length) {
        const row_el = document.createElement("tr");
        table_el.append(row_el);

        for (const col of header) {
            const col_el = document.createElement("th");
            col_el.innerHTML = col;
            row_el.append(col_el);
        }
    }

    for (const row of rows) {
        const row_el = document.createElement("tr");
        table_el.append(row_el);

        for (const col of row) {
            const col_el = document.createElement("td");
            col_el.innerHTML = col;
            row_el.append(col_el);
        }
    }

    return table_el;
}

// components
export class component_t {
    parent: component_t|null;
    children: component_t[] = [];
    ref_el: HTMLElement;

    container(): HTMLElement {
        return this.ref_el;
    }

    render(): void {}

    mount(): void {}

    static mount(): void {}

    update(): void {}
};

export class window_t extends component_t {
    id: number;
    title: string;
    grid_x: unit_t[];
    grid_y: unit_t[];
    layout: number[];
    window_parent: window_t|null;
    window_children: window_t[];

    grid_str(grid: unit_t[]): string {
        let str = "";

        for (let i = 0; i < grid.length; i += 1) {
            const col = grid[i];

            str += unit_str(col);

            if (i < grid.length - 1) {
                str += " ";
            }
        }

        return str;
    }

    layout_str(): string {
        let str = "";
        const cols = this.grid_x.length;
        const rows = this.grid_y.length;
        const total = cols * rows;

        for (let i = 0; i < total; i += cols) {
            let row_str = "";

            for (let j = i; j < i + cols; j += 1) {
                const value = this.layout[j];

                row_str += `w${value}`;

                if (j < i + cols - 1) {
                    row_str += " ";
                }
            }

            str += `"${row_str}"\n`;
        }

        return str;
    }

    render(): void {
        const ref_el = document.createElement("div");

        if (!this.window_parent) {
            ref_el.className = "gui_window_root";
        } else {
            ref_el.className = "gui_window";
        }

        if (this.window_children.length) {
            ref_el.style.display = "grid";
            ref_el.style.gridTemplateColumns = this.grid_str(this.grid_x);
            ref_el.style.gridTemplateRows = this.grid_str(this.grid_y);
            ref_el.style.gridTemplateAreas = this.layout_str();
        } else {
            ref_el.style.gridArea = `w${this.id}`;
        }

        this.ref_el = ref_el;
    }
};

export class collapsing_header_t extends component_t {
    title: string;
    is_collapsed: boolean;
    container_el: HTMLDivElement;

    container(): HTMLElement {
        return this.container_el;
    }

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_collapsing_header" + (this.is_collapsed ? " gui_is_collapsed" : "");

        const title_el = document.createElement("div");
        title_el.className = "gui_title";
        title_el.innerHTML = this.title;
        ref_el.append(title_el);

        title_el.onclick = (function(this: collapsing_header_t): void {
            if (this.is_collapsed) {
                this.is_collapsed = false;
                ref_el.classList.remove("gui_is_collapsed");
            } else {
                this.is_collapsed = true;
                ref_el.classList.add("gui_is_collapsed");
            }
        }).bind(this);

        const container_el = gui_render_container();
        ref_el.append(container_el);

        this.ref_el = ref_el;
        this.container_el = container_el;
    }
};

export class group_t extends component_t {
    condition: () => boolean;

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_group";

        if (this.condition()) {
            ref_el.style.display = "block";
        } else {
            ref_el.style.display = "none";
        }

        this.ref_el = ref_el;
    }

    update(): void {
        if (this.condition()) {
            this.ref_el.style.display = "block";
        } else {
            this.ref_el.style.display = "none";
        }
    }
};

export class text_t extends component_t {
    value: string;

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_text";
        ref_el.innerHTML = this.value;

        this.ref_el = ref_el;
    }
};

export class bool_t extends component_t {
    label: string;
    value: getset_t;
    onchange: (value: boolean) => void;
    input_el: HTMLDivElement;

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_bool";

        const input_el = document.createElement("div");
        input_el.className = "gui_checkbox_group_option" + (this.value.get() ? " gui_selected" : "");
        input_el.innerHTML = this.label;
        ref_el.append(input_el);

        input_el.onclick = (function(this: bool_t): void {
            if (this.value.get()) {
                this.value.set(false);
                input_el.classList.remove("gui_selected");
            } else {
                this.value.set(true);
                input_el.classList.add("gui_selected");
            }

            this.onchange(this.value.get());
        }).bind(this);

        this.ref_el = ref_el;
        this.input_el = input_el;
    }

    update(): void {
        if (this.value.get()) {
            this.input_el.classList.add("gui_selected");
        } else {
            this.input_el.classList.remove("gui_selected");
        }
    }
};

export class input_number_t extends component_t {
    label: string;
    value: getset_t;
    step: number;
    min: number;
    max: number;
    onchange: (value: number) => void;
    input_el: HTMLInputElement;

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_input_number";

        gui_render_label(this.label, ref_el);

        const input_el = gui_render_input("number", this.value.get(), this.step, this.min, this.max);
        ref_el.append(input_el);

        input_el.onchange = (function(this: input_number_t): void {
            const value = clamp(parseFloat(input_el.value), this.min, this.max);
            this.value.set(value);
            input_el.value = value.toString();
            this.onchange(value);
        }).bind(this);

        this.ref_el = ref_el;
        this.input_el = input_el;
    }

    update(): void {
        if (document.activeElement != this.input_el) {
            this.input_el.value = this.value.get().toString();
        }
    }
};

export class slider_number_t extends component_t {
    label: string;
    value: getset_t;
    step: number;
    min: number;
    max: number;
    container_el: HTMLDivElement;
    onchange: (value: number) => void;
    input_el: HTMLInputElement;

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_slider_number";

        gui_render_label(this.label, ref_el);

        const container_el = gui_render_container();
        container_el.className = "gui_input_range_container"
        ref_el.append(container_el);

        const input_el = gui_render_input("range", this.value.get(), this.step, this.min, this.max);
        input_el.className = "gui_input_range"
        container_el.dataset.content = input_el.value;
        container_el.append(input_el);

        input_el.onchange = (function(this: slider_number_t): void {
            const value = clamp(parseFloat(input_el.value), this.min, this.max);
            this.value.set(value);
            container_el.dataset.content = input_el.value;
            this.onchange(value);
        }).bind(this);

        input_el.onmousemove = function(): void {
            container_el.dataset.content = input_el.value;
        }

        this.ref_el = ref_el;
        this.container_el = container_el;
        this.input_el = input_el;
    }

    update(): void {
        if (document.activeElement != this.input_el) {
            this.input_el.value = this.value.get().toString();
            this.container_el.dataset.content = this.input_el.value;
        }
    }
};

export class input_vec_t extends component_t {
    label: string;
    value: vec_t;
    step: number;
    min: number;
    max: number;
    size: number;
    onchange: (value: vec_t) => void;
    input_els: HTMLInputElement[];

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_input_vec";
        ref_el.style.setProperty("--size", this.size.toString());

        gui_render_label(this.label, ref_el);

        const container_el = gui_render_container();
        ref_el.append(container_el);

        const input_els: HTMLInputElement[] = [];

        for (let i = 0; i < this.value.length; i += 1) {
            const input_el = gui_render_input("number", this.value[i], this.step, this.min, this.max);
            container_el.append(input_el);

            input_el.onchange = (function(this: input_vec_t): void {
                const value = clamp(parseFloat(input_el.value), this.min, this.max);
                this.value[i] = value;
                input_el.value = value.toString();
                this.onchange(this.value);
            }).bind(this);

            input_els.push(input_el);
        }

        this.ref_el = ref_el;
        this.input_els = input_els;
    }

    update(): void {
        for (let i = 0; i < this.value.length; i += 1) {
            const input_el = this.input_els[i];

            if (document.activeElement != input_el) {
                input_el.value = this.value[i].toString();
            }
        }
    }
};

export enum COLOR_MODE {
    R_0_1,
    R_0_255
};

export class color_edit_t extends component_t {
    label: string;
    value: vec_t;
    mode: COLOR_MODE;
    onchange: (value: vec_t) => void;
    input_el: HTMLInputElement;
    range_container_el: HTMLDivElement|null;
    range_el: HTMLInputElement|null;

    to_hex(r: number, g: number, b: number): string {
        const multiplier = this.mode === COLOR_MODE.R_0_1 ? 255.0 : 1.0;
        const r_str = Math.round(r * multiplier).toString(16).padStart(2, "0");
        const g_str = Math.round(g * multiplier).toString(16).padStart(2, "0");
        const b_str = Math.round(b * multiplier).toString(16).padStart(2, "0");

        return `#${r_str}${g_str}${b_str}`;
    }

    from_hex(h: string): number[] {
        const hex = h.replace(/^#/, "");
        const divider = this.mode === COLOR_MODE.R_0_1 ? 255.0 : 1.0;
        const r = parseInt(hex.substring(0, 2), 16) / divider;
        const g = parseInt(hex.substring(2, 4), 16) / divider;
        const b = parseInt(hex.substring(4, 6), 16) / divider;

        return [r, g, b];
    }

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_color_edit" + (this.value.length === 4 ? " gui_rgba" : "");

        gui_render_label(this.label, ref_el);

        const container_el = gui_render_container();
        ref_el.append(container_el);

        const input_el = document.createElement("input");
        input_el.className = "gui_input_color";
        input_el.type = "color";
        input_el.value = this.to_hex(this.value[0], this.value[1], this.value[2]);
        container_el.append(input_el);

        input_el.onchange = (function(this: color_edit_t): void {
            const values = this.from_hex(input_el.value);
            this.value[0] = values[0];
            this.value[1] = values[1];
            this.value[2] = values[2];
            this.onchange(this.value);
        }).bind(this);

        if (this.value.length == 4) {
            const range_container_el = document.createElement("div");
            range_container_el.className = "gui_input_range_container";
            container_el.append(range_container_el);

            const range_el = gui_render_input("range", this.value[3], 0.01, 0.0, 1.0);
            range_el.className = "gui_input_range";
            range_container_el.dataset.content = range_el.value;
            range_container_el.append(range_el);

            range_el.onchange = (function(this: color_edit_t): void {
                this.value[3] = parseFloat(range_el.value) * (this.mode === COLOR_MODE.R_0_255 ? 255.0 : 1.0);
                range_container_el.dataset.content = range_el.value;
                this.onchange(this.value);
            }).bind(this);

            range_el.onmousemove = function(): void {
                range_container_el.dataset.content = range_el.value;
            }

            this.range_el = range_el;
            this.range_container_el = range_container_el;
        }

        this.ref_el = ref_el;
        this.input_el = input_el;
    }

    update(): void {
        if (document.activeElement != this.input_el) {
            this.input_el.value = this.to_hex(this.value[0], this.value[1], this.value[2]);
        }

        if (this.range_container_el && this.range_el && document.activeElement != this.range_el) {
            this.range_el.value = this.value[3].toString();
            this.range_container_el.dataset.content = this.range_el.value;
        }
    }
}

export class input_text_t extends component_t {
    label: string;
    value: getset_t;
    onchange: (value: string) => void;
    input_el: HTMLInputElement;

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_input_text";

        gui_render_label(this.label, ref_el);

        const input_el = document.createElement("input");
        input_el.className = "gui_input";
        input_el.type = "text";
        input_el.value = this.value.get().toString();
        ref_el.append(input_el);

        input_el.onchange = (function(this: input_text_t): void {
            this.value.set(input_el.value);
            this.onchange(input_el.value);
        }).bind(this);

        this.ref_el = ref_el;
        this.input_el = input_el;
    }

    update(): void {
        if (document.activeElement != this.input_el) {
            this.input_el.value = this.value.get().toString();
        }
    }
};

export class radio_group_t extends component_t {
    label: string;
    value: getset_t;
    keys: string[];
    values: any[];
    onchange: (value: any) => void;
    option_els: HTMLDivElement[];

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_radio_group";

        gui_render_label(this.label, ref_el);

        const container_el = gui_render_container();
        ref_el.append(container_el);

        const option_els: HTMLDivElement[] = [];
        const current_value = this.value.get();

        for (let i = 0; i < this.keys.length; i += 1) {
            const key = this.keys[i];
            const value = this.values[i];

            const option_el = document.createElement("div");
            option_el.className = "gui_radio_group_option" + (value === current_value? " gui_selected" : "");
            option_el.innerHTML = key;
            container_el.append(option_el);

            option_el.onclick = (function(this: radio_group_t): void {
                this.value.set(value);

                for (const option_el of this.option_els) {
                    option_el.classList.remove("gui_selected");
                }

                option_el.classList.add("gui_selected");
                this.onchange(value);
            }).bind(this);

            option_els.push(option_el);
        }

        this.ref_el = ref_el;
        this.option_els = option_els;
    }

    update(): void {
        const current_value = this.value.get();

        for (let i = 0; i < this.option_els.length; i += 1) {
            const option_el = this.option_els[i];

            if (this.values[i] === current_value) {
                option_el.classList.add("gui_selected");
            } else {
                option_el.classList.remove("gui_selected");
            }
        }
    }
}

export class checkbox_group_t extends component_t {
    label: string;
    value: getset_t;
    keys: string[];
    values: any[];
    onchange: (value: any) => void;
    option_els: HTMLDivElement[];

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_checkbox_group";

        gui_render_label(this.label, ref_el);

        const container_el = gui_render_container();
        ref_el.append(container_el);

        const option_els: HTMLDivElement[] = [];
        const current_value = this.value.get();

        for (let i = 0; i < this.keys.length; i += 1) {
            const key = this.keys[i];
            const value = this.values[i];

            const option_el = document.createElement("div");
            option_el.className = "gui_checkbox_group_option" + (current_value.indexOf(value) > -1 ? " gui_selected" : "");
            option_el.innerHTML = key;
            container_el.append(option_el);

            option_el.onclick = (function(this: checkbox_group_t): void {
                if (option_el.classList.contains("gui_selected")) {
                    current_value.splice(current_value.indexOf(value), 1);
                    option_el.classList.remove("gui_selected");
                } else {
                    current_value.push(value);
                    option_el.classList.add("gui_selected");
                }

                this.onchange(this.value.get());
            }).bind(this);

            option_els.push(option_el);
        }

        this.ref_el = ref_el;
        this.option_els = option_els;
    }

    update(): void {
        const current_value = this.value.get();

        for (let i = 0; i < this.option_els.length; i += 1) {
            const option_el = this.option_els[i];

            if (current_value.indexOf(this.values[i]) > -1) {
                option_el.classList.add("gui_selected");
            } else {
                option_el.classList.remove("gui_selected");
            }
        }
    }
}

export class select_t extends component_t {
    label: string;
    value: getset_t;
    keys: string[];
    values: any[];
    onchange: (value: any) => void;
    button_el: HTMLDivElement;
    option_els: HTMLDivElement[];

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_select";

        gui_render_label(this.label, ref_el);

        const select_el = document.createElement("div");
        select_el.className = "gui_select";
        ref_el.append(select_el);

        select_el.onclick = function(e) {
            e.stopPropagation();
        }

        const button_el = document.createElement("div");
        button_el.className = "gui_select_button";
        button_el.innerHTML = "Select";
        select_el.append(button_el);

        button_el.onclick = function() {
            if (!button_el.classList.contains("gui_open")) {
                button_el.classList.add("gui_open");
            } else {
                button_el.classList.remove("gui_open");
            }
        }

        const container_el = document.createElement("div");
        container_el.className = "gui_select_container";
        select_el.append(container_el);

        const option_els: HTMLDivElement[] = [];
        const current_value = this.value.get();

        for (let i = 0; i < this.keys.length; i += 1) {
            const key = this.keys[i];
            const value = this.values[i];

            if (value === current_value) {
                button_el.innerHTML = key;
            }

            const option_el = document.createElement("div");
            option_el.className = "gui_select_option";
            option_el.innerHTML = key;
            option_el.dataset.value = i.toString();
            container_el.append(option_el);

            option_el.onclick = (function(this: select_t): void {
                const value = this.values[parseInt(option_el.dataset.value || "")];
                this.value.set(value);
                button_el.innerHTML = key;
                button_el.classList.remove("gui_open");
                this.onchange(value);
            }).bind(this);

            option_els.push(option_el);
        }

        this.ref_el = ref_el;
        this.button_el = button_el;
        this.option_els = option_els;
    }

    static mount(): void {
        const window_root_el = document.body.querySelector(".gui_window_root");

        if (!window_root_el) {
            return;
        }

        window_root_el.addEventListener("click", function() {
            const button_el = document.body.querySelector(".gui_select_button.gui_open");

            if (button_el) {
                button_el.classList.remove("gui_open");
            }
        });
    }

    update(): void {
        const current_value = this.value.get();

        for (let i = 0; i < this.option_els.length; i += 1) {
            if (this.values[i] === current_value) {
                this.button_el.innerHTML = this.keys[i];

                return;
            }
        }
    }
}

export class button_t extends component_t {
    label: string;
    onclick: () => void;

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_button";

        const button_el = document.createElement("button");
        button_el.innerHTML = this.label;
        button_el.onclick = this.onclick;
        ref_el.append(button_el);

        this.ref_el = ref_el;
    }
};

export class canvas_t extends component_t {
    auto_resize: boolean;
    canvas_el: HTMLCanvasElement;

    render(): void {
        const ref_el = document.createElement("div");
        ref_el.className = "gui_canvas";

        const canvas_el = this.canvas_el ?? document.createElement("canvas");
        ref_el.append(canvas_el);

        if (this.auto_resize) {
            window.addEventListener("resize", function() {
                canvas_el.width = canvas_el.parentElement?.clientWidth || 0;
                canvas_el.height = canvas_el.parentElement?.clientHeight || 0;
            });
        }

        this.ref_el = ref_el;
        this.canvas_el = canvas_el;
    }

    mount(): void {
        if (this.auto_resize) {
            this.canvas_el.width = this.canvas_el.parentElement?.clientWidth || 0;
            this.canvas_el.height = this.canvas_el.parentElement?.clientHeight || 0;
        }
    }
}

export const COMPONENT_TYPES = [
    window_t,
    collapsing_header_t,
    text_t,
    bool_t,
    input_number_t,
    slider_number_t,
    input_vec_t,
    color_edit_t,
    input_text_t,
    radio_group_t,
    checkbox_group_t,
    select_t,
    button_t,
    canvas_t
];

// component api
let id = 0;

export function gui_window(parent: window_t|null, title: string = ""): window_t {
    const component = new window_t();
    component.id = id;
    component.title = title;
    component.grid_x = [];
    component.grid_y = [];
    component.layout = [];
    component.window_parent = parent;
    component.window_children = [];
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
        parent.window_children.push(component);
    }

    id += 1;

    return component;
}

export function gui_window_grid(window: window_t, grid_x: unit_t[], grid_y: unit_t[]): void {
    window.grid_x = grid_x;
    window.grid_y = grid_y;
}

export function gui_window_layout(window: window_t, window_children: window_t[]): void {
    const layout: number[] = [];

    for (const child of window_children) {
        layout.push(child.id);
    }

    window.layout = layout;
}

export function gui_collapsing_header(parent: component_t|null, title: string, is_collapsed: boolean = false): collapsing_header_t {
    const component = new collapsing_header_t();
    component.title = title;
    component.is_collapsed = is_collapsed;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_group(parent: component_t|null, condition: () => boolean = () => true): group_t {
    const component = new group_t();
    component.condition = condition;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_text(parent: component_t|null, value: string): text_t {
    const component = new text_t();
    component.value = value;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_bool(parent: component_t|null, label: string, value: getset_t, onchange: (value: boolean) => void = () => {}): bool_t {
    const component = new bool_t();
    component.label = label;
    component.value = value;
    component.onchange = onchange;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_input_number(parent: component_t|null, label: string, value: getset_t, step: number, min: number, max: number, onchange: (value: number) => void = () => {}): input_number_t {
    const component = new input_number_t();
    component.label = label;
    component.value = value;
    component.step = step;
    component.min = min;
    component.max = max;
    component.onchange = onchange;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_slider_number(parent: component_t|null, label: string, value: getset_t, step: number, min: number, max: number, onchange: (value: number) => void = () => {}): slider_number_t {
    const component = new slider_number_t();
    component.label = label;
    component.value = value;
    component.step = step;
    component.min = min;
    component.max = max;
    component.onchange = onchange;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_input_vec(parent: component_t|null, label: string, value: vec_t, step: number, min: number, max: number, size: number, onchange: (value: vec_t) => void = () => {}): input_vec_t {
    const component = new input_vec_t();
    component.label = label;
    component.value = value;
    component.step = step;
    component.min = min;
    component.max = max;
    component.size = size;
    component.onchange = onchange;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_color_edit(parent: component_t|null, label: string, mode: COLOR_MODE, value: vec_t, onchange: (value: vec_t) => void = () => {}): color_edit_t {
    const component = new color_edit_t();
    component.label = label;
    component.value = value;
    component.mode = mode;
    component.onchange = onchange;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_input_text(parent: component_t|null, label: string, value: getset_t, onchange: (value: string) => void = () => {}): input_text_t {
    const component = new input_text_t();
    component.label = label;
    component.value = value;
    component.onchange = onchange;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_radio_group(parent: component_t|null, label: string, value: getset_t, keys: string[], values: any[], onchange: (value: any) => void = () => {}): radio_group_t {
    const component = new radio_group_t();
    component.label = label;
    component.value = value;
    component.keys = keys;
    component.values = values;
    component.onchange = onchange;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_checkbox_group(parent: component_t|null, label: string, value: getset_t, keys: string[], values: any[], onchange: (value: any) => void = () => {}): checkbox_group_t {
    const component = new checkbox_group_t();
    component.label = label;
    component.value = value;
    component.keys = keys;
    component.values = values;
    component.onchange = onchange;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_select(parent: component_t|null, label: string, value: getset_t, keys: string[], values: any[], onchange: (value: any) => void = () => {}): select_t {
    const component = new select_t();
    component.label = label;
    component.value = value;
    component.keys = keys;
    component.values = values;
    component.onchange = onchange;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_button(parent: component_t|null, label: string, onclick: () => any): button_t {
    const component = new button_t();
    component.label = label;
    component.onclick = onclick;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

export function gui_canvas(parent: component_t|null, auto_resize: boolean = true): canvas_t {
    const component = new canvas_t();
    component.auto_resize = auto_resize;
    component.parent = parent;

    if (parent) {
        parent.children.push(component);
    }

    return component;
}

// component rendering
export function gui_component_append(parent: component_t, child: component_t): void {
    child.parent = parent;

    if (parent.children.indexOf(child) < 0) {
        parent.children.push(child);
    }
}

export function gui_render_component(component: component_t, parent_el: HTMLElement): void {
    component.render();
    parent_el.append(component.ref_el);
    component.mount();

    for (const child of component.children) {
        gui_render_component(child, component.container());
    }
}

export function gui_reload_component(component: component_t): void {
    const parent_el = component.parent?.ref_el;

    if (!parent_el) {
        return;
    }

    const prev_el = component.ref_el;

    component.render();
    prev_el.replaceWith(component.ref_el);
    component.mount();

    for (const child of component.children) {
        gui_render_component(child, component.container());
    }
}

export function gui_render(component: component_t, parent_el: HTMLElement, static_mount = true): void {
    gui_render_component(component, parent_el);

    if (!static_mount) {
        return;
    }

    for (const component_type of COMPONENT_TYPES) {
        component_type.mount();
    }
}

export function gui_update(component: component_t): void {
    if (component instanceof collapsing_header_t && component.is_collapsed) {
        return;
    }

    component.update();

    for (const child of component.children) {
        gui_update(child);
    }
}
