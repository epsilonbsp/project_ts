export function vertex_hash3(vx: number, vy: number, vz: number): string {
    return `${vx}_${vy}_${vz}`;
}

export function vertex_hash6(vx: number, vy: number, vz: number, nx: number, ny: number, nz: number): string {
    return `${vx}_${vy}_${vz}_${nx}_${ny}_${nz}`;
}
