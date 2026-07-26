export enum ELEMENT_STATE {
    VOID,
    SOLID,
    LIQUID,
    GAS
};

export class element_t {
    id: number;
    type: number;
    color: number;
    state: ELEMENT_STATE;
    gravity_flag: boolean;
    density: number;
    temperature: number;
    lifetime: number;
};

export function element_copy(e0: element_t, e1: element_t): void {
    e0.type = e1.type;
    e0.color = e1.color;
    e0.state = e1.state;
    e0.gravity_flag = e1.gravity_flag;
    e0.density = e1.density;
    e0.lifetime = e1.lifetime;
    e0.temperature = e1.temperature;
}
