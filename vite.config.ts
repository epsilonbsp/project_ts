import path from "path";
import {defineConfig} from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
    plugins: [preact()],
    resolve: {
        alias: {
            '@block_world': path.resolve(__dirname, "./modules/block_world_ts/source"),
            '@cl': path.resolve(__dirname, "./modules/cl_ts/source"),
            '@driving': path.resolve(__dirname, "./modules/driving_ts/source"),
            '@engine': path.resolve(__dirname, "./modules/engine_ts/source"),
            '@gravitation': path.resolve(__dirname, "./modules/gravitation_ts/source"),
            '@gui': path.resolve(__dirname, "./modules/gui_ts/source"),
            '@model_viewer': path.resolve(__dirname, "./modules/model_viewer_ts/source"),
            '@panel_templater': path.resolve(__dirname, "./modules/panel_templater_ts/source"),
            '@pixel_sandbox': path.resolve(__dirname, "./modules/pixel_sandbox_ts/source"),
            '@plant_gen': path.resolve(__dirname, "./modules/plant_gen_ts/source"),
            '@ray_marcher': path.resolve(__dirname, "./modules/ray_marcher_ts/source"),
            '@simple_demos': path.resolve(__dirname, "./modules/simple_demos_ts/source"),
            '@square': path.resolve(__dirname, "./modules/square_ts/source"),
            '@tetris': path.resolve(__dirname, "./modules/tetris_ts/source"),
            '@turmite': path.resolve(__dirname, "./modules/turmite_ts/source")
        }
    }
});
