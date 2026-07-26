import {vec2_t, vec2, vec2n_copy, vec2_dist, vec2n_dir, vec2m_add, vec2n_muls, vec2m_addmuls, vec2_copy, vec2_zero} from "@cl/math/vec2.ts";

export function radius_from_mass(mass: number, density: number): number {
    return Math.cbrt((3 * mass) / (4 * Math.PI * density));
}

export class ball_t {
    position: vec2_t;
    radius: number;
    mass: number;
    density: number;
    force: vec2_t;
    acceleration: vec2_t;
    velocity: vec2_t;
    drag_pos: vec2_t;
};

export function ball_new(position: vec2_t, mass: number, density: number) {
    const ball = new ball_t();
    ball.position = vec2n_copy(position);
    ball.radius = radius_from_mass(mass, density);
    ball.mass = mass;
    ball.density = density;
    ball.force = vec2();
    ball.acceleration = vec2();
    ball.velocity = vec2();
    ball.drag_pos = vec2();

    return ball;
}

export function ball_left(ball: ball_t): number {
    return ball.position[0] - ball.radius;
}

export function ball_right(ball: ball_t): number {
    return ball.position[0] + ball.radius;
}

export function ball_down(ball: ball_t): number {
    return ball.position[1] - ball.radius;
}

export function ball_up(ball: ball_t): number {
    return ball.position[1] + ball.radius;
}

export function ball_sap(balls: ball_t[], merge: boolean = false): void {
    const sorted_balls = balls.sort((a, b) => ball_left(a) - ball_left(b));

    for (let i = 0; i < sorted_balls.length; i += 1) {
        const ball0 = sorted_balls[i];

        for (let j = i + 1; j < sorted_balls.length; j += 1) {
            const ball1 = sorted_balls[j];

            if (ball_left(ball1) > ball_right(ball0)) {
                break;
            }

            if (ball_down(ball0) < ball_up(ball1) && ball_up(ball0) > ball_down(ball1)) {
                const depth = vec2_dist(ball0.position, ball1.position) - (ball0.radius + ball1.radius);
                const dir = vec2n_dir(ball1.position, ball0.position);

                if (depth < 0.0) {
                    const mtv = {
                        depth,
                        dir
                    }

                    if (merge) {
                        if (ball0.mass > ball1.mass) {
                            ball0.mass += ball1.mass;
                            ball0.radius = radius_from_mass(ball0.mass, ball0.density);
                            balls[j] = balls[balls.length - 1];
                            balls.pop();
                        } else {
                            ball1.mass += ball0.mass;
                            ball1.radius = radius_from_mass(ball1.mass, ball1.density);
                            balls[i] = balls[balls.length - 1];
                            balls.pop();
                        }
                    } else {
                        vec2m_add(ball0.position, vec2n_muls(mtv.dir, mtv.depth / 2.0));
                        vec2m_add(ball1.position, vec2n_muls(mtv.dir, -mtv.depth / 2.0));
                    }
                }
            }
        }
    }
}

export function ball_integrate(ball: ball_t, step: number): void {
    vec2m_addmuls(ball.position, ball.velocity, step);

    vec2_copy(ball.acceleration, vec2n_muls(ball.force, 1.0 / ball.mass));

    vec2m_addmuls(ball.velocity, ball.acceleration, step);

    vec2_zero(ball.force);
}
