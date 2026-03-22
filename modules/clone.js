const {execSync} = require("child_process");

const host = 'github.com'
const user = 'epsilonbsp'

const commands = [
    `git clone git@${host}:${user}/block_world_ts.git block_world`,
    `git clone git@${host}:${user}/cl_ts.git cl`,
    `git clone git@${host}:${user}/engine_ts.git engine`,
    `git clone git@${host}:${user}/gravitation_ts.git gravitation`,
    `git clone git@${host}:${user}/gui_ts.git gui`,
    `git clone git@${host}:${user}/model_viewer_ts.git model_viewer`,
    `git clone git@${host}:${user}/panel_templater_ts.git panel_templater`,
    `git clone git@${host}:${user}/pixel_sandbox_ts.git pixel_sandbox`,
    `git clone git@${host}:${user}/plant_gen_ts.git plant_gen`,
    `git clone git@${host}:${user}/ray_marcher_ts.git ray_marcher`,
    `git clone git@${host}:${user}/simple_demos_ts.git simple_demos`,
    `git clone git@${host}:${user}/square_ts.git square`,
    `git clone git@${host}:${user}/tetris_ts.git tetris`,
    `git clone git@${host}:${user}/turmite_ts.git turmite`
];

for (const command of commands) {
    try {
        execSync(command, {stdio: "inherit", shell: true});
    } catch (error) {
        console.error(error.message);
    }
}
