export const INCH_MM = 25.4

export function mm_to_in(mm: number): number {
    return mm / INCH_MM;
}

export function mm_to_px(mm: number, res: number): number {
    return Math.round(mm / INCH_MM * res);
}
