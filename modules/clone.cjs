const {execSync} = require("child_process");

const host = 'github.com'

const commands = [
    `git clone git@${host}:deltasampler/block_world_ts.git`,
    `git clone git@${host}:deltasampler/cl_ts.git`,
    `git clone git@${host}:deltasampler/driving_ts.git`,
    `git clone git@${host}:deltasampler/engine_ts.git`,
    `git clone git@${host}:deltasampler/gravitation_ts.git`,
    `git clone git@${host}:deltasampler/gui_ts.git`,
    `git clone git@${host}:deltasampler/model_viewer_ts.git`,
    `git clone git@${host}:deltasampler/panel_templater_ts.git`,
    `git clone git@${host}:deltasampler/pixel_sandbox_ts.git`,
    `git clone git@${host}:deltasampler/plant_gen_ts.git`,
    `git clone git@${host}:deltasampler/ray_marcher_ts.git`,
    `git clone git@${host}:deltasampler/simple_demos_ts.git`,
    `git clone git@${host}:deltasampler/square_ts.git`,
    `git clone git@${host}:deltasampler/tetris_ts.git`,
    `git clone git@${host}:deltasampler/turmite_ts.git`
];

for (const command of commands) {
    try {
        execSync(command, {stdio: "inherit", shell: true});
    } catch (error) {
        console.error(error.message);
    }
}
