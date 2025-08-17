import path from "path";
import {defineConfig} from "vite";
import preact from "@preact/preset-vite";

export default defineConfig({
    plugins: [preact()],
    resolve: {
        alias: {
            '@block_world': path.resolve(__dirname, "./modules/block_world/source"),
            '@cl': path.resolve(__dirname, "./modules/cl/source"),
            '@engine': path.resolve(__dirname, "./modules/engine/source"),
            '@gravitation': path.resolve(__dirname, "./modules/gravitation/source"),
            '@gui': path.resolve(__dirname, "./modules/gui/source"),
            '@model_viewer': path.resolve(__dirname, "./modules/model_viewer/source"),
            '@panel_templater': path.resolve(__dirname, "./modules/panel_templater/source"),
            '@pixel_sandbox': path.resolve(__dirname, "./modules/pixel_sandbox/source"),
            '@plant_gen': path.resolve(__dirname, "./modules/plant_gen/source"),
            '@ray_marcher': path.resolve(__dirname, "./modules/ray_marcher/source"),
            '@simple_demos': path.resolve(__dirname, "./modules/simple_demos/source"),
            '@square': path.resolve(__dirname, "./modules/square/source"),
            '@tetris': path.resolve(__dirname, "./modules/tetris/source"),
            '@turmite': path.resolve(__dirname, "./modules/turmite/source")
        }
    }
});
