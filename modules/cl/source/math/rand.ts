export const random = Math.random;

export function rand_ex(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export function rand_in(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function frand_in(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
