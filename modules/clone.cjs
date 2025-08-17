const {execSync} = require("child_process");

const host = 'github.com'

const commands = [
    `git clone git@${host}:deltasampler/block_world_ts.git block_world`,
    `git clone git@${host}:deltasampler/cl_ts.git cl`,
    `git clone git@${host}:deltasampler/engine_ts.git engine`,
    `git clone git@${host}:deltasampler/gravitation_ts.git gravitation`,
    `git clone git@${host}:deltasampler/gui_ts.git gui`,
    `git clone git@${host}:deltasampler/model_viewer_ts.git model_viewer`,
    `git clone git@${host}:deltasampler/panel_templater_ts.git panel_templater`,
    `git clone git@${host}:deltasampler/pixel_sandbox_ts.git pixel_sandbox`,
    `git clone git@${host}:deltasampler/plant_gen_ts.git plant_gen`,
    `git clone git@${host}:deltasampler/ray_marcher_ts.git ray_marcher`,
    `git clone git@${host}:deltasampler/simple_demos_ts.git simple_demos`,
    `git clone git@${host}:deltasampler/square_ts.git square`,
    `git clone git@${host}:deltasampler/tetris_ts.git tetris`,
    `git clone git@${host}:deltasampler/turmite_ts.git turmite`
];

for (const command of commands) {
    try {
        execSync(command, {stdio: "inherit", shell: true});
    } catch (error) {
        console.error(error.message);
    }
}
